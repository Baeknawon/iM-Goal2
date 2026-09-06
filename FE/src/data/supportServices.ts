import type { PersonaKey } from '../types';
export const supportServices=[
 {id:'youth',name:'자립정보ON',group:'자립·주거',personas:['A'],why:'주거·생활 기반을 준비하는 목표에 맞춰 자립지원 정보를 확인할 수 있어요.',target:'보호아동·자립준비청년 관련 지원을 찾는 경우',url:'https://jaripon.ncrc.or.kr/home/kor/main.do',phone:'1855-2455',steps:['거주 지역과 필요한 지원 분야 정리','공식 공고의 연령·보호종료 등 대상 조건 확인','공고에서 요구하는 서류와 접수 기간 확인']},
 {id:'business',name:'소상공인 정책자금·지원사업',group:'사업 운영',personas:['B'],why:'매출 감소로 운영 여유가 줄었다면 비용 절감 외에 공고별 지원 경로도 확인해요.',target:'사업 운영자금·경영 지원을 찾는 소상공인',url:'https://ols.semas.or.kr/',steps:['사업자 정보·업종·사업장 지역 정리','공고의 대상·제외 업종·접수 기간 확인','공고별 매출·사업자 증빙 등 요구서류 확인']},
 {id:'debt',name:'신용회복위원회 상담',group:'채무·상환',personas:['C'],why:'리볼빙이나 상환 부담은 지출 미션만으로 해결하기 어려울 수 있어 상담 경로를 함께 안내해요.',target:'채무·상환 어려움에 대한 상담이 필요한 경우',url:'https://edu.ccrs.or.kr/main.do',phone:'1600-5500',steps:['금융회사별 잔액·상환일·연체 여부 정리','공식 상담에서 본인 상황에 맞는 절차 확인','상담 후 안내받은 구비서류와 예약일 확인']},
 {id:'general',name:'서민금융통합지원센터',group:'생활·금융',personas:['A','B','C'],why:'어떤 제도가 맞는지 모르겠다면 종합상담으로 필요한 지원을 확인해요.',target:'자금·채무·고용·복지 상담 경로를 함께 찾는 경우',url:'https://www.kinfa.or.kr/counselingSupport/centerIntroduction.do',phone:'1397',steps:['필요한 상담 주제 정리','1397 또는 공식 안내에서 상담 가능한 센터 확인','방문 시 신분증 및 상담에서 안내한 준비물 확인']}
] as const;
export const matchesSupport=(id:string,p:PersonaKey)=>supportServices.find(s=>s.id===id)?.personas.some(v=>v===p)??false;
