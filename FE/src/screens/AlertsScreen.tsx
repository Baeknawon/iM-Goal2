import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen } from '../components/ui';
import { alertDefs, personaDefs } from '../data/personas';
import { color } from '../styles/theme';

type Category = '전체' | '경로' | '미션' | '자산' | '신용';
type AlertRow = { id: number; category: Exclude<Category, '전체'>; title: string; body: string; time: string; icon: string; go: string };
const categories: Category[] = ['전체', '경로', '미션', '자산', '신용'];
const accents = { 경로: 'var(--color-danger)', 미션: 'var(--color-purple-text)', 자산: 'var(--color-info-text)', 신용: 'var(--color-accent-text)' } as const;

export function AlertsScreen() {
  const navigate = useNavigate();
  const persona = useAppStore((s) => s.persona);
  const AL = alertDefs[persona];
  const P = personaDefs[persona];
  const [category, setCategory] = useState<Category>('전체');
  const [read, setRead] = useState<Set<number>>(() => new Set([4, 5, 6, 7]));
  const rows: AlertRow[] = [
    { id: 1, category: '경로', title: '경로 이탈 경고', body: AL.tag, time: '방금', icon: '!', go: '/cause' },
    { id: 2, category: '미션', title: '경제 퀴즈 도착', body: '오늘의 1문제 · 정답이면 마일리지 +5점', time: '10분 전', icon: '?', go: '/quiz' },
    { id: 3, category: '자산', title: '하루 예산 초과', body: `오늘 예산 ${P.dailyBudget.toLocaleString()}원을 초과했어요`, time: '1시간 전', icon: '₩', go: '/calendar' },
    { id: 4, category: '자산', title: '급여 자동 분배 완료', body: '입금된 급여를 3개 계좌로 분배했어요', time: '어제', icon: '✓', go: '/salary' },
    { id: 5, category: '신용', title: 'FCPS 마일리지 적립', body: '현재 612점 · 골드까지 88점 남았어요', time: '어제', icon: '◆', go: '/mileage' },
    { id: 6, category: '신용', title: '맞춤 상품 추천', body: '현재 조건에 맞는 iM 상품 4개를 찾았어요', time: '2일 전', icon: '★', go: '/products' },
    { id: 7, category: '경로', title: '목표 도착 임박', body: '목표까지 남은 금액이 10% 아래로 내려왔어요', time: '3일 전', icon: '✈', go: '/detail' },
  ];
  const visible = category === '전체' ? rows : rows.filter((row) => row.category === category);
  const unread = rows.filter((row) => !read.has(row.id)).length;
  const open = (row: AlertRow) => { setRead((value) => new Set(value).add(row.id)); navigate(row.go); };

  return (
    <Screen bg={color.white}>
      <div className="alerts-toolbar">
        <button type="button" className="alerts-back" aria-label="홈으로" onClick={() => navigate('/home')}>‹</button>
        <div className="alerts-heading">
          <h1>알림</h1>
          <span className="alerts-count" aria-label={`읽지 않은 알림 ${unread}개`}>{unread}</span>
        </div>
        <button type="button" className="alerts-settings" onClick={() => navigate('/settings')}>설정</button>
      </div>
      <div className="alerts-categories" aria-label="알림 카테고리">
        {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <div className="alerts-list">
          {visible.map((row) => {
            const isRead = read.has(row.id);
            const accent = accents[row.category];
            return <button key={row.id} type="button" className="notification-row" data-unread={!isRead} onClick={() => open(row)}>
              <span className="notification-icon" aria-hidden="true" style={{ color: accent }}>{row.icon}</span>
              <span className="notification-content">
                <span className="notification-meta">
                  <span>{row.category}{!isRead && <span className="notification-unread-dot" aria-label="읽지 않음" />}</span>
                  <span>{row.time}</span>
                </span>
                <span className="notification-title">{row.title}</span>
                <span className="notification-body">{row.body}</span>
              </span>
              </button>;
          })}
      </div>
    </Screen>
  );
}
