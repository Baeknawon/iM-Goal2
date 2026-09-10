/**
 * 자연어 목표 수정 파서 (규칙 기반, 오프라인).
 *
 * 데모 환경은 외부 LLM 없이 동작하므로(요구사항 7.5), 한국어 목표 문장에서
 * 금액(target)·기간(months)·(선택)모아둔 금액(saved)·(선택)목표 이름(name)을
 * 정규식 규칙으로 추출한다. 필수 항목(target, months) 중 추출하지 못한 것은 `missing`에 담는다.
 *
 * 기존 parseGoalNumber(goalInput.ts)는 "단일 정형 입력"만 다루므로(문장 파싱 불가),
 * 여기서는 문장 어디에서든 등장하는 한국어 수량 표현을 잡아내는 helper를 별도로 둔다.
 */

/** 필수 항목 키 — missing 배열에 담기는 값. */
export type GoalField = 'target' | 'months';

export interface ParsedGoal {
  /** 목표 금액(원). 추출 실패 시 undefined. */
  target?: number;
  /** 목표 기간(개월). 추출 실패 시 undefined. */
  months?: number;
  /** 모아둔 금액(원). 선택 항목. */
  saved?: number;
  /** 목표 이름. 선택 항목. */
  name?: string;
  /** 추출하지 못한 필수 항목 목록(target, months). */
  missing: GoalField[];
}

const AMOUNT_UNITS: Record<string, number> = {
  억: 1e8,
  천만: 1e7,
  백만: 1e6,
  만: 1e4,
  천: 1e3,
};

/**
 * 한국어 금액 표현 한 덩어리를 원 단위 정수로 변환한다.
 * 지원: "5억", "3천만", "3000만", "1억5천만", "600만", "1억2천3백만", "3,000만", 순수 숫자("30000000").
 * 파싱 불가 시 NaN.
 */
export function parseKoreanAmount(raw: string): number {
  const text = raw.replace(/,/g, '').replace(/\s/g, '').replace(/원$/, '');
  if (!text) return NaN;

  // 순수 숫자(단위 없음): 그대로 원 단위로 취급.
  if (/^\d+(?:\.\d+)?$/.test(text)) {
    const n = Number(text);
    return Number.isFinite(n) ? Math.round(n) : NaN;
  }

  // 단위가 붙은 조합을 순차적으로 누적한다. 예) 1억5천만 → 1e8 + 5e7.
  const token = /(\d+(?:\.\d+)?)(억|천만|백만|만|천)/g;
  let total = 0;
  let matched = false;
  let consumed = 0;
  let m: RegExpExecArray | null;
  while ((m = token.exec(text)) !== null) {
    matched = true;
    total += Number(m[1]) * AMOUNT_UNITS[m[2]];
    consumed += m[0].length;
  }
  // 매칭이 전혀 없거나, 단위 없는 잔여 문자열이 남으면(불명확) 실패 처리.
  if (!matched || consumed !== text.length) return NaN;
  return Math.round(total);
}

/**
 * 문장 전체에서 목표 금액을 찾는다.
 * "모았/모아/모은/모아둔/모아뒀" 등 saved 를 나타내는 표현에 붙은 금액은 target 후보에서 제외한다.
 */
function extractTarget(text: string): number | undefined {
  // 금액 표현 후보를 위치와 함께 수집.
  //  - 연속된 단위 조합(1억5천만)을 하나로 잡기 위해 (숫자+금액단위) 1회 이상을 캡처한다.
  //  - 뒤에 시간 단위(년/개월/달)가 붙은 순수 숫자는 금액이 아니므로 제외한다(부정 전방탐색).
  //  - "원"이 붙은 순수 숫자(30000000원)도 금액 후보로 허용한다.
  const amountRe =
    /(\d[\d,]*(?:\.\d+)?\s*(?:억|천만|백만|만|천))+\s*원?|\d[\d,]*(?:\.\d+)?\s*원(?![가-힣])/g;
  const candidates: { value: number; index: number; end: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = amountRe.exec(text)) !== null) {
    const value = parseKoreanAmount(m[0]);
    if (Number.isFinite(value) && value > 0) {
      candidates.push({ value, index: m.index, end: m.index + m[0].length });
    }
  }
  if (!candidates.length) return undefined;

  // saved(모아둔 금액) 문맥에 속한 후보는 target에서 배제한다.
  const savedIdx = savedContextRange(text);
  const targetCandidates = candidates.filter(
    (c) => !savedIdx.some((r) => c.index >= r.start && c.index < r.end),
  );
  const pick = (targetCandidates.length ? targetCandidates : candidates)[0];
  return pick?.value;
}

/**
 * saved(모아둔 금액) 표현이 위치하는 대략적 구간을 반환한다.
 * "이미 500만원 모았어", "500만원 모아뒀어", "지금 500만 있어" 같은 문맥을 감싼다.
 */
function savedContextRange(text: string): { start: number; end: number }[] {
  const ranges: { start: number; end: number }[] = [];
  const re =
    /(?:이미|현재|지금|벌써)?\s*((?:\d[\d,]*(?:\.\d+)?\s*(?:억|천만|백만|만|천)\s*)+원?|\d[\d,]*\s*원?)\s*(?:정도|쯤)?\s*(?:모았|모아|모은|모아둔|모아뒀|모아놨|저축했|있어|있고|있는|모음|모아뒀어)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    ranges.push({ start: m.index, end: m.index + m[0].length });
  }
  return ranges;
}

/** 문장에서 모아둔 금액(saved)을 추출한다. 선택 항목이라 없으면 undefined. */
function extractSaved(text: string): number | undefined {
  const re =
    /(?:이미|현재|지금|벌써)?\s*((?:\d[\d,]*(?:\.\d+)?\s*(?:억|천만|백만|만|천)\s*)+원?|\d[\d,]*\s*원?)\s*(?:정도|쯤)?\s*(?:모았|모아|모은|모아둔|모아뒀|모아놨|저축했|있어|있고|있는|모음|모아뒀어)/;
  const m = text.match(re);
  if (!m) return undefined;
  const value = parseKoreanAmount(m[1]);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

/**
 * 문장에서 기간(개월)을 추출한다.
 * 지원: "2년"→24, "24개월"→24, "6개월"→6, "반년"→6, "1년6개월"→18, "1년 반"→18, "3달"→3.
 */
function extractMonths(text: string): number | undefined {
  const compact = text.replace(/\s/g, '');
  let months = 0;
  let found = false;

  // "N년" (반년/N년 반 포함)
  const yearRe = /(\d+(?:\.\d+)?|반)\s*년/g;
  let m: RegExpExecArray | null;
  while ((m = yearRe.exec(compact)) !== null) {
    found = true;
    months += m[1] === '반' ? 6 : Number(m[1]) * 12;
  }

  // "N개월" / "N달"
  const monthRe = /(\d+(?:\.\d+)?)\s*(?:개월|달)/g;
  while ((m = monthRe.exec(compact)) !== null) {
    found = true;
    months += Number(m[1]);
  }

  // "N년 반" → +6개월 (년 뒤에 "반"이 오는 경우)
  if (/\d\s*년\s*반/.test(compact) && !/반\s*년/.test(compact)) {
    months += 6;
    found = true;
  }

  if (!found) return undefined;
  const rounded = Math.round(months);
  return rounded >= 1 ? rounded : undefined;
}

/**
 * 문장에서 목표 이름을 추출한다. 선택 항목.
 * "전세보증금 모으고 싶어", "OO를 위해", "OO 목표로" 같은 표현에서 명사구를 잡는다.
 */
function extractName(text: string): string | undefined {
  const patterns = [
    /([가-힣A-Za-z0-9]+)\s*(?:을|를)\s*위(?:해|한|하여)/, // "OO을 위해"
    /([가-힣A-Za-z0-9]+)\s*(?:목표로|목적으로)/, // "OO 목표로"
    /([가-힣A-Za-z0-9]+)\s*(?:마련|장만)/, // "OO 마련"
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m && m[1] && !/^\d/.test(m[1])) return m[1];
  }
  return undefined;
}

/**
 * 한국어 자연어 목표 문장을 파싱한다.
 * @returns ParsedGoal — target/months/saved/name과 누락 필수 항목(missing).
 */
export function parseGoalSentence(text: string): ParsedGoal {
  const input = (text ?? '').trim();
  const target = extractTarget(input);
  const months = extractMonths(input);
  const saved = extractSaved(input);
  const name = extractName(input);

  const missing: GoalField[] = [];
  if (target === undefined) missing.push('target');
  if (months === undefined) missing.push('months');

  const result: ParsedGoal = { missing };
  if (target !== undefined) result.target = target;
  if (months !== undefined) result.months = months;
  if (saved !== undefined) result.saved = saved;
  if (name !== undefined) result.name = name;
  return result;
}
