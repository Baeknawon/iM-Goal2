import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const services = [
  { icon: '📊', name: 'ETF한눈에', description: '비대면ETF신탁가이드' },
  { icon: '🌞', name: '햇살론통합조회', description: '가능한 한도 알아보기' },
  { icon: '👶🏻', name: '아이 맞춤 상품', description: '첫 금융 어렵지 않아요' },
  { icon: '🏪', name: '사장님이라면', description: '필요한 금융상품 한번에' },
  { icon: '💸', name: '금리인하 자동신청', description: '지금이 금리 낮출 기회' },
];
const shortcuts = [ ['💰', '퇴직연금'], ['💱', '환전하기'], ['🤖', '로디'], ['📩', '경조사 서비스'] ];
const benefits = [ ['⚾', '오승환싸인볼', 'blue'], ['', '한정판카드', ''], ['', '매월쿠폰받기', ''], ['🙌🏻', '매달모임혜택', 'cyan'], ['🎁', '혜택도~착!', 'green'] ];
type IconName = 'home' | 'bag' | 'gift' | 'menu' | 'search' | 'bell' | 'bulb';
function BankIcon({ name }: { name: IconName }) {
  const shapes: Record<IconName, React.ReactNode> = {
    home: <path d="m3 11 9-8 9 8v10h-7v-6h-4v6H3Z" />,
    bag: <><rect x="4" y="3" width="16" height="19" rx="4" /><path d="M8 7c0 6 8 6 8 0" /></>,
    gift: <><path d="M4 11v11h16V11M12 7v15" /><rect x="2" y="7" width="20" height="5" rx="1" /><path d="M12 7C4 7 5 0 9 2l3 5c8 0 7-7 3-5Z" /></>,
    menu: <path d="M3 4h18M3 12h18M3 20h18" />,
    search: <><circle cx="10" cy="10" r="8" /><path d="m16 16 6 6" /></>,
    bell: <><path d="M5 10a7 7 0 0 1 14 0c0 5 2 6 2 8H3c0-2 2-3 2-8ZM9 22h6" /><circle cx="12" cy="2" r="1" /></>,
    bulb: <><path d="M8 17C-1 9 8 1 14 4c6 3 4 9 2 11l-1 2v4H9v-4M9 18h6M10 24h4M12 17v-5m-3-2 3 3 3-3M12 0v1M2 3l2 2M0 11h2M22 11h2M20 4l2-2" /></>,
  };
  return <svg viewBox="0 0 24 26" fill={name === 'home' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name]}</svg>;
}

/** Bank landing is shared by every persona; CLiMB starts at MyData consent. */
export function BankHomeScreen() {
  const navigate = useNavigate();
  const scroll = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [panel, setPanel] = useState('');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('홈');
  const [easy, setEasy] = useState(false);
  const show = (title: string) => { setPanel(title); setSearch(''); dialog.current?.showModal(); };
  const section = (id: string, label: string) => {
    setTab(label);
    const target = scroll.current?.querySelector<HTMLElement>('#' + id);
    if (scroll.current && target) scroll.current.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
  };
  const start = () => navigate('/consent');
  const menu = ['CLiMB · 나의 금융 목표 만들기', ...shortcuts.map(x => x[1]), ...services.map(x => x.name), '오늘의 혜택', '고객센터', '상황 바꾸기'];
  return <div className={`bank-home${easy ? ' bank-easy' : ''}`}>
    <header className="bank-header">
      <span className="bank-wordmark" aria-label="iM Bank">iM Bank</span>
      <div className="bank-header-actions">
        <button aria-label="이용 안내" onClick={() => show('이용 안내')}><BankIcon name="bulb" /></button>
        <button aria-label="메뉴 검색" onClick={() => show('메뉴 검색')}><BankIcon name="search" /></button>
        <button className="bank-bell" aria-label="은행 알림" onClick={() => show('은행 알림')}><BankIcon name="bell" /><i /></button>
      </div>
    </header>
    <div className="bank-scroll" ref={scroll}>
      <section className="bank-intro" id="bank-top" aria-label="CLiMB 서비스 소개">
        <button className="bank-climb" onClick={start}>
          <span className="bank-climb-copy"><span className="bank-climb-tag">iM뱅크와 함께, CLiMB</span><strong>내 꿈에 가까워지는<br />오늘의 금융 습관</strong><span className="bank-climb-description">목표부터 소비 관리, 맞춤 미션까지<br />나만의 AI 금융 페이스메이커</span><span className="bank-climb-link">CLiMB 시작하기 <span aria-hidden="true">↗</span></span></span>
          <img src="/assets/pair-map.png" alt="함께 지도를 펼쳐 보는 단디와 똑디" />
        </button>
      </section>
      <section className="bank-trending" id="bank-services">
        <h1>요즘 iM</h1>
        <div className="bank-shortcuts">{shortcuts.map(([icon, label], i) => <button key={label} onClick={() => show(label)}><span className="bank-shortcut-icon"><span aria-hidden="true">{icon}</span>{i === 0 && <b>HOT</b>}</span><span>{label}</span></button>)}</div>
        <div className="bank-services">{services.map(item => <button key={item.name} onClick={() => show(item.name)}><span className="bank-service-icon" aria-hidden="true">{item.icon}</span><span className="bank-service-copy"><strong>{item.name}</strong> <span>{item.description}</span></span><span className="bank-chevron" aria-hidden="true">›</span></button>)}</div>
      </section>
      <section className="bank-benefits" id="bank-benefits">
        <h2>오늘의 혜택</h2>
        <div className="bank-benefit-chips">{benefits.map(([icon, label, tone]) => <button key={label} className={tone} onClick={() => show(label)}>{icon && <span aria-hidden="true">{icon}</span>}{label}</button>)}</div>
        <button className="bank-promo" onClick={() => show('iM뱅크-현대카드M')}><span><span>iM뱅크-현대카드M</span><strong>7만원 캐시백 혜택!</strong></span><span className="bank-card-art" aria-hidden="true"><i>₩</i><b><small>HYUNDAI CARD</small>M</b><em>₩</em></span></button>
        <div className="bank-pagination" aria-label="혜택 배너"><i /><i /><i className="active" /><i /><i /><span aria-hidden="true">Ⅱ</span></div>
      </section>
      <button className="bank-announcement" onClick={() => show('iM Love Letter')}><span>공지</span><strong>[inter-Maum] iM Love Letter 121호</strong><b aria-hidden="true">›</b></button>
      <footer className="bank-footer"><div><button onClick={() => show('챗봇')}><span aria-hidden="true">🤖</span>챗봇</button><i /><button onClick={() => show('고객센터')}><span aria-hidden="true">💬</span>고객센터</button></div><button className="bank-easy-toggle" aria-pressed={easy} onClick={() => setEasy(!easy)}><span aria-hidden="true">●</span> 쉬운모드{easy ? ' 켜짐' : ''}</button></footer>
    </div>
    <nav className="bank-nav" aria-label="iM뱅크 메뉴">{([['홈','home','bank-top'],['상품','bag','bank-services'],['혜택','gift','bank-benefits'],['전체','menu','']] as const).map(([label, icon, id]) => <button key={label} aria-current={tab === label ? 'page' : undefined} onClick={() => id ? section(id,label) : show('전체 메뉴')}><BankIcon name={icon} /><span>{label}</span></button>)}</nav>
    <dialog ref={dialog} className="bank-dialog" onClick={event => { if(event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="bank-dialog-heading"><h2>{panel}</h2><button aria-label="안내 닫기" onClick={() => dialog.current?.close()}>✕</button></div>
      {['메뉴 검색','전체 메뉴'].includes(panel) ? <><input aria-label="찾을 메뉴" placeholder="어떤 서비스를 찾으세요?" value={search} onChange={e => setSearch(e.target.value)} /><div className="bank-menu-results">{menu.filter(name => name.includes(search)).map(name => <button key={name} onClick={() => name.startsWith('CLiMB') ? start() : name === '상황 바꾸기' ? navigate('/picker') : setPanel(name)}>{name}<span>›</span></button>)}{!menu.some(name => name.includes(search)) && <p>검색 결과가 없어요.</p>}</div></> : <><p>{panel === '은행 알림' ? '새로운 금융 여정, CLiMB를 만나보세요.' : 'iM뱅크에서 만나는 나만의 금융 목표 관리, CLiMB'}</p><p className="bank-dialog-description">이 화면에서는 CLiMB 서비스를 시작할 수 있어요. 목표를 정하고 나에게 맞는 금융 습관을 만들어보세요.</p><button className="bank-dialog-cta" onClick={start}>CLiMB 시작하기</button></>}
    </dialog>
  </div>;
}
