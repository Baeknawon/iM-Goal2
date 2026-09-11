import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { useAppStore } from './store/appStore';
import './styles/tokens.css';
import './styles/tabs.css';
import './styles/notifications.css';
import './styles/global.css';
import './styles/bank.css';

// 발표용 프레젠테이션 셸(/present)이 iframe 내부 앱을 원격 제어할 수 있도록 store를 노출한다.
(window as unknown as { __imGoalStore?: typeof useAppStore }).__imGoalStore = useAppStore;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

import './styles/assistant.css';

import './styles/insights.css';
