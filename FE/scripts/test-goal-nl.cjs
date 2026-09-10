// Run with: node scripts/test-goal-nl.cjs
// 자연어 목표 파서(goalNaturalLanguage.ts) 단위 검증 — 요구사항 7.1, 7.4.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);

const { parseGoalSentence, parseKoreanAmount } = require('../src/viewmodel/goalNaturalLanguage.ts');

// ── parseKoreanAmount: 다양한 금액 표현이 원 단위 정수로 변환되는지 ──
assert.equal(parseKoreanAmount('3천만'), 30000000);
assert.equal(parseKoreanAmount('3천만원'), 30000000);
assert.equal(parseKoreanAmount('3,000만'), 30000000);
assert.equal(parseKoreanAmount('3000만'), 30000000);
assert.equal(parseKoreanAmount('5억'), 500000000);
assert.equal(parseKoreanAmount('1억5천만'), 150000000);
assert.equal(parseKoreanAmount('4천만'), 40000000);
assert.equal(parseKoreanAmount('600만원'), 6000000);
assert.equal(parseKoreanAmount('30000000'), 30000000);
assert.equal(parseKoreanAmount('30000000원'), 30000000);
assert.ok(Number.isNaN(parseKoreanAmount('')));
assert.ok(Number.isNaN(parseKoreanAmount('스무살')));
console.log('parseKoreanAmount: 단위/조합/순수숫자/실패 케이스 통과.');

// ── parseGoalSentence: target 추출 ──
assert.equal(parseGoalSentence('2년 안에 3천만원 모으고 싶어').target, 30000000);
assert.equal(parseGoalSentence('3천만 목표로 할게').target, 30000000);
assert.equal(parseGoalSentence('5억을 2년 안에 모을래').target, 500000000);
assert.equal(parseGoalSentence('1억5천만원을 3년 동안 모으고 싶어').target, 150000000);

// ── parseGoalSentence: months 추출 (2년→24, 반년→6, 1년 6개월→18) ──
assert.equal(parseGoalSentence('2년 안에 3천만원 모으고 싶어').months, 24);
assert.equal(parseGoalSentence('반년 안에 600만원 모을래').months, 6);
assert.equal(parseGoalSentence('1년 6개월 동안 4천만원').months, 18);
assert.equal(parseGoalSentence('18개월 안에 3천만원').months, 18);
assert.equal(parseGoalSentence('1년 반 안에 3천만원').months, 18);
assert.equal(parseGoalSentence('3달 안에 300만원').months, 3);

// ── parseGoalSentence: saved 추출 ("이미 X 모았어") ──
assert.equal(parseGoalSentence('2년 안에 3천만원 모으고 싶고 이미 500만원 모았어').saved, 5000000);
assert.equal(parseGoalSentence('3천만원 목표인데 지금 1천만원 모아뒀어. 2년 안에').saved, 10000000);
{
  // saved 표현이 있어도 target/months는 별개로 정확히 잡혀야 한다.
  const g = parseGoalSentence('2년 안에 3천만원 모으고 싶고 이미 500만원 모았어');
  assert.equal(g.target, 30000000);
  assert.equal(g.months, 24);
  assert.equal(g.saved, 5000000);
  assert.deepEqual(g.missing, []);
}
console.log('parseGoalSentence: target/months/saved 추출 통과.');

// ── 실패 케이스: 금액 없음 / 기간 없음 → missing 에 반영 (요구사항 7.4) ──
{
  const noAmount = parseGoalSentence('2년 안에 모으고 싶어');
  assert.equal(noAmount.target, undefined);
  assert.equal(noAmount.months, 24);
  assert.ok(noAmount.missing.includes('target'));
  assert.ok(!noAmount.missing.includes('months'));
}
{
  const noPeriod = parseGoalSentence('3천만원 모으고 싶어');
  assert.equal(noPeriod.target, 30000000);
  assert.equal(noPeriod.months, undefined);
  assert.ok(noPeriod.missing.includes('months'));
  assert.ok(!noPeriod.missing.includes('target'));
}
{
  const nothing = parseGoalSentence('안녕 오늘 날씨 좋다');
  assert.equal(nothing.target, undefined);
  assert.equal(nothing.months, undefined);
  assert.deepEqual([...nothing.missing].sort(), ['months', 'target']);
}
{
  const empty = parseGoalSentence('');
  assert.deepEqual([...empty.missing].sort(), ['months', 'target']);
}
console.log('parseGoalSentence: 실패 케이스(금액/기간 누락 → missing) 통과.');

console.log('Goal natural-language parser checks passed: amounts, periods, saved extraction and failure cases.');
