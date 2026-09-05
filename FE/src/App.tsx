import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { PhoneFrame } from './components/PhoneFrame';
import { GlobalAssistant } from './components/GlobalAssistant';
import { BottomNav, navScreens } from './components/BottomNav';
import { useAppStore } from './store/appStore';

import { PickerScreen } from './screens/PickerScreen';
import { LoginScreen } from './screens/LoginScreen';
import { ConsentScreen } from './screens/ConsentScreen';
import { LinkingScreen } from './screens/LinkingScreen';
import { ConnectScreen } from './screens/ConnectScreen';
import { IncomeScreen } from './screens/IncomeScreen';
import { EmptyHomeScreen } from './screens/EmptyHomeScreen';
import { EmptyTabScreen } from './screens/EmptyTabScreen';
import { ChatGoalScreen } from './screens/ChatGoalScreen';
import { GoalReportScreen } from './screens/GoalReportScreen';
import { TicketIssueScreen } from './screens/TicketIssueScreen';
import { VoiceInputScreen } from './screens/VoiceInputScreen';
import { ParsedScreen } from './screens/ParsedScreen';
import { TypingScreen } from './screens/TypingScreen';
import { AnalyzeScreen } from './screens/AnalyzeScreen';
import { PlanScreen } from './screens/PlanScreen';
import { HomeScreen } from './screens/HomeScreen';
import { DetailScreen } from './screens/DetailScreen';
import { AccountsScreen } from './screens/AccountsScreen';
import { SalarySplitSettingsScreen } from './screens/SalarySplitSettingsScreen';
import { SalaryScreen } from './screens/SalaryScreen';
import { SpendScreen } from './screens/SpendScreen';
import { CategoryScreen } from './screens/CategoryScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { MissionDetailScreen } from './screens/MissionDetailScreen';
import { CauseScreen } from './screens/CauseScreen';
import { TokenScreen } from './screens/TokenScreen';
import { ReleaseScreen } from './screens/ReleaseScreen';
import { MileageScreen } from './screens/MileageScreen';
import { VerifyScreen } from './screens/VerifyScreen';
import { FcpsDetailScreen } from './screens/FcpsDetailScreen';
import { ProductsScreen } from './screens/ProductsScreen';
import { SupportScreen } from './screens/SupportScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ArrivedScreen } from './screens/ArrivedScreen';
import { UCScreen } from './screens/UCScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { QuizScreen } from './screens/QuizScreen';
import { MissionsScreen } from './screens/MissionsScreen';
import { MissionLiveScreen } from './screens/MissionLiveScreen';

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const alertOn = useAppStore((s) => s.alertOn);
  const resetOnboarding = useAppStore((s) => s.resetOnboarding);
  const current = location.pathname.replace(/^\//, '');
  const showNav = navScreens.includes(current) && !alertOn;
  const showSwitcher = current !== '' && current !== 'picker';

  const toPicker = () => {
    resetOnboarding();
    navigate('/picker');
  };

  return (
      <PhoneFrame>
        <Routes>
          <Route path="/" element={<Navigate to="/picker" replace />} />
          <Route path="/picker" element={<PickerScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/consent" element={<ConsentScreen />} />
          <Route path="/linking" element={<LinkingScreen />} />
          <Route path="/connect" element={<ConnectScreen />} />
          <Route path="/income" element={<IncomeScreen />} />
          <Route path="/empty" element={<EmptyHomeScreen />} />
          <Route path="/emptyTab" element={<EmptyTabScreen />} />
          <Route path="/chat" element={<ChatGoalScreen />} />
          <Route path="/report" element={<GoalReportScreen />} />
          <Route path="/issuing" element={<TicketIssueScreen />} />
          <Route path="/voice" element={<VoiceInputScreen />} />
          <Route path="/parsed" element={<ParsedScreen />} />
          <Route path="/typing" element={<TypingScreen />} />
          <Route path="/analyze" element={<AnalyzeScreen />} />
          <Route path="/plan" element={<PlanScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/detail" element={<DetailScreen />} />
          <Route path="/accounts" element={<AccountsScreen />} />
          <Route path="/splitSettings" element={<SalarySplitSettingsScreen />} />
          <Route path="/salary" element={<SalaryScreen />} />
          <Route path="/spend" element={<SpendScreen />} />
          <Route path="/category" element={<CategoryScreen />} />
          <Route path="/calendar" element={<CalendarScreen />} />
          <Route path="/missionDetail" element={<MissionDetailScreen />} />
          <Route path="/cause" element={<CauseScreen />} />
          <Route path="/token" element={<TokenScreen />} />
          <Route path="/verify" element={<VerifyScreen />} />
          <Route path="/release" element={<ReleaseScreen />} />
          <Route path="/mileage" element={<MileageScreen />} />
          <Route path="/fcps" element={<FcpsDetailScreen />} />
          <Route path="/products" element={<ProductsScreen />} />
          <Route path="/support" element={<SupportScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/arrived" element={<ArrivedScreen />} />
          <Route path="/alerts" element={<AlertsScreen />} />
          <Route path="/quiz" element={<QuizScreen />} />
          <Route path="/missions" element={<MissionsScreen />} />
          <Route path="/missionLive" element={<MissionLiveScreen />} />
          <Route path="/uc/:id" element={<UCScreen />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        {showSwitcher && (
            <div
                onClick={toPicker}
                style={{
                  position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 6, zIndex: 40,
                  padding: '6px 14px', borderRadius: 9999, background: 'var(--color-60-text-secondary)', color: 'var(--im-white)',
                  fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer',
                }}
            >
              상황 바꾸기
            </div>
        )}
        {showNav && <BottomNav />}
        <GlobalAssistant />
      </PhoneFrame>
  );
}

export default function App() {
  return (
      <div className="app-stage"
          style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--color-30-surface-sub)',
            padding: 32, boxSizing: 'border-box',
          }}
      >
        <AppShell />
      </div>
  );
}
