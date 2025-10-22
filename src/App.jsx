import { useState } from 'react';
import * as Icons from './icons';
import html2pdf from 'html2pdf.js';
import { useCoaching } from './contexts/CoachingContext';
import { useAutoSave } from './hooks/useLocalStorage';
import { useToast } from './components/Toast';
import AutoSaveIndicator from './components/AutoSaveIndicator';
import ClientSelector from './components/ClientSelector';
import ProgressBar from './components/ProgressBar';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ExportControls from './components/ExportControls';
import FontSizeControl from './components/FontSizeControl';
import ThemeToggle from './components/ThemeToggle';
import OnboardingWizard from './components/OnboardingWizard';
import NextStepSuggestion from './components/NextStepSuggestion';
import ViewSwitcher from './components/ViewSwitcher';
import CoacheeDashboard from './pages/coachee/CoacheeDashboard';
import { calculateWheelAverage, calculateOverallProgress, getReadinessLevel } from './utils/calculations';
import { getReadinessRouting, isToolAllowed, getToolLockMessage } from './utils/readinessRouting';
import { sections } from './utils/sectionsConfig';
import { Menu, X, Lock } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const {
  Home,
  CheckCircle,
  Target,
  Map,
  FileText,
  BarChart3,
  AlertCircle,
  Download,
  ClipboardList,
  Circle,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Search,
  Lightbulb,
  BookOpen,
  Activity,
  Heart,
  Brain,
  Zap,
  Clock,
  HelpCircle,
  Mail,
  Anchor,
  Layers,
  Flag
} = Icons;

const CoachingAssessmentTool = () => {
// Use coaching context for state management
const coaching = useCoaching();

// Local UI state
const [activeSection, setActiveSection] = useState('home');
const [sidebarOpen, setSidebarOpen] = useState(false);
const [showOnboarding, setShowOnboarding] = useState(true);
const [currentView, setCurrentView] = useState('coach'); // 'coach' or 'client'

// Destructure from context for easier access
const {
  clientName, setClientName,
  clientAge, setClientAge,
  clientLocation, setClientLocation,
  sessionDate, setSessionDate,
  sessionNotes, setSessionNotes,
  actionPlan, setActionPlan,
  coachObservations, setCoachObservations,
  redFlags, setRedFlags,
  sessionGoal, setSessionGoal,
  nextSessionDate, setNextSessionDate,
  getCurrentSessionData
} = coaching;

// Get remaining state from context
const {
  readinessScores, setReadinessScores,
  quickAssessment, setQuickAssessment,
  logicalAnswers, setLogicalAnswers,
  scoreAnswers, setScoreAnswers,
  disneyAnswers, setDisneyAnswers,
  mapUpdateAnswers, setMapUpdateAnswers,
  personalHistoryAnswers, setPersonalHistoryAnswers,
  somAnswers, setSomAnswers,
  vakadAnswers, setVakadAnswers,
  personalColorAnswers, setPersonalColorAnswers,
  spiralDynamicsAnswers, setSpiralDynamicsAnswers,
  metaProgramAnswers, setMetaProgramAnswers,
  followUpReadinessScores, setFollowUpReadinessScores,
  wheelOfLife, setWheelOfLife
} = coaching;

// New tool states
const [problemIdentifier, setProblemIdentifier] = useState({
  category: '',
  urgency: '',
  impact: '',
  clientPerspective: '',
  coachObservation: '',
  symptoms: []
});

const [toolRecommendation, setToolRecommendation] = useState({
  recommendedTools: [],
  reasoning: '',
  sessionStructure: ''
});

const [sessionNoteData, setSessionNoteData] = useState({
  date: '',
  duration: '',
  clientMood: '',
  keyInsights: '',
  breakthroughs: '',
  challenges: '',
  homework: '',
  nextFocus: ''
});

// Enhanced Assessment Tools
const [valuesHierarchy, setValuesHierarchy] = useState([
  { value: '', importance: 5, satisfaction: 5, notes: '' },
  { value: '', importance: 5, satisfaction: 5, notes: '' },
  { value: '', importance: 5, satisfaction: 5, notes: '' },
  { value: '', importance: 5, satisfaction: 5, notes: '' },
  { value: '', importance: 5, satisfaction: 5, notes: '' },
  { value: '', importance: 5, satisfaction: 5, notes: '' },
  { value: '', importance: 5, satisfaction: 5, notes: '' },
  { value: '', importance: 5, satisfaction: 5, notes: '' },
  { value: '', importance: 5, satisfaction: 5, notes: '' },
  { value: '', importance: 5, satisfaction: 5, notes: '' }
]);

const [limitingBeliefs, setLimitingBeliefs] = useState({
  beliefs: [
    { belief: '', evidence: '', counter: '', reframe: '' }
  ],
  empoweringBeliefs: []
});

const [energyAudit, setEnergyAudit] = useState({
  energizers: ['', '', '', ''],
  drainers: ['', '', '', ''],
  actionPlan: ''
});

const [smartGoals, setSmartGoals] = useState([
  {
    goal: '',
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: '',
    actionSteps: ['', '', ''],
    obstacles: '',
    support: ''
  }
]);

// Session Features
const [sessionTimer, setSessionTimer] = useState({
  duration: 60,
  elapsed: 0,
  isRunning: false,
  startTime: null
});

const [selectedQuestions, setSelectedQuestions] = useState([]);

// Advanced NLP Tools
const [reframingWork, setReframingWork] = useState({
  situation: '',
  currentFrame: '',
  contentReframe: '',
  contextReframe: '',
  sixStepReframe: {
    behavior: '',
    intention: '',
    alternatives: ['', '', ''],
    selected: ''
  }
});

const [anchoringWork, setAnchoringWork] = useState({
  desiredState: '',
  trigger: '',
  intensity: 5,
  steps: [],
  practice: ''
});

const [timelineWork, setTimelineWork] = useState({
  issue: '',
  rootCause: '',
  learnings: '',
  future: '',
  integration: ''
});

// Email Templates
const [emailTemplates, setEmailTemplates] = useState({
  selectedTemplate: '',
  customization: '',
  recipient: ''
});

// Auto-save functionality
const currentData = getCurrentSessionData();
const { lastSaved, isSaving } = useAutoSave('coaching_current_session', currentData, 2000);

// Toast notifications
const toast = useToast();

const totalScore = Object.values(readinessScores).flat().reduce((a, b) => a + b, 0);

const getReadinessLevel = (score) => {
if (score >= 140) return { level: 'Sẵn sàng cao', color: 'text-green-600', bg: 'bg-green-50', icon: '✅', tools: 'SOM, VAKAD, Timeline Therapy, Meta Programs' };
if (score >= 100) return { level: 'Sẵn sàng trung bình', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '⚠️', tools: 'Well-Formed Outcome, Values Work, Map Update' };
if (score >= 60) return { level: 'Sẵn sàng thấp', color: 'text-orange-600', bg: 'bg-orange-50', icon: '⚠️', tools: 'Belief Audit, Motivation Building, Rapport' };
return { level: 'Chưa sẵn sàng', color: 'text-red-600', bg: 'bg-red-50', icon: '❌', tools: 'Tạm hoãn coaching, Tư vấn thêm' };
};

const readiness = getReadinessLevel(totalScore);

// Calculate progress
const progress = calculateOverallProgress(currentData);

const readinessQuestions = {
commitment: [
'Tôi sẵn sàng dành thời gian và công sức cần thiết cho quá trình coaching này',
'Tôi cam kết hoàn thành các bài tập và hành động được thỏa thuận giữa các buổi',
'Tôi sẵn sàng chia sẻ trung thực và cởi mở trong suốt quá trình coaching',
'Tôi hiểu rằng sự thay đổi bền vững cần có thời gian và sự kiên trì'
],
change: [
'Tôi tin tưởng vào khả năng thay đổi tình huống hiện tại của mình',
'Tôi sẵn sàng thay đổi những thói quen hoặc niềm tin không còn hỗ trợ tôi',
'Tôi sẵn sàng trải nghiệm những điều mới nằm ngoài vùng an toàn của mình',
'Tôi sẵn sàng nhận trách nhiệm cho kết quả và hành động của bản thân'
],
awareness: [
'Tôi có thể mô tả rõ ràng vấn đề hoặc thách thức mà tôi đang đối mặt',
'Tôi nhận thức được tác động của vấn đề này đến các khía cạnh trong cuộc sống tôi',
'Tôi thừa nhận vai trò và trách nhiệm của mình trong tình huống hiện tại',
'Tôi có thể nêu cụ thể điều gì tôi muốn thay đổi và tại sao điều đó quan trọng'
],
resources: [
'Tôi có người hỗ trợ (gia đình, bạn bè, đồng nghiệp) trong hành trình thay đổi này',
'Tôi có thể sắp xếp thời gian hợp lý để tham gia đầy đủ vào quá trình coaching',
'Tôi có đủ nguồn lực (tài chính, tinh thần, thể chất) để duy trì quá trình này',
'Tôi có các phương pháp hiệu quả để quản lý stress và điều chỉnh cảm xúc'
]
};

const mapUpdateQuestions = [
{
category: 'Nhận Trách Nhiệm (Taking Ownership)',
questions: [
'Khi nhìn lại, vai trò của bạn trong việc tạo ra hoặc duy trì tình huống hiện tại là gì?',
'Những hành động hoặc quyết định nào của bạn đã góp phần vào vấn đề này?',
'Trong tất cả những gì đang xảy ra, điều gì nằm trong tầm kiểm soát của bạn?',
'Nếu bạn chịu trách nhiệm 100% cho tình huống này, điều gì sẽ thay đổi?'
]
},
{
category: 'Chuyển Đổi Tư Duy (Mindset Shift)',
questions: [
'Thay vì hỏi "Tại sao điều này xảy ra với tôi?", bạn có thể học được gì từ trải nghiệm này?',
'Khi bạn cảm thấy bị ảnh hưởng bởi người khác, điều gì trong phản ứng của bạn là sự lựa chọn?',
'Nếu bạn có đầy đủ quyền lực, bạn sẽ làm gì NGAY BÂY GIỜ để cải thiện tình huống?',
'Bằng cách đổ lỗi cho hoàn cảnh hoặc người khác, bạn đang từ bỏ quyền lực nào của mình?'
]
},
{
category: 'Lựa Chọn & Hậu Quả (Choices & Consequences)',
questions: [
'Nếu mọi thứ tiếp tục như hiện tại, cuộc sống của bạn sẽ như thế nào sau 6 tháng, 1 năm?',
'Những lựa chọn khác nào bạn có mà chưa khám phá hoặc xem xét?',
'Chi phí (cảm xúc, thời gian, cơ hội) của việc KHÔNG thay đổi là gì?',
'Có phần nào trong bạn muốn giữ nguyên vấn đề này không? Nếu có, lý do là gì? (Secondary gain)'
]
},
{
category: 'Cam Kết & Trách Nhiệm (Commitment & Accountability)',
questions: [
'Dựa trên những gì bạn đã khám phá, bạn cam kết làm gì khác đi kể từ hôm nay?',
'Hành động cụ thể đầu tiên bạn sẽ thực hiện là gì? Khi nào bạn sẽ bắt đầu?',
'Ai (hoặc điều gì) sẽ hỗ trợ bạn giữ vững cam kết này?',
'Bạn sẽ đo lường và theo dõi tiến độ của mình như thế nào?'
]
}
];

const wheelAreas = {
spirituality: { label: 'Spirituality (Tâm Linh)', icon: '🙏', color: 'indigo' },
career: { label: 'Career/Finances/Studies (Sự Nghiệp/Tài Chính/Học Tập)', icon: '💼', color: 'blue' },
family: { label: 'Family (Gia Đình)', icon: '👨‍👩‍👧‍👦', color: 'orange' },
relationships: { label: 'Relationships (Các Mối Quan Hệ)', icon: '❤️', color: 'pink' },
health: { label: 'Health & Fitness (Sức Khỏe & Thể Chất)', icon: '💪', color: 'red' },
personal: { label: 'Personal Development (Phát Triển Cá Nhân)', icon: '📚', color: 'purple' },
leisure: { label: 'Leisure & Fun (Giải Trí & Vui Chơi)', icon: '🎉', color: 'cyan' },
contribution: { label: 'Significant Contribution (Đóng Góp Ý Nghĩa)', icon: '🌟', color: 'green' }
};

const logicalLevelQuestions = {
environment: [
'Môi trường (nơi làm việc, nhà ở, không gian) nào hiện đang hỗ trợ hoặc cản trở bạn?',
'Bạn cần tạo ra hoặc thay đổi điều gì trong môi trường xung quanh để hỗ trợ mục tiêu của mình?',
'Nơi nào và khi nào bạn cảm thấy có năng suất và sáng tạo nhất?',
'Những yếu tố môi trường nào (âm thanh, ánh sáng, con người) ảnh hưởng đến hiệu suất của bạn?'
],
behavior: [
'Những hành vi hoặc thói quen nào bạn đang lặp lại hàng ngày liên quan đến mục tiêu này?',
'Hành vi hoặc thói quen nào không còn phục vụ bạn và cần được thay đổi?',
'Hành động mới nào bạn cần bắt đầu thực hiện thường xuyên để tiến gần hơn đến mục tiêu?',
'Nếu ai đó quan sát bạn cả ngày, họ sẽ nhận thấy những pattern hành vi nào?'
],
capabilities: [
'Kỹ năng hoặc năng lực cụ thể nào bạn cần phát triển để đạt được mục tiêu này?',
'Bạn đã từng sử dụng những kỹ năng tương tự trong hoàn cảnh nào? Làm thế nào để áp dụng lại?',
'Ai có thể là người hướng dẫn, mentor, hoặc tấm gương cho bạn trong lĩnh vực này?',
'Con đường học tập nào (khóa học, thực hành, mentoring) phù hợp nhất với bạn?'
],
beliefs: [
'Những niềm tin nào về bản thân đang tạo ra kết quả hiện tại của bạn?',
'Niềm tin hạn chế nào đang ngăn cản bạn hành động hoặc tiến bộ?',
'Bạn tin điều gì về khả năng đạt được mục tiêu? Niềm tin này có phục vụ bạn không?',
'Giá trị cốt lõi nào đang hướng dẫn quyết định và hành động của bạn?'
],
identity: [
'Khi mô tả bản thân một cách chân thực nhất, bạn là ai?',
'Phiên bản tương lai của bạn - người đã đạt được mục tiêu - sẽ là ai?',
'Những vai trò nào trong cuộc sống đang định nghĩa bạn? Vai trò nào bạn muốn thêm vào?',
'Nếu bạn sống trọn vẹn với bản sắc lý tưởng, bạn sẽ nghĩ, nói và làm khác đi như thế nào?'
],
purpose: [
'Ý nghĩa sâu sắc nhất của cuộc sống bạn là gì? Điều gì làm bạn cảm thấy sống động?',
'Bạn muốn đóng góp và tạo ra tác động gì cho cộng đồng, gia đình, thế giới?',
'Di sản - cái mà bạn để lại sau khi rời đi - mà bạn mong muốn là gì?',
'Nếu thời gian và tiền bạc không phải vấn đề, bạn sẽ cống hiến cuộc đời cho điều gì?'
]
};

// ✅ ENHANCED SCORE MODEL with Reframe, Significant Emotional Experience, Inner Voice, Positive Intention
const scoreQuestions = {
symptom: [
'Vấn đề/triệu chứng của bạn là gì?',
'Bạn cảm thấy như thế nào về vấn đề này?',
'Vấn đề này xuất hiện khi nào?',
'Điều gì khiến vấn đề tồi tệ hơn?',
'⚛️ [Quantum Q1] Nếu vấn đề này biến mất ngay bây giờ, bạn sẽ biết như thế nào?',
'⚛️ [Quantum Q2] Điều gì sẽ khác đi trong cuộc sống bạn?',
'⚛️ [Quantum Q3] Ai sẽ là người đầu tiên nhận ra sự thay đổi?',
'⚛️ [Quantum Q4] Họ sẽ nhận ra điều gì khác về bạn?'
],
cause: [
'Bạn có vấn đề này từ khi nào?',
'Lần đầu tiên bạn nhận ra vấn đề này là khi nào?',
'Điều gì xảy ra trước khi vấn đề bắt đầu?',
'Ai hoặc sự kiện nào liên quan đến nguyên nhân?',
'🔍 [Significant Emotional Experience] Sự kiện cảm xúc quan trọng nào trong quá khứ liên quan đến vấn đề này?',
'🔄 [Reframe in Cause] Cách khác để nhìn sự kiện gốc này là gì?',
'👁️ [Visual] Bạn thấy gì khi nhớ lại sự kiện đó?',
'👂 [Auditory] Bạn nghe thấy gì? (Lời nói, âm thanh)',
'🤲 [Kinesthetic] Bạn cảm nhận gì trong cơ thể khi nhớ lại?'
],
outcome: [
'Bạn muốn đạt được điều gì thay vì vấn đề này?',
'Cuộc sống bạn sẽ như thế nào khi đạt được mục tiêu?',
'Bạn sẽ biết đã thành công như thế nào?',
'Khi nào bạn muốn đạt được điều này?'
],
resources: [
'Bạn cần những gì để đạt mục tiêu?',
'Ai có thể giúp bạn?',
'Bạn đã thành công trong lĩnh vực tương tự chưa?',
'Nguồn lực nào bạn đã có sẵn?'
],
effects: [
'Nếu không thay đổi, điều gì sẽ xảy ra?',
'Vấn đề này ảnh hưởng đến ai?',
'Lợi ích của việc thay đổi là gì?',
'Chi phí của việc không thay đổi là gì?'
],
reframe: [
'🔄 [Reframe] Cách khác để nhìn vấn đề này là gì?',
'🗣️ [Inner Voice] Giọng nói bên trong nói gì về vấn đề này?',
'💡 [Positive Intention] Ý định tích cực đằng sau hành vi/vấn đề này là gì?',
'📝 [Reframe] Nếu vấn đề này là một lời nhắn, nó muốn nói gì với bạn?'
],
futurePacing: [
'🚀 [Future Pacing] Hãy tưởng tượng bạn đã đạt được mục tiêu. Bạn đang ở đâu?',
'🚀 Bạn đang làm gì? Với ai?',
'🚀 Bạn cảm thấy thế nào? Nhìn thấy gì? Nghe thấy gì?',
'🚀 Điều gì đã thay đổi trong cuộc sống bạn để đạt được điều này?',
'🚀 Test: Liệu có bất kỳ phần nào trong bạn phản đối mục tiêu này không?'
]
};

const disneyQuestions = {
dreamer: [
'Nếu mọi thứ đều có thể, bạn muốn gì?',
'Tưởng tượng trong tương lai lý tưởng là gì?',
'Ước mơ lớn nhất của bạn là gì?',
'Nếu không có giới hạn, bạn sẽ làm gì?'
],
realist: [
'Bạn sẽ thực hiện như thế nào?',
'Bước đầu tiên là gì?',
'Bạn cần những nguồn lực gì?',
'Timeline cụ thể là gì?'
],
critic: [
'Rủi ro nào có thể xảy ra?',
'Điểm yếu của kế hoạch là gì?',
'Làm thế nào để cải thiện kế hoạch?',
'Điều gì có thể sai và giải pháp là gì?'
]
};

// ============================================
// RENDER FUNCTIONS
// ============================================

const renderHome = () => {
  // Calculate readiness score
  const totalReadinessScore = Object.values(readinessScores).flat().reduce((a, b) => a + b, 0);

  // Handle onboarding flow selection
  const handleFlowSelection = (flow) => {
    setShowOnboarding(false);
    if (flow === 'newClient') {
      setActiveSection('personalhistory');
    } else if (flow === 'smartAssistant') {
      setActiveSection('problemidentifier');
    } else if (flow === 'existingClient') {
      setActiveSection('followup');
    }
  };

  return (
    <div className="space-y-6">
      {/* Show onboarding wizard on first visit */}
      {showOnboarding ? (
        <>
          <OnboardingWizard onSelectFlow={handleFlowSelection} />

          <div className="text-center">
            <button
              onClick={() => setShowOnboarding(false)}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Bỏ qua - Tôi đã quen với công cụ này
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4">🎯 Công Cụ Đánh Giá Khách Hàng</h1>
            <p className="text-xl mb-2">Hệ Thống Toàn Diện Cho Coach - Enhanced v3.0</p>
            <p className="opacity-90">Xác định sẵn sàng, điểm nghẽn, trách nhiệm và công cụ phù hợp</p>
          </div>

          {/* FEATURED: Smart Assistant - Tool Recommender */}
          <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 border-3 border-purple-400 rounded-xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-4 py-2 rounded-full shadow-lg text-sm">
              ⭐ RECOMMENDED
            </div>

            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-purple-900 mb-2">💡 Trợ Lý Thông Minh (Smart Assistant)</h2>
                <p className="text-purple-800 text-lg mb-4">
                  Không chắc nên dùng công cụ nào? Hệ thống AI sẽ tự động gợi ý công cụ phù hợp nhất dựa trên vấn đề của khách hàng!
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="flex items-center space-x-2 mb-2">
                      <Search className="w-5 h-5 text-purple-600" />
                      <h4 className="font-bold text-gray-800">Bước 1: Xác Định Vấn Đề</h4>
                    </div>
                    <p className="text-sm text-gray-700">Mô tả vấn đề của khách hàng, phân loại và đánh giá mức độ khẩn cấp</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-5 h-5 text-pink-600" />
                      <h4 className="font-bold text-gray-800">Bước 2: Nhận Gợi Ý</h4>
                    </div>
                    <p className="text-sm text-gray-700">Nhận 3-4 công cụ phù hợp nhất + cấu trúc buổi coaching chi tiết</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveSection('problemidentifier')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-3 transition shadow-lg hover:shadow-xl text-lg"
                >
                  <Zap className="w-6 h-6" />
                  <span>Bắt Đầu Với Trợ Lý Thông Minh →</span>
                </button>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <details className="bg-red-50 border-2 border-red-400 rounded-lg p-6">
            <summary className="text-lg font-bold text-red-800 cursor-pointer hover:text-red-900">
              ⚠️ DISCLAIMER / TUYÊN BỐ MIỄN TRỪ TRÁCH NHIỆM (Click để xem)
            </summary>
            <div className="space-y-2 text-sm text-red-900 mt-4">
              <p className="font-semibold">© Coach Sony Ho - All Rights Reserved</p>
              <p><strong>Bản quyền:</strong> Công cụ này thuộc bản quyền của Coach Sony Ho. Nghiêm cấm sao chép, phân phối, hoặc sử dụng cho mục đích thương mại mà không có sự cho phép bằng văn bản.</p>
              <p><strong>Mục đích sử dụng:</strong> Công cụ này được thiết kế để hỗ trợ các coach chuyên nghiệp trong quá trình đánh giá khách hàng. Không thay thế tư vấn y tế, tâm lý, hoặc pháp lý chuyên môn.</p>
              <p><strong>Trách nhiệm:</strong> Người sử dụng công cụ phải có đào tạo coaching/NLP phù hợp. Coach Sony Ho không chịu trách nhiệm về việc sử dụng sai mục đích hoặc kết quả không mong muốn.</p>
              <p><strong>Liên hệ:</strong> Để được cấp phép sử dụng hoặc đào tạo, vui lòng liên hệ trực tiếp với Coach Sony Ho.</p>
            </div>
          </details>

<div className="border-2 border-blue-300 rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
<h3 className="text-xl font-bold text-blue-800 mb-4">👤 Thông Tin Khách Hàng</h3>
<div className="grid md:grid-cols-3 gap-4">
<div>
<label className="block text-sm font-medium mb-2 text-gray-700">Tên khách hàng</label>
<input
type="text"
value={clientName}
onChange={(e) => setClientName(e.target.value)}
placeholder="Nhập tên khách hàng..."
className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
/>
</div>
<div>
<label className="block text-sm font-medium mb-2 text-gray-700">Tuổi</label>
<input
type="number"
value={clientAge}
onChange={(e) => setClientAge(e.target.value)}
placeholder="Nhập tuổi..."
className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
/>
</div>
<div>
<label className="block text-sm font-medium mb-2 text-gray-700">Đến từ (Where from)</label>
<input
type="text"
value={clientLocation}
onChange={(e) => setClientLocation(e.target.value)}
placeholder="Nhập địa điểm..."
className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
/>
</div>
</div>
{clientName && (
<div className="mt-4 p-4 bg-white rounded-lg border-l-4 border-blue-500">
<p className="text-sm text-gray-700">
<strong>Khách hàng:</strong> {clientName}
{clientAge && `, ${clientAge} tuổi`}
{clientLocation && `, đến từ ${clientLocation}`}
</p>
</div>
)}
</div>

<div className="grid md:grid-cols-3 gap-4">
<div className="border-2 border-cyan-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer" onClick={() => setActiveSection('personalhistory')}>
<FileText className="w-12 h-12 text-cyan-600 mb-3" />
<h3 className="text-xl font-bold mb-2">Personal History Check</h3>
<p className="text-gray-600">20 câu - Tiểu sử cá nhân</p>
</div>

<div className="border-2 border-green-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer" onClick={() => setActiveSection('readiness')}>
<CheckCircle className="w-12 h-12 text-green-600 mb-3" />
<h3 className="text-xl font-bold mb-2">Đánh Giá Sẵn Sàng</h3>
<p className="text-gray-600">16 câu hỏi - 160 điểm</p>
</div>

<div className="border-2 border-orange-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer" onClick={() => setActiveSection('mapupdate')}>
<Map className="w-12 h-12 text-orange-600 mb-3" />
<h3 className="text-xl font-bold mb-2">Map Update</h3>
<p className="text-gray-600">16 câu - Nhận trách nhiệm</p>
</div>

<div className="border-2 border-purple-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer" onClick={() => setActiveSection('wheel')}>
<Circle className="w-12 h-12 text-purple-600 mb-3" />
<h3 className="text-xl font-bold mb-2">Wheel of Life</h3>
<p className="text-gray-600">8 lĩnh vực - Trực quan hóa</p>
</div>

<div className="border-2 border-teal-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer" onClick={() => setActiveSection('tools')}>
<FileText className="w-12 h-12 text-teal-600 mb-3" />
<h3 className="text-xl font-bold mb-2">Ma Trận Công Cụ</h3>
<p className="text-gray-600">Chọn công cụ phù hợp</p>
</div>

<div className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer" onClick={() => setActiveSection('worksheet')}>
<ClipboardList className="w-12 h-12 text-gray-600 mb-3" />
<h3 className="text-xl font-bold mb-2">Worksheet</h3>
<p className="text-gray-600">Tổng hợp & xuất báo cáo</p>
</div>
</div>

<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
<h3 className="text-lg font-bold mb-3">📋 Cách Sử Dụng:</h3>
<ol className="space-y-2 ml-4 list-decimal">
<li><strong>Personal History Check:</strong> 20 câu - Tiểu sử cá nhân (15 phút)</li>
<li><strong>Đánh Giá Sẵn Sàng:</strong> 16 câu chi tiết (10 phút)</li>
<li><strong>Follow-up Meeting:</strong> Review tiến độ và cam kết tiếp theo</li>
<li><strong>Map Update:</strong> 16 câu về trách nhiệm (15 phút)</li>
<li><strong>Wheel of Life:</strong> 8 lĩnh vực cuộc sống (10 phút)</li>
<li><strong>SOM & VAKAD Tools:</strong> Xác định vị trí tri giác và hệ thống đại diện</li>
<li><strong>Worksheet:</strong> Tổng hợp và xuất báo cáo</li>
</ol>
</div>

<div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
<h3 className="text-lg font-bold text-green-800 mb-3">🎯 Session Planning - Lập Kế Hoạch Buổi Coaching</h3>
<div className="space-y-3 text-sm">
<div className="p-3 bg-white rounded">
<p className="font-bold mb-2">📅 Trước Session (Pre-Session):</p>
<ul className="list-disc ml-6 text-xs space-y-1">
<li>Review notes từ session trước (nếu có)</li>
<li>Xem lại action plan - khách hàng đã hoàn thành chưa?</li>
<li>Chuẩn bị môi trường: yên tĩnh, riêng tư, thoải mái</li>
<li>Check mindset: Tôi đang ở trong trạng thái resourceful chưa?</li>
<li>Set ý định: Mục tiêu của session này là gì?</li>
</ul>
</div>

<div className="p-3 bg-white rounded">
<p className="font-bold mb-2">🎬 Mở Đầu Session (10-15 phút):</p>
<ul className="list-disc ml-6 text-xs space-y-1">
<li><strong>Rapport:</strong> Matching & Mirroring, small talk tự nhiên</li>
<li><strong>State Management:</strong> "Hôm nay bạn cảm thấy thế nào? (1-10)"</li>
<li><strong>Set Outcome:</strong> "Điều gì sẽ khiến session hôm nay trở nên có giá trị với bạn?"</li>
<li><strong>Check Action Plan:</strong> "Tuần vừa rồi thế nào với các cam kết của bạn?"</li>
</ul>
</div>

<div className="p-3 bg-white rounded">
<p className="font-bold mb-2">⚙️ Thân Session (30-50 phút):</p>
<ul className="list-disc ml-6 text-xs space-y-1">
<li>Sử dụng công cụ phù hợp dựa trên đánh giá</li>
<li>Calibrate liên tục: Quan sát ngôn ngữ cơ thể, giọng điệu</li>
<li>Pace & Lead: Đi cùng khách hàng trước khi dẫn dắt</li>
<li>Powerful questions thay vì advice</li>
<li>Celebrate insights và breakthrough</li>
</ul>
</div>

<div className="p-3 bg-white rounded">
<p className="font-bold mb-2">🏁 Kết Thúc Session (10-15 phút):</p>
<ul className="list-disc ml-6 text-xs space-y-1">
<li><strong>Summarize:</strong> "Những gì quan trọng nhất từ session hôm nay là gì?"</li>
<li><strong>Action Plan:</strong> 2-3 hành động cụ thể, đo lường được</li>
<li><strong>Accountability:</strong> "Ai/Cái gì sẽ giúp bạn giữ cam kết?"</li>
<li><strong>Future Pace:</strong> "Hãy tưởng tượng bạn đã hoàn thành..."</li>
<li><strong>Schedule:</strong> Book session tiếp theo</li>
</ul>
</div>
</div>
</div>

<div className="bg-purple-50 border-2 border-purple-500 rounded-lg p-6">
<h3 className="text-lg font-bold text-purple-800 mb-3">👁️ Calibration Guide - Đọc Khách Hàng</h3>
<div className="grid md:grid-cols-2 gap-4 text-sm">
<div className="p-3 bg-white rounded">
<p className="font-bold mb-2">🟢 Dấu Hiệu Tích Cực:</p>
<ul className="list-disc ml-6 text-xs space-y-1">
<li><strong>Ngôn ngữ cơ thể:</strong> Nghiêng về phía trước, eye contact tốt, mở cánh tay</li>
<li><strong>Giọng điệu:</strong> Nhiệt tình, tăng năng lượng, tốc độ nhanh hơn</li>
<li><strong>Ngôn ngữ:</strong> "Tôi có thể", "Tôi sẽ", "Tôi muốn"</li>
<li><strong>Thở:</strong> Sâu hơn, đều đặn, thư giãn</li>
<li><strong>Da mặt:</strong> Tươi sáng, hồng hào</li>
</ul>
</div>

<div className="p-3 bg-white rounded">
<p className="font-bold mb-2">🔴 Dấu Hiệu Tiêu Cực/Kháng Cự:</p>
<ul className="list-disc ml-6 text-xs space-y-1">
<li><strong>Ngôn ngữ cơ thể:</strong> Khoanh tay, nghiêng ra xa, tránh eye contact</li>
<li><strong>Giọng điệu:</strong> Đơn điệu, thấp, chậm, thiếu năng lượng</li>
<li><strong>Ngôn ngữ:</strong> "Tôi không thể", "Họ làm tôi", "Nhưng mà"</li>
<li><strong>Thở:</strong> Nông, nhanh, hoặc giữ hơi</li>
<li><strong>Da mặt:</strong> Nhợt nhạt, đỏ ửng (stress)</li>
</ul>
</div>

<div className="p-3 bg-white rounded">
<p className="font-bold mb-2">⚠️ Khi Thấy Kháng Cự:</p>
<ul className="list-disc ml-6 text-xs space-y-1">
<li>CHẬM LẠI - đừng push</li>
<li>Quay lại Rapport - matching & pacing</li>
<li>"Có vẻ như có điều gì đó... bạn có muốn chia sẻ không?"</li>
<li>Tôn trọng Ecology - có thể có lý do tốt cho kháng cự</li>
</ul>
</div>

<div className="p-3 bg-white rounded">
<p className="font-bold mb-2">🎯 Dấu Hiệu Breakthrough:</p>
<ul className="list-disc ml-6 text-xs space-y-1">
<li>Thay đổi đột ngột trong tư thế</li>
<li>Ánh mắt sáng lên, "Aha moment"</li>
<li>Cười hoặc khóc (giải phóng cảm xúc)</li>
<li>"Ồ... tôi chưa từng nghĩ về nó như vậy"</li>
<li>→ Celebrate & Anchor ngay!</li>
</ul>
</div>
</div>
</div>

<div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-6">
<h3 className="text-lg font-bold text-yellow-800 mb-3">💬 Coaching Scripts - Câu Hỏi Mạnh</h3>
<div className="space-y-3 text-sm">
<div className="p-3 bg-white rounded border-l-4 border-blue-500">
<p className="font-bold mb-1">🎯 Khám Phá (Exploration):</p>
<ul className="list-none space-y-1 text-xs">
<li>"Nói thêm về điều đó..."</li>
<li>"Điều gì quan trọng với bạn về vấn đề này?"</li>
<li>"Nếu tôi đứng ở vị trí của bạn, tôi sẽ thấy/nghe/cảm nhận gì?"</li>
<li>"Còn gì nữa?"</li>
</ul>
</div>

<div className="p-3 bg-white rounded border-l-4 border-green-500">
<p className="font-bold mb-1">🔍 Làm Rõ (Clarification):</p>
<ul className="list-none space-y-1 text-xs">
<li>"Cụ thể là gì?"</li>
<li>"Ví dụ như thế nào?"</li>
<li>"Bạn có thể mô tả chi tiết hơn không?"</li>
<li>"Luôn luôn? Không bao giờ? Mọi người?"</li>
</ul>
</div>

<div className="p-3 bg-white rounded border-l-4 border-purple-500">
<p className="font-bold mb-1">💡 Insight (Deepening):</p>
<ul className="list-none space-y-1 text-xs">
<li>"Điều gì thực sự quan trọng ở đây?"</li>
<li>"Nếu bạn biết câu trả lời, nó sẽ là gì?"</li>
<li>"Phần nào trong bạn đang nói điều này?"</li>
<li>"Nếu vấn đề này là một thông điệp, nó muốn nói gì?"</li>
</ul>
</div>

<div className="p-3 bg-white rounded border-l-4 border-orange-500">
<p className="font-bold mb-1">🚀 Hành Động (Action):</p>
<ul className="list-none space-y-1 text-xs">
<li>"Bạn sẽ làm gì với insight này?"</li>
<li>"Bước đầu tiên nhỏ nhất là gì?"</li>
<li>"Trên thang 1-10, mức độ cam kết của bạn là bao nhiêu?"</li>
<li>"Điều gì sẽ khiến nó lên 10?"</li>
</ul>
</div>

<div className="p-3 bg-white rounded border-l-4 border-red-500">
<p className="font-bold mb-1">⚡ Thách Thức (Challenge):</p>
<ul className="list-none space-y-1 text-xs">
<li>"Điều gì ngăn bạn?"</li>
<li>"Chi phí của việc KHÔNG làm là gì?"</li>
<li>"Nếu [người bạn yêu] phụ thuộc vào điều này, bạn sẽ làm gì?"</li>
<li>"Phiên bản tốt nhất của bạn sẽ nói gì?"</li>
</ul>
</div>
</div>
</div>

<div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-400 rounded-lg p-6">
<h3 className="text-lg font-bold mb-3 text-purple-800">🆕 Tính Năng Mới v2.0:</h3>
<ul className="space-y-2 text-sm">
<li className="flex items-start">
<span className="mr-2">✨</span>
<span><strong>SCORE Model Enhanced:</strong> Thêm Quantum Questions, VAK System, Reframe, Future Pacing</span>
</li>
<li className="flex items-start">
<span className="mr-2">✨</span>
<span><strong>Logical Levels Alignment:</strong> Quy trình đi lên (chẩn đoán) và đi xuống (alignment)</span>
</li>
<li className="flex items-start">
<span className="mr-2">✨</span>
<span><strong>6 Công Cụ Mới:</strong> Well-Formed Outcome, Rapport, Motivation, Collapse Anchor, Belief Audit, Values Work</span>
</li>
<li className="flex items-start">
<span className="mr-2">✨</span>
<span><strong>Red Flags:</strong> Hệ thống cảnh báo an toàn và đạo đức</span>
</li>
</ul>
</div>

<div className="bg-red-100 border-2 border-red-500 rounded-lg p-6">
<h3 className="text-lg font-bold text-red-800 mb-3">🚨 RED FLAGS - Khi Nào Cần Chuyển Tiếp Chuyên Gia</h3>
<div className="space-y-3 text-sm">
<div className="p-3 bg-white rounded border-l-4 border-red-600">
<p className="font-bold text-red-800 mb-2">⚠️ Cấp Độ Khẩn Cấp - Chuyển Tiếp Ngay Lập Tức:</p>
<ul className="list-disc ml-6 space-y-1">
<li><strong>Ý định tự hại/tự tử:</strong> "Tôi nghĩ về việc kết thúc cuộc đời", "Không còn lý do để sống"</li>
<li><strong>Ý định làm hại người khác:</strong> Kế hoạch cụ thể về bạo lực</li>
<li><strong>Triệu chứng tâm thần:</strong> Ảo giác, hoang tưởng, mất kết nối với thực tại</li>
<li><strong>Lạm dụng cấp tính:</strong> Bạo hành, ngược đãi đang diễn ra</li>
</ul>
<p className="mt-2 text-red-700 font-semibold">→ Hành động: Liên hệ dịch vụ khẩn cấp hoặc chuyên gia tâm lý ngay</p>
</div>

<div className="p-3 bg-white rounded border-l-4 border-orange-500">
<p className="font-bold text-orange-800 mb-2">⚡ Cấp Độ Cao - Cần Chuyên Gia Y Tế/Tâm Lý:</p>
<ul className="list-disc ml-6 space-y-1">
<li><strong>Trầm cảm nặng:</strong> Mất hứng thú hoàn toàn, thay đổi giấc ngủ/ăn uống nghiêm trọng</li>
<li><strong>Lo âu/hoảng loạn:</strong> Cơn hoảng loạn thường xuyên, lo âu làm tê liệt cuộc sống</li>
<li><strong>Chấn thương tâm lý (PTSD):</strong> Flashbacks, nightmare, tránh né nghiêm trọng</li>
<li><strong>Nghiện ngập:</strong> Lạm dụng chất gây nghiện ảnh hưởng chức năng sống</li>
<li><strong>Rối loạn ăn uống:</strong> Anorexia, bulimia, binge eating nghiêm trọng</li>
</ul>
<p className="mt-2 text-orange-700 font-semibold">→ Hành động: Giới thiệu psychiatrist, psychologist hoặc bác sĩ</p>
</div>

<div className="p-3 bg-white rounded border-l-4 border-yellow-500">
<p className="font-bold text-yellow-800 mb-2">⚠️ Vấn Đề Pháp Lý - Ngoài Phạm Vi Coaching:</p>
<ul className="list-disc ml-6 space-y-1">
<li>Vấn đề ly hôn, tranh chấp nuôi con</li>
<li>Vấn đề pháp lý nghiêm trọng</li>
<li>Tranh chấp tài chính phức tạp</li>
<li>Vấn đề y tế cần chẩn đoán</li>
</ul>
<p className="mt-2 text-yellow-700 font-semibold">→ Hành động: Giới thiệu luật sư, kế toán, bác sĩ phù hợp</p>
</div>
</div>
</div>

<div className="bg-blue-100 border-2 border-blue-500 rounded-lg p-6">
<h3 className="text-lg font-bold text-blue-800 mb-3">📜 Đạo Đức & Ranh Giới Nghề Nghiệp</h3>
<div className="space-y-2 text-sm">
<div className="p-3 bg-white rounded">
<p className="font-semibold mb-1">✓ Coaching LÀ:</p>
<ul className="list-disc ml-6 text-xs">
<li>Giúp người có chức năng sống tốt đạt mục tiêu cao hơn</li>
<li>Hỗ trợ phát triển kỹ năng, thay đổi hành vi</li>
<li>Làm việc với tương lai và tiềm năng</li>
<li>Partnership, không phải điều trị</li>
</ul>
</div>
<div className="p-3 bg-white rounded">
<p className="font-semibold mb-1">✗ Coaching KHÔNG PHẢI:</p>
<ul className="list-disc ml-6 text-xs">
<li>Điều trị tâm lý hoặc tư vấn trị liệu</li>
<li>Chẩn đoán hoặc điều trị bệnh tâm thần</li>
<li>Tư vấn pháp lý, tài chính, hoặc y tế</li>
<li>Giải quyết chấn thương tâm lý nặng</li>
</ul>
</div>
<p className="mt-3 p-3 bg-blue-50 rounded text-xs italic">
<strong>Lưu ý:</strong> Nếu không chắc chắn, luôn err on the side of caution và giới thiệu khách hàng đến chuyên gia phù hợp. Tốt hơn là an toàn hơn là hối hận.
</p>
</div>
</div>

<NextStepSuggestion
  currentSection="home"
  readinessScore={totalReadinessScore}
  onNavigate={setActiveSection}
/>
</>
)}
</div>
);
};

const renderReadiness = () => {
  const colorClasses = {
    blue: { text: 'text-blue-600', border: 'border-blue-200' },
    green: { text: 'text-green-600', border: 'border-green-200' },
    purple: { text: 'text-purple-600', border: 'border-purple-200' },
    orange: { text: 'text-orange-600', border: 'border-orange-200' }
  };

  return (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">✅ Đánh Giá Mức Độ Sẵn Sàng Chi Tiết</h2>

<div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
<p className="font-bold">⏱️ Thời gian: 10-15 phút - 16 câu hỏi với thang điểm 1-10</p>
</div>

<div className={`${readiness.bg} border-l-4 border-current p-6 rounded-lg ${readiness.color} shadow-md`}>
<div className="flex justify-between items-center mb-2">
<p className="font-bold text-2xl">{readiness.icon} Tổng điểm: {totalScore}/160</p>
<span className="text-xl font-bold">{readiness.level}</span>
</div>
<p className="text-sm mt-2"><strong>Công cụ khuyến nghị:</strong> {readiness.tools}</p>
</div>

<div className="space-y-6">
{Object.entries({
commitment: { label: 'Cam Kết', icon: '🎯', color: 'blue' },
change: { label: 'Thay Đổi', icon: '🔄', color: 'green' },
awareness: { label: 'Nhận Thức', icon: '💡', color: 'purple' },
resources: { label: 'Nguồn Lực', icon: '⚡', color: 'orange' }
}).map(([key, meta]) => (
<div key={key} className={`border-2 ${colorClasses[meta.color].border} rounded-lg p-6 bg-white shadow hover:shadow-lg transition`}>
<div className="flex items-center justify-between mb-4">
<h3 className="text-xl font-bold">{meta.icon} {meta.label}</h3>
<span className={`text-2xl font-bold ${colorClasses[meta.color].text}`}>
{readinessScores[key].reduce((a, b) => a + b, 0)}/40
</span>
</div>

<div className="space-y-4">
{readinessQuestions[key].map((question, idx) => (
<div key={idx} className="bg-gray-50 p-4 rounded">
<label className="block text-sm font-medium mb-3">
<span className="font-bold">Câu {idx + 1}:</span> {question}
</label>
<div className="flex items-center space-x-4">
<input
type="range"
min="0"
max="10"
value={readinessScores[key][idx]}
onChange={(e) => {
const newScores = { ...readinessScores };
newScores[key][idx] = parseInt(e.target.value);
setReadinessScores(newScores);
}}
className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
/>
<span className={`text-2xl font-bold ${colorClasses[meta.color].text} w-12 text-center`}>
{readinessScores[key][idx]}
</span>
</div>
<div className="flex justify-between text-xs text-gray-500 mt-1">
<span>Hoàn toàn không đồng ý</span>
<span>Hoàn toàn đồng ý</span>
</div>
</div>
))}
</div>
</div>
))}
</div>

<div className="border rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold mb-4">📊 Phân Tích Chi Tiết</h3>
<div className="space-y-4">
<div className="p-4 bg-green-50 rounded border-l-4 border-green-500">
<p className="font-bold text-green-800 mb-2">140-160 điểm: SẴN SÀNG CAO ✅</p>
<p className="text-sm mb-2">Khách hàng hoàn toàn sẵn sàng cho coaching. Tiến độ có thể nhanh.</p>
<p className="text-sm font-semibold">Công cụ: Disney Model, Logical Levels, Timeline Therapy</p>
</div>
<div className="p-4 bg-yellow-50 rounded border-l-4 border-yellow-500">
<p className="font-bold text-yellow-800 mb-2">100-139 điểm: SẴN SÀNG TRUNG BÌNH ⚠️</p>
<p className="text-sm mb-2">Cần xây dựng thêm động lực và cam kết.</p>
<p className="text-sm font-semibold">Công cụ: SCORE Model, Well-Formed Outcome, Values Work</p>
</div>
<div className="p-4 bg-orange-50 rounded border-l-4 border-orange-500">
<p className="font-bold text-orange-800 mb-2">60-99 điểm: SẴN SÀNG THẤP ⚠️</p>
<p className="text-sm mb-2">Cần nhiều thời gian chuẩn bị, tập trung xây dựng động lực.</p>
<p className="text-sm font-semibold">Công cụ: Belief Audit, Motivation Building, Rapport</p>
</div>
<div className="p-4 bg-red-50 rounded border-l-4 border-red-500">
<p className="font-bold text-red-800 mb-2">Dưới 60 điểm: CHƯA SẴN SÀNG ❌</p>
<p className="text-sm mb-2">Cần tư vấn thêm về lợi ích của coaching.</p>
<p className="text-sm font-semibold">Khuyến nghị: Hoãn lại hoặc tham khảo chuyên gia khác</p>
</div>
</div>

<NextStepSuggestion
  currentSection="readiness"
  readinessScore={Object.values(readinessScores).flat().reduce((a, b) => a + b, 0)}
  onNavigate={setActiveSection}
/>
</div>
</div>
  );
};

const renderMapUpdate = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">🗺️ Map Update - Nhận Trách Nhiệm</h2>

<div className="bg-gradient-to-r from-orange-100 to-red-100 border-l-4 border-orange-500 p-4">
<p className="font-bold">⏱️ Thời gian: 15-20 phút - 16 câu hỏi giúp khách hàng chuyển từ "Nạn nhân" → "Chủ động"</p>
<p className="text-sm mt-2">Mục tiêu: Khách hàng tự nhận trách nhiệm về tình huống và cam kết hành động</p>
</div>

<div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
<h3 className="font-bold text-lg mb-3">🎯 Mục Đích Map Update</h3>
<ul className="list-disc ml-6 space-y-2 text-sm">
<li><strong>Awareness:</strong> Nhận ra vai trò của mình trong tình huống hiện tại</li>
<li><strong>Responsibility:</strong> Chấp nhận trách nhiệm thay vì đổ lỗi</li>
<li><strong>Choice:</strong> Nhìn thấy các lựa chọn và quyền lực của mình</li>
<li><strong>Action:</strong> Cam kết hành động cụ thể để thay đổi</li>
</ul>
</div>

<div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-6">
<h3 className="font-bold text-lg text-blue-800 mb-3">💡 Gợi Ý Cho Khách Hàng</h3>
<div className="space-y-3 text-sm">
<div className="p-3 bg-white rounded-lg border-l-4 border-blue-500">
<p className="font-semibold mb-2">🔹 Khi khách hàng nói: "Họ làm tôi..."</p>
<p className="text-gray-700">→ Gợi ý: "Không ai có thể KHIẾN bạn cảm thấy gì mà không có sự đồng ý của bạn. Bạn CHỌN cảm nhận như vậy vì lý do gì?"</p>
</div>
<div className="p-3 bg-white rounded-lg border-l-4 border-green-500">
<p className="font-semibold mb-2">🔹 Khi khách hàng nói: "Tôi không có lựa chọn nào khác"</p>
<p className="text-gray-700">→ Gợi ý: "Luôn có ít nhất 3 lựa chọn. Hãy kể cho tôi nghe 3 điều bạn CÓ THỂ làm, kể cả những điều tưởng chừng như không thể"</p>
</div>
<div className="p-3 bg-white rounded-lg border-l-4 border-purple-500">
<p className="font-semibold mb-2">🔹 Khi khách hàng nói: "Đó là lỗi của..."</p>
<p className="text-gray-700">→ Gợi ý: "Tôi hiểu họ có vai trò trong tình huống này. Nhưng VAI TRÒ của bạn là gì? Bạn đã đóng góp như thế nào vào kết quả này?"</p>
</div>
<div className="p-3 bg-white rounded-lg border-l-4 border-orange-500">
<p className="font-semibold mb-2">🔹 Khi khách hàng nói: "Tôi đã cố gắng hết sức rồi"</p>
<p className="text-gray-700">→ Gợi ý: "Cố gắng' khác với 'cam kết'. Nếu cuộc sống của người bạn yêu phụ thuộc vào việc này, bạn sẽ làm gì khác đi?"</p>
</div>
<div className="p-3 bg-white rounded-lg border-l-4 border-red-500">
<p className="font-semibold mb-2">🔹 Khi khách hàng kháng cự nhận trách nhiệm</p>
<p className="text-gray-700">→ Gợi ý: "Nhận trách nhiệm KHÔNG có nghĩa là tự trách mình. Nó có nghĩa là lấy lại QUYỀN LỰC thay đổi tình huống. Khi bạn đổ lỗi, bạn từ bỏ quyền lực."</p>
</div>
</div>
</div>

<div className="space-y-6">
{mapUpdateQuestions.map((section, sectionIdx) => (
<div key={sectionIdx} className="border-2 border-orange-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-orange-600 mb-4">
{sectionIdx + 1}. {section.category}
</h3>

<div className="space-y-4">
{section.questions.map((question, qIdx) => (
<div key={qIdx} className="bg-gray-50 p-4 rounded">
<label className="block text-sm font-semibold mb-2 text-gray-700">
{String.fromCharCode(97 + qIdx)}. {question}
</label>
<textarea
value={mapUpdateAnswers[`${sectionIdx}-${qIdx}`] || ''}
onChange={(e) => setMapUpdateAnswers({...mapUpdateAnswers, [`${sectionIdx}-${qIdx}`]: e.target.value})}
placeholder="Câu trả lời của khách hàng..."
className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
rows="3"
/>
</div>
))}
</div>

{sectionIdx === 0 && (
<div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
<p className="text-sm font-semibold mb-2">💡 Coach Tips:</p>
<p className="text-sm">Giúp khách hàng thấy rằng họ KHÔNG phải nạn nhân. Họ có vai trò và quyền lực trong tình huống.</p>
</div>
)}

{sectionIdx === 1 && (
<div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
<p className="text-sm font-semibold mb-2">💡 Coach Tips:</p>
<p className="text-sm">Chuyển ngôn ngữ từ bị động sang chủ động. "Họ làm tôi..." → "Tôi chọn... vì..."</p>
</div>
)}

{sectionIdx === 2 && (
<div className="mt-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
<p className="text-sm font-semibold mb-2">💡 Coach Tips:</p>
<p className="text-sm">Khám phá "secondary gain" - lợi ích ẩn của việc giữ nguyên vấn đề. Ví dụ: sự chú ý, tránh trách nhiệm...</p>
</div>
)}

{sectionIdx === 3 && (
<div className="mt-4 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
<p className="text-sm font-semibold mb-2">💡 Coach Tips:</p>
<p className="text-sm">Cam kết phải cụ thể, đo lường được và có thời hạn. Ai sẽ giữ họ accountable?</p>
</div>
)}
</div>
))}
</div>

<div className="border-2 border-green-300 rounded-lg p-6 bg-green-50">
<h3 className="text-xl font-bold text-green-700 mb-4">✅ Checklist Hoàn Thành Map Update</h3>
<div className="space-y-2">
{[
'Khách hàng nhận ra vai trò của mình trong tình huống',
'Khách hàng ngừng đổ lỗi cho người/điều khác',
'Khách hàng thấy được các lựa chọn của mình',
'Khách hàng hiểu hậu quả của việc không thay đổi',
'Khách hàng cam kết hành động cụ thể',
'Có người/cơ chế để giữ khách hàng accountable'
].map((item, idx) => (
<div key={idx} className="flex items-center space-x-3 p-3 bg-white rounded">
<input type="checkbox" className="w-5 h-5 text-green-600" />
<span className="text-sm">{item}</span>
</div>
))}
</div>
</div>

<div className="bg-red-50 border border-red-200 rounded-lg p-6">
<h3 className="font-bold text-red-800 mb-3">⚠️ Lưu Ý Quan Trọng:</h3>
<ul className="list-disc ml-6 space-y-2 text-sm">
<li>Map Update KHÔNG phải để khiến khách hàng cảm thấy tội lỗi</li>
<li>Mục tiêu là trao quyền lực (empower), không phải đổ lỗi</li>
<li>Nhận trách nhiệm = Lấy lại quyền kiểm soát</li>
<li>Nếu khách hàng kháng cự, hãy chậm lại và xây dựng rapport</li>
</ul>
</div>

<NextStepSuggestion
  currentSection="mapupdate"
  readinessScore={Object.values(readinessScores).flat().reduce((a, b) => a + b, 0)}
  onNavigate={setActiveSection}
/>
</div>
);

const renderWheelOfLife = () => {
const averageScore = Object.values(wheelOfLife).reduce((sum, area) => sum + area.current, 0) / 8;

const colorClasses = {
  blue: { border: 'border-blue-200', text: 'text-blue-600', bg: 'bg-blue-500' },
  green: { border: 'border-green-200', text: 'text-green-600', bg: 'bg-green-500' },
  purple: { border: 'border-purple-200', text: 'text-purple-600', bg: 'bg-purple-500' },
  orange: { border: 'border-orange-200', text: 'text-orange-600', bg: 'bg-orange-500' },
  red: { border: 'border-red-200', text: 'text-red-600', bg: 'bg-red-500' },
  yellow: { border: 'border-yellow-200', text: 'text-yellow-600', bg: 'bg-yellow-500' },
  pink: { border: 'border-pink-200', text: 'text-pink-600', bg: 'bg-pink-500' },
  cyan: { border: 'border-cyan-200', text: 'text-cyan-600', bg: 'bg-cyan-500' }
};

return (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">⭕ Bánh Xe Cuộc Đời</h2>

<div className="bg-gradient-to-r from-purple-100 to-pink-100 border-l-4 border-purple-500 p-4 rounded-lg">
<p className="font-bold">⏱️ Thời gian: 10-15 phút - Đánh giá 8 lĩnh vực và xác định cần gì để đạt 10 điểm</p>
<p className="text-sm mt-2">Điểm trung bình hiện tại: <strong>{averageScore.toFixed(1)}/10</strong></p>
</div>

<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow">
<h3 className="font-bold text-lg mb-3">🎯 Hướng Dẫn Sử Dụng</h3>
<ol className="list-decimal ml-6 space-y-2 text-sm">
<li><strong>Đánh giá hiện tại:</strong> Cho điểm từ 0-10 cho mỗi lĩnh vực</li>
<li><strong>Đặt mục tiêu:</strong> Thường là 10, có thể điều chỉnh</li>
<li><strong>Xác định nhu cầu:</strong> Viết cụ thể cần GÌ để đạt mục tiêu</li>
<li><strong>Xem biểu đồ:</strong> Nhận biết sự mất cân bằng</li>
<li><strong>Ưu tiên:</strong> Chọn 2-3 lĩnh vực để tập trung cải thiện</li>
</ol>
</div>

<div className="grid md:grid-cols-2 gap-6">
{Object.entries(wheelAreas).map(([key, meta]) => {
const data = wheelOfLife[key];
const gap = data.target - data.current;
const colors = colorClasses[meta.color] || colorClasses.blue;

const iconBgClasses = {
blue: 'bg-gradient-to-br from-blue-100 to-blue-200',
green: 'bg-gradient-to-br from-green-100 to-green-200',
purple: 'bg-gradient-to-br from-purple-100 to-purple-200',
orange: 'bg-gradient-to-br from-orange-100 to-orange-200',
red: 'bg-gradient-to-br from-red-100 to-red-200',
yellow: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
pink: 'bg-gradient-to-br from-pink-100 to-pink-200',
cyan: 'bg-gradient-to-br from-cyan-100 to-cyan-200'
};

const badgeBgClasses = {
blue: 'bg-blue-50',
green: 'bg-green-50',
purple: 'bg-purple-50',
orange: 'bg-orange-50',
red: 'bg-red-50',
yellow: 'bg-yellow-50',
pink: 'bg-pink-50',
cyan: 'bg-cyan-50'
};

return (
<div key={key} className={`relative border-2 ${colors.border} rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-xl transition-all duration-300`}>
{/* Header with icon, title and score */}
<div className="flex items-start justify-between mb-5">
<div className="flex items-center space-x-3">
<div className={`w-12 h-12 rounded-full ${iconBgClasses[meta.color]} flex items-center justify-center text-2xl shadow-sm`}>
{meta.icon}
</div>
<div>
<h3 className={`text-lg font-bold ${colors.text}`}>{meta.label}</h3>
<p className="text-xs text-gray-500 mt-1">Hiện tại → Mục tiêu</p>
</div>
</div>
<div className="text-right">
<div className={`text-3xl font-bold ${colors.text}`}>{data.current}</div>
<div className="text-xs text-gray-400">/ {data.target}</div>
{gap > 0 && (
<div className={`mt-1 px-2 py-1 ${colors.text} ${badgeBgClasses[meta.color]} rounded-full text-xs font-semibold`}>
+{gap} điểm nữa
</div>
)}
</div>
</div>

{/* Visual Progress Bar with percentage */}
<div className="mb-5">
<div className="flex justify-between items-center mb-2">
<span className="text-xs font-semibold text-gray-600">Tiến độ</span>
<span className={`text-sm font-bold ${colors.text}`}>{Math.round((data.current / data.target) * 100)}%</span>
</div>
<div className="relative h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
<div
className={`absolute inset-y-0 left-0 ${colors.bg} rounded-full transition-all duration-500 ease-out`}
style={{ width: `${(data.current / data.target) * 100}%` }}
>
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
</div>
{/* Markers for every 2 points */}
<div className="absolute inset-0 flex">
{[2,4,6,8].map((marker) => (
<div key={marker} className="border-r border-gray-300/50" style={{width: `${(marker/10)*100}%`}}></div>
))}
</div>
</div>
<div className="flex justify-between text-xs text-gray-400 mt-1">
<span>0</span>
<span>5</span>
<span>10</span>
</div>
</div>

{/* Input Controls */}
<div className="space-y-4">
<div className="grid grid-cols-2 gap-3">
<div>
<label className="block text-xs font-semibold text-gray-600 mb-2">Điểm hiện tại</label>
<div className="flex items-center space-x-2">
<input
type="range"
min="0"
max="10"
value={data.current}
onChange={(e) => setWheelOfLife({
...wheelOfLife,
[key]: { ...data, current: parseInt(e.target.value) }
})}
className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
/>
<input
type="number"
min="0"
max="10"
value={data.current}
onChange={(e) => setWheelOfLife({
...wheelOfLife,
[key]: { ...data, current: Math.min(10, Math.max(0, parseInt(e.target.value) || 0)) }
})}
className={`w-14 p-2 border-2 ${colors.border} rounded-lg text-center font-bold ${colors.text} focus:ring-2 focus:ring-blue-300`}
/>
</div>
</div>

<div>
<label className="block text-xs font-semibold text-gray-600 mb-2">Mục tiêu</label>
<input
type="number"
min="0"
max="10"
value={data.target}
onChange={(e) => setWheelOfLife({
...wheelOfLife,
[key]: { ...data, target: Math.min(10, Math.max(0, parseInt(e.target.value) || 0)) }
})}
className={`w-full p-2 border-2 ${colors.border} rounded-lg text-center font-bold ${colors.text} focus:ring-2 focus:ring-blue-300`}
/>
</div>
</div>

<div>
<label className="block text-xs font-semibold text-gray-600 mb-2">
💡 Cần gì để đạt {data.target} điểm?
</label>
<textarea
value={data.needs}
onChange={(e) => setWheelOfLife({
...wheelOfLife,
[key]: { ...data, needs: e.target.value }
})}
placeholder="Ví dụ: Tập gym 3 lần/tuần, Ngủ đủ 7-8 tiếng, Khám sức khỏe định kỳ..."
className={`w-full p-3 border-2 ${colors.border} rounded-lg resize-none focus:ring-2 focus:ring-blue-300 text-sm`}
rows="3"
/>
</div>
</div>
</div>
);
})}
</div>

<div className="border-2 border-purple-300 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-purple-600 mb-4">📊 Phân Tích Tổng Quan</h3>

<div className="grid md:grid-cols-2 gap-6">
<div>
<h4 className="font-bold mb-3">Điểm số các lĩnh vực:</h4>
<div className="space-y-2">
{Object.entries(wheelAreas).map(([key, meta]) => (
<div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
<span className="text-sm flex items-center">
<span className="mr-2">{meta.icon}</span>
{meta.label}
</span>
<span className="font-bold">{wheelOfLife[key].current}/10</span>
</div>
))}
</div>
<div className="mt-4 p-3 bg-purple-50 rounded">
<div className="flex justify-between items-center">
<span className="font-bold">Điểm trung bình:</span>
<span className="text-2xl font-bold text-purple-600">{averageScore.toFixed(1)}/10</span>
</div>
</div>
</div>

<div>
<h4 className="font-bold mb-3">Biểu đồ trực quan:</h4>
<div className="relative w-64 h-64 mx-auto">
<svg viewBox="0 0 200 200" className="w-full h-full">
{[2, 4, 6, 8, 10].map(level => (
<circle
key={level}
cx="100"
cy="100"
r={level * 8}
fill="none"
stroke="#e5e7eb"
strokeWidth="1"
/>
))}

{Object.entries(wheelOfLife).map(([key, data], idx) => {
const angle = (idx / 8) * 2 * Math.PI - Math.PI / 2;
const x = 100 + Math.cos(angle) * data.current * 8;
const y = 100 + Math.sin(angle) * data.current * 8;
return (
<g key={key}>
<line
x1="100"
y1="100"
x2={100 + Math.cos(angle) * 80}
y2={100 + Math.sin(angle) * 80}
stroke="#9ca3af"
strokeWidth="1"
strokeDasharray="2,2"
/>
<circle cx={x} cy={y} r="5" fill="#8b5cf6" />
</g>
);
})}

<path
d={Object.entries(wheelOfLife).map(([key, data], idx) => {
const angle = (idx / 8) * 2 * Math.PI - Math.PI / 2;
const x = 100 + Math.cos(angle) * data.current * 8;
const y = 100 + Math.sin(angle) * data.current * 8;
return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
}).join(' ') + ' Z'}
fill="rgba(139, 92, 246, 0.2)"
stroke="#8b5cf6"
strokeWidth="2"
/>
</svg>
</div>
<p className="text-xs text-center text-gray-500 mt-2">
Hình tròn càng đều = Cuộc sống càng cân bằng
</p>
</div>
</div>
</div>

<div className="border-2 border-green-300 rounded-lg p-6 bg-green-50">
<h3 className="text-xl font-bold text-green-700 mb-4">✅ Ưu Tiên Hành Động</h3>
<p className="text-sm mb-4">Dựa trên kết quả, chọn 2-3 lĩnh vực để tập trung cải thiện trong 90 ngày tới:</p>

<div className="space-y-3">
{Object.entries(wheelOfLife)
.sort((a, b) => (a[1].target - a[1].current) - (b[1].target - b[1].current))
.reverse()
.slice(0, 3)
.map(([key, data]) => {
const meta = wheelAreas[key];
const gap = data.target - data.current;
return gap > 0 ? (
<div key={key} className="p-4 bg-white rounded-lg border-l-4 border-green-500">
<div className="flex items-center justify-between mb-2">
<div className="flex items-center space-x-2">
<span className="text-2xl">{meta.icon}</span>
<span className="font-bold">{meta.label}</span>
</div>
<span className="text-red-600 font-bold">Cần +{gap} điểm</span>
</div>
{data.needs && (
<div className="text-sm text-gray-700 mt-2 pl-2 border-l-2 border-gray-300">
{data.needs}
</div>
)}
</div>
) : null;
})}
</div>
</div>

<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
<h3 className="font-bold mb-3">💡 Câu Hỏi Coaching Cho Wheel of Life:</h3>
<ul className="list-disc ml-6 space-y-2 text-sm">
<li>"Lĩnh vực nào đang khiến bạn không hài lòng nhất?"</li>
<li>"Nếu cải thiện 1 lĩnh vực, lĩnh vực nào sẽ ảnh hưởng tích cực nhất đến các lĩnh vực khác?"</li>
<li>"Điều gì ngăn cản bạn đạt 10 điểm trong lĩnh vực này?"</li>
<li>"Nếu lĩnh vực này ở mức 10 điểm, cuộc sống bạn sẽ khác như thế nào?"</li>
<li>"Bạn có thể làm gì NGAY HÔM NAY để cải thiện 1 điểm?"</li>
</ul>
</div>

<NextStepSuggestion
  currentSection="wheel"
  readinessScore={Object.values(readinessScores).flat().reduce((a, b) => a + b, 0)}
  onNavigate={setActiveSection}
/>
</div>
);
};

const renderDisney = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">🎨 Xác Định Nghẽn - Disney Model</h2>

<div className="bg-pink-50 border-l-4 border-pink-500 p-4">
<p className="font-bold">⏱️ Thời gian: 10-15 phút - 12 câu hỏi (4 câu cho mỗi vai trò)</p>
<p className="text-sm mt-1">3 Góc Nhìn: Dreamer, Realist, Critic</p>
</div>

<div className="space-y-4">
{Object.entries({
dreamer: { label: '🌟 DREAMER (Người Mơ Mộng)', color: 'pink' },
realist: { label: '⚙️ REALIST (Người Thực Tế)', color: 'blue' },
critic: { label: '🔍 CRITIC (Người Phê Bình)', color: 'yellow' }
}).map(([key, meta]) => {
const disneyColorClasses = {
  pink: { border: 'border-pink-200', text: 'text-pink-600', bg: 'bg-pink-50' },
  blue: { border: 'border-blue-200', text: 'text-blue-600', bg: 'bg-blue-50' },
  yellow: { border: 'border-yellow-200', text: 'text-yellow-600', bg: 'bg-yellow-50' }
};
const colors = disneyColorClasses[meta.color];
return (
<div key={key} className={`border-2 ${colors.border} rounded-lg p-6 bg-white`}>
<h3 className={`text-xl font-bold ${colors.text} mb-4`}>{meta.label}</h3>

<div className="space-y-4">
{disneyQuestions[key].map((question, idx) => (
<div key={idx} className="bg-gray-50 p-4 rounded">
<label className="block text-sm font-semibold mb-2">
{idx + 1}. {question}
</label>
<textarea
value={disneyAnswers[`${key}-${idx}`] || ''}
onChange={(e) => setDisneyAnswers({...disneyAnswers, [`${key}-${idx}`]: e.target.value})}
placeholder="Nhập câu trả lời của khách hàng..."
className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
rows="2"
/>
</div>
))}
</div>

<div className={`mt-4 p-3 ${colors.bg} rounded`}>
<p className="text-sm font-semibold">✅ Nếu nghẽn ở vai trò này:</p>
<p className="text-sm mt-1">
{key === 'dreamer' && 'Khuyến khích sử dụng tư duy Dreamer, đặt câu hỏi mở về tương lai lý tưởng'}
{key === 'realist' && 'Sử dụng góc nhìn Realist, xây dựng kế hoạch hành động chi tiết'}
{key === 'critic' && 'Chuyển từ Negative Critic sang Positive Critic, tìm giải pháp thay vì chỉ chỉ ra vấn đề'}
</p>
</div>
</div>
);
})}
</div>
</div>
);

const renderProblemIdentifier = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">🔍 Xác Định Vấn Đề Khách Hàng - Problem Identifier</h2>

<div className="bg-gradient-to-r from-purple-100 to-blue-100 border-l-4 border-purple-500 p-4 rounded-lg">
<p className="font-bold">⏱️ Thời gian: 15-20 phút</p>
<p className="text-sm mt-2">Công cụ giúp coach xác định chính xác vấn đề và nguyên nhân gốc rễ của khách hàng</p>
</div>

<div className="grid md:grid-cols-2 gap-6">
<div className="border-2 border-purple-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-purple-800 mb-4">📋 Phân Loại Vấn Đề</h3>
<div className="space-y-3">
{[
{ value: 'career', label: 'Sự Nghiệp / Career', icon: '💼' },
{ value: 'relationship', label: 'Mối Quan Hệ / Relationships', icon: '❤️' },
{ value: 'health', label: 'Sức Khỏe / Health & Wellness', icon: '🏃' },
{ value: 'finance', label: 'Tài Chính / Finance', icon: '💰' },
{ value: 'personal-growth', label: 'Phát Triển Bản Thân', icon: '🌱' },
{ value: 'life-purpose', label: 'Mục Đích Sống', icon: '⭐' },
{ value: 'stress-anxiety', label: 'Stress & Lo Âu', icon: '😰' },
{ value: 'confidence', label: 'Tự Tin & Bản Sắc', icon: '💪' }
].map((cat) => (
<button
key={cat.value}
onClick={() => setProblemIdentifier({...problemIdentifier, category: cat.value})}
className={`w-full p-3 rounded-lg border-2 transition text-left ${problemIdentifier.category === cat.value ? 'bg-purple-100 border-purple-500' : 'border-gray-200 hover:bg-gray-50'}`}
>
<span className="mr-2">{cat.icon}</span>
<span className="font-medium">{cat.label}</span>
</button>
))}
</div>
</div>

<div className="border-2 border-blue-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-blue-800 mb-4">⚡ Mức Độ Khẩn Cấp</h3>
<div className="space-y-3">
{[
{ value: 'critical', label: 'Khẩn cấp (Cần giải quyết ngay)', color: 'red', icon: '🚨' },
{ value: 'high', label: 'Cao (Trong 1-2 tuần)', color: 'orange', icon: '⚠️' },
{ value: 'medium', label: 'Trung bình (Trong 1 tháng)', color: 'yellow', icon: '⏰' },
{ value: 'low', label: 'Thấp (Có thể chờ)', color: 'green', icon: '✅' }
].map((urg) => {
const urgencyColors = {
  red: 'bg-red-100 border-red-500',
  orange: 'bg-orange-100 border-orange-500',
  yellow: 'bg-yellow-100 border-yellow-500',
  green: 'bg-green-100 border-green-500'
};
const activeColor = urgencyColors[urg.color];
return (
<button
key={urg.value}
onClick={() => setProblemIdentifier({...problemIdentifier, urgency: urg.value})}
className={`w-full p-3 rounded-lg border-2 transition text-left ${problemIdentifier.urgency === urg.value ? activeColor : 'border-gray-200 hover:bg-gray-50'}`}
>
<span className="mr-2">{urg.icon}</span>
<span className="font-medium">{urg.label}</span>
</button>
);
})}
</div>
</div>
</div>

<div className="border-2 border-indigo-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-indigo-800 mb-4">💡 Góc Nhìn Của Khách Hàng</h3>
<textarea
value={problemIdentifier.clientPerspective}
onChange={(e) => setProblemIdentifier({...problemIdentifier, clientPerspective: e.target.value})}
placeholder="Khách hàng mô tả vấn đề như thế nào? Họ thấy gì là nguyên nhân?"
className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500"
rows="4"
/>
</div>

<div className="border-2 border-green-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-green-800 mb-4">🎯 Quan Sát Của Coach</h3>
<textarea
value={problemIdentifier.coachObservation}
onChange={(e) => setProblemIdentifier({...problemIdentifier, coachObservation: e.target.value})}
placeholder="Coach quan sát thấy gì? Patterns, blind spots, underlying issues?"
className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500"
rows="4"
/>
</div>

<div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-6">
<h3 className="text-xl font-bold text-blue-800 mb-4">📊 Khung Phân Tích 5W1H</h3>
<div className="grid md:grid-cols-2 gap-4">
<div className="bg-white p-4 rounded-lg">
<p className="font-bold text-sm mb-2">What (Cái gì?)</p>
<p className="text-sm text-gray-700">Vấn đề chính xác là gì?</p>
</div>
<div className="bg-white p-4 rounded-lg">
<p className="font-bold text-sm mb-2">When (Khi nào?)</p>
<p className="text-sm text-gray-700">Vấn đề bắt đầu khi nào?</p>
</div>
<div className="bg-white p-4 rounded-lg">
<p className="font-bold text-sm mb-2">Where (Ở đâu?)</p>
<p className="text-sm text-gray-700">Vấn đề xảy ra ở đâu?</p>
</div>
<div className="bg-white p-4 rounded-lg">
<p className="font-bold text-sm mb-2">Who (Ai?)</p>
<p className="text-sm text-gray-700">Liên quan đến ai?</p>
</div>
<div className="bg-white p-4 rounded-lg">
<p className="font-bold text-sm mb-2">Why (Tại sao?)</p>
<p className="text-sm text-gray-700">Nguyên nhân sâu xa?</p>
</div>
<div className="bg-white p-4 rounded-lg">
<p className="font-bold text-sm mb-2">How (Như thế nào?)</p>
<p className="text-sm text-gray-700">Ảnh hưởng như thế nào?</p>
</div>
</div>

<NextStepSuggestion
  currentSection="problemidentifier"
  readinessScore={Object.values(readinessScores).flat().reduce((a, b) => a + b, 0)}
  onNavigate={setActiveSection}
/>
</div>
</div>
);

const renderToolRecommender = () => {
const getRecommendedTools = () => {
if (!problemIdentifier.category) return [];

const toolMap = {
'career': ['Wheel of Life', 'Values Work', 'SCORE Model', 'Logical Levels'],
'relationship': ['Meta-Programs', 'Rapport Building', 'Perceptual Positions'],
'health': ['Wheel of Life', 'Anchoring', 'Timeline Therapy'],
'finance': ['Well-Formed Outcome', 'Belief Change', 'Values Audit'],
'personal-growth': ['Disney Model', 'Logical Levels', 'Purpose Work'],
'life-purpose': ['Logical Levels (Purpose)', 'Spiral Dynamics', 'Life Mapping'],
'stress-anxiety': ['Collapse Anchor', 'Submodalities', 'Breathing Techniques'],
'confidence': ['Identity Reframe', 'Belief Change', 'Modeling Excellence']
};

return toolMap[problemIdentifier.category] || [];
};

const recommendedTools = getRecommendedTools();

return (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">💡 Gợi Ý Công Cụ Coaching - Tool Recommender</h2>

<div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-l-4 border-yellow-500 p-4 rounded-lg">
<p className="font-bold">🎯 Dựa trên vấn đề đã xác định</p>
<p className="text-sm mt-2">Hệ thống tự động gợi ý các công cụ coaching phù hợp nhất</p>
</div>

{problemIdentifier.category ? (
<div className="space-y-6">
<div className="border-2 border-green-200 rounded-lg p-6 bg-gradient-to-r from-green-50 to-blue-50 shadow">
<h3 className="text-xl font-bold text-green-800 mb-4">✅ Công Cụ Được Gợi Ý</h3>
<div className="grid md:grid-cols-2 gap-3">
{recommendedTools.map((tool, idx) => (
<div key={idx} className="bg-white p-4 rounded-lg border-2 border-green-300 hover:shadow-lg transition">
<p className="font-bold text-green-700">🔧 {tool}</p>
</div>
))}
</div>
</div>

<div className="border-2 border-purple-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-purple-800 mb-4">📋 Cấu Trúc Buổi Coaching Gợi Ý</h3>
<div className="space-y-3 text-sm">
<div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
<p className="font-bold">1. Opening (5-10'): Rapport + Set Outcome</p>
<p className="text-gray-700 mt-1">Xây dựng rapport, xác định mục tiêu buổi coaching</p>
</div>
<div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
<p className="font-bold">2. Current State (10-15'): Explore Problem</p>
<p className="text-gray-700 mt-1">Khám phá tình trạng hiện tại, sử dụng Meta Model để làm rõ</p>
</div>
<div className="bg-purple-50 p-3 rounded border-l-4 border-purple-500">
<p className="font-bold">3. Desired State (10-15'): Define Outcome</p>
<p className="text-gray-700 mt-1">Xác định kết quả mong muốn, sử dụng Well-Formed Outcome</p>
</div>
<div className="bg-orange-50 p-3 rounded border-l-4 border-orange-500">
<p className="font-bold">4. Intervention (20-30'): Apply Tools</p>
<p className="text-gray-700 mt-1">Áp dụng các công cụ đã gợi ý: {recommendedTools.join(', ')}</p>
</div>
<div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
<p className="font-bold">5. Integration & Action (10-15'): Next Steps</p>
<p className="text-gray-700 mt-1">Future pacing, cam kết hành động, homework</p>
</div>
</div>
</div>
</div>
) : (
<div className="border-2 border-gray-300 rounded-lg p-8 bg-gray-50 text-center">
<p className="text-gray-600">⬅️ Vui lòng hoàn thành "Xác Định Vấn Đề" trước để nhận gợi ý công cụ</p>
</div>
)}

<NextStepSuggestion
  currentSection="toolrecommender"
  readinessScore={Object.values(readinessScores).flat().reduce((a, b) => a + b, 0)}
  onNavigate={setActiveSection}
/>
</div>
);
};

const renderSessionNotes = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">📝 Ghi Chú Buổi Coaching - Session Notes</h2>

<div className="bg-gradient-to-r from-teal-100 to-green-100 border-l-4 border-teal-500 p-4 rounded-lg">
<p className="font-bold">📋 Template ghi chú cấu trúc</p>
<p className="text-sm mt-2">Giúp coach ghi nhận đầy đủ thông tin quan trọng của mỗi buổi coaching</p>
</div>

<div className="grid md:grid-cols-2 gap-4">
<div className="border-2 border-blue-200 rounded-lg p-4 bg-white">
<label className="block text-sm font-bold mb-2 text-blue-800">📅 Ngày Coaching</label>
<input
type="date"
value={sessionNoteData.date}
onChange={(e) => setSessionNoteData({...sessionNoteData, date: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
/>
</div>

<div className="border-2 border-blue-200 rounded-lg p-4 bg-white">
<label className="block text-sm font-bold mb-2 text-blue-800">⏱️ Thời Lượng</label>
<input
type="text"
value={sessionNoteData.duration}
onChange={(e) => setSessionNoteData({...sessionNoteData, duration: e.target.value})}
placeholder="VD: 60 phút"
className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
/>
</div>
</div>

<div className="border-2 border-purple-200 rounded-lg p-6 bg-white shadow">
<label className="block text-sm font-bold mb-3 text-purple-800">😊 Tâm Trạng/Năng Lượng Của Khách Hàng</label>
<div className="grid grid-cols-5 gap-2 mb-3">
{['😭 Rất thấp', '😢 Thấp', '😐 Trung bình', '🙂 Tốt', '😄 Rất tốt'].map((mood, idx) => (
<button
key={idx}
onClick={() => setSessionNoteData({...sessionNoteData, clientMood: mood})}
className={`p-2 rounded-lg border-2 transition text-sm ${sessionNoteData.clientMood === mood ? 'bg-purple-100 border-purple-500' : 'border-gray-200 hover:bg-gray-50'}`}
>
{mood}
</button>
))}
</div>
</div>

<div className="border-2 border-green-200 rounded-lg p-6 bg-white shadow">
<label className="block text-sm font-bold mb-3 text-green-800">💡 Key Insights (Những Phát Hiện Quan Trọng)</label>
<textarea
value={sessionNoteData.keyInsights}
onChange={(e) => setSessionNoteData({...sessionNoteData, keyInsights: e.target.value})}
placeholder="Những insight, patterns, themes quan trọng mà khách hàng hoặc coach phát hiện..."
className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500"
rows="4"
/>
</div>

<div className="border-2 border-yellow-200 rounded-lg p-6 bg-white shadow">
<label className="block text-sm font-bold mb-3 text-yellow-800">⚡ Breakthroughs (Đột Phá)</label>
<textarea
value={sessionNoteData.breakthroughs}
onChange={(e) => setSessionNoteData({...sessionNoteData, breakthroughs: e.target.value})}
placeholder="Những moment đột phá, shift lớn trong tư duy hoặc cảm xúc..."
className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-yellow-500"
rows="3"
/>
</div>

<div className="border-2 border-orange-200 rounded-lg p-6 bg-white shadow">
<label className="block text-sm font-bold mb-3 text-orange-800">🚧 Challenges (Thách Thức)</label>
<textarea
value={sessionNoteData.challenges}
onChange={(e) => setSessionNoteData({...sessionNoteData, challenges: e.target.value})}
placeholder="Những điểm khách hàng còn struggling, resistance, blind spots..."
className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500"
rows="3"
/>
</div>

<div className="border-2 border-indigo-200 rounded-lg p-6 bg-white shadow">
<label className="block text-sm font-bold mb-3 text-indigo-800">📚 Homework / Action Items</label>
<textarea
value={sessionNoteData.homework}
onChange={(e) => setSessionNoteData({...sessionNoteData, homework: e.target.value})}
placeholder="Bài tập về nhà, hành động cụ thể khách hàng cam kết làm..."
className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500"
rows="4"
/>
</div>

<div className="border-2 border-pink-200 rounded-lg p-6 bg-white shadow">
<label className="block text-sm font-bold mb-3 text-pink-800">🎯 Focus Cho Buổi Tiếp Theo</label>
<textarea
value={sessionNoteData.nextFocus}
onChange={(e) => setSessionNoteData({...sessionNoteData, nextFocus: e.target.value})}
placeholder="Chủ đề, vấn đề, hoặc công cụ sẽ làm việc ở buổi sau..."
className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-pink-500"
rows="3"
/>
</div>

<div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
<h3 className="text-lg font-bold text-blue-800 mb-3">💾 Lưu Ý Quan Trọng</h3>
<ul className="text-sm space-y-2 text-gray-700">
<li>✅ Ghi chú ngay sau buổi coaching khi còn nhớ rõ</li>
<li>✅ Tập trung vào insight và breakthrough, không phải mọi chi tiết</li>
<li>✅ Ghi nhận patterns và themes xuyên suốt các buổi</li>
<li>✅ Bảo mật thông tin khách hàng</li>
<li>✅ Review trước buổi tiếp theo để preparation</li>
</ul>
</div>
</div>
);

// Session Timer
const renderSessionTimer = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">⏱️ Session Timer - Đồng Hồ Buổi Coaching</h2>

<div className="bg-gradient-to-r from-blue-100 to-purple-100 border-l-4 border-blue-500 p-4 rounded-lg">
<p className="font-bold">Theo dõi thời gian buổi coaching</p>
<p className="text-sm mt-2">Giúp coach quản lý thời gian và đảm bảo buổi coaching hiệu quả</p>
</div>

<div className="border-2 border-blue-200 rounded-lg p-8 bg-white shadow-lg text-center">
<div className="text-6xl font-bold text-blue-600 mb-6">
{Math.floor(sessionTimer.elapsed / 60)}:{(sessionTimer.elapsed % 60).toString().padStart(2, '0')}
</div>
<div className="text-sm text-gray-600 mb-6">
Mục tiêu: {sessionTimer.duration} phút
</div>
<div className="flex gap-4 justify-center">
<button
onClick={() => {
if (!sessionTimer.isRunning) {
setSessionTimer({...sessionTimer, isRunning: true, startTime: Date.now() - (sessionTimer.elapsed * 1000)});
const interval = setInterval(() => {
setSessionTimer(prev => {
if (!prev.isRunning) {
clearInterval(interval);
return prev;
}
return {...prev, elapsed: Math.floor((Date.now() - prev.startTime) / 1000)};
});
}, 1000);
}
}}
className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
disabled={sessionTimer.isRunning}
>
▶️ Bắt Đầu
</button>
<button
onClick={() => setSessionTimer({...sessionTimer, isRunning: false})}
className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-semibold"
disabled={!sessionTimer.isRunning}
>
⏸️ Tạm Dừng
</button>
<button
onClick={() => setSessionTimer({duration: 60, elapsed: 0, isRunning: false, startTime: null})}
className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
>
🔄 Reset
</button>
</div>
</div>

<div className="grid md:grid-cols-2 gap-4">
<div className="border-2 border-purple-200 rounded-lg p-4 bg-white">
<label className="block text-sm font-bold mb-2 text-purple-800">Thời lượng mục tiêu (phút)</label>
<input
type="number"
value={sessionTimer.duration}
onChange={(e) => setSessionTimer({...sessionTimer, duration: parseInt(e.target.value) || 60})}
className="w-full p-3 border border-gray-300 rounded-lg"
min="15"
max="180"
step="15"
/>
</div>
</div>
</div>
);

// Values Hierarchy
const renderValuesHierarchy = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">❤️ Values Hierarchy - Thứ Bậc Giá Trị</h2>

<div className="bg-gradient-to-r from-red-100 to-pink-100 border-l-4 border-red-500 p-4 rounded-lg">
<p className="font-bold">⏱️ Thời gian: 30-40 phút</p>
<p className="text-sm mt-2">Xác định và sắp xếp 10 giá trị quan trọng nhất của khách hàng</p>
</div>

<div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
<h3 className="font-bold text-lg mb-2">💡 Câu Hỏi Dẫn</h3>
<ul className="text-sm space-y-2">
<li>• "Điều gì quan trọng nhất với bạn trong cuộc sống?"</li>
<li>• "Khi bạn quyết định một điều gì đó, bạn dựa trên tiêu chí nào?"</li>
<li>• "Bạn muốn được nhớ đến như thế nào?"</li>
</ul>
</div>

<div className="space-y-4">
{valuesHierarchy.map((item, index) => (
<div key={index} className="border-2 border-red-200 rounded-lg p-4 bg-white shadow">
<div className="flex items-center gap-4 mb-3">
<div className="text-2xl font-bold text-red-600 w-8">#{index + 1}</div>
<input
type="text"
value={item.value}
onChange={(e) => {
const newValues = [...valuesHierarchy];
newValues[index].value = e.target.value;
setValuesHierarchy(newValues);
}}
placeholder="VD: Gia đình, Tự do, Thành công..."
className="flex-1 p-3 border border-gray-300 rounded-lg font-bold"
/>
</div>
<div className="grid grid-cols-2 gap-4 mb-3">
<div>
<label className="block text-xs font-semibold mb-1">Tầm quan trọng (1-10)</label>
<input
type="range"
min="1"
max="10"
value={item.importance}
onChange={(e) => {
const newValues = [...valuesHierarchy];
newValues[index].importance = parseInt(e.target.value);
setValuesHierarchy(newValues);
}}
className="w-full"
/>
<div className="text-center text-sm font-bold text-red-600">{item.importance}/10</div>
</div>
<div>
<label className="block text-xs font-semibold mb-1">Mức độ thỏa mãn (1-10)</label>
<input
type="range"
min="1"
max="10"
value={item.satisfaction}
onChange={(e) => {
const newValues = [...valuesHierarchy];
newValues[index].satisfaction = parseInt(e.target.value);
setValuesHierarchy(newValues);
}}
className="w-full"
/>
<div className="text-center text-sm font-bold text-green-600">{item.satisfaction}/10</div>
</div>
</div>
<textarea
value={item.notes}
onChange={(e) => {
const newValues = [...valuesHierarchy];
newValues[index].notes = e.target.value;
setValuesHierarchy(newValues);
}}
placeholder="Ghi chú: Giá trị này thể hiện như thế nào? Conflict nào?"
className="w-full p-2 border border-gray-300 rounded-lg resize-none text-sm"
rows="2"
/>
</div>
))}

<NextStepSuggestion
  currentSection="values"
  readinessScore={Object.values(readinessScores).flat().reduce((a, b) => a + b, 0)}
  onNavigate={setActiveSection}
/>
</div>
</div>
);

// Limiting Beliefs Identifier
const renderLimitingBeliefs = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">🧠 Limiting Beliefs Identifier - Xác Định Niềm Tin Hạn Chế</h2>

<div className="bg-gradient-to-r from-purple-100 to-indigo-100 border-l-4 border-purple-500 p-4 rounded-lg">
<p className="font-bold">⏱️ Thời gian: 25-30 phút</p>
<p className="text-sm mt-2">Khám phá và chuyển đổi những niềm tin đang cản trở khách hàng</p>
</div>

<div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
<h3 className="font-bold text-lg mb-2">🔍 Dấu Hiệu Limiting Beliefs</h3>
<div className="grid md:grid-cols-2 gap-3 text-sm">
<div><strong>"Tôi không thể..."</strong> - Khả năng</div>
<div><strong>"Tôi không xứng đáng..."</strong> - Giá trị bản thân</div>
<div><strong>"Điều đó không thể..."</strong> - Khả năng thực hiện</div>
<div><strong>"Tôi luôn luôn..."</strong> - Pattern cố định</div>
</div>
</div>

<div className="space-y-4">
{limitingBeliefs.beliefs.map((item, index) => (
<div key={index} className="border-2 border-purple-200 rounded-lg p-6 bg-white shadow">
<div className="mb-4">
<label className="block text-sm font-bold mb-2 text-purple-800">💭 Niềm Tin Hạn Chế #{index + 1}</label>
<input
type="text"
value={item.belief}
onChange={(e) => {
const newBeliefs = [...limitingBeliefs.beliefs];
newBeliefs[index].belief = e.target.value;
setLimitingBeliefs({...limitingBeliefs, beliefs: newBeliefs});
}}
placeholder='VD: "Tôi không đủ giỏi để..."'
className="w-full p-3 border border-gray-300 rounded-lg font-medium"
/>
</div>
<div className="grid md:grid-cols-2 gap-4">
<div>
<label className="block text-xs font-semibold mb-2 text-gray-700">📊 Bằng chứng hỗ trợ niềm tin này</label>
<textarea
value={item.evidence}
onChange={(e) => {
const newBeliefs = [...limitingBeliefs.beliefs];
newBeliefs[index].evidence = e.target.value;
setLimitingBeliefs({...limitingBeliefs, beliefs: newBeliefs});
}}
placeholder="Những gì khách hàng tin là 'chứng cứ'..."
className="w-full p-2 border border-gray-300 rounded-lg resize-none text-sm"
rows="3"
/>
</div>
<div>
<label className="block text-xs font-semibold mb-2 text-gray-700">❌ Phản biện (Counter Evidence)</label>
<textarea
value={item.counter}
onChange={(e) => {
const newBeliefs = [...limitingBeliefs.beliefs];
newBeliefs[index].counter = e.target.value;
setLimitingBeliefs({...limitingBeliefs, beliefs: newBeliefs});
}}
placeholder="Những lần niềm tin này KHÔNG đúng..."
className="w-full p-2 border border-gray-300 rounded-lg resize-none text-sm"
rows="3"
/>
</div>
</div>
<div className="mt-3">
<label className="block text-xs font-semibold mb-2 text-green-700">✨ Niềm Tin Mới (Reframe)</label>
<input
type="text"
value={item.reframe}
onChange={(e) => {
const newBeliefs = [...limitingBeliefs.beliefs];
newBeliefs[index].reframe = e.target.value;
setLimitingBeliefs({...limitingBeliefs, beliefs: newBeliefs});
}}
placeholder='VD: "Tôi đang học và phát triển mỗi ngày..."'
className="w-full p-3 border-2 border-green-300 rounded-lg bg-green-50 font-medium"
/>
</div>
</div>
))}
<button
onClick={() => setLimitingBeliefs({
...limitingBeliefs,
beliefs: [...limitingBeliefs.beliefs, { belief: '', evidence: '', counter: '', reframe: '' }]
})}
className="w-full p-3 border-2 border-dashed border-purple-300 rounded-lg hover:bg-purple-50 transition font-semibold text-purple-700"
>
+ Thêm Niềm Tin
</button>

<NextStepSuggestion
  currentSection="beliefs"
  readinessScore={Object.values(readinessScores).flat().reduce((a, b) => a + b, 0)}
  onNavigate={setActiveSection}
/>
</div>
</div>
);

// Energy Audit
const renderEnergyAudit = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">⚡ Energy Audit - Kiểm Toán Năng Lượng</h2>

<div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-l-4 border-yellow-500 p-4 rounded-lg">
<p className="font-bold">⏱️ Thời gian: 20-25 phút</p>
<p className="text-sm mt-2">Xác định những gì cho và lấy đi năng lượng của khách hàng</p>
</div>

<div className="grid md:grid-cols-2 gap-6">
<div className="border-2 border-green-200 rounded-lg p-6 bg-gradient-to-br from-white to-green-50 shadow">
<h3 className="text-xl font-bold text-green-700 mb-4">🔋 Energizers - Nguồn Năng Lượng</h3>
<p className="text-sm text-gray-600 mb-4">Những gì làm tăng năng lượng, tạo động lực, và mang lại niềm vui</p>
{energyAudit.energizers.map((item, index) => (
<div key={index} className="mb-3">
<input
type="text"
value={item}
onChange={(e) => {
const newEnergizers = [...energyAudit.energizers];
newEnergizers[index] = e.target.value;
setEnergyAudit({...energyAudit, energizers: newEnergizers});
}}
placeholder={`Energizer #${index + 1}`}
className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
/>
</div>
))}
<button
onClick={() => setEnergyAudit({...energyAudit, energizers: [...energyAudit.energizers, '']})}
className="w-full p-2 border-2 border-dashed border-green-300 rounded-lg hover:bg-green-50 transition text-green-700 font-semibold text-sm"
>
+ Thêm
</button>
</div>

<div className="border-2 border-red-200 rounded-lg p-6 bg-gradient-to-br from-white to-red-50 shadow">
<h3 className="text-xl font-bold text-red-700 mb-4">🔴 Drainers - Rút Kiệt Năng Lượng</h3>
<p className="text-sm text-gray-600 mb-4">Những gì làm kiệt sức, gây stress, hoặc cảm giác nặng nề</p>
{energyAudit.drainers.map((item, index) => (
<div key={index} className="mb-3">
<input
type="text"
value={item}
onChange={(e) => {
const newDrainers = [...energyAudit.drainers];
newDrainers[index] = e.target.value;
setEnergyAudit({...energyAudit, drainers: newDrainers});
}}
placeholder={`Drainer #${index + 1}`}
className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
/>
</div>
))}
<button
onClick={() => setEnergyAudit({...energyAudit, drainers: [...energyAudit.drainers, '']})}
className="w-full p-2 border-2 border-dashed border-red-300 rounded-lg hover:bg-red-50 transition text-red-700 font-semibold text-sm"
>
+ Thêm
</button>
</div>
</div>

<div className="border-2 border-blue-200 rounded-lg p-6 bg-white shadow">
<label className="block text-sm font-bold mb-3 text-blue-800">📋 Action Plan - Kế Hoạch Hành Động</label>
<textarea
value={energyAudit.actionPlan}
onChange={(e) => setEnergyAudit({...energyAudit, actionPlan: e.target.value})}
placeholder="Dựa trên phân tích trên, khách hàng sẽ:\n- Tăng thời gian cho...\n- Giảm hoặc loại bỏ...\n- Thiết lập ranh giới với..."
className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
rows="6"
/>
</div>
</div>
);

// SMART Goals
const renderSmartGoals = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">🎯 SMART Goals Framework - Mục Tiêu SMART</h2>

<div className="bg-gradient-to-r from-blue-100 to-cyan-100 border-l-4 border-blue-500 p-4 rounded-lg">
<p className="font-bold">⏱️ Thời gian: 30-40 phút</p>
<p className="text-sm mt-2">Xây dựng mục tiêu cụ thể, đo lường được và có thể thực hiện</p>
</div>

<div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
<h3 className="font-bold text-lg mb-2">💡 SMART Framework</h3>
<div className="grid md:grid-cols-2 gap-2 text-sm">
<div><strong>S</strong>pecific - Cụ thể rõ ràng</div>
<div><strong>M</strong>easurable - Đo lường được</div>
<div><strong>A</strong>chievable - Có thể đạt được</div>
<div><strong>R</strong>elevant - Phù hợp với giá trị</div>
<div><strong>T</strong>ime-bound - Có thời hạn</div>
</div>
</div>

<div className="space-y-6">
{smartGoals.map((goal, gIdx) => (
<div key={gIdx} className="border-2 border-blue-200 rounded-lg p-6 bg-white shadow-lg">
<div className="mb-4">
<label className="block text-sm font-bold mb-2 text-blue-800">🎯 Mục Tiêu #{gIdx + 1}</label>
<textarea
value={goal.goal}
onChange={(e) => {
const newGoals = [...smartGoals];
newGoals[gIdx].goal = e.target.value;
setSmartGoals(newGoals);
}}
placeholder="Mô tả mục tiêu tổng quan..."
className="w-full p-3 border border-gray-300 rounded-lg resize-none font-medium"
rows="2"
/>
</div>

<div className="space-y-3">
<div className="grid md:grid-cols-2 gap-4">
<div>
<label className="block text-xs font-bold mb-1 text-gray-700">S - Specific (Cụ thể)</label>
<input
type="text"
value={goal.specific}
onChange={(e) => {
const newGoals = [...smartGoals];
newGoals[gIdx].specific = e.target.value;
setSmartGoals(newGoals);
}}
placeholder="Chính xác bạn muốn gì?"
className="w-full p-2 border border-gray-300 rounded-lg text-sm"
/>
</div>
<div>
<label className="block text-xs font-bold mb-1 text-gray-700">M - Measurable (Đo lường)</label>
<input
type="text"
value={goal.measurable}
onChange={(e) => {
const newGoals = [...smartGoals];
newGoals[gIdx].measurable = e.target.value;
setSmartGoals(newGoals);
}}
placeholder="Đo lường như thế nào?"
className="w-full p-2 border border-gray-300 rounded-lg text-sm"
/>
</div>
<div>
<label className="block text-xs font-bold mb-1 text-gray-700">A - Achievable (Khả thi)</label>
<input
type="text"
value={goal.achievable}
onChange={(e) => {
const newGoals = [...smartGoals];
newGoals[gIdx].achievable = e.target.value;
setSmartGoals(newGoals);
}}
placeholder="Resources cần có?"
className="w-full p-2 border border-gray-300 rounded-lg text-sm"
/>
</div>
<div>
<label className="block text-xs font-bold mb-1 text-gray-700">R - Relevant (Phù hợp)</label>
<input
type="text"
value={goal.relevant}
onChange={(e) => {
const newGoals = [...smartGoals];
newGoals[gIdx].relevant = e.target.value;
setSmartGoals(newGoals);
}}
placeholder="Tại sao quan trọng?"
className="w-full p-2 border border-gray-300 rounded-lg text-sm"
/>
</div>
</div>
<div>
<label className="block text-xs font-bold mb-1 text-gray-700">T - Time-bound (Thời hạn)</label>
<input
type="text"
value={goal.timeBound}
onChange={(e) => {
const newGoals = [...smartGoals];
newGoals[gIdx].timeBound = e.target.value;
setSmartGoals(newGoals);
}}
placeholder="Deadline cụ thể?"
className="w-full p-2 border border-gray-300 rounded-lg text-sm"
/>
</div>
</div>

<div className="mt-4 pt-4 border-t border-gray-200">
<label className="block text-xs font-bold mb-2 text-green-700">📝 Action Steps</label>
{goal.actionSteps.map((step, sIdx) => (
<input
key={sIdx}
type="text"
value={step}
onChange={(e) => {
const newGoals = [...smartGoals];
newGoals[gIdx].actionSteps[sIdx] = e.target.value;
setSmartGoals(newGoals);
}}
placeholder={`Bước ${sIdx + 1}`}
className="w-full p-2 border border-gray-300 rounded-lg text-sm mb-2"
/>
))}
</div>

<div className="grid md:grid-cols-2 gap-4 mt-3">
<div>
<label className="block text-xs font-bold mb-1 text-orange-700">🚧 Obstacles (Trở ngại)</label>
<textarea
value={goal.obstacles}
onChange={(e) => {
const newGoals = [...smartGoals];
newGoals[gIdx].obstacles = e.target.value;
setSmartGoals(newGoals);
}}
placeholder="Rào cản tiềm ẩn..."
className="w-full p-2 border border-gray-300 rounded-lg resize-none text-sm"
rows="2"
/>
</div>
<div>
<label className="block text-xs font-bold mb-1 text-purple-700">🤝 Support Needed</label>
<textarea
value={goal.support}
onChange={(e) => {
const newGoals = [...smartGoals];
newGoals[gIdx].support = e.target.value;
setSmartGoals(newGoals);
}}
placeholder="Hỗ trợ cần thiết..."
className="w-full p-2 border border-gray-300 rounded-lg resize-none text-sm"
rows="2"
/>
</div>
</div>
</div>
))}
<button
onClick={() => setSmartGoals([...smartGoals, {
goal: '',
specific: '',
measurable: '',
achievable: '',
relevant: '',
timeBound: '',
actionSteps: ['', '', ''],
obstacles: '',
support: ''
}])}
className="w-full p-3 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition font-semibold text-blue-700"
>
+ Thêm Mục Tiêu
</button>

<NextStepSuggestion
  currentSection="goals"
  readinessScore={Object.values(readinessScores).flat().reduce((a, b) => a + b, 0)}
  onNavigate={setActiveSection}
/>
</div>
</div>
);

const renderPersonalHistory = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">📋 Detailed Personal History Check - Kiểm Chứng Chi Tiết Về Tiểu Sử Cá Nhân</h2>

<div className="bg-cyan-50 border-l-4 border-cyan-500 p-4">
<p className="font-bold">⏱️ Thời gian: 30-40 phút - 20 câu hỏi chi tiết về tiểu sử cá nhân</p>
<p className="text-sm mt-1 italic">Translated by Soul Retreats</p>
</div>

{/* Basic Info */}
<div className="border-2 border-cyan-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-cyan-600 mb-4">1️⃣ Thông Tin Cơ Bản</h3>
<div className="space-y-4">
<div className="grid md:grid-cols-3 gap-4">
<div>
<label className="block text-sm font-semibold mb-2">Tên (Name)</label>
<input
type="text"
value={personalHistoryAnswers['name'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, name: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Tuổi (Age)</label>
<input
type="number"
value={personalHistoryAnswers['age'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, age: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Giới tính (Gender)</label>
<input
type="text"
value={personalHistoryAnswers['gender'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, gender: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg"
/>
</div>
</div>
<div>
<label className="block text-sm font-semibold mb-2">2. Địa chỉ (Address)</label>
<textarea
value={personalHistoryAnswers['address'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, address: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="2"
/>
</div>
</div>
</div>

{/* Father Info */}
<div className="border-2 border-blue-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-blue-600 mb-4">3️⃣ Thông Tin Về Cha (Father)</h3>
<div className="space-y-4">
<div className="grid md:grid-cols-2 gap-4">
<div>
<label className="block text-sm font-semibold mb-2">Tuổi (Age)</label>
<input
type="number"
value={personalHistoryAnswers['father_age'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, father_age: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Tình trạng sức khỏe (Health)</label>
<input
type="text"
value={personalHistoryAnswers['father_health'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, father_health: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg"
/>
</div>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Tình hình tài chính (Working/Business/Retired/Dependency on you?)</label>
<textarea
value={personalHistoryAnswers['father_economic'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, father_economic: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>
</div>
</div>

{/* Mother Info */}
<div className="border-2 border-pink-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-pink-600 mb-4">4️⃣ Thông Tin Về Mẹ (Mother)</h3>
<div className="space-y-4">
<div className="grid md:grid-cols-2 gap-4">
<div>
<label className="block text-sm font-semibold mb-2">Tuổi (Age)</label>
<input
type="number"
value={personalHistoryAnswers['mother_age'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, mother_age: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Tình trạng sức khỏe (Health Status)</label>
<input
type="text"
value={personalHistoryAnswers['mother_health'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, mother_health: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg"
/>
</div>
</div>
</div>
</div>

{/* Siblings & Family */}
<div className="border-2 border-purple-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-purple-600 mb-4">5️⃣-6️⃣ Anh/Chị/Em Ruột (Siblings)</h3>
<div className="space-y-4">
<div>
<label className="block text-sm font-semibold mb-2">5. Thông tin về anh/chị/em ruột</label>
<textarea
value={personalHistoryAnswers['siblings'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, siblings: e.target.value})}
placeholder="Liệt kê tên, tuổi..."
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">6. Có anh/chị/em nào dựa vào bạn không? (Do your Siblings depend on you?)</label>
<textarea
value={personalHistoryAnswers['siblings_depend'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, siblings_depend: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="2"
/>
</div>
</div>
</div>

{/* Relationships */}
<div className="border-2 border-red-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-red-600 mb-4">7️⃣-9️⃣ Quan Hệ Tình Cảm (Relationships)</h3>
<div className="space-y-4">
<div className="grid md:grid-cols-2 gap-4">
<div>
<label className="block text-sm font-semibold mb-2">7. Đã kết hôn (Married)</label>
<input
type="text"
value={personalHistoryAnswers['married'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, married: e.target.value})}
placeholder="Yes/No"
className="w-full p-3 border border-gray-300 rounded-lg"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Trong bao lâu? (How long?)</label>
<input
type="text"
value={personalHistoryAnswers['married_duration'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, married_duration: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg"
/>
</div>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Chấm điểm tình trạng (Rate your Status /10)</label>
<input
type="range"
min="0"
max="10"
value={personalHistoryAnswers['married_rating'] || 0}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, married_rating: parseInt(e.target.value)})}
className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
/>
<div className="text-center text-2xl font-bold text-red-600">{personalHistoryAnswers['married_rating'] || 0}/10</div>
</div>
<div className="grid md:grid-cols-2 gap-4 mt-4">
<div>
<label className="block text-sm font-semibold mb-2">8. Boy/Girlfriend</label>
<input
type="text"
value={personalHistoryAnswers['relationship'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, relationship: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Trong bao lâu? (How long?)</label>
<input
type="text"
value={personalHistoryAnswers['relationship_duration'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, relationship_duration: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg"
/>
</div>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Chấm điểm tình trạng của bạn (Rate your Status /10)</label>
<input
type="range"
min="0"
max="10"
value={personalHistoryAnswers['relationship_rating'] || 0}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, relationship_rating: parseInt(e.target.value)})}
className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
/>
<div className="text-center text-2xl font-bold text-red-600">{personalHistoryAnswers['relationship_rating'] || 0}/10</div>
</div>
<div>
<label className="block text-sm font-semibold mb-2">9. Con cái (Children) - Có bao nhiêu người con?</label>
<textarea
value={personalHistoryAnswers['children'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, children: e.target.value})}
placeholder="1. Name:..., Age:...
2. Name:..., Age:..."
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>
</div>
</div>

{/* Career & Business */}
<div className="border-2 border-green-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-green-600 mb-4">🔟-1️⃣1️⃣ Công Việc & Kinh Doanh</h3>
<div className="space-y-4">
<div>
<label className="block text-sm font-semibold mb-2">10. Working/Designation - Công việc / Chức vụ</label>
<textarea
value={personalHistoryAnswers['work_designation'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, work_designation: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="2"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Liệu bạn sẽ vẫn làm việc tại nơi này trong 5 năm tới chứ?</label>
<textarea
value={personalHistoryAnswers['work_5years'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, work_5years: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="2"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Đánh giá sự thể hiện thành tích của bản thân và sự hài lòng /10</label>
<input
type="range"
min="0"
max="10"
value={personalHistoryAnswers['work_satisfaction'] || 0}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, work_satisfaction: parseInt(e.target.value)})}
className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
/>
<div className="text-center text-2xl font-bold text-green-600">{personalHistoryAnswers['work_satisfaction'] || 0}/10</div>
</div>
<div>
<label className="block text-sm font-semibold mb-2">11. Business/Designation - Kinh Doanh / Chức vụ</label>
<textarea
value={personalHistoryAnswers['business'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, business: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="2"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Liệu bạn sẽ vẫn kinh doanh lĩnh vực này trong 5 năm tới chứ?</label>
<textarea
value={personalHistoryAnswers['business_5years'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, business_5years: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="2"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Đánh giá sự thể hiện thành tích và sự hài lòng /10</label>
<input
type="range"
min="0"
max="10"
value={personalHistoryAnswers['business_satisfaction'] || 0}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, business_satisfaction: parseInt(e.target.value)})}
className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
/>
<div className="text-center text-2xl font-bold text-green-600">{personalHistoryAnswers['business_satisfaction'] || 0}/10</div>
</div>
</div>
</div>

{/* Life Purpose & Vision */}
<div className="border-2 border-indigo-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-indigo-600 mb-4">1️⃣2️⃣-1️⃣6️⃣ Life Project, Purpose, Vision & Goals</h3>
<div className="space-y-4">
<div>
<label className="block text-sm font-semibold mb-2">12. Do you have a Life Project? - Bạn có dự án cuộc đời không?</label>
<textarea
value={personalHistoryAnswers['life_project'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, life_project: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">13. What is your Life-Purpose? - Lẽ sống của bạn là gì?</label>
<textarea
value={personalHistoryAnswers['life_purpose'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, life_purpose: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">14. What is your Vision? - Tầm nhìn của bạn là gì?</label>
<textarea
value={personalHistoryAnswers['vision'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, vision: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">15. What is your 5 year Goal? State it in the number of people you plan to serve and financial reward expected</label>
<p className="text-xs text-gray-600 mb-2">Mục tiêu trong 5 năm tới của bạn là gì? Hãy nêu ra số người mà bạn định sẽ phục vụ và phần thưởng về tài chính mà bạn kỳ vọng</p>
<textarea
value={personalHistoryAnswers['goal_5year'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, goal_5year: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">16. What is your 10 year Goal? State it in the number of people you plan to serve and financial reward expected</label>
<p className="text-xs text-gray-600 mb-2">Mục tiêu trong 10 năm tới của bạn là gì? Hãy nêu ra số người mà bạn định sẽ phục vụ và phần thưởng về tài chính mà bạn kỳ vọng</p>
<textarea
value={personalHistoryAnswers['goal_10year'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, goal_10year: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>
</div>
</div>

{/* Achievements & Behaviors */}
<div className="border-2 border-orange-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-orange-600 mb-4">1️⃣7️⃣-1️⃣9️⃣ Thành Tựu & Hành Vi</h3>
<div className="space-y-4">
<div>
<label className="block text-sm font-semibold mb-2">17. Remember 3 to 5 experiences where you consider yourself having achieved the impossible tasks?</label>
<p className="text-xs text-gray-600 mb-2">Hãy nhớ lại 3-5 trải nghiệm, đâu là lúc mà bạn nhận thấy rằng bản thân đã thành tựu được những nhiệm vụ quan trọng?</p>
<textarea
value={personalHistoryAnswers['achievements'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, achievements: e.target.value})}
placeholder="A.
B.
C.
D.
E."
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="6"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">18. Name 3-5 behaviors that you are not happy with yourself about.</label>
<p className="text-xs text-gray-600 mb-2">Hãy kể ra 3-5 hành vi mà bạn không cảm thấy vui mấy về chính mình</p>
<textarea
value={personalHistoryAnswers['unhappy_behaviors'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, unhappy_behaviors: e.target.value})}
placeholder="A.
B.
C.
D.
E."
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="6"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">19. Which of your unwanted behaviors do you want to heal from urgently and if possible you will be most happy and your performance would be enhanced immensely?</label>
<p className="text-xs text-gray-600 mb-2">Bạn muốn cấp báchchữa lành những hành vi không mong muốn nào của mình nếu, mà nếu được có thể chữa lành được những hành vi đó rồi thì bạn sẽ thấy mình hạnh phúc nhất và khả năng thể hiện thành tích của bạn sẽ được tăng cường đáng kể?</p>
<textarea
value={personalHistoryAnswers['urgent_heal'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, urgent_heal: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="5"
/>
</div>
</div>
</div>

{/* Additional Information */}
<div className="border-2 border-gray-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-gray-700 mb-4">2️⃣0️⃣ Thông Tin Bổ Sung</h3>
<div>
<label className="block text-sm font-semibold mb-2">20. Is there anything about you that we haven't discussed that you would like me to know so that I can serve you better?</label>
<p className="text-xs text-gray-600 mb-2">Có điều gì nữa về bạn mà chúng ta chưa thảo luận, mà bạn muốn tôi biết để có thể phục vụ bạn tốt hơn không?</p>
<textarea
value={personalHistoryAnswers['additional_info'] || ''}
onChange={(e) => setPersonalHistoryAnswers({...personalHistoryAnswers, additional_info: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="6"
/>
</div>
</div>

<NextStepSuggestion
  currentSection="personalhistory"
  readinessScore={Object.values(readinessScores).flat().reduce((a, b) => a + b, 0)}
  onNavigate={setActiveSection}
/>
</div>
);

const renderFollowUp = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">🔄 Follow-up Meeting - Buổi Gặp Tiếp Theo</h2>

<div className="bg-gradient-to-r from-green-100 to-blue-100 border-l-4 border-green-500 p-4">
<p className="font-bold">Đánh giá tiến độ và cam kết tiếp theo</p>
</div>

<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
<h3 className="font-bold text-lg mb-3">📋 Follow-up Meeting Questions</h3>
<div className="space-y-6">
<div className="p-4 bg-white rounded border-l-4 border-green-500">
<p className="font-bold mb-2">1. What have you done since our last session?</p>
<p className="text-sm text-gray-600">Khách hàng đã thực hiện những gì từ buổi coaching trước?</p>
</div>

<div className="p-4 bg-white rounded border-l-4 border-blue-500">
<p className="font-bold mb-2">2. What results did you get?</p>
<p className="text-sm text-gray-600">Kết quả cụ thể là gì? Đo lường được không?</p>
</div>

<div className="p-4 bg-white rounded border-l-4 border-purple-500">
<p className="font-bold mb-2">3. What worked? What didn't work?</p>
<p className="text-sm text-gray-600">Phân tích những gì hiệu quả và không hiệu quả</p>
</div>

<div className="p-4 bg-white rounded border-l-4 border-yellow-500">
<p className="font-bold mb-2">4. What did you learn about yourself?</p>
<p className="text-sm text-gray-600">Insight và nhận thức mới về bản thân</p>
</div>

<div className="p-4 bg-white rounded border-l-4 border-orange-500">
<p className="font-bold mb-2">5. What will you do differently moving forward?</p>
<p className="text-sm text-gray-600">Hành động cụ thể cho giai đoạn tiếp theo</p>
</div>

<div className="p-4 bg-white rounded border-l-4 border-red-500">
<p className="font-bold mb-2">6. What support do you need from me as your coach?</p>
<p className="text-sm text-gray-600">Xác định nhu cầu hỗ trợ từ coach</p>
</div>
</div>
</div>

{/* Repeat Readiness Assessment */}
<div className={`${readiness.bg} border-l-4 border-current p-6 rounded-lg ${readiness.color} shadow-md`}>
<div className="flex justify-between items-center mb-2">
<p className="font-bold text-2xl">{readiness.icon} Điểm sẵn sàng Follow-up: {Object.values(followUpReadinessScores).flat().reduce((a, b) => a + b, 0)}/160</p>
<span className="text-xl font-bold">{getReadinessLevel(Object.values(followUpReadinessScores).flat().reduce((a, b) => a + b, 0)).level}</span>
</div>
</div>

<div className="space-y-6">
{Object.entries({
commitment: { label: 'Cam Kết', icon: '🎯', color: 'blue' },
change: { label: 'Thay Đổi', icon: '🔄', color: 'green' },
awareness: { label: 'Nhận Thức', icon: '💡', color: 'purple' },
resources: { label: 'Nguồn Lực', icon: '⚡', color: 'orange' }
}).map(([key, meta]) => {
const followUpColorClasses = {
  blue: { text: 'text-blue-600', border: 'border-blue-200' },
  green: { text: 'text-green-600', border: 'border-green-200' },
  purple: { text: 'text-purple-600', border: 'border-purple-200' },
  orange: { text: 'text-orange-600', border: 'border-orange-200' }
};
const colors = followUpColorClasses[meta.color];
return (
<div key={key} className={`border-2 ${colors.border} rounded-lg p-6 bg-white shadow`}>
<div className="flex items-center justify-between mb-4">
<h3 className="text-xl font-bold">{meta.icon} {meta.label}</h3>
<span className={`text-2xl font-bold ${colors.text}`}>
{followUpReadinessScores[key].reduce((a, b) => a + b, 0)}/40
</span>
</div>

<div className="space-y-4">
{readinessQuestions[key].map((question, idx) => (
<div key={idx} className="bg-gray-50 p-4 rounded">
<label className="block text-sm font-medium mb-3">
<span className="font-bold">Câu {idx + 1}:</span> {question}
</label>
<div className="flex items-center space-x-4">
<input
type="range"
min="0"
max="10"
value={followUpReadinessScores[key][idx]}
onChange={(e) => {
const newScores = { ...followUpReadinessScores };
newScores[key][idx] = parseInt(e.target.value);
setFollowUpReadinessScores(newScores);
}}
className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
/>
<span className={`text-2xl font-bold ${colors.text} w-12 text-center`}>
{followUpReadinessScores[key][idx]}
</span>
</div>
<div className="flex justify-between text-xs text-gray-500 mt-1">
<span>Hoàn toàn không đồng ý</span>
<span>Hoàn toàn đồng ý</span>
</div>
</div>
))}
</div>
</div>
);
})}
</div>

<div className="border-2 border-blue-300 rounded-lg p-6 bg-blue-50">
<h3 className="text-xl font-bold text-blue-800 mb-4">📊 So Sánh Tiến Độ</h3>
<div className="grid md:grid-cols-2 gap-4">
<div className="p-4 bg-white rounded">
<p className="font-bold mb-2">Session Đầu:</p>
<p className="text-3xl font-bold text-blue-600">{totalScore}/160</p>
<p className="text-sm text-gray-600">{readiness.level}</p>
</div>
<div className="p-4 bg-white rounded">
<p className="font-bold mb-2">Follow-up:</p>
<p className="text-3xl font-bold text-green-600">{Object.values(followUpReadinessScores).flat().reduce((a, b) => a + b, 0)}/160</p>
<p className="text-sm text-gray-600">{getReadinessLevel(Object.values(followUpReadinessScores).flat().reduce((a, b) => a + b, 0)).level}</p>
</div>
</div>
<div className="mt-4 p-4 bg-white rounded border-l-4 border-blue-500">
<p className="font-bold">Thay đổi:
<span className={`ml-2 text-2xl ${Object.values(followUpReadinessScores).flat().reduce((a, b) => a + b, 0) - totalScore >= 0 ? 'text-green-600' : 'text-red-600'}`}>
{Object.values(followUpReadinessScores).flat().reduce((a, b) => a + b, 0) - totalScore > 0 ? '+' : ''}{Object.values(followUpReadinessScores).flat().reduce((a, b) => a + b, 0) - totalScore}
</span>
</p>
</div>
</div>
</div>
);

const renderSOM = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">🎯 Công Cụ SOM - Sleight of Mouth Meta-Frame</h2>

<div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
<p className="font-bold">Sleight of Mouth - 14 mẫu hỏi để thách thức và tái cấu trúc niềm tin giới hạn</p>
</div>

<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
<h3 className="font-bold text-lg mb-3">📚 Về Sleight of Mouth</h3>
<div className="space-y-2 text-sm">
<p>Sleight of Mouth là một trong những kỹ thuật mạnh mẽ nhất trong NLP để thách thức niềm tin giới hạn. Sử dụng 14 mẫu khung để mở rộng góc nhìn và tạo sự thay đổi.</p>
<p className="font-semibold mt-3">Ví dụ niềm tin: "Tôi quá già để bắt đầu một sự nghiệp mới"</p>
</div>
</div>

<div className="space-y-4">
<div className="border-2 border-blue-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold text-blue-600 mb-3">Khung Meta</h3>
<label className="block text-sm font-semibold mb-2">Việc nghĩ rằng [niềm tin] là một vấn đề như thế nào?</label>
<textarea
value={somAnswers['meta_frame'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, meta_frame: e.target.value})}
placeholder="Việc nghĩ rằng... là một vấn đề như thế nào?"
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>

<div className="border-2 border-green-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold text-green-600 mb-3">Chiến Lược Thực Tế</h3>
<label className="block text-sm font-semibold mb-2">Làm thế nào bạn biết rằng [niềm tin] là đúng?</label>
<textarea
value={somAnswers['reality_strategy'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, reality_strategy: e.target.value})}
placeholder="Làm thế nào bạn biết rằng... là đúng?"
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>

<div className="border-2 border-purple-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold text-purple-600 mb-3">Mô Hình Thế Giới</h3>
<label className="block text-sm font-semibold mb-2">Theo ai thì [niềm tin] là đúng? Đây là quan điểm của ai?</label>
<textarea
value={somAnswers['model_world'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, model_world: e.target.value})}
placeholder="Theo ai thì... là đúng?"
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>

<div className="border-2 border-yellow-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold text-yellow-600 mb-3">Ý Định</h3>
<label className="block text-sm font-semibold mb-2">Niềm tin [niềm tin] có thể có ý định tích cực nào?</label>
<textarea
value={somAnswers['intent'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, intent: e.target.value})}
placeholder="Niềm tin... có thể có ý định tích cực nào?"
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>

<div className="border-2 border-red-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold text-red-600 mb-3">Phản Ví Dụ</h3>
<label className="block text-sm font-semibold mb-2">Khi nào niềm tin [niềm tin] không đúng?</label>
<textarea
value={somAnswers['counter_example'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, counter_example: e.target.value})}
placeholder="Khi nào niềm tin... không đúng?"
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>

<div className="border-2 border-pink-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold text-pink-600 mb-3">Định Nghĩa Lại (Nguyên Nhân)</h3>
<label className="block text-sm font-semibold mb-2">Điều gì khác có thể có nghĩa là [niềm tin]?</label>
<textarea
value={somAnswers['redefine_cause'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, redefine_cause: e.target.value})}
placeholder="Điều gì khác có thể có nghĩa là...?"
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>

<div className="border-2 border-indigo-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold text-indigo-600 mb-3">Mở Rộng (Kết Quả)</h3>
<label className="block text-sm font-semibold mb-2">Mục đích hoặc giá trị lớn hơn đằng sau niềm tin [niềm tin] là gì?</label>
<textarea
value={somAnswers['chunk_up'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, chunk_up: e.target.value})}
placeholder="Mục đích hoặc giá trị lớn hơn đằng sau niềm tin... là gì?"
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>

<div className="border-2 border-teal-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold text-teal-600 mb-3">Thu Nhỏ (Chi Tiết)</h3>
<label className="block text-sm font-semibold mb-2">Khi bạn nói [niềm tin], cụ thể bạn đang đề cập đến điều gì?</label>
<textarea
value={somAnswers['chunk_down'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, chunk_down: e.target.value})}
placeholder="Khi bạn nói..., cụ thể bạn đang đề cập đến điều gì?"
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>

<div className="border-2 border-orange-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold text-orange-600 mb-3">Phép So Sánh</h3>
<label className="block text-sm font-semibold mb-2">Tin rằng [niềm tin] giống như _____. So sánh đó cho thấy điều gì?</label>
<textarea
value={somAnswers['analogy'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, analogy: e.target.value})}
placeholder="Tin rằng... giống như ___. So sánh đó cho thấy điều gì?"
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>

<div className="border-2 border-cyan-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold text-cyan-600 mb-3">Kết Quả Khác</h3>
<label className="block text-sm font-semibold mb-2">Kết quả nào khác mà việc tin rằng [niềm tin] có thể dẫn đến?</label>
<textarea
value={somAnswers['another_outcome'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, another_outcome: e.target.value})}
placeholder="Kết quả nào khác mà việc tin rằng... có thể dẫn đến?"
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>

<div className="border-2 border-lime-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold text-lime-600 mb-3">Hậu Quả</h3>
<label className="block text-sm font-semibold mb-2">Điều gì sẽ xảy ra nếu bạn tiếp tục tin rằng [niềm tin]?</label>
<textarea
value={somAnswers['consequences'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, consequences: e.target.value})}
placeholder="Điều gì sẽ xảy ra nếu bạn tiếp tục tin rằng...?"
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>

<div className="border-2 border-violet-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold text-violet-600 mb-3">Thứ Bậc Tiêu Chí</h3>
<label className="block text-sm font-semibold mb-2">Điều gì còn quan trọng hơn [niềm tin]?</label>
<textarea
value={somAnswers['hierarchy'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, hierarchy: e.target.value})}
placeholder="Điều gì còn quan trọng hơn...?"
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>

<div className="border-2 border-rose-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold text-rose-600 mb-3">Áp Dụng Vào Bản Thân (Mâu Thuẫn)</h3>
<label className="block text-sm font-semibold mb-2">Niềm tin [niềm tin] tự mâu thuẫn như thế nào?</label>
<textarea
value={somAnswers['apply_contradiction'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, apply_contradiction: e.target.value})}
placeholder="Niềm tin... tự mâu thuẫn như thế nào?"
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>

<div className="border-2 border-amber-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold text-amber-600 mb-3">Áp Dụng Vào Bản Thân (Cá Nhân)</h3>
<label className="block text-sm font-semibold mb-2">Bạn cá nhân không tuân theo niềm tin [niềm tin] ở đâu?</label>
<textarea
value={somAnswers['apply_personal'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, apply_personal: e.target.value})}
placeholder="Bạn cá nhân không tuân theo niềm tin... ở đâu?"
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>

<div className="border-2 border-slate-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold text-slate-600 mb-3">Thay Đổi Kích Thước Khung</h3>
<label className="block text-sm font-semibold mb-2">Niềm tin [niềm tin] sẽ trông như thế nào về lâu dài, hoặc trong một bối cảnh lớn hơn?</label>
<textarea
value={somAnswers['frame_size'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, frame_size: e.target.value})}
placeholder="Niềm tin... sẽ trông như thế nào về lâu dài?"
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>
</div>

<div className="bg-green-50 border border-green-200 rounded-lg p-6">
<h3 className="font-bold text-green-800 mb-3">💡 Coach Tips:</h3>
<ul className="list-disc ml-6 space-y-2 text-sm">
<li>Không cần dùng tất cả 14 patterns - chọn 3-5 patterns phù hợp nhất</li>
<li>Mục tiêu là mở rộng góc nhìn, không phải "thắng" tranh luận</li>
<li>Lắng nghe phản ứng của khách hàng - pattern nào tạo shift lớn nhất?</li>
<li>Có thể kết hợp với các công cụ khác như Timeline hoặc Values Work</li>
</ul>
</div>

<NextStepSuggestion
  currentSection="som"
  readinessScore={Object.values(readinessScores).flat().reduce((a, b) => a + b, 0)}
  onNavigate={setActiveSection}
/>
</div>
);

const renderVAKAD = () => {
  const questions = [
    {
      id: 'q1',
      question: '1. Tôi đưa ra quyết định quan trọng dựa trên:',
      options: [
        { type: 'K', text: 'cảm giác trực giác từ bên trong' },
        { type: 'A', text: 'cách nào nghe có vẻ tốt nhất' },
        { type: 'V', text: 'cái gì trông tốt nhất đối với tôi' },
        { type: 'Ad', text: 'xem xét và nghiên cứu chính xác các vấn đề' }
      ]
    },
    {
      id: 'q2',
      question: '2. Trong một cuộc tranh luận, tôi có khả năng bị ảnh hưởng nhất bởi:',
      options: [
        { type: 'A', text: "giọng điệu của người khác" },
        { type: 'V', text: "liệu tôi có thể thấy được quan điểm của người khác hay không" },
        { type: 'Ad', text: "logic trong lập luận của người khác" },
        { type: 'K', text: "liệu tôi có cảm nhận được cảm xúc thật sự của người khác hay không" }
      ]
    },
    {
      id: 'q3',
      question: '3. Tôi dễ dàng truyền đạt những gì đang diễn ra với mình nhất bằng:',
      options: [
        { type: 'V', text: 'cách tôi ăn mặc và vẻ ngoài' },
        { type: 'K', text: 'những cảm xúc tôi chia sẻ' },
        { type: 'Ad', text: 'những từ ngữ tôi chọn' },
        { type: 'A', text: 'giọng điệu của tôi' }
      ]
    },
    {
      id: 'q4',
      question: '4. Điều dễ dàng nhất đối với tôi là:',
      options: [
        { type: 'A', text: 'tìm âm lượng và điều chỉnh lý tưởng trên hệ thống âm thanh' },
        { type: 'Ad', text: 'chọn điểm liên quan nhất về mặt trí tuệ trong một chủ đề thú vị' },
        { type: 'K', text: 'chọn đồ nội thất thoải mái nhất' },
        { type: 'V', text: 'chọn các kết hợp màu sắc hấp dẫn' }
      ]
    },
    {
      id: 'q5',
      question: '5. Câu nào mô tả tôi tốt nhất...',
      options: [
        { type: 'A', text: 'Tôi rất nhạy cảm với âm thanh xung quanh' },
        { type: 'Ad', text: 'Tôi rất giỏi trong việc hiểu các sự kiện và dữ liệu mới' },
        { type: 'K', text: 'Tôi rất nhạy cảm với cảm giác của quần áo trên cơ thể' },
        { type: 'V', text: 'Tôi có phản ứng mạnh mẽ với màu sắc và cách một căn phòng trông như thế nào' }
      ]
    }
  ];

  // Calculate totals
  const totals = { V: 0, A: 0, K: 0, Ad: 0 };
  Object.values(vakadAnswers).forEach(q => {
    Object.keys(q).forEach(type => {
      totals[type] += q[type] || 0;
    });
  });

  const maxScore = Math.max(...Object.values(totals));
  const preferredSystem = Object.keys(totals).find(key => totals[key] === maxScore);

  const systemNames = {
    V: 'Thị Giác (Visual)',
    A: 'Thính Giác (Auditory)',
    K: 'Cảm Giác (Kinesthetic)',
    Ad: 'Nội Tâm (Auditory Digital)'
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">👁️👂🤲 Đánh Giá VAKAD - Test Xác Định Hệ Thống Ưu Tiên</h2>

      <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
        <p className="font-bold">VAKAD - Xác định hệ thống đại diện ưu tiên của khách hàng</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-3">📋 Hướng Dẫn</h3>
        <div className="space-y-2 text-sm">
          <p>Với mỗi câu hỏi dưới đây, vui lòng xếp hạng từng cụm từ bằng các số sau.</p>
          <p>Mỗi số chỉ được sử dụng một lần cho mỗi câu hỏi (xếp hạng bắt buộc):</p>
          <ul className="list-disc ml-6 mt-2">
            <li><strong>4</strong> = Mô tả bạn chính xác nhất</li>
            <li><strong>3</strong> = Mô tả bạn khá chính xác</li>
            <li><strong>2</strong> = Mô tả bạn ít chính xác</li>
            <li><strong>1</strong> = Mô tả bạn ít nhất</li>
          </ul>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
        <h3 className="font-bold text-lg mb-3">🎯 Hệ Thống Đại Diện</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-white rounded border-l-4 border-blue-500">
            <p className="font-bold">👁️ Thị Giác (V):</p>
            <p>Từ ngữ: "Tôi thấy", "Rõ ràng", "Hình dung", "Nhìn"</p>
          </div>
          <div className="p-3 bg-white rounded border-l-4 border-green-500">
            <p className="font-bold">👂 Thính Giác (A):</p>
            <p>Từ ngữ: "Tôi nghe", "Nghe có vẻ", "Âm thanh", "Nói"</p>
          </div>
          <div className="p-3 bg-white rounded border-l-4 border-red-500">
            <p className="font-bold">🤲 Cảm Giác (K):</p>
            <p>Từ ngữ: "Tôi cảm thấy", "Nắm bắt", "Cảm nhận", "Chạm"</p>
          </div>
          <div className="p-3 bg-white rounded border-l-4 border-purple-500">
            <p className="font-bold">💭 Nội Tâm (Ad):</p>
            <p>Từ ngữ: "Tôi hiểu", "Có lý", "Phân tích", "Suy nghĩ"</p>
          </div>
        </div>
      </div>

      {questions.map((q) => (
        <div key={q.id} className="border-2 border-gray-200 rounded-lg p-6 bg-white shadow">
          <h3 className="text-lg font-bold mb-4">{q.question}</h3>
          <div className="space-y-3">
            {q.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <select
                  value={vakadAnswers[q.id][opt.type] || 0}
                  onChange={(e) => {
                    const newAnswers = { ...vakadAnswers };
                    newAnswers[q.id][opt.type] = parseInt(e.target.value);
                    setVakadAnswers(newAnswers);
                  }}
                  className="w-20 p-2 border border-gray-300 rounded"
                >
                  <option value={0}>-</option>
                  <option value={4}>4</option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
                <label className="flex-1">{opt.text}</label>
                <span className={`text-xs px-2 py-1 rounded ${
                  opt.type === 'V' ? 'bg-blue-100 text-blue-800' :
                  opt.type === 'A' ? 'bg-green-100 text-green-800' :
                  opt.type === 'K' ? 'bg-red-100 text-red-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {opt.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="border-2 border-indigo-300 rounded-lg p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
        <h3 className="text-xl font-bold text-indigo-800 mb-4">📊 Your Results / Kết Quả</h3>
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <div className={`p-4 rounded text-center ${totals.V === maxScore && maxScore > 0 ? 'bg-blue-200 border-2 border-blue-600' : 'bg-white'}`}>
            <p className="text-sm mb-2">👁️ Visual</p>
            <p className="text-3xl font-bold text-blue-600">{totals.V}</p>
          </div>
          <div className={`p-4 rounded text-center ${totals.A === maxScore && maxScore > 0 ? 'bg-green-200 border-2 border-green-600' : 'bg-white'}`}>
            <p className="text-sm mb-2">👂 Auditory</p>
            <p className="text-3xl font-bold text-green-600">{totals.A}</p>
          </div>
          <div className={`p-4 rounded text-center ${totals.K === maxScore && maxScore > 0 ? 'bg-red-200 border-2 border-red-600' : 'bg-white'}`}>
            <p className="text-sm mb-2">🤲 Kinesthetic</p>
            <p className="text-3xl font-bold text-red-600">{totals.K}</p>
          </div>
          <div className={`p-4 rounded text-center ${totals.Ad === maxScore && maxScore > 0 ? 'bg-purple-200 border-2 border-purple-600' : 'bg-white'}`}>
            <p className="text-sm mb-2">💭 Auditory Digital</p>
            <p className="text-3xl font-bold text-purple-600">{totals.Ad}</p>
          </div>
        </div>
        {maxScore > 0 && (
          <div className="p-4 bg-white rounded border-l-4 border-indigo-500">
            <p className="font-bold text-lg">Your primary representational system:</p>
            <p className="text-2xl font-bold text-indigo-600 mt-2">{systemNames[preferredSystem]}</p>
          </div>
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="font-bold text-green-800 mb-3">💡 How to Use This Information</h3>
        <ul className="list-disc ml-6 space-y-2 text-sm">
          <li><strong>Matching:</strong> Use language that matches the client's preferred system</li>
          <li><strong>Visual:</strong> Use diagrams, drawings, visual metaphors ("Do you see what I mean?")</li>
          <li><strong>Auditory:</strong> Use sound-based language ("Does this sound right to you?")</li>
          <li><strong>Kinesthetic:</strong> Focus on feelings and experiences ("How does that feel?")</li>
          <li><strong>Auditory Digital:</strong> Use logic, data, analysis ("Does this make sense?")</li>
          <li>Remember: This is an indicator of preference, not a limitation. People use all systems.</li>
        </ul>
      </div>

      <NextStepSuggestion
        currentSection="vakad"
        readinessScore={Object.values(readinessScores).flat().reduce((a, b) => a + b, 0)}
        onNavigate={setActiveSection}
      />
    </div>
  );
};

// NLP Reframing Toolkit
const renderReframing = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">🔄 Reframing Toolkit - Công Cụ Tái Định Nghĩa</h2>

<div className="bg-gradient-to-r from-indigo-100 to-purple-100 border-l-4 border-indigo-500 p-4 rounded-lg">
<p className="font-bold">⏱️ Thời gian: 20-30 phút</p>
<p className="text-sm mt-2">Thay đổi góc nhìn về tình huống để mở ra khả năng mới</p>
</div>

<div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
<h3 className="font-bold text-lg mb-2">🔍 3 Loại Reframe</h3>
<ul className="text-sm space-y-1">
<li><strong>Content Reframe:</strong> Thay đổi ý nghĩa của sự kiện</li>
<li><strong>Context Reframe:</strong> Tìm ngữ cảnh khác nơi hành vi hữu ích</li>
<li><strong>6-Step Reframe:</strong> Tìm ý định tích cực đằng sau hành vi</li>
</ul>
</div>

<div className="border-2 border-indigo-200 rounded-lg p-6 bg-white shadow">
<label className="block text-sm font-bold mb-3 text-indigo-800">📝 Tình Huống / Vấn Đề</label>
<textarea
value={reframingWork.situation}
onChange={(e) => setReframingWork({...reframingWork, situation: e.target.value})}
placeholder="Mô tả tình huống hoặc hành vi cần reframe..."
className="w-full p-4 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>

<div className="border-2 border-red-200 rounded-lg p-6 bg-white shadow">
<label className="block text-sm font-bold mb-3 text-red-800">❌ Frame Hiện Tại (Cách nhìn cũ)</label>
<textarea
value={reframingWork.currentFrame}
onChange={(e) => setReframingWork({...reframingWork, currentFrame: e.target.value})}
placeholder='VD: "Tôi là người thất bại vì..."'
className="w-full p-4 border border-gray-300 rounded-lg resize-none"
rows="2"
/>
</div>

<div className="grid md:grid-cols-2 gap-4">
<div className="border-2 border-green-200 rounded-lg p-6 bg-white shadow">
<label className="block text-sm font-bold mb-3 text-green-800">✨ Content Reframe</label>
<p className="text-xs text-gray-600 mb-2">Cùng sự kiện, nghĩa khác: "Điều này có thể có nghĩa là...?"</p>
<textarea
value={reframingWork.contentReframe}
onChange={(e) => setReframingWork({...reframingWork, contentReframe: e.target.value})}
placeholder='VD: "Tôi đang học được những bài học quý giá..."'
className="w-full p-4 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>

<div className="border-2 border-blue-200 rounded-lg p-6 bg-white shadow">
<label className="block text-sm font-bold mb-3 text-blue-800">🌍 Context Reframe</label>
<p className="text-xs text-gray-600 mb-2">Trong ngữ cảnh nào thì điều này hữu ích?</p>
<textarea
value={reframingWork.contextReframe}
onChange={(e) => setReframingWork({...reframingWork, contextReframe: e.target.value})}
placeholder='VD: "Sự cẩn thận này sẽ rất hữu ích khi..."'
className="w-full p-4 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>
</div>

<div className="border-2 border-purple-200 rounded-lg p-6 bg-gradient-to-br from-white to-purple-50 shadow">
<h3 className="text-lg font-bold text-purple-800 mb-4">🎯 6-Step Reframe</h3>
<div className="space-y-3">
<div>
<label className="block text-xs font-bold mb-1">1. Hành vi cần thay đổi</label>
<input
type="text"
value={reframingWork.sixStepReframe.behavior}
onChange={(e) => setReframingWork({
...reframingWork,
sixStepReframe: {...reframingWork.sixStepReframe, behavior: e.target.value}
})}
className="w-full p-2 border border-gray-300 rounded-lg text-sm"
/>
</div>
<div>
<label className="block text-xs font-bold mb-1">2. Ý định tích cực đằng sau</label>
<input
type="text"
value={reframingWork.sixStepReframe.intention}
onChange={(e) => setReframingWork({
...reframingWork,
sixStepReframe: {...reframingWork.sixStepReframe, intention: e.target.value}
})}
placeholder="Ý định tích cực là gì?"
className="w-full p-2 border border-gray-300 rounded-lg text-sm"
/>
</div>
<div>
<label className="block text-xs font-bold mb-1">3. Cách khác để đạt ý định (3 cách)</label>
{reframingWork.sixStepReframe.alternatives.map((alt, idx) => (
<input
key={idx}
type="text"
value={alt}
onChange={(e) => {
const newAlts = [...reframingWork.sixStepReframe.alternatives];
newAlts[idx] = e.target.value;
setReframingWork({
...reframingWork,
sixStepReframe: {...reframingWork.sixStepReframe, alternatives: newAlts}
});
}}
placeholder={`Cách thay thế ${idx + 1}`}
className="w-full p-2 border border-gray-300 rounded-lg text-sm mb-2"
/>
))}
</div>
<div>
<label className="block text-xs font-bold mb-1">4. Cách được chọn</label>
<input
type="text"
value={reframingWork.sixStepReframe.selected}
onChange={(e) => setReframingWork({
...reframingWork,
sixStepReframe: {...reframingWork.sixStepReframe, selected: e.target.value}
})}
className="w-full p-2 border border-gray-300 rounded-lg text-sm"
/>
</div>
</div>

<NextStepSuggestion
  currentSection="reframing"
  readinessScore={Object.values(readinessScores).flat().reduce((a, b) => a + b, 0)}
  onNavigate={setActiveSection}
/>
</div>
</div>
);

// Anchoring Guide
const renderAnchoring = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">⚓ Anchoring Guide - Hướng Dẫn Neo Hóa</h2>

<div className="bg-gradient-to-r from-cyan-100 to-blue-100 border-l-4 border-cyan-500 p-4 rounded-lg">
<p className="font-bold">⏱️ Thời gian: 25-30 phút</p>
<p className="text-sm mt-2">Tạo liên kết thần kinh giữa kích hoạt vật lý và trạng thái cảm xúc</p>
</div>

<div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
<h3 className="font-bold text-lg mb-2">🎯 Các Bước Neo Hóa</h3>
<ol className="text-sm space-y-1 list-decimal ml-5">
<li>Xác định trạng thái mong muốn</li>
<li>Chọn kích hoạt (anchor trigger)</li>
<li>Gợi trạng thái mạnh mẽ</li>
<li>Kích hoạt tại đỉnh điểm</li>
<li>Break state & Test</li>
<li>Củng cố và luyện tập</li>
</ol>
</div>

<div className="border-2 border-blue-200 rounded-lg p-6 bg-white shadow">
<label className="block text-sm font-bold mb-3 text-blue-800">🎯 Trạng Thái Mong Muốn</label>
<input
type="text"
value={anchoringWork.desiredState}
onChange={(e) => setAnchoringWork({...anchoringWork, desiredState: e.target.value})}
placeholder="VD: Tự tin, Bình tĩnh, Động lực cao..."
className="w-full p-3 border border-gray-300 rounded-lg font-medium"
/>
</div>

<div className="border-2 border-purple-200 rounded-lg p-6 bg-white shadow">
<label className="block text-sm font-bold mb-3 text-purple-800">⚓ Anchor Trigger (Kích Hoạt)</label>
<input
type="text"
value={anchoringWork.trigger}
onChange={(e) => setAnchoringWork({...anchoringWork, trigger: e.target.value})}
placeholder="VD: Ấn ngón tay, Chạm cổ tay, Tư thế..."
className="w-full p-3 border border-gray-300 rounded-lg font-medium"
/>
<p className="text-xs text-gray-600 mt-2">💡 Nên là động tác dễ làm, riêng biệt, không làm hàng ngày</p>
</div>

<div className="border-2 border-green-200 rounded-lg p-6 bg-white shadow">
<label className="block text-sm font-bold mb-3 text-green-800">💪 Cường Độ Trạng Thái (1-10)</label>
<div className="flex items-center gap-4">
<input
type="range"
min="1"
max="10"
value={anchoringWork.intensity}
onChange={(e) => setAnchoringWork({...anchoringWork, intensity: parseInt(e.target.value)})}
className="flex-1"
/>
<div className="text-3xl font-bold text-green-600 w-16 text-center">
{anchoringWork.intensity}
</div>
</div>
<p className="text-xs text-gray-600 mt-2">Cần đạt 8+ để neo hiệu quả</p>
</div>

<div className="border-2 border-orange-200 rounded-lg p-6 bg-white shadow">
<label className="block text-sm font-bold mb-3 text-orange-800">📝 Kế Hoạch Luyện Tập</label>
<textarea
value={anchoringWork.practice}
onChange={(e) => setAnchoringWork({...anchoringWork, practice: e.target.value})}
placeholder="Luyện tập mỗi ngày:\n- Sáng: 3 lần\n- Trước tình huống quan trọng\n- Khi cần nâng trạng thái"
className="w-full p-4 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>

<div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
<h3 className="text-sm font-bold text-red-800 mb-2">⚠️ Lưu Ý Quan Trọng</h3>
<ul className="text-xs space-y-1 text-gray-700">
<li>✓ Kích hoạt đúng tại PEAK STATE (đỉnh điểm cảm xúc)</li>
<li>✓ Giữ trigger 5-10 giây</li>
<li>✓ Break state sau đó (nghĩ chuyện khác)</li>
<li>✓ Test ngay để kiểm tra hiệu quả</li>
<li>✓ Củng cố bằng cách lặp lại 3-5 lần</li>
</ul>
</div>
</div>
);

// Timeline Therapy
const renderTimeline = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">⏳ Timeline Therapy - Liệu Pháp Dòng Thời Gian</h2>

<div className="bg-gradient-to-r from-pink-100 to-purple-100 border-l-4 border-pink-500 p-4 rounded-lg">
<p className="font-bold">⏱️ Thời gian: 40-60 phút</p>
<p className="text-sm mt-2">Làm việc với quá khứ để thay đổi hiện tại và tương lai</p>
</div>

<div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
<h3 className="font-bold text-lg mb-2">🔄 Quy Trình Timeline</h3>
<ol className="text-sm space-y-1 list-decimal ml-5">
<li>Xác định vấn đề/cảm xúc hiện tại</li>
<li>Bay về quá khứ tìm sự kiện gốc (root cause)</li>
<li>Xem từ vị trí meta (quan sát viên)</li>
<li>Rút learning & giải phóng cảm xúc</li>
<li>Bay lên tương lai thấy kết quả mới</li>
<li>Quay về hiện tại với tài nguyên mới</li>
</ol>
</div>

<div className="border-2 border-red-200 rounded-lg p-6 bg-white shadow">
<label className="block text-sm font-bold mb-3 text-red-800">❓ Vấn Đề / Cảm Xúc Hiện Tại</label>
<textarea
value={timelineWork.issue}
onChange={(e) => setTimelineWork({...timelineWork, issue: e.target.value})}
placeholder="Vấn đề cần giải quyết..."
className="w-full p-4 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>

<div className="border-2 border-purple-200 rounded-lg p-6 bg-white shadow">
<label className="block text-sm font-bold mb-3 text-purple-800">🔍 Root Cause Event (Sự kiện gốc)</label>
<textarea
value={timelineWork.rootCause}
onChange={(e) => setTimelineWork({...timelineWork, rootCause: e.target.value})}
placeholder="Lần đầu tiên cảm giác này xuất hiện? Sự kiện quan trọng nào?"
className="w-full p-4 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
<p className="text-xs text-gray-600 mt-2">💡 Câu hỏi: "Nếu có một sự kiện trước đó làm gốc rễ cho vấn đề này, đó sẽ là sự kiện nào?"</p>
</div>

<div className="border-2 border-green-200 rounded-lg p-6 bg-white shadow">
<label className="block text-sm font-bold mb-3 text-green-800">📚 Learnings & Insights</label>
<textarea
value={timelineWork.learnings}
onChange={(e) => setTimelineWork({...timelineWork, learnings: e.target.value})}
placeholder="Từ vị trí quan sát viên, bạn học được gì? Ý định tích cực của bản thân lúc đó là gì?"
className="w-full p-4 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>

<div className="border-2 border-blue-200 rounded-lg p-6 bg-white shadow">
<label className="block text-sm font-bold mb-3 text-blue-800">🚀 Future Without Issue</label>
<textarea
value={timelineWork.future}
onChange={(e) => setTimelineWork({...timelineWork, future: e.target.value})}
placeholder="Hãy bay lên tương lai nơi vấn đề này không còn. Bạn thấy gì? Cảm thấy thế nào?"
className="w-full p-4 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>

<div className="border-2 border-cyan-200 rounded-lg p-6 bg-white shadow">
<label className="block text-sm font-bold mb-3 text-cyan-800">✨ Integration (Tích hợp)</label>
<textarea
value={timelineWork.integration}
onChange={(e) => setTimelineWork({...timelineWork, integration: e.target.value})}
placeholder="Mang learnings và tương lai tốt đẹp về hiện tại. Điều gì khác biệt bây giờ?"
className="w-full p-4 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>

<NextStepSuggestion
  currentSection="timeline"
  readinessScore={Object.values(readinessScores).flat().reduce((a, b) => a + b, 0)}
  onNavigate={setActiveSection}
/>
</div>
);

// Question Library
const renderQuestionLibrary = () => {
const questionCategories = {
'Mở đầu / Rapport': [
'Điều gì mang bạn đến đây hôm nay?',
'Bạn mong muốn gì từ buổi coaching này?',
'Nếu buổi này thành công tuyệt vời, điều gì sẽ khác?',
'Bạn muốn tập trung vào vấn đề gì nhất?'
],
'Khám phá sâu': [
'Điều gì THỰC SỰ quan trọng với bạn về vấn đề này?',
'Nếu không có rào cản, bạn muốn gì?',
'Phần nào trong bạn muốn thay đổi? Phần nào chống lại?',
'Bạn đang giữ niềm tin gì về vấn đề này?'
],
'Future Pacing': [
'Nếu vấn đề này được giải quyết hoàn toàn, cuộc sống bạn sẽ ra sao?',
'5 năm nữa, nếu mọi thứ diễn ra tốt đẹp, bạn thấy gì?',
'Bạn muốn trở thành phiên bản nào của chính mình?',
'Điều gì sẽ khác nếu bạn đạt được mục tiêu này?'
],
'Trách nhiệm': [
'Vai trò của bạn trong tình huống này là gì?',
'Điều gì nằm trong tầm kiểm soát của bạn?',
'Bạn chọn cách phản ứng này vì lý do gì?',
'Nếu bạn chịu 100% trách nhiệm, điều gì thay đổi?'
],
'Hành động': [
'Bước đầu tiên nhỏ nhất bạn có thể làm là gì?',
'Khi nào bạn sẽ bắt đầu?',
'Ai sẽ giữ bạn accountable?',
'Điều gì có thể cản trở? Bạn sẽ vượt qua như thế nào?'
],
'Meta / Quan sát': [
'Nếu bạn nhìn từ bên ngoài vào, bạn thấy gì?',
'Một người bạn thân sẽ khuyên bạn điều gì?',
'Phần khôn ngoan nhất trong bạn sẽ nói gì?',
'10 năm sau, bạn sẽ nhìn lại tình huống này như thế nào?'
]
};

return (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">❓ Question Library - Thư Viện Câu Hỏi</h2>

<div className="bg-gradient-to-r from-teal-100 to-green-100 border-l-4 border-teal-500 p-4 rounded-lg">
<p className="font-bold">Bộ sưu tập câu hỏi coaching mạnh mẽ</p>
<p className="text-sm mt-2">Phân loại theo giai đoạn và mục đích của buổi coaching</p>
</div>

<div className="space-y-4">
{Object.entries(questionCategories).map(([category, questions]) => (
<div key={category} className="border-2 border-teal-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold text-teal-800 mb-4">📂 {category}</h3>
<div className="space-y-2">
{questions.map((question, idx) => (
<div key={idx} className="flex items-start gap-3 p-3 hover:bg-teal-50 rounded-lg transition group">
<div className="text-teal-600 font-bold mt-1">{idx + 1}.</div>
<div className="flex-1 text-gray-700">{question}</div>
<button
onClick={() => {
navigator.clipboard.writeText(question);
alert('Câu hỏi đã copy!');
}}
className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-teal-500 text-white text-xs rounded hover:bg-teal-600 transition"
>
Copy
</button>
</div>
))}
</div>
</div>
))}
</div>

<div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
<h3 className="text-sm font-bold text-blue-800 mb-2">💡 Cách Sử Dụng</h3>
<ul className="text-xs space-y-1 text-gray-700">
<li>✓ Đọc qua trước buổi coaching để chuẩn bị</li>
<li>✓ Chọn 3-5 câu hỏi phù hợp với tình huống khách hàng</li>
<li>✓ Điều chỉnh ngôn ngữ cho phù hợp với khách hàng</li>
<li>✓ Đừng hỏi liên tục - cho thời gian để khách hàng suy nghĩ sâu</li>
</ul>
</div>
</div>
);
};

// Email Templates
const renderEmailTemplates = () => {
const templates = {
'followup': {
name: '📧 Follow-up sau buổi coaching',
subject: 'Recap & Action Items - [Tên khách hàng]',
body: `Chào [Tên],

Cảm ơn bạn đã có buổi coaching tuyệt vời hôm nay!

🎯 KEY INSIGHTS:
[Ghi lại 2-3 insight quan trọng nhất]

⚡ BREAKTHROUGHS:
[Ghi lại đột phá/shift lớn]

📝 ACTION ITEMS:
1. [Hành động 1] - Deadline: [Ngày]
2. [Hành động 2] - Deadline: [Ngày]
3. [Hành động 3] - Deadline: [Ngày]

🎯 BUỔI TIẾP THEO:
Ngày: [Ngày/giờ]
Focus: [Chủ đề]

Bạn có thắc mắc gì, cứ reply email này nhé!

Best regards,
[Coach name]`
},
'reminder': {
name: '⏰ Nhắc nhở buổi coaching',
subject: 'Reminder: Buổi coaching ngày mai',
body: `Chào [Tên],

Nhắc nhở buổi coaching của chúng ta:

📅 Thời gian: [Ngày, giờ]
⏱️ Thời lượng: [60 phút]
📍 Địa điểm: [Zoom/Offline]

🎯 ChuẨN BỊ TRƯỚC BUỔI:
- Review homework tuần trước
- Chuẩn bị 1-2 chủ đề muốn làm việc
- Tìm không gian yên tĩnh, không bị làm phiền

Hẹn gặp bạn!

[Coach name]`
},
'welcome': {
name: '👋 Welcome client mới',
subject: 'Chào mừng đến với coaching journey!',
body: `Chào [Tên],

Chào mừng bạn! Tôi rất háo hức được đồng hành cùng bạn trong hành trình này.

📋 THÔNG TIN BUỔI ĐẦU TIÊN:
Ngày: [Ngày, giờ]
Thời lượng: 90 phút (buổi đầu dài hơn)
Địa điểm: [Link Zoom/địa chỉ]

📝 CHUẨN BỊ TRƯỚC BUỔI:
1. Suy nghĩ về mục tiêu coaching của bạn
2. Những gì bạn muốn thay đổi/cải thiện
3. Kỳ vọng của bạn về coaching

💡 TRONG BUỔI ĐẦU:
- Làm quen và xây dựng rapport
- Xác định mục tiêu rõ ràng
- Tạo action plan

Bạn có câu hỏi gì, cứ reply email này!

Best regards,
[Coach name]`
},
'completion': {
name: '🎓 Hoàn thành chương trình',
subject: 'Chúc mừng hoàn thành coaching program!',
body: `Chào [Tên],

Chúc mừng bạn đã hoàn thành [X] buổi coaching!

🌟 NHỮNG GÌ BẠN ĐÃ ĐẠT ĐƯỢC:
[List achievements]

📊 TIẾN TRÌNH:
- Trước: [Mô tả]
- Sau: [Mô tả]
- Growth: [%]

💪 NHỮNG KỸ NĂNG/CÔNG CỤ BẠN ĐÃ HỌC:
[List tools/skills]

🚀 TIẾP THEO:
[Khuyến nghị để maintain progress]

Tôi rất tự hào về những gì bạn đã đạt được. Hãy tiếp tục shine!

Stay in touch,
[Coach name]`
}
};

return (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">📧 Email Templates - Mẫu Email</h2>

<div className="bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-blue-500 p-4 rounded-lg">
<p className="font-bold">Mẫu email chuyên nghiệp</p>
<p className="text-sm mt-2">Tiết kiệm thời gian với các mẫu email được thiết kế sẵn</p>
</div>

<div className="grid md:grid-cols-2 gap-4 mb-6">
<div className="border-2 border-blue-200 rounded-lg p-4 bg-white">
<label className="block text-sm font-bold mb-2 text-blue-800">Chọn Template</label>
<select
value={emailTemplates.selectedTemplate}
onChange={(e) => setEmailTemplates({
...emailTemplates,
selectedTemplate: e.target.value,
customization: templates[e.target.value]?.body || ''
})}
className="w-full p-3 border border-gray-300 rounded-lg"
>
<option value="">-- Chọn mẫu email --</option>
{Object.entries(templates).map(([key, template]) => (
<option key={key} value={key}>{template.name}</option>
))}
</select>
</div>

<div className="border-2 border-purple-200 rounded-lg p-4 bg-white">
<label className="block text-sm font-bold mb-2 text-purple-800">Email Khách Hàng</label>
<input
type="email"
value={emailTemplates.recipient}
onChange={(e) => setEmailTemplates({...emailTemplates, recipient: e.target.value})}
placeholder="email@example.com"
className="w-full p-3 border border-gray-300 rounded-lg"
/>
</div>
</div>

{emailTemplates.selectedTemplate && templates[emailTemplates.selectedTemplate] && (
<div className="space-y-4">
<div className="border-2 border-green-200 rounded-lg p-4 bg-white shadow">
<label className="block text-sm font-bold mb-2 text-green-800">✉️ Subject Line</label>
<input
type="text"
value={templates[emailTemplates.selectedTemplate].subject}
className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
readOnly
/>
</div>

<div className="border-2 border-blue-200 rounded-lg p-6 bg-white shadow">
<div className="flex justify-between items-center mb-3">
<label className="block text-sm font-bold text-blue-800">📝 Email Body</label>
<button
onClick={() => {
navigator.clipboard.writeText(emailTemplates.customization);
alert('Email đã copy vào clipboard!');
}}
className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-semibold"
>
📋 Copy Email
</button>
</div>
<textarea
value={emailTemplates.customization}
onChange={(e) => setEmailTemplates({...emailTemplates, customization: e.target.value})}
className="w-full p-4 border border-gray-300 rounded-lg resize-none font-mono text-sm"
rows="20"
/>
<p className="text-xs text-gray-600 mt-2">💡 Điều chỉnh [các phần trong ngoặc] cho phù hợp với khách hàng</p>
</div>
</div>
)}

<div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
<h3 className="text-sm font-bold text-yellow-800 mb-2">✨ Best Practices</h3>
<ul className="text-xs space-y-1 text-gray-700">
<li>✓ Gửi follow-up trong 24h sau buổi coaching</li>
<li>✓ Personalize - đừng copy y nguyên template</li>
<li>✓ Specific về action items với deadline rõ ràng</li>
<li>✓ Reminder gửi trước 24h</li>
<li>✓ Keep it concise và dễ đọc</li>
</ul>
</div>
</div>
);
};

// Progress Tracking
const renderPersonalColor = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">🎨 Personal Color - Phân Loại Tính Cách Theo Màu Sắc</h2>

<div className="bg-gradient-to-r from-red-100 via-yellow-100 via-green-100 to-blue-100 border-l-4 border-purple-500 p-4">
<p className="font-bold">Personal Color - 4 nhóm tính cách: Red, Yellow, Green, Blue</p>
</div>

<div className="bg-white border border-gray-200 rounded-lg p-6">
<h3 className="font-bold text-lg mb-3">🌈 Personal Color Là Gì?</h3>
<div className="grid md:grid-cols-2 gap-4 text-sm">
<div className="p-4 bg-red-50 rounded border-l-4 border-red-500">
<p className="font-bold text-red-700">🔴 RED - Quyền Lực</p>
<p><strong>Đặc điểm:</strong> Quyết đoán, mạnh mẽ, hướng kết quả, thích kiểm soát</p>
<p><strong>Động lực:</strong> Thành tựu, chiến thắng, hiệu quả</p>
<p><strong>Sợ:</strong> Bị lợi dụng, mất kiểm soát</p>
</div>
<div className="p-4 bg-yellow-50 rounded border-l-4 border-yellow-500">
<p className="font-bold text-yellow-700">🟡 YELLOW - Vui Vẻ</p>
<p><strong>Đặc điểm:</strong> Hòa đồng, lạc quan, sáng tạo, thích giao lưu</p>
<p><strong>Động lực:</strong> Vui vẻ, công nhận, sự chú ý</p>
<p><strong>Sợ:</strong> Bị từ chối, nhàm chán</p>
</div>
<div className="p-4 bg-green-50 rounded border-l-4 border-green-500">
<p className="font-bold text-green-700">🟢 GREEN - Hòa Bình</p>
<p><strong>Đặc điểm:</strong> Ổn định, kiên nhẫn, trung thành, tránh xung đột</p>
<p><strong>Động lực:</strong> Hòa hợp, an toàn, ổn định</p>
<p><strong>Sợ:</strong> Thay đổi đột ngột, xung đột</p>
</div>
<div className="p-4 bg-blue-50 rounded border-l-4 border-blue-500">
<p className="font-bold text-blue-700">🔵 BLUE - Hoàn Hảo</p>
<p><strong>Đặc điểm:</strong> Chính xác, chi tiết, có tổ chức, cầu toàn</p>
<p><strong>Động lực:</strong> Chính xác, chất lượng, trật tự</p>
<p><strong>Sợ:</strong> Sai sót, lộn xộn</p>
</div>
</div>
</div>

<div className="border-2 border-red-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-red-600 mb-4">🔴 RED Assessment</h3>
<div className="space-y-3">
{[
'Tôi thích ra quyết định nhanh và hành động ngay',
'Tôi tập trung vào kết quả hơn là quy trình',
'Tôi thích thách thức và cạnh tranh',
'Tôi có xu hướng kiểm soát tình huống'
].map((q, idx) => (
<div key={idx} className="flex items-center space-x-3">
<input
type="checkbox"
checked={personalColorAnswers[`red_${idx}`] || false}
onChange={(e) => setPersonalColorAnswers({...personalColorAnswers, [`red_${idx}`]: e.target.checked})}
className="w-5 h-5 text-red-600"
/>
<span className="text-sm">{q}</span>
</div>
))}
</div>
<div className="mt-4 text-center">
<span className="text-2xl font-bold text-red-600">
{[0,1,2,3].filter(i => personalColorAnswers[`red_${i}`]).length}/4
</span>
</div>
</div>

<div className="border-2 border-yellow-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-yellow-600 mb-4">🟡 YELLOW Assessment</h3>
<div className="space-y-3">
{[
'Tôi thích gặp gỡ người mới và giao lưu',
'Tôi là người lạc quan và nhiệt tình',
'Tôi thích sáng tạo và có nhiều ý tưởng mới',
'Tôi cần sự công nhận và khen ngợi'
].map((q, idx) => (
<div key={idx} className="flex items-center space-x-3">
<input
type="checkbox"
checked={personalColorAnswers[`yellow_${idx}`] || false}
onChange={(e) => setPersonalColorAnswers({...personalColorAnswers, [`yellow_${idx}`]: e.target.checked})}
className="w-5 h-5 text-yellow-600"
/>
<span className="text-sm">{q}</span>
</div>
))}
</div>
<div className="mt-4 text-center">
<span className="text-2xl font-bold text-yellow-600">
{[0,1,2,3].filter(i => personalColorAnswers[`yellow_${i}`]).length}/4
</span>
</div>
</div>

<div className="border-2 border-green-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-green-600 mb-4">🟢 GREEN Assessment</h3>
<div className="space-y-3">
{[
'Tôi thích sự ổn định và tránh thay đổi đột ngột',
'Tôi là người kiên nhẫn và lắng nghe tốt',
'Tôi tránh xung đột và ưu tiên hòa hợp',
'Tôi trung thành và đáng tin cậy'
].map((q, idx) => (
<div key={idx} className="flex items-center space-x-3">
<input
type="checkbox"
checked={personalColorAnswers[`green_${idx}`] || false}
onChange={(e) => setPersonalColorAnswers({...personalColorAnswers, [`green_${idx}`]: e.target.checked})}
className="w-5 h-5 text-green-600"
/>
<span className="text-sm">{q}</span>
</div>
))}
</div>
<div className="mt-4 text-center">
<span className="text-2xl font-bold text-green-600">
{[0,1,2,3].filter(i => personalColorAnswers[`green_${i}`]).length}/4
</span>
</div>
</div>

<div className="border-2 border-blue-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-blue-600 mb-4">🔵 BLUE Assessment</h3>
<div className="space-y-3">
{[
'Tôi chú ý đến chi tiết và chính xác',
'Tôi thích lập kế hoạch và tổ chức',
'Tôi cần thông tin đầy đủ trước khi quyết định',
'Tôi có tiêu chuẩn cao và cầu toàn'
].map((q, idx) => (
<div key={idx} className="flex items-center space-x-3">
<input
type="checkbox"
checked={personalColorAnswers[`blue_${idx}`] || false}
onChange={(e) => setPersonalColorAnswers({...personalColorAnswers, [`blue_${idx}`]: e.target.checked})}
className="w-5 h-5 text-blue-600"
/>
<span className="text-sm">{q}</span>
</div>
))}
</div>
<div className="mt-4 text-center">
<span className="text-2xl font-bold text-blue-600">
{[0,1,2,3].filter(i => personalColorAnswers[`blue_${i}`]).length}/4
</span>
</div>
</div>

<div className="border-2 border-purple-300 rounded-lg p-6 bg-gradient-to-r from-purple-50 to-pink-50">
<h3 className="text-xl font-bold text-purple-800 mb-4">📊 Kết Quả Personal Color</h3>
<div className="grid md:grid-cols-4 gap-4">
<div className="p-4 bg-white rounded border-t-4 border-red-500">
<p className="text-sm mb-2 text-center font-bold">RED</p>
<p className="text-4xl font-bold text-red-600 text-center">{[0,1,2,3].filter(i => personalColorAnswers[`red_${i}`]).length}</p>
</div>
<div className="p-4 bg-white rounded border-t-4 border-yellow-500">
<p className="text-sm mb-2 text-center font-bold">YELLOW</p>
<p className="text-4xl font-bold text-yellow-600 text-center">{[0,1,2,3].filter(i => personalColorAnswers[`yellow_${i}`]).length}</p>
</div>
<div className="p-4 bg-white rounded border-t-4 border-green-500">
<p className="text-sm mb-2 text-center font-bold">GREEN</p>
<p className="text-4xl font-bold text-green-600 text-center">{[0,1,2,3].filter(i => personalColorAnswers[`green_${i}`]).length}</p>
</div>
<div className="p-4 bg-white rounded border-t-4 border-blue-500">
<p className="text-sm mb-2 text-center font-bold">BLUE</p>
<p className="text-4xl font-bold text-blue-600 text-center">{[0,1,2,3].filter(i => personalColorAnswers[`blue_${i}`]).length}</p>
</div>
</div>
</div>

<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
<h3 className="font-bold text-blue-800 mb-3">💡 Cách Coaching Theo Personal Color:</h3>
<ul className="list-disc ml-6 space-y-2 text-sm">
<li><strong>RED:</strong> Đi thẳng vào vấn đề, tập trung kết quả, thách thức họ</li>
<li><strong>YELLOW:</strong> Tạo không khí vui vẻ, công nhận thành tựu, dùng sáng tạo</li>
<li><strong>GREEN:</strong> Chậm rãi, kiên nhẫn, tạo an toàn, tránh áp lực</li>
<li><strong>BLUE:</strong> Cung cấp thông tin chi tiết, có cấu trúc, logic rõ ràng</li>
</ul>
</div>
</div>
);

const renderSpiralDynamics = () => {
  const levels = [
    {
      color: 'beige',
      name: 'Beige – Bản Năng Sinh Tồn',
      focus: 'Sinh tồn, thức ăn, nước, sinh sản, nơi trú ẩn',
      worldview: 'Làm bất cứ điều gì để sống sót',
      description: 'Tồn tại sinh học cơ bản. Nhu cầu cơ bản chưa được đáp ứng ổn định.',
      values: 'Bản năng, an toàn sinh học, tồn tại',
      borderColor: 'border-gray-400',
      bgColor: 'bg-gray-50',
      emoji: '🥚'
    },
    {
      color: 'purple',
      name: 'Purple – Bản Ngã Ma Thuật/Huyền Bí',
      focus: 'An toàn thông qua thuộc về, nghi lễ và truyền thống',
      worldview: 'Các linh hồn sẽ bảo vệ chúng ta',
      description: 'Tư duy bộ lạc, huyền bí. An toàn từ nhóm và truyền thống.',
      values: 'Truyền thống, bộ lạc, nghi lễ, ma thuật',
      borderColor: 'border-purple-400',
      bgColor: 'bg-purple-50',
      emoji: '🔮'
    },
    {
      color: 'red',
      name: 'Red – Bản Ngã Bốc Đồng/Quyền Lực',
      focus: 'Quyền lực, kiểm soát, thỏa mãn tức thì',
      worldview: 'Tôi mạnh mẽ. Tôi lấy những gì tôi muốn',
      description: 'Quyết đoán, bốc đồng, tự trọng. Tìm kiếm quyền lực và sự thống trị.',
      values: 'Sức mạnh, can đảm, hành động, thống trị',
      borderColor: 'border-red-400',
      bgColor: 'bg-red-50',
      emoji: '⚡'
    },
    {
      color: 'blue',
      name: 'Blue – Bản Ngã Có Mục Đích/Trật Tự',
      focus: 'Trật tự, ổn định, quy tắc, vâng lời',
      worldview: 'Cuộc sống có ý nghĩa từ quyền lực cao hơn',
      description: 'Đạo đức tuyệt đối, nghĩa vụ. Kỷ luật và trật tự.',
      values: 'Kỷ luật, chính nghĩa, trật tự, hy sinh',
      borderColor: 'border-blue-400',
      bgColor: 'bg-blue-50',
      emoji: '📜'
    },
    {
      color: 'orange',
      name: 'Orange – Bản Ngã Thành Đạt/Chiến Lược',
      focus: 'Thành công, tự chủ, lý tính, kết quả',
      worldview: 'Tôi tạo con đường riêng bằng chiến lược',
      description: 'Khoa học, cạnh tranh, hiệu quả. Đo lường và đổi mới.',
      values: 'Thành công, đổi mới, khoa học, hiệu quả',
      borderColor: 'border-orange-400',
      bgColor: 'bg-orange-50',
      emoji: '🎯'
    },
    {
      color: 'green',
      name: 'Green – Bản Ngã Cộng Đồng/Bình Đẳng',
      focus: 'Mối quan hệ, bình đẳng, hài hòa, trắc ẩn',
      worldview: 'Chúng ta đều được kết nối với nhau',
      description: 'Ưu tiên kết nối, thấu hiểu, công bằng xã hội.',
      values: 'Đồng cảm, bình đẳng, cộng đồng, hòa bình',
      borderColor: 'border-green-400',
      bgColor: 'bg-green-50',
      emoji: '🌍'
    },
    {
      color: 'yellow',
      name: 'Yellow – Bản Ngã Tích Hợp/Hệ Thống',
      focus: 'Linh hoạt, tích hợp, tư duy hệ thống',
      worldview: 'Cuộc sống là hệ thống phức tạp',
      description: 'Tích hợp tất cả cấp độ. Linh hoạt và theo ngữ cảnh.',
      values: 'Linh hoạt, tích hợp, học tập, hệ thống',
      borderColor: 'border-yellow-400',
      bgColor: 'bg-yellow-50',
      emoji: '🌟'
    },
    {
      color: 'turquoise',
      name: 'Turquoise – Bản Ngã Toàn Diện/Vũ Trụ',
      focus: 'Ý thức thống nhất, hài hòa toàn cầu',
      worldview: 'Mọi thứ là một hệ thống sống',
      description: 'Ý thức toàn cầu về sự liên kết. Sống vì tất cả.',
      values: 'Toàn vẹn, bền vững, ý thức vũ trụ',
      borderColor: 'border-cyan-400',
      bgColor: 'bg-cyan-50',
      emoji: '🌌'
    }
  ];

  const questions = [
    {
      id: 1,
      question: 'Khi ra quyết định quan trọng trong cuộc sống, yếu tố nào ảnh hưởng MỘT nhiều nhất đến bạn?',
      options: [
        { text: 'Nhu cầu sinh tồn cơ bản và an toàn tức thì', color: 'beige', score: 5 },
        { text: 'Truyền thống gia đình và điềm báo/tín ngưỡng', color: 'purple', score: 5 },
        { text: 'Sức mạnh, quyền lực và khả năng kiểm soát', color: 'red', score: 5 },
        { text: 'Quy tắc đạo đức, nghĩa vụ và điều đúng đắn', color: 'blue', score: 5 },
        { text: 'Lợi ích cá nhân, thành công và hiệu quả', color: 'orange', score: 5 },
        { text: 'Tác động đến người khác và sự hòa hợp cộng đồng', color: 'green', score: 5 },
        { text: 'Tính linh hoạt và hiệu quả của hệ thống', color: 'yellow', score: 5 },
        { text: 'Lợi ích toàn cầu và sự bền vững lâu dài', color: 'turquoise', score: 5 }
      ]
    },
    {
      id: 2,
      question: 'Điều gì tạo động lực MẠNH MẼ nhất cho bạn hiện tại?',
      options: [
        { text: 'Đáp ứng nhu cầu cơ bản: ăn, ngủ, an toàn', color: 'beige', score: 5 },
        { text: 'Thuộc về một nhóm/gia tộc và được bảo vệ', color: 'purple', score: 5 },
        { text: 'Được tôn trọng, có ảnh hưởng và quyền lực', color: 'red', score: 5 },
        { text: 'Sống đúng với nguyên tắc và có ý nghĩa cao hơn', color: 'blue', score: 5 },
        { text: 'Đạt được mục tiêu và thành công vượt trội', color: 'orange', score: 5 },
        { text: 'Xây dựng mối quan hệ sâu sắc và đóng góp cho cộng đồng', color: 'green', score: 5 },
        { text: 'Học hỏi, phát triển và hiểu hệ thống phức tạp', color: 'yellow', score: 5 },
        { text: 'Góp phần vào sự tiến hóa của nhân loại và hành tinh', color: 'turquoise', score: 5 }
      ]
    },
    {
      id: 3,
      question: 'Khi đối mặt với xung đột, phản ứng tự nhiên đầu tiên của bạn là gì?',
      options: [
        { text: 'Tránh né, tìm nơi an toàn', color: 'beige', score: 5 },
        { text: 'Nhờ người lớn tuổi/người có uy tín hòa giải', color: 'purple', score: 5 },
        { text: 'Đối đầu trực tiếp, khẳng định vị thế', color: 'red', score: 5 },
        { text: 'Dựa vào quy tắc và nguyên tắc để xử lý', color: 'blue', score: 5 },
        { text: 'Tìm giải pháp win-win dựa trên lợi ích', color: 'orange', score: 5 },
        { text: 'Lắng nghe, thấu hiểu và tìm sự đồng thuận', color: 'green', score: 5 },
        { text: 'Phân tích hệ thống và tìm nguyên nhân gốc rễ', color: 'yellow', score: 5 },
        { text: 'Nhìn từ góc độ toàn cầu và lợi ích dài hạn', color: 'turquoise', score: 5 }
      ]
    },
    {
      id: 4,
      question: 'Bạn cảm thấy "ý nghĩa cuộc sống" đến từ đâu?',
      options: [
        { text: 'Sống qua từng ngày, tồn tại và sinh tồn', color: 'beige', score: 5 },
        { text: 'Giữ gìn truyền thống và tinh thần tổ tiên', color: 'purple', score: 5 },
        { text: 'Tự do làm những gì tôi muốn, mạnh mẽ và độc lập', color: 'red', score: 5 },
        { text: 'Hoàn thành nhiệm vụ và sống đúng đạo lý', color: 'blue', score: 5 },
        { text: 'Đạt thành tựu, thành công và được công nhận', color: 'orange', score: 5 },
        { text: 'Kết nối sâu sắc và đóng góp cho người khác', color: 'green', score: 5 },
        { text: 'Hiểu biết sâu rộng và phát triển bản thân không ngừng', color: 'yellow', score: 5 },
        { text: 'Hòa hợp với vũ trụ và phục vụ sự tiến hóa toàn cầu', color: 'turquoise', score: 5 }
      ]
    },
    {
      id: 5,
      question: 'Quan điểm của bạn về "quy tắc và luật lệ" là gì?',
      options: [
        { text: 'Không quan tâm nhiều, quan trọng là sinh tồn', color: 'beige', score: 5 },
        { text: 'Truyền thống và tập tục là trên hết', color: 'purple', score: 5 },
        { text: 'Quy tắc là cho người khác, tôi tự quyết định', color: 'red', score: 5 },
        { text: 'Luật lệ phải được tuân thủ nghiêm ngặt', color: 'blue', score: 5 },
        { text: 'Quy tắc tốt khi nó hiệu quả, có thể thay đổi', color: 'orange', score: 5 },
        { text: 'Quy tắc nên linh hoạt để đảm bảo công bằng cho mọi người', color: 'green', score: 5 },
        { text: 'Quy tắc tùy ngữ cảnh, cần hiểu hệ thống đằng sau', color: 'yellow', score: 5 },
        { text: 'Các nguyên tắc vũ trụ tự nhiên quan trọng hơn luật của con người', color: 'turquoise', score: 5 }
      ]
    },
    {
      id: 6,
      question: 'Môi trường làm việc/sống nào làm bạn cảm thấy THOẢI MÁI nhất?',
      options: [
        { text: 'Nơi đảm bảo nhu cầu cơ bản, an toàn và ổn định', color: 'beige', score: 5 },
        { text: 'Nơi có truyền thống, mọi người như gia đình', color: 'purple', score: 5 },
        { text: 'Nơi tôi có quyền tự do và ảnh hưởng lớn', color: 'red', score: 5 },
        { text: 'Nơi có cấu trúc rõ ràng, kỷ luật và trật tự', color: 'blue', score: 5 },
        { text: 'Nơi thưởng cho thành tích, cạnh tranh lành mạnh', color: 'orange', score: 5 },
        { text: 'Nơi hợp tác, bình đẳng và quan tâm đến cảm xúc', color: 'green', score: 5 },
        { text: 'Nơi linh hoạt, khuyến khích tư duy độc lập', color: 'yellow', score: 5 },
        { text: 'Nơi hướng đến sứ mệnh toàn cầu và bền vững', color: 'turquoise', score: 5 }
      ]
    },
    {
      id: 7,
      question: 'Khi học điều mới, bạn quan tâm nhất đến điều gì?',
      options: [
        { text: 'Nó giúp tôi sống qua ngày hôm nay như thế nào', color: 'beige', score: 5 },
        { text: 'Tổ tiên/người xưa đã làm thế nào', color: 'purple', score: 5 },
        { text: 'Nó cho tôi lợi thế và quyền lực gì', color: 'red', score: 5 },
        { text: 'Nó có đúng đắn và phù hợp với nguyên tắc không', color: 'blue', score: 5 },
        { text: 'Nó có thực tế, hiệu quả và mang lại kết quả không', color: 'orange', score: 5 },
        { text: 'Nó giúp tôi hiểu và kết nối với người khác tốt hơn', color: 'green', score: 5 },
        { text: 'Nó mở rộng nhận thức và tích hợp kiến thức như thế nào', color: 'yellow', score: 5 },
        { text: 'Nó đóng góp vào sự tiến hóa ý thức toàn cầu ra sao', color: 'turquoise', score: 5 }
      ]
    },
    {
      id: 8,
      question: 'Bạn đánh giá "thành công" dựa trên tiêu chí nào?',
      options: [
        { text: 'Có đủ ăn, nơi ở an toàn', color: 'beige', score: 5 },
        { text: 'Được chấp nhận và tôn trọng trong gia tộc/nhóm', color: 'purple', score: 5 },
        { text: 'Có quyền lực, ảnh hưởng và được kính nể', color: 'red', score: 5 },
        { text: 'Hoàn thành bổn phận và sống có nguyên tắc', color: 'blue', score: 5 },
        { text: 'Đạt mục tiêu, giàu có và được công nhận', color: 'orange', score: 5 },
        { text: 'Có mối quan hệ ý nghĩa và làm điều tốt cho cộng đồng', color: 'green', score: 5 },
        { text: 'Phát triển liên tục, linh hoạt thích nghi', color: 'yellow', score: 5 },
        { text: 'Sống hài hòa với vũ trụ và đóng góp cho nhân loại', color: 'turquoise', score: 5 }
      ]
    }
  ];

  // Calculate color scores
  const calculateColorScores = () => {
    const scores = {};
    levels.forEach(level => {
      scores[level.color] = 0;
    });

    questions.forEach(question => {
      const answer = spiralDynamicsAnswers[`q${question.id}`];
      if (answer !== undefined && answer !== null) {
        const selectedOption = question.options[answer];
        if (selectedOption) {
          scores[selectedOption.color] += selectedOption.score;
        }
      }
    });

    return scores;
  };

  const colorScores = calculateColorScores();
  const maxScore = Math.max(...Object.values(colorScores));
  const dominantColor = Object.keys(colorScores).find(color => colorScores[color] === maxScore);
  const dominantLevel = levels.find(l => l.color === dominantColor);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">
        🌀 Đánh Giá Cấp Độ Ý Thức - Spiral Dynamics
      </h2>

      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 border-l-4 border-indigo-500 p-6 rounded-lg">
        <h3 className="font-bold text-lg mb-2">🎯 Xác Định "Màu Sắc" Hiện Tại Của Bạn</h3>
        <p className="text-base mb-3">
          Spiral Dynamics mô tả sự tiến hóa ý thức qua 8 cấp độ (màu sắc). Mỗi người có thể ở các màu khác nhau tùy ngữ cảnh,
          nhưng thường có 1-2 màu DOMINANT (chủ đạo) trong cuộc sống hiện tại.
        </p>
        <p className="text-sm text-gray-700">
          <strong>Lưu ý:</strong> Không có màu nào "tốt hơn" màu khác. Mỗi màu phù hợp với giai đoạn và hoàn cảnh khác nhau.
        </p>
      </div>

      {/* Questions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-3">
          📋 Trả Lời 8 Câu Hỏi Sau
        </h3>
        <p className="text-sm mb-4">
          Chọn câu trả lời phản ánh CHÂN THỰC nhất cách bạn suy nghĩ và hành động HIỆN NAY (không phải lý tưởng hoặc quá khứ).
        </p>
      </div>

      {questions.map((question, qIndex) => (
        <div key={question.id} className="border-2 border-purple-300 rounded-lg p-6 bg-white shadow-lg">
          <h3 className="text-lg font-bold text-purple-700 mb-4">
            Câu {question.id}: {question.question}
          </h3>

          <div className="space-y-2">
            {question.options.map((option, oIndex) => {
              const levelInfo = levels.find(l => l.color === option.color);
              const isSelected = spiralDynamicsAnswers[`q${question.id}`] === oIndex;

              return (
                <label
                  key={oIndex}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? `${levelInfo.borderColor} ${levelInfo.bgColor} shadow-md`
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${question.id}`}
                    value={oIndex}
                    checked={isSelected}
                    onChange={() => setSpiralDynamicsAnswers({
                      ...spiralDynamicsAnswers,
                      [`q${question.id}`]: oIndex
                    })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{levelInfo.emoji}</span>
                      <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${levelInfo.bgColor}`}>
                        {levelInfo.color}
                      </span>
                    </div>
                    <p className="text-base mt-1">{option.text}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {/* Results */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-6">
        <h3 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
          📊 Kết Quả Đánh Giá Của Bạn
        </h3>

        {maxScore > 0 ? (
          <>
            {/* Dominant Color */}
            {dominantLevel && (
              <div className={`border-4 ${dominantLevel.borderColor} ${dominantLevel.bgColor} rounded-xl p-6 mb-6 shadow-xl`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">{dominantLevel.emoji}</span>
                  <div>
                    <h4 className="text-2xl font-bold">{dominantLevel.name}</h4>
                    <p className="text-sm text-gray-600">Màu Chủ Đạo Của Bạn Hiện Tại</p>
                  </div>
                </div>
                <div className="space-y-2 text-base">
                  <p><strong>Thế giới quan:</strong> <em>"{dominantLevel.worldview}"</em></p>
                  <p><strong>Trọng tâm:</strong> {dominantLevel.focus}</p>
                  <p><strong>Mô tả:</strong> {dominantLevel.description}</p>
                  <p><strong>Giá trị cốt lõi:</strong> {dominantLevel.values}</p>
                </div>
              </div>
            )}

            {/* Score Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {levels.map(level => {
                const score = colorScores[level.color];
                const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
                const isDominant = level.color === dominantColor;

                return (
                  <div
                    key={level.color}
                    className={`p-4 rounded-lg border-2 ${isDominant ? `${level.borderColor} ${level.bgColor}` : 'border-gray-200 bg-white'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{level.emoji}</span>
                        <span className="font-bold text-sm uppercase">{level.color}</span>
                      </div>
                      <span className="text-xl font-bold">{score}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${level.bgColor.replace('50', '500')}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600 py-8">
            Vui lòng trả lời các câu hỏi ở trên để xem kết quả đánh giá.
          </p>
        )}
      </div>

      {/* Coaching Guide */}
      {maxScore > 0 && dominantLevel && (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
          <h3 className="font-bold text-green-800 mb-4 text-xl flex items-center gap-2">
            💡 Hướng Dẫn Coaching Cho Màu {dominantLevel.color.toUpperCase()}
          </h3>
          <div className="space-y-3 text-base">
            {dominantLevel.color === 'beige' && (
              <>
                <p><strong>Ưu tiên:</strong> Đảm bảo nhu cầu cơ bản được đáp ứng trước khi coaching sâu.</p>
                <p><strong>Tiếp cận:</strong> Rất cụ thể, từng bước, tập trung vào sinh tồn và an toàn.</p>
                <p><strong>Tránh:</strong> Các khái niệm trừu tượng hoặc mục tiêu dài hạn.</p>
              </>
            )}
            {dominantLevel.color === 'purple' && (
              <>
                <p><strong>Ưu tiên:</strong> Tôn trọng truyền thống, gia đình và nhóm của họ.</p>
                <p><strong>Tiếp cận:</strong> Kết nối với giá trị gia tộc, sử dụng nghi lễ và biểu tượng.</p>
                <p><strong>Tránh:</strong> Phá vỡ truyền thống hoặc tách họ khỏi nhóm.</p>
              </>
            )}
            {dominantLevel.color === 'red' && (
              <>
                <p><strong>Ưu tiên:</strong> Tôn trọng sức mạnh và độc lập của họ.</p>
                <p><strong>Tiếp cận:</strong> Thách thức, cạnh tranh, tập trung kết quả ngay. Thẳng thắn.</p>
                <p><strong>Tránh:</strong> Yếu đuối, quá nhiều quy tắc, kiểm soát quá mức.</p>
              </>
            )}
            {dominantLevel.color === 'blue' && (
              <>
                <p><strong>Ưu tiên:</strong> Cấu trúc, kỷ luật và ý nghĩa cao hơn.</p>
                <p><strong>Tiếp cận:</strong> Rõ ràng về đúng/sai, có hệ thống, tham chiếu đến nguyên tắc.</p>
                <p><strong>Tránh:</strong> Mơ hồ, thiếu cấu trúc, không có mục đích rõ ràng.</p>
              </>
            )}
            {dominantLevel.color === 'orange' && (
              <>
                <p><strong>Ưu tiên:</strong> Kết quả, hiệu quả và thành công.</p>
                <p><strong>Tiếp cận:</strong> Dựa trên dữ liệu, ROI, chiến lược, đổi mới. Tập trung mục tiêu.</p>
                <p><strong>Tránh:</strong> Quá nhiều cảm xúc, thiếu số liệu, không có kế hoạch rõ ràng.</p>
              </>
            )}
            {dominantLevel.color === 'green' && (
              <>
                <p><strong>Ưu tiên:</strong> Mối quan hệ, cảm xúc và ý nghĩa sâu sắc.</p>
                <p><strong>Tiếp cận:</strong> Đồng cảm, lắng nghe, consensus, chậm rãi và an toàn.</p>
                <p><strong>Tránh:</strong> Quá aggressive, cạnh tranh, thiếu sự quan tâm đến cảm xúc.</p>
              </>
            )}
            {dominantLevel.color === 'yellow' && (
              <>
                <p><strong>Ưu tiên:</strong> Học hỏi, tích hợp và linh hoạt.</p>
                <p><strong>Tiếp cận:</strong> Tư duy hệ thống, nhiều góc nhìn, tự do khám phá.</p>
                <p><strong>Tránh:</strong> Dogmatic, rigid thinking, một câu trả lời duy nhất.</p>
              </>
            )}
            {dominantLevel.color === 'turquoise' && (
              <>
                <p><strong>Ưu tiên:</strong> Ý thức toàn cầu và sự hài hòa vũ trụ.</p>
                <p><strong>Tiếp cận:</strong> Holistic, spiritual, long-term planetary thinking.</p>
                <p><strong>Tránh:</strong> Short-term thinking, ego-driven goals.</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
        <h3 className="font-bold text-yellow-800 mb-3 text-lg">
          🌈 Hiểu Về Spiral Dynamics
        </h3>
        <ul className="list-disc ml-6 space-y-2 text-sm">
          <li>Mỗi màu là một cấp độ ý thức và hệ giá trị khác nhau</li>
          <li>Bạn có thể ở nhiều màu khác nhau tùy ngữ cảnh (công việc vs. gia đình)</li>
          <li>Tiến hóa ý thức là hành trình lên các màu cao hơn, nhưng vẫn truy cập được màu thấp khi cần</li>
          <li>Không thể "nhảy cóc" - phải đi qua từng màu để tích hợp đầy đủ</li>
          <li>Coaching hiệu quả khi coach hiểu màu hiện tại và hướng dẫn phù hợp</li>
        </ul>
      </div>
    </div>
  );
};

const renderMetaPrograms = () => {
  const metaPrograms = [
    {
      id: 'motivation',
      name: '1. Hướng Động Lực (Motivation Direction)',
      description: 'Người này được thúc đẩy bởi điều gì? Hướng tới mục tiêu hay tránh xa vấn đề?',
      patterns: [
        { name: 'Hướng Tới (Toward)', color: 'green' },
        { name: 'Tránh Xa (Away From)', color: 'orange' }
      ],
      questions: [
        {
          text: 'Khi đặt mục tiêu, tôi tập trung vào kết quả tích cực tôi muốn đạt được',
          pattern: 'toward'
        },
        {
          text: 'Tôi thường hành động để tránh các vấn đề, rủi ro hoặc hậu quả tiêu cực',
          pattern: 'away'
        },
        {
          text: 'Tôi cảm thấy phấn khích khi nghĩ về những điều tốt đẹp sẽ xảy ra',
          pattern: 'toward'
        },
        {
          text: 'Tôi ra quyết định chủ yếu dựa trên việc ngăn chặn những điều không mong muốn',
          pattern: 'away'
        },
        {
          text: 'Khi mô tả điều tôi muốn, tôi dùng ngôn ngữ tích cực (muốn có, đạt được, tạo ra)',
          pattern: 'toward'
        },
        {
          text: 'Tôi thường xuyên lo lắng về những gì có thể sai và chuẩn bị phòng tránh',
          pattern: 'away'
        }
      ],
      coachingTips: {
        toward: '✅ Sử dụng ngôn ngữ tích cực: "đạt được", "hướng tới", "tạo ra". Tập trung vào lợi ích và phần thưởng.',
        away: '⚠️ Sử dụng ngôn ngữ phòng tránh: "tránh", "ngăn chặn", "giải quyết vấn đề". Nhấn mạnh rủi ro nếu không hành động.'
      }
    },
    {
      id: 'reference',
      name: '2. Khung Tham Chiếu (Frame of Reference)',
      description: 'Người này đánh giá thành công dựa trên chuẩn mực nội tại hay ý kiến bên ngoài?',
      patterns: [
        { name: 'Nội Tại (Internal)', color: 'blue' },
        { name: 'Bên Ngoài (External)', color: 'purple' }
      ],
      questions: [
        {
          text: 'Tôi biết trong lòng khi mình đã làm tốt công việc, không cần ai xác nhận',
          pattern: 'internal'
        },
        {
          text: 'Tôi cần phản hồi từ người khác để biết mình đang làm đúng hướng',
          pattern: 'external'
        },
        {
          text: 'Khi ra quyết định, tôi tin vào trực giác và đánh giá của bản thân',
          pattern: 'internal'
        },
        {
          text: 'Ý kiến và lời khuyên từ người khác ảnh hưởng lớn đến quyết định của tôi',
          pattern: 'external'
        },
        {
          text: 'Tôi có thể bất đồng với đa số nếu tôi tin điều đó là đúng',
          pattern: 'internal'
        },
        {
          text: 'Sự công nhận và khen ngợi từ người khác là động lực quan trọng của tôi',
          pattern: 'external'
        }
      ],
      coachingTips: {
        internal: '✅ Hỏi: "Bạn cảm thấy thế nào về điều này?", "Điều gì cảm thấy đúng với bạn?". Tôn trọng quyết định của họ.',
        external: '⚠️ Cung cấp phản hồi rõ ràng, dữ liệu, testimonials. Hỏi: "Người khác nghĩ gì?", "Tiêu chuẩn là gì?"'
      }
    },
    {
      id: 'sorting',
      name: '3. Phong Cách Phân Loại (Sorting Style)',
      description: 'Người này tập trung vào bản thân hay người khác khi xử lý thông tin?',
      patterns: [
        { name: 'Tập Trung Bản Thân (Self)', color: 'indigo' },
        { name: 'Tập Trung Người Khác (Others)', color: 'pink' }
      ],
      questions: [
        {
          text: 'Trong cuộc trò chuyện, tôi thường nghĩ về điều này ảnh hưởng đến tôi như thế nào',
          pattern: 'self'
        },
        {
          text: 'Tôi dễ dàng nhận ra cảm xúc và nhu cầu của người khác',
          pattern: 'others'
        },
        {
          text: 'Khi nghe một ý tưởng, tôi nghĩ ngay về lợi ích cho bản thân',
          pattern: 'self'
        },
        {
          text: 'Tôi thường xem xét tác động của hành động lên người xung quanh',
          pattern: 'others'
        },
        {
          text: 'Tôi ưu tiên mục tiêu cá nhân trước khi xem xét tác động tập thể',
          pattern: 'self'
        },
        {
          text: 'Tôi cảm thấy thoải mái khi điều chỉnh kế hoạch để phù hợp với nhóm',
          pattern: 'others'
        }
      ],
      coachingTips: {
        self: '✅ Tập trung vào: "Điều này mang lại gì cho BẠN?", "BẠN sẽ đạt được gì?". Nhấn mạnh lợi ích cá nhân.',
        others: '⚠️ Nhấn mạnh: "Điều này giúp ai?", "Tác động lên team/gia đình ra sao?". Liên kết với mục đích lớn hơn.'
      }
    },
    {
      id: 'chunk',
      name: '4. Kích Thước Khối (Chunk Size)',
      description: 'Người này xử lý thông tin ở mức tổng quan hay chi tiết?',
      patterns: [
        { name: 'Big Picture (Tổng Quan)', color: 'yellow' },
        { name: 'Details (Chi Tiết)', color: 'red' }
      ],
      questions: [
        {
          text: 'Tôi thích nhìn bức tranh toàn cảnh và hiểu mục đích chung trước',
          pattern: 'big'
        },
        {
          text: 'Tôi thích hiểu rõ từng bước cụ thể và chi tiết thực hiện',
          pattern: 'detail'
        },
        {
          text: 'Khi lên kế hoạch, tôi bắt đầu với tầm nhìn và chiến lược tổng thể',
          pattern: 'big'
        },
        {
          text: 'Tôi cần danh sách công việc chi tiết và trình tự rõ ràng',
          pattern: 'detail'
        },
        {
          text: 'Tôi dễ dàng thấy mối liên hệ và patterns giữa các ý tưởng',
          pattern: 'big'
        },
        {
          text: 'Tôi chú ý đến những chi tiết nhỏ mà người khác có thể bỏ qua',
          pattern: 'detail'
        }
      ],
      coachingTips: {
        big: '✅ Bắt đầu với WHY và vision. Tránh quá nhiều chi tiết. Sử dụng metaphor và big concepts.',
        detail: '⚠️ Cung cấp kế hoạch bước-by-bước. Chỉ rõ timeline, checklists, và specific actions.'
      }
    },
    {
      id: 'time',
      name: '5. Quan Hệ Với Thời Gian (Relationship to Time)',
      description: 'Người này tập trung vào quá khứ, hiện tại, hay tương lai?',
      patterns: [
        { name: 'Quá Khứ (Past)', color: 'gray' },
        { name: 'Hiện Tại (Present)', color: 'green' },
        { name: 'Tương Lai (Future)', color: 'blue' }
      ],
      questions: [
        {
          text: 'Tôi thường tham khảo kinh nghiệm và bài học từ quá khứ',
          pattern: 'past'
        },
        {
          text: 'Tôi tập trung vào những gì đang xảy ra ở hiện tại',
          pattern: 'present'
        },
        {
          text: 'Tôi dành nhiều thời gian suy nghĩ về kế hoạch và khả năng tương lai',
          pattern: 'future'
        },
        {
          text: 'Tôi học tốt nhất từ những gì đã trải qua trước đây',
          pattern: 'past'
        },
        {
          text: 'Tôi sống trong khoảnh khắc và thích trải nghiệm ngay lập tức',
          pattern: 'present'
        },
        {
          text: 'Tôi phấn khích với các khả năng và viễn cảnh chưa xảy ra',
          pattern: 'future'
        }
      ],
      coachingTips: {
        past: '✅ Kết nối với kinh nghiệm: "Lần trước bạn đã làm gì?", "Điều gì đã hiệu quả?"',
        present: '⚠️ Tập trung vào hành động ngay: "Ngay bây giờ bạn có thể làm gì?", "Điều gì đang xảy ra?"',
        future: '🚀 Tập trung vision: "Bạn thấy gì trong tương lai?", "Điều này sẽ dẫn đến đâu?"'
      }
    },
    {
      id: 'action',
      name: '6. Chế Độ Hành Động (Action Mode)',
      description: 'Người này có xu hướng chủ động, phản ứng, hay chờ đợi?',
      patterns: [
        { name: 'Chủ Động (Proactive)', color: 'green' },
        { name: 'Phản Ứng (Reactive)', color: 'yellow' },
        { name: 'Chờ Đợi (Inactive)', color: 'orange' }
      ],
      questions: [
        {
          text: 'Khi có ý tưởng, tôi hành động ngay lập tức',
          pattern: 'proactive'
        },
        {
          text: 'Tôi thích chờ đợi và xem tình huống phát triển trước khi hành động',
          pattern: 'reactive'
        },
        {
          text: 'Tôi cần người khác khởi xướng hoặc thúc đẩy tôi bắt đầu',
          pattern: 'inactive'
        },
        {
          text: 'Tôi là người chủ động tìm kiếm cơ hội và giải pháp',
          pattern: 'proactive'
        },
        {
          text: 'Tôi phản ứng tốt khi có yêu cầu hoặc deadline cụ thể',
          pattern: 'reactive'
        },
        {
          text: 'Tôi thường phân tích quá nhiều và khó bắt đầu hành động',
          pattern: 'inactive'
        }
      ],
      coachingTips: {
        proactive: '✅ Trao quyền và không gian để họ tự khởi xướng. Hỏi: "Bạn muốn làm gì tiếp theo?"',
        reactive: '⚠️ Đặt deadline và checkpoints rõ ràng. Tạo sense of urgency.',
        inactive: '🔥 Cần accountability partner. Chia nhỏ action thành micro-steps. Nhiều động viên.'
      }
    },
    {
      id: 'decision',
      name: '7. Yếu Tố Quyết Định (Decision Factor)',
      description: 'Người này thích có nhiều lựa chọn hay quy trình chuẩn?',
      patterns: [
        { name: 'Lựa Chọn (Options)', color: 'purple' },
        { name: 'Quy Trình (Procedures)', color: 'blue' }
      ],
      questions: [
        {
          text: 'Tôi thích khám phá nhiều cách khác nhau để làm việc',
          pattern: 'options'
        },
        {
          text: 'Tôi cảm thấy thoải mái với một phương pháp đã được chứng minh',
          pattern: 'procedures'
        },
        {
          text: 'Tôi thích tự do sáng tạo và thử nghiệm cách mới',
          pattern: 'options'
        },
        {
          text: 'Tôi thích làm theo hướng dẫn và best practices đã có',
          pattern: 'procedures'
        },
        {
          text: 'Các quy trình cố định làm tôi cảm thấy bị giới hạn',
          pattern: 'options'
        },
        {
          text: 'Tôi cần biết "cách đúng" để làm việc trước khi bắt đầu',
          pattern: 'procedures'
        }
      ],
      coachingTips: {
        options: '✅ Cung cấp nhiều alternatives. Hỏi: "Bạn còn có thể làm gì khác?", "Có bao nhiêu cách?"',
        procedures: '⚠️ Cung cấp step-by-step process. "Làm A, rồi B, sau đó C". Sử dụng proven frameworks.'
      }
    },
    {
      id: 'convince',
      name: '8. Kênh Thuyết Phục (Convincer Channel)',
      description: 'Người này cần thấy, nghe, đọc, hay làm để tin tưởng?',
      patterns: [
        { name: 'Thị Giác (See)', color: 'blue' },
        { name: 'Thính Giác (Hear)', color: 'green' },
        { name: 'Đọc (Read)', color: 'purple' },
        { name: 'Thực Hành (Do)', color: 'orange' }
      ],
      questions: [
        {
          text: 'Tôi tin khi tôi thấy bằng chứng trực quan (biểu đồ, demo, hình ảnh)',
          pattern: 'see'
        },
        {
          text: 'Tôi tin khi được giải thích rõ ràng và có lời chứng thực',
          pattern: 'hear'
        },
        {
          text: 'Tôi cần đọc tài liệu, nghiên cứu và dữ liệu chi tiết',
          pattern: 'read'
        },
        {
          text: 'Tôi cần trải nghiệm và thử nghiệm thực tế để tin tưởng',
          pattern: 'do'
        }
      ],
      coachingTips: {
        see: '👁️ Sử dụng visualization, whiteboard, diagrams, videos. "Hãy hình dung..."',
        hear: '👂 Giải thích chi tiết, storytelling, testimonials. "Nghe này...", "Như người ta nói..."',
        read: '📖 Cung cấp articles, case studies, research. "Đã có nghiên cứu chỉ ra..."',
        do: '🤲 Tạo exercises, role-play, pilots. "Hãy thử và xem kết quả..."'
      }
    }
  ];

  // Calculate pattern scores for each meta-program
  const calculatePatternScores = (program) => {
    const scores = {};
    program.questions.forEach((question, qIndex) => {
      const key = `${program.id}_${qIndex}`;
      const score = metaProgramAnswers[key] || 3;
      if (!scores[question.pattern]) {
        scores[question.pattern] = { total: 0, count: 0 };
      }
      scores[question.pattern].total += score;
      scores[question.pattern].count += 1;
    });

    // Calculate averages
    const averages = {};
    Object.keys(scores).forEach(pattern => {
      averages[pattern] = (scores[pattern].total / scores[pattern].count).toFixed(1);
    });
    return averages;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">
        🧭 Đánh Giá Meta-Programs Chuyên Sâu
      </h2>

      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 border-l-4 border-purple-500 p-6 rounded-lg">
        <h3 className="font-bold text-lg mb-2">🎯 Mục Đích Đánh Giá</h3>
        <p className="text-base mb-3">
          Meta-Programs là các bộ lọc tư duy vô thức ảnh hưởng đến cách chúng ta xử lý thông tin, ra quyết định và hành động.
          Hiểu được meta-programs của khách hàng giúp coach điều chỉnh ngôn ngữ và phương pháp coaching hiệu quả hơn.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-3">
          📋 Hướng Dẫn Đánh Giá
        </h3>
        <p className="text-base mb-3">
          Với mỗi câu phát biểu, đánh giá mức độ đúng với bạn (hoặc khách hàng) trên thang điểm <strong>1-5</strong>:
        </p>
        <div className="grid grid-cols-5 gap-2 text-center text-sm">
          <div className="bg-red-100 border border-red-300 rounded p-2">
            <div className="font-bold text-red-800">1</div>
            <div className="text-xs">Hoàn toàn không đúng</div>
          </div>
          <div className="bg-orange-100 border border-orange-300 rounded p-2">
            <div className="font-bold text-orange-800">2</div>
            <div className="text-xs">Hơi đúng</div>
          </div>
          <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
            <div className="font-bold text-yellow-800">3</div>
            <div className="text-xs">Trung lập</div>
          </div>
          <div className="bg-lime-100 border border-lime-300 rounded p-2">
            <div className="font-bold text-lime-800">4</div>
            <div className="text-xs">Phần lớn đúng</div>
          </div>
          <div className="bg-green-100 border border-green-300 rounded p-2">
            <div className="font-bold text-green-800">5</div>
            <div className="text-xs">Hoàn toàn đúng</div>
          </div>
        </div>
      </div>

      {metaPrograms.map((program, pIndex) => {
        const patternScores = calculatePatternScores(program);
        const dominantPattern = Object.keys(patternScores).reduce((a, b) =>
          parseFloat(patternScores[a]) > parseFloat(patternScores[b]) ? a : b
        );

        return (
          <div key={program.id} className="border-2 border-purple-300 rounded-lg p-6 bg-white shadow-xl">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-purple-700 mb-2">
                {program.name}
              </h3>
              <p className="text-sm text-gray-600 italic">
                {program.description}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {program.questions.map((question, qIndex) => {
                const key = `${program.id}_${qIndex}`;
                const value = metaProgramAnswers[key] || 3;
                return (
                  <div key={qIndex} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-base font-medium mb-3 text-gray-800">
                      {question.text}
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={value}
                        onChange={(e) => setMetaProgramAnswers({...metaProgramAnswers, [key]: parseInt(e.target.value)})}
                        className="flex-1 h-3 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right,
                            #ef4444 0%,
                            #f97316 25%,
                            #eab308 50%,
                            #84cc16 75%,
                            #22c55e 100%)`
                        }}
                      />
                      <span className="text-2xl font-bold w-12 text-center text-purple-600">
                        {value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pattern Scores */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-5">
              <h4 className="font-bold text-purple-800 mb-3 text-lg">
                📊 Kết Quả Phân Tích
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {Object.entries(patternScores).map(([pattern, score]) => {
                  const patternInfo = program.patterns.find(p =>
                    p.name.toLowerCase().includes(pattern)
                  );
                  const colorClass = patternInfo ? patternInfo.color : 'gray';
                  const isDominant = pattern === dominantPattern;

                  const metaColorClasses = {
                    blue: 'bg-blue-500',
                    green: 'bg-green-500',
                    purple: 'bg-purple-500',
                    orange: 'bg-orange-500',
                    red: 'bg-red-500',
                    yellow: 'bg-yellow-500',
                    gray: 'bg-gray-500'
                  };

                  return (
                    <div
                      key={pattern}
                      className={`p-4 rounded-lg border-2 ${isDominant ? 'border-purple-500 bg-purple-100' : 'border-gray-300 bg-white'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm uppercase text-gray-700">
                          {pattern}
                        </span>
                        {isDominant && <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">DOMINANT</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className={`${metaColorClasses[colorClass] || metaColorClasses.gray} h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${(parseFloat(score) / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-2xl font-bold text-purple-700">{score}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coaching Tips */}
              <div className="bg-white border-2 border-green-300 rounded-lg p-4">
                <h5 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                  💡 Gợi Ý Coaching Cho Pattern Dominant:
                </h5>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {program.coachingTips[dominantPattern] || 'Không có gợi ý cụ thể'}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Summary Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
        <h3 className="font-bold text-green-800 mb-4 text-xl flex items-center gap-2">
          ✅ Tổng Kết & Hướng Dẫn Sử Dụng
        </h3>
        <div className="space-y-3 text-base">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎯</span>
            <p><strong>Không có pattern nào "tốt" hay "xấu"</strong> - chỉ là khác biệt. Mỗi pattern có ưu và nhược điểm tùy ngữ cảnh.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🗣️</span>
            <p><strong>Điều chỉnh ngôn ngữ coaching</strong> phù hợp với meta-programs của khách hàng để tăng rapport và hiệu quả.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔄</span>
            <p><strong>Meta-programs có thể thay đổi</strong> theo ngữ cảnh (công việc vs. gia đình) hoặc theo thời gian.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📈</span>
            <p><strong>Mục tiêu coaching</strong> có thể là giúp khách hàng linh hoạt hơn giữa các patterns, không bị "kẹt" ở một pattern duy nhất.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎭</span>
            <p><strong>Calibrate thực tế</strong>: Đừng chỉ dựa vào bài test. Quan sát ngôn ngữ và hành vi thực tế của khách hàng.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const renderTools = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">🛠️ Ma Trận Chọn Công Cụ Coaching</h2>

<div className="bg-gradient-to-r from-blue-100 to-purple-100 border-l-4 border-blue-500 p-4">
<p className="font-bold">Công cụ nào cho tình huống nào? - Hướng dẫn đầy đủ</p>
</div>

<div className="border rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold mb-4">📊 Theo Mức Độ Sẵn Sàng</h3>
<div className="space-y-3">
<div className="p-4 bg-green-50 rounded border-l-4 border-green-500">
<p className="font-bold text-green-800 mb-2">✅ SẴN SÀNG CAO (140-160 điểm)</p>
<div className="flex flex-wrap gap-2">
<span className="bg-green-200 text-green-900 px-3 py-1 rounded text-sm">Disney Model (60-90')</span>
<span className="bg-green-200 text-green-900 px-3 py-1 rounded text-sm">Logical Levels (60-90')</span>
<span className="bg-green-200 text-green-900 px-3 py-1 rounded text-sm">Timeline Therapy (90-120')</span>
<span className="bg-green-200 text-green-900 px-3 py-1 rounded text-sm">Future Pacing (15-20')</span>
</div>
</div>
<div className="p-4 bg-yellow-50 rounded border-l-4 border-yellow-500">
<p className="font-bold text-yellow-800 mb-2">⚠️ SẴN SÀNG TB (100-139 điểm)</p>
<div className="flex flex-wrap gap-2">
<span className="bg-yellow-200 text-yellow-900 px-3 py-1 rounded text-sm">SCORE Model (30-45')</span>
<span className="bg-yellow-200 text-yellow-900 px-3 py-1 rounded text-sm">Well-Formed Outcome (20-30')</span>
<span className="bg-yellow-200 text-yellow-900 px-3 py-1 rounded text-sm">Values Work (30-45')</span>
<span className="bg-yellow-200 text-yellow-900 px-3 py-1 rounded text-sm">Map Update (15-20')</span>
</div>
</div>
<div className="p-4 bg-orange-50 rounded border-l-4 border-orange-500">
<p className="font-bold text-orange-800 mb-2">⚠️ SẴN SÀNG THẤP (60-99 điểm)</p>
<div className="flex flex-wrap gap-2">
<span className="bg-orange-200 text-orange-900 px-3 py-1 rounded text-sm">Belief Audit (30-45')</span>
<span className="bg-orange-200 text-orange-900 px-3 py-1 rounded text-sm">Motivation Building (20-30')</span>
<span className="bg-orange-200 text-orange-900 px-3 py-1 rounded text-sm">Rapport (10-15')</span>
<span className="bg-orange-200 text-orange-900 px-3 py-1 rounded text-sm">Wheel of Life (10-15')</span>
</div>
</div>
</div>
</div>

<div className="border rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold mb-4">🎯 Theo Vấn Đề Cụ Thể</h3>
<div className="space-y-2">
{[
{ problem: 'Không rõ vấn đề là gì', tool: 'Meta Model', time: '10-15\'', color: 'red' },
{ problem: 'Không biết muốn gì', tool: 'Well-Formed Outcome', time: '20-30\'', color: 'orange' },
{ problem: 'Không biết làm thế nào', tool: 'Disney Model', time: '60-90\'', color: 'blue' },
{ problem: 'Niềm tin hạn chế', tool: 'Belief Change', time: '30-60\'', color: 'purple' },
{ problem: 'Không nhận trách nhiệm', tool: 'Map Update', time: '15-20\'', color: 'orange' },
{ problem: 'Cuộc sống mất cân bằng', tool: 'Wheel of Life', time: '10-15\'', color: 'purple' },
{ problem: 'Xung đột giá trị', tool: 'Values Work', time: '30-45\'', color: 'green' },
{ problem: 'Vấn đề từ quá khứ', tool: 'Timeline Therapy', time: '90-120\'', color: 'indigo' },
{ problem: 'Cần reframe vấn đề', tool: 'SCORE + Reframe', time: '25-30\'', color: 'pink' },
{ problem: 'Cần alignment', tool: 'Logical Levels Alignment', time: '20-30\'', color: 'indigo' },
{ problem: 'Thiếu động lực', tool: 'Motivation Building', time: '20-30\'', color: 'red' },
{ problem: 'Trạng thái tiêu cực', tool: 'Collapse Anchor', time: '15-20\'', color: 'blue' },
{ problem: 'Kiểm tra niềm tin', tool: 'Belief Audit', time: '30-45\'', color: 'purple' },
{ problem: 'Thiếu rapport/tin tưởng', tool: 'Rapport Building', time: '10-15\'', color: 'green' },
{ problem: 'Test mục tiêu', tool: 'Future Pacing', time: '15-20\'', color: 'teal' }
].map((item, idx) => {
const problemColorClasses = {
  red: 'bg-red-100 text-red-800',
  orange: 'bg-orange-100 text-orange-800',
  blue: 'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
  green: 'bg-green-100 text-green-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  pink: 'bg-pink-100 text-pink-800',
  teal: 'bg-teal-100 text-teal-800'
};
const colorClasses = problemColorClasses[item.color] || problemColorClasses.blue;
return (
<div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition">
<span className="text-sm flex-1">{item.problem}</span>
<div className="flex items-center gap-2">
<span className="text-xs text-gray-500">{item.time}</span>
<span className={`${colorClasses} px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap`}>
{item.tool}
</span>
</div>
</div>
);
})}
</div>
</div>

{/* New Tools Descriptions */}
<div className="border-2 border-blue-300 rounded-lg p-6 bg-blue-50">
<h3 className="text-xl font-bold text-blue-800 mb-4">📚 Chi Tiết Các Công Cụ</h3>
<div className="space-y-4">
<div className="p-4 bg-white rounded-lg border-l-4 border-blue-500">
<h4 className="font-bold text-blue-800 mb-2">🎯 Well-Formed Outcome (20-30 phút)</h4>
<p className="text-sm mb-2">Xây dựng mục tiêu rõ ràng, cụ thể, có thể đo lường</p>
<ul className="list-disc ml-6 text-xs space-y-1">
<li><strong>Positive:</strong> Mục tiêu là điều bạn MUỐN, không phải điều bạn KHÔNG MUỐN</li>
<li><strong>Specific:</strong> Cụ thể đến mức bạn biết khi nào đạt được</li>
<li><strong>Self-initiated:</strong> Bạn có thể bắt đầu và duy trì</li>
<li><strong>Contextualized:</strong> Ở đâu, khi nào, với ai?</li>
<li><strong>Resources:</strong> Bạn có những gì cần thiết?</li>
<li><strong>Ecological:</strong> Phù hợp với cuộc sống và giá trị của bạn</li>
</ul>
</div>

<div className="p-4 bg-white rounded-lg border-l-4 border-green-500">
<h4 className="font-bold text-green-800 mb-2">🤝 Rapport Building (10-15 phút)</h4>
<p className="text-sm mb-2">Xây dựng sự tin tưởng và kết nối với khách hàng</p>
<ul className="list-disc ml-6 text-xs space-y-1">
<li><strong>Matching & Mirroring:</strong> Ngôn ngữ cơ thể, giọng điệu, nhịp thở</li>
<li><strong>Backtracking:</strong> Lặp lại từ ngữ của khách hàng</li>
<li><strong>Pacing & Leading:</strong> Đồng điệu trước khi dẫn dắt</li>
<li><strong>Calibration:</strong> Quan sát phản ứng vi tế</li>
</ul>
</div>

<div className="p-4 bg-white rounded-lg border-l-4 border-red-500">
<h4 className="font-bold text-red-800 mb-2">🔥 Motivation Building (20-30 phút)</h4>
<p className="text-sm mb-2">Xây dựng động lực thay đổi từ bên trong</p>
<ul className="list-disc ml-6 text-xs space-y-1">
<li><strong>Away From Pain:</strong> Chi phí của việc KHÔNG thay đổi</li>
<li><strong>Toward Pleasure:</strong> Lợi ích của việc thay đổi</li>
<li><strong>Leverage:</strong> Đòn bẩy cảm xúc để tạo hành động</li>
<li><strong>Values Connection:</strong> Kết nối mục tiêu với giá trị cốt lõi</li>
</ul>
</div>

<div className="p-4 bg-white rounded-lg border-l-4 border-purple-500">
<h4 className="font-bold text-purple-800 mb-2">⚡ Collapse Anchor (15-20 phút)</h4>
<p className="text-sm mb-2">Loại bỏ trạng thái cảm xúc tiêu cực bằng cách "đè" bằng trạng thái tích cực</p>
<ul className="list-disc ml-6 text-xs space-y-1">
<li><strong>Bước 1:</strong> Xác định trạng thái tiêu cực và anchor nó</li>
<li><strong>Bước 2:</strong> Xác định trạng thái tích cực và anchor nó</li>
<li><strong>Bước 3:</strong> Kích hoạt cả 2 anchor cùng lúc</li>
<li><strong>Bước 4:</strong> Test - trạng thái tiêu cực đã biến mất/giảm</li>
</ul>
</div>

<div className="p-4 bg-white rounded-lg border-l-4 border-orange-500">
<h4 className="font-bold text-orange-800 mb-2">🔍 Belief Audit (30-45 phút)</h4>
<p className="text-sm mb-2">Kiểm tra và thay đổi niềm tin hạn chế</p>
<ul className="list-disc ml-6 text-xs space-y-1">
<li><strong>Identify:</strong> Niềm tin nào đang cản trở bạn?</li>
<li><strong>Challenge:</strong> Bằng chứng nào cho thấy niềm tin này SAI?</li>
<li><strong>Replace:</strong> Niềm tin mới nào sẽ hỗ trợ bạn tốt hơn?</li>
<li><strong>Install:</strong> Làm thế nào để niềm tin mới trở thành tự động?</li>
</ul>
</div>

<div className="p-4 bg-white rounded-lg border-l-4 border-teal-500">
<h4 className="font-bold text-teal-800 mb-2">💎 Values Work (30-45 phút)</h4>
<p className="text-sm mb-2">Khám phá và sắp xếp thứ tự giá trị cốt lõi</p>
<ul className="list-disc ml-6 text-xs space-y-1">
<li><strong>Elicitation:</strong> Điều gì quan trọng với bạn trong [context]?</li>
<li><strong>Hierarchy:</strong> Sắp xếp thứ tự ưu tiên các giá trị</li>
<li><strong>Conflicts:</strong> Giá trị nào đang xung đột?</li>
<li><strong>Alignment:</strong> Làm thế nào để align hành động với giá trị?</li>
</ul>
</div>
</div>
</div>
</div>
);

const renderWorksheet = () => {
  const wheelAvg = (Object.values(wheelOfLife).reduce((sum, area) => sum + area.current, 0) / 8).toFixed(1);

  // Calculate VAKAD totals
  const vakadTotals = Object.values(vakadAnswers).reduce((acc, q) => {
    acc.V += q.V || 0;
    acc.A += q.A || 0;
    acc.K += q.K || 0;
    acc.Ad += q.Ad || 0;
    return acc;
  }, { V: 0, A: 0, K: 0, Ad: 0 });

  const dominantVAKAD = Object.entries(vakadTotals).sort((a, b) => b[1] - a[1])[0];

  // Calculate Spiral Dynamics dominant level
  const spiralLevels = Object.entries(spiralDynamicsAnswers).reduce((acc, [key, value]) => {
    if (value && value !== '') {
      const level = key.split('-')[0];
      acc[level] = (acc[level] || 0) + 1;
    }
    return acc;
  }, {});
  const dominantSpiral = Object.entries(spiralLevels).sort((a, b) => b[1] - a[1])[0];

  // Export to PDF function
  const exportToPDF = () => {
    const element = document.getElementById('comprehensive-report');
    const opt = {
      margin: 10,
      filename: `coaching-report-${clientName || 'client'}-${sessionDate || 'date'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">📝 Bảng Tổng Hợp - Comprehensive Report</h2>

<div className="bg-gradient-to-r from-green-100 to-blue-100 border-l-4 border-green-500 p-4">
<p className="font-bold">Báo cáo toàn diện - Bao gồm TẤT CẢ đánh giá, quan sát, phân tích và kế hoạch hành động</p>
<p className="text-sm mt-2">Công cụ này tổng hợp dữ liệu từ: Personal History, Readiness, Wheel of Life, Values, Goals, VAKAD, Personal Color, Spiral Dynamics, Meta-Programs, SOM, và nhiều hơn nữa.</p>
</div>

{/* Export Controls */}
<div className="sticky top-0 z-10 bg-white p-4 shadow-md rounded-lg">
<ExportControls />
</div>

{/* Report Content */}
<div id="comprehensive-report" className="space-y-6 bg-white p-8">
{/* Header */}
<div className="text-center border-b-4 border-blue-600 pb-4">
<h1 className="text-3xl font-bold text-blue-800">BÁO CÁO COACHING TOÀN DIỆN</h1>
<p className="text-sm text-gray-600 mt-2">© Coach Sony Ho - All Rights Reserved</p>
<p className="text-xs text-gray-500 mt-1">Confidential - For Coach Use Only</p>
</div>

{/* 1. Session Information */}
<div className="border-2 border-blue-300 rounded-lg p-6 bg-blue-50">
<h3 className="text-xl font-bold mb-4 text-blue-800">👤 THÔNG TIN KHÁCH HÀNG & SESSION</h3>
<div className="grid md:grid-cols-2 gap-4">
<div>
<label className="block text-sm font-medium mb-2">Tên khách hàng</label>
<input
type="text"
value={clientName}
onChange={(e) => setClientName(e.target.value)}
placeholder="Nhập tên khách hàng..."
className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
/>
</div>
<div>
<label className="block text-sm font-medium mb-2">Tuổi</label>
<input
type="text"
value={clientAge}
onChange={(e) => setClientAge(e.target.value)}
placeholder="Tuổi"
className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
/>
</div>
<div>
<label className="block text-sm font-medium mb-2">Địa điểm</label>
<input
type="text"
value={clientLocation}
onChange={(e) => setClientLocation(e.target.value)}
placeholder="Địa điểm"
className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
/>
</div>
<div>
<label className="block text-sm font-medium mb-2">Ngày session</label>
<input
type="date"
value={sessionDate}
onChange={(e) => setSessionDate(e.target.value)}
className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
/>
</div>
<div>
<label className="block text-sm font-medium mb-2">Mục tiêu session</label>
<input
type="text"
value={sessionGoal}
onChange={(e) => setSessionGoal(e.target.value)}
placeholder="Điều gì sẽ khiến session này có giá trị?"
className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
/>
</div>
<div>
<label className="block text-sm font-medium mb-2">Session tiếp theo</label>
<input
type="date"
value={nextSessionDate}
onChange={(e) => setNextSessionDate(e.target.value)}
className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
/>
</div>
</div>
</div>

{/* 2. Executive Summary */}
<div className="border-2 border-purple-300 rounded-lg p-6 bg-purple-50">
<h3 className="text-xl font-bold mb-4 text-purple-800">📊 TÓM TẮT ĐÁNH GIÁ TỔNG QUÁT</h3>
<div className="grid md:grid-cols-3 gap-4">
<div className="bg-white p-4 rounded-lg shadow">
<p className="text-sm text-gray-600">Điểm sẵn sàng</p>
<p className="text-3xl font-bold text-green-600">{totalScore}/160</p>
<p className="text-sm font-semibold text-gray-700">{readiness.level}</p>
</div>
<div className="bg-white p-4 rounded-lg shadow">
<p className="text-sm text-gray-600">Wheel of Life Average</p>
<p className="text-3xl font-bold text-orange-600">{wheelAvg}/10</p>
</div>
<div className="bg-white p-4 rounded-lg shadow">
<p className="text-sm text-gray-600">VAKAD Dominant Style</p>
<p className="text-2xl font-bold text-purple-600">
{dominantVAKAD ? `${dominantVAKAD[0]} (${dominantVAKAD[1]})` : 'N/A'}
</p>
</div>
</div>
<div className="mt-4 bg-white p-4 rounded-lg">
<p className="text-sm font-semibold mb-2">Công cụ đề xuất:</p>
<p className="text-base font-bold text-blue-600">{readiness.tools}</p>
</div>
<div className="mt-4 bg-white p-4 rounded-lg">
<p className="text-sm font-semibold mb-2">Spiral Dynamics Level:</p>
<p className="text-lg font-bold text-indigo-600">
{dominantSpiral ? `${dominantSpiral[0]} (${dominantSpiral[1]} answers)` : 'Chưa đánh giá'}
</p>
</div>
</div>

{/* 3. Wheel of Life Details */}
<div className="border-2 border-orange-300 rounded-lg p-6 bg-orange-50">
<h3 className="text-xl font-bold mb-4 text-orange-800">🎡 WHEEL OF LIFE - CHI TIẾT</h3>
<div className="grid md:grid-cols-2 gap-4">
{Object.entries({
spirituality: 'Tâm Linh',
career: 'Sự Nghiệp',
family: 'Gia Đình',
relationships: 'Quan Hệ',
health: 'Sức Khỏe',
personal: 'Phát Triển',
leisure: 'Giải Trí',
contribution: 'Đóng Góp'
}).map(([key, label]) => (
<div key={key} className="bg-white p-4 rounded-lg">
<p className="font-semibold text-sm">{label}</p>
<div className="flex items-center gap-2 mt-2">
<span className="text-2xl font-bold text-orange-600">{wheelOfLife[key].current}</span>
<span className="text-gray-400">/</span>
<span className="text-lg text-gray-600">Target: {wheelOfLife[key].target}</span>
</div>
{wheelOfLife[key].needs && (
<p className="text-xs mt-2 text-gray-600 italic">Needs: {wheelOfLife[key].needs}</p>
)}
<div className="w-full bg-gray-200 rounded-full h-2 mt-2">
<div
className="bg-orange-500 h-2 rounded-full"
style={{width: `${(wheelOfLife[key].current / 10) * 100}%`}}
></div>
</div>
</div>
))}
</div>
</div>

{/* 4. VAKAD Analysis */}
<div className="border-2 border-teal-300 rounded-lg p-6 bg-teal-50">
<h3 className="text-xl font-bold mb-4 text-teal-800">👁️👂🤲 VAKAD ANALYSIS</h3>
<div className="grid md:grid-cols-4 gap-4 mb-4">
<div className="bg-white p-4 rounded-lg text-center">
<p className="text-sm text-gray-600">Visual</p>
<p className="text-3xl font-bold text-purple-600">{vakadTotals.V}</p>
</div>
<div className="bg-white p-4 rounded-lg text-center">
<p className="text-sm text-gray-600">Auditory</p>
<p className="text-3xl font-bold text-blue-600">{vakadTotals.A}</p>
</div>
<div className="bg-white p-4 rounded-lg text-center">
<p className="text-sm text-gray-600">Kinesthetic</p>
<p className="text-3xl font-bold text-green-600">{vakadTotals.K}</p>
</div>
<div className="bg-white p-4 rounded-lg text-center">
<p className="text-sm text-gray-600">Auditory Digital</p>
<p className="text-3xl font-bold text-orange-600">{vakadTotals.Ad}</p>
</div>
</div>
<div className="bg-white p-4 rounded-lg">
<p className="text-sm font-semibold mb-2">Dominant Learning Style:</p>
<p className="text-xl font-bold text-teal-700">
{dominantVAKAD ? `${dominantVAKAD[0]} (Score: ${dominantVAKAD[1]})` : 'Chưa đánh giá'}
</p>
<p className="text-xs text-gray-600 mt-2">
{dominantVAKAD && dominantVAKAD[0] === 'V' && 'Client learns best through visual aids, diagrams, and imagery'}
{dominantVAKAD && dominantVAKAD[0] === 'A' && 'Client learns best through discussions, verbal explanations'}
{dominantVAKAD && dominantVAKAD[0] === 'K' && 'Client learns best through hands-on experience and feelings'}
{dominantVAKAD && dominantVAKAD[0] === 'Ad' && 'Client learns best through logic, data, and self-talk'}
</p>
</div>
</div>

{/* 5. Personal Color & Spiral Dynamics */}
<div className="border-2 border-pink-300 rounded-lg p-6 bg-pink-50">
<h3 className="text-xl font-bold mb-4 text-pink-800">🎨 PERSONALITY PROFILES</h3>
<div className="grid md:grid-cols-2 gap-4">
<div className="bg-white p-4 rounded-lg">
<p className="text-sm font-semibold mb-2">Personal Color Answers:</p>
<div className="text-xs space-y-1 max-h-40 overflow-y-auto">
{Object.entries(personalColorAnswers).length > 0 ? (
Object.entries(personalColorAnswers).map(([key, value]) => (
<p key={key}><span className="font-semibold">{key}:</span> {value}</p>
))
) : (
<p className="text-gray-500 italic">Chưa có dữ liệu</p>
)}
</div>
</div>
<div className="bg-white p-4 rounded-lg">
<p className="text-sm font-semibold mb-2">Spiral Dynamics Level:</p>
<p className="text-lg font-bold text-indigo-600 mb-2">
{dominantSpiral ? dominantSpiral[0] : 'Chưa đánh giá'}
</p>
<div className="text-xs space-y-1 max-h-40 overflow-y-auto">
{Object.entries(spiralLevels).map(([level, count]) => (
<div key={level} className="flex justify-between">
<span className="font-semibold">{level}:</span>
<span>{count} answers</span>
</div>
))}
</div>
</div>
</div>
</div>

{/* 6. Meta-Programs Summary */}
<div className="border-2 border-indigo-300 rounded-lg p-6 bg-indigo-50">
<h3 className="text-xl font-bold mb-4 text-indigo-800">🧠 META-PROGRAMS NLP</h3>
<div className="bg-white p-4 rounded-lg">
{Object.entries(metaProgramAnswers).length > 0 ? (
<div className="space-y-2 text-sm max-h-60 overflow-y-auto">
{Object.entries(metaProgramAnswers).map(([key, value]) => (
<div key={key} className="border-b pb-2">
<span className="font-semibold">{key}:</span> {value}
</div>
))}
</div>
) : (
<p className="text-gray-500 italic">Chưa có dữ liệu Meta-Programs</p>
)}
</div>
</div>

{/* NEW: Red Flags Checklist */}
<div className="border-2 border-red-300 rounded-lg p-6 bg-red-50">
<h3 className="text-lg font-bold text-red-800 mb-4">🚨 Red Flags Checklist</h3>
<p className="text-sm mb-3">Đánh dấu nếu khách hàng thể hiện bất kỳ dấu hiệu nào sau:</p>
<div className="space-y-2">
{[
{ label: 'Ý định tự hại/tự tử', level: 'KHẨN CẤP', color: 'red' },
{ label: 'Ý định làm hại người khác', level: 'KHẨN CẤP', color: 'red' },
{ label: 'Triệu chứng tâm thần (ảo giác, hoang tưởng)', level: 'KHẨN CẤP', color: 'red' },
{ label: 'Trầm cảm nặng (>2 tuần)', level: 'CAO', color: 'orange' },
{ label: 'Lo âu/Hoảng loạn thường xuyên', level: 'CAO', color: 'orange' },
{ label: 'PTSD/Chấn thương tâm lý nặng', level: 'CAO', color: 'orange' },
{ label: 'Nghiện ngập', level: 'CAO', color: 'orange' },
{ label: 'Rối loạn ăn uống nghiêm trọng', level: 'CAO', color: 'orange' },
{ label: 'Vấn đề pháp lý cần chuyên gia', level: 'TRUNG BÌNH', color: 'yellow' },
{ label: 'Vấn đề y tế cần chẩn đoán', level: 'TRUNG BÌNH', color: 'yellow' }
].map((flag, idx) => {
const flagColorClasses = {
  red: 'bg-red-200 text-red-900',
  orange: 'bg-orange-200 text-orange-900',
  yellow: 'bg-yellow-200 text-yellow-900'
};
const colorClasses = flagColorClasses[flag.color] || flagColorClasses.red;
return (
<div key={idx} className="flex items-center space-x-3 p-3 bg-white rounded">
<input
type="checkbox"
checked={redFlags.includes(flag.label)}
onChange={(e) => {
if (e.target.checked) {
setRedFlags([...redFlags, flag.label]);
} else {
setRedFlags(redFlags.filter(f => f !== flag.label));
}
}}
className="w-5 h-5 text-red-600"
/>
<span className="text-sm flex-1">{flag.label}</span>
<span className={`${colorClasses} px-2 py-1 rounded text-xs font-bold`}>
{flag.level}
</span>
</div>
);
})}
</div>
{redFlags.length > 0 && (
<div className="mt-4 p-4 bg-red-100 border-2 border-red-500 rounded">
<p className="font-bold text-red-800 mb-2">⚠️ HÀNH ĐỘNG CẦN THIẾT:</p>
<p className="text-sm text-red-900">
Khách hàng có {redFlags.length} red flag(s). Xem xét chuyển tiếp đến chuyên gia phù hợp.
Không tiếp tục coaching nếu có red flag ở cấp độ KHẨN CẤP.
</p>
</div>
)}
</div>

{/* 7. Coach Observations */}
<div className="border-2 border-yellow-300 rounded-lg p-6 bg-yellow-50">
<h3 className="text-xl font-bold mb-4 text-yellow-800">👁️ QUAN SÁT CỦA COACH (Calibration)</h3>
<div className="space-y-4">
<div>
<label className="block text-sm font-medium mb-2">Ngôn ngữ cơ thể & State</label>
<textarea
value={coachObservations}
onChange={(e) => setCoachObservations(e.target.value)}
placeholder="- Rapport: Tốt/Cần cải thiện?
- Ngôn ngữ cơ thể: Mở/Đóng? Năng lượng cao/thấp?
- Giọng điệu: Nhiệt tình/Đơn điệu?
- Eye patterns: Truy cập Visual/Auditory/Kinesthetic?
- Breakthrough moments: Khi nào? Trigger là gì?
- Resistance: Có kháng cự không? Ở đâu?"
className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
rows="8"
/>
</div>
</div>
</div>

{/* 8. Session Notes */}
<div className="border-2 border-green-300 rounded-lg p-6 bg-green-50">
<h3 className="text-xl font-bold mb-4 text-green-800">📝 GHI CHÚ SESSION</h3>
<textarea
value={sessionNotes}
onChange={(e) => setSessionNotes(e.target.value)}
placeholder="Ghi chú quan trọng từ session:
- Insight chính của khách hàng
- Breakthrough moments
- Niềm tin hạn chế được phát hiện
- Patterns nhận ra
- Reframe hiệu quả
- Công cụ đã sử dụng
- Mức độ nhận trách nhiệm
- Lĩnh vực Wheel of Life cần ưu tiên..."
className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
rows="10"
/>
</div>

{/* 9. Action Plan */}
<div className="border-2 border-blue-300 rounded-lg p-6 bg-blue-50">
<h3 className="text-xl font-bold mb-4 text-blue-800">✅ ACTION PLAN & CAM KẾT</h3>
<p className="text-sm text-gray-600 mb-4">Khách hàng cam kết làm gì trước session tiếp theo? (Cụ thể, đo lường được, có deadline)</p>
<div className="space-y-4">
{actionPlan.map((action, idx) => (
<div key={idx}>
<label className="block text-sm font-medium mb-2">Hành động {idx + 1}</label>
<input
type="text"
value={action}
onChange={(e) => {
const newPlan = [...actionPlan];
newPlan[idx] = e.target.value;
setActionPlan(newPlan);
}}
placeholder={`VD: Tập gym 3 lần vào T2, T4, T6 (7-8am) - Đo lường: Check-in log`}
className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
/>
</div>
))}
<button
onClick={() => setActionPlan([...actionPlan, ''])}
className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
>
+ Thêm hành động
</button>
</div>

<div className="mt-4 p-4 bg-yellow-50 rounded border-l-4 border-yellow-500">
<p className="text-sm font-semibold mb-2">💡 Accountability Check:</p>
<div className="space-y-2 text-xs">
<p>• Khách hàng cam kết từ 1-10: __/10</p>
<p>• Ai sẽ giữ họ accountable? _____________</p>
<p>• Họ sẽ báo cáo tiến độ như thế nào? _____________</p>
<p>• Reward khi hoàn thành? _____________</p>
</div>
</div>
</div>

{/* Footer */}
<div className="text-center border-t-4 border-blue-600 pt-4 mt-6">
<p className="text-sm text-gray-600">© Coach Sony Ho - All Rights Reserved</p>
<p className="text-xs text-gray-500 mt-1">This report is confidential and for professional coaching use only</p>
</div>
</div>

{/* Best Practices Reminder */}
<div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-6 mt-6">
<h3 className="text-lg font-bold text-blue-800 mb-3">📚 Best Practices - Lưu Ý Cuối</h3>
<div className="space-y-2 text-sm">
<p>✅ <strong>Follow-up:</strong> Email/SMS cảm ơn trong 24h, nhắc action plan</p>
<p>✅ <strong>Confidentiality:</strong> Bảo mật tuyệt đối thông tin khách hàng</p>
<p>✅ <strong>Boundaries:</strong> Giữ ranh giới nghề nghiệp, không làm therapist</p>
<p>✅ <strong>Self-care:</strong> Coach cũng cần nghỉ ngơi và nạp năng lượng</p>
<p>✅ <strong>Supervision:</strong> Thảo luận case khó với mentor/supervisor</p>
<p>✅ <strong>CPD:</strong> Học hỏi liên tục, cập nhật kỹ năng</p>
</div>

<NextStepSuggestion
  currentSection="worksheet"
  readinessScore={Object.values(readinessScores).flat().reduce((a, b) => a + b, 0)}
  onNavigate={setActiveSection}
/>
</div>
</div>
);
};

const renderScore = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">🗺️ SCORE Model - Nâng Cao</h2>

<div className="bg-blue-50 border-l-4 border-blue-500 p-4">
<p className="font-bold">⏱️ Thời gian: 25-30 phút - SCORE + Quantum Q + VAK + Reframe + Future Pacing</p>
<p className="text-sm mt-1">SCORE = Symptom, Cause, Outcome, Resources, Effects + Enhancements</p>
</div>

{/* Reframe Section - NEW */}
<div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-400 rounded-lg p-6">
<h3 className="text-xl font-bold text-purple-800 mb-4">🆕 Phần Bổ Sung Nâng Cao</h3>
<div className="grid md:grid-cols-2 gap-4 text-sm">
<div className="flex items-start space-x-3 p-3 bg-white rounded">
<span className="text-2xl">⚛️</span>
<div>
<p className="font-bold">Quantum Questions</p>
<p className="text-gray-700">Câu hỏi "giả định thành công" để kích hoạt tư duy giải pháp</p>
</div>
</div>
<div className="flex items-start space-x-3 p-3 bg-white rounded">
<span className="text-2xl">👁️👂🤲</span>
<div>
<p className="font-bold">VAK System</p>
<p className="text-gray-700">Visual-Auditory-Kinesthetic để truy cập ký ức đầy đủ</p>
</div>
</div>
<div className="flex items-start space-x-3 p-3 bg-white rounded">
<span className="text-2xl">🔄</span>
<div>
<p className="font-bold">Reframe in Cause</p>
<p className="text-gray-700">Thay đổi ý nghĩa của sự kiện gốc</p>
</div>
</div>
<div className="flex items-start space-x-3 p-3 bg-white rounded">
<span className="text-2xl">🚀</span>
<div>
<p className="font-bold">Future Pacing</p>
<p className="text-gray-700">Test mục tiêu trong tương lai, phát hiện phản đối nội tại</p>
</div>
</div>
<div className="flex items-start space-x-3 p-3 bg-white rounded">
<span className="text-2xl">🔍</span>
<div>
<p className="font-bold">Significant Emotional Experience</p>
<p className="text-gray-700">Xác định sự kiện cảm xúc quan trọng trong quá khứ</p>
</div>
</div>
<div className="flex items-start space-x-3 p-3 bg-white rounded">
<span className="text-2xl">💡</span>
<div>
<p className="font-bold">Positive Intention</p>
<p className="text-gray-700">Mọi hành vi đều có ý định tích cực</p>
</div>
</div>
</div>
</div>

<div className="space-y-4">
{Object.entries({
symptom: { label: 'S - SYMPTOM (Triệu Chứng) + Quantum Questions', color: 'red' },
cause: { label: 'C - CAUSE (Nguyên Nhân) + VAK + Reframe', color: 'orange' },
outcome: { label: 'O - OUTCOME (Kết Quả)', color: 'green' },
resources: { label: 'R - RESOURCES (Nguồn Lực)', color: 'blue' },
effects: { label: 'E - EFFECTS (Tác Động)', color: 'purple' },
reframe: { label: '🔄 REFRAME + Inner Voice + Positive Intention', color: 'pink' },
futurePacing: { label: '🚀 FUTURE PACING (Thử Nghiệm Tương Lai)', color: 'teal' }
}).map(([key, meta]) => {
const scoreColorClasses = {
  red: { border: 'border-red-200', text: 'text-red-600', bg: 'bg-red-50', borderLeft: 'border-red-500' },
  orange: { border: 'border-orange-200', text: 'text-orange-600', bg: 'bg-orange-50', borderLeft: 'border-orange-500' },
  green: { border: 'border-green-200', text: 'text-green-600', bg: 'bg-green-50', borderLeft: 'border-green-500' },
  blue: { border: 'border-blue-200', text: 'text-blue-600', bg: 'bg-blue-50', borderLeft: 'border-blue-500' },
  purple: { border: 'border-purple-200', text: 'text-purple-600', bg: 'bg-purple-50', borderLeft: 'border-purple-500' },
  pink: { border: 'border-pink-200', text: 'text-pink-600', bg: 'bg-pink-50', borderLeft: 'border-pink-500' },
  teal: { border: 'border-teal-200', text: 'text-teal-600', bg: 'bg-teal-50', borderLeft: 'border-teal-500' }
};
const colors = scoreColorClasses[meta.color];
return (
<div key={key} className={`border-2 ${colors.border} rounded-lg p-6 bg-white shadow`}>
<h3 className={`text-xl font-bold ${colors.text} mb-4`}>{meta.label}</h3>

<div className="space-y-4">
{scoreQuestions[key].map((question, idx) => (
<div key={idx} className="bg-gray-50 p-4 rounded">
<label className="block text-sm font-semibold mb-2">
{idx + 1}. {question}
</label>
<textarea
value={scoreAnswers[`${key}-${idx}`] || ''}
onChange={(e) => setScoreAnswers({...scoreAnswers, [`${key}-${idx}`]: e.target.value})}
placeholder="Nhập câu trả lời của khách hàng..."
className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
rows="3"
/>
</div>
))}
</div>

{/* Enhanced coaching tips */}
<div className={`mt-4 p-3 ${colors.bg} rounded border-l-4 ${colors.borderLeft}`}>
<p className="text-sm font-semibold">💡 Coach Tips:</p>
<p className="text-sm mt-1">
{key === 'symptom' && 'Sử dụng Quantum Questions để chuyển từ "vấn đề" sang "giải pháp". Câu hỏi "Nếu vấn đề biến mất..." giúp não bộ tập trung vào kết quả mong muốn.'}
{key === 'cause' && 'Sử dụng VAK để truy cập ký ức đầy đủ. Visual (hình ảnh) → Auditory (âm thanh) → Kinesthetic (cảm giác). Sau đó Reframe để thay đổi ý nghĩa.'}
{key === 'outcome' && 'Dùng Well-Formed Outcome để xây dựng mục tiêu rõ ràng, cụ thể, có thể đo lường'}
{key === 'resources' && 'Dùng Disney Model, Logical Levels để khám phá nguồn lực. Nhớ rằng khách hàng có nhiều nguồn lực hơn họ nghĩ.'}
{key === 'effects' && 'Dùng Leverage Questions để tạo động lực. Pain (đau đớn nếu không thay đổi) thường mạnh hơn Pleasure (niềm vui khi thay đổi).'}
{key === 'reframe' && 'Giúp khách hàng thấy vấn đề là thông điệp, không phải kẻ thù. Mọi hành vi đều có ý định tích cực - hãy tôn trọng ý định đó và tìm cách mới để đáp ứng nhu cầu.'}
{key === 'futurePacing' && 'Test mục tiêu bằng cách "du hành" vào tương lai. Nếu có phần nào phản đối, đó là tín hiệu quan trọng cần khám phá thêm. Có thể có secondary gain hoặc ecology issue.'}
</p>
</div>
</div>
);
})}
</div>

{/* Positive Intention Framework */}
<div className="border-2 border-purple-300 rounded-lg p-6 bg-purple-50">
<h3 className="text-xl font-bold text-purple-800 mb-4">🎯 Framework: Positive Intention</h3>
<div className="space-y-3 text-sm">
<p className="font-semibold">Mọi hành vi, kể cả hành vi "tiêu cực", đều có ý định tích cực:</p>
<ul className="list-disc ml-6 space-y-2">
<li><strong>Trì hoãn:</strong> Ý định tích cực = Bảo vệ khỏi thất bại, giữ an toàn</li>
<li><strong>Lo lắng:</strong> Ý định tích cực = Chuẩn bị, kiểm soát rủi ro</li>
<li><strong>Tức giận:</strong> Ý định tích cực = Bảo vệ ranh giới, đấu tranh cho công bằng</li>
<li><strong>Hoàn hảo:</strong> Ý định tích cực = Được chấp nhận, tránh bị phê bình</li>
</ul>
<p className="mt-4 p-3 bg-white rounded border-l-4 border-purple-500">
<strong>Câu hỏi coach:</strong> "Nếu hành vi này đang cố gắng bảo vệ bạn khỏi điều gì, đó là gì?"
</p>
</div>
</div>

{/* VAK Explanation */}
<div className="border-2 border-orange-300 rounded-lg p-6 bg-orange-50">
<h3 className="text-xl font-bold text-orange-800 mb-4">👁️👂🤲 VAK System - Visual, Auditory, Kinesthetic</h3>
<div className="grid md:grid-cols-3 gap-4 text-sm">
<div className="p-4 bg-white rounded-lg border-l-4 border-blue-500">
<p className="font-bold mb-2">👁️ VISUAL (Thị Giác)</p>
<p className="text-gray-700 mb-2">Hỏi: "Bạn thấy gì?"</p>
<ul className="list-disc ml-4 text-xs space-y-1">
<li>Màu sắc, hình dạng</li>
<li>Ánh sáng/tối</li>
<li>Di chuyển/tĩnh</li>
<li>Khoảng cách</li>
</ul>
</div>
<div className="p-4 bg-white rounded-lg border-l-4 border-green-500">
<p className="font-bold mb-2">👂 AUDITORY (Thính Giác)</p>
<p className="text-gray-700 mb-2">Hỏi: "Bạn nghe thấy gì?"</p>
<ul className="list-disc ml-4 text-xs space-y-1">
<li>Giọng nói, âm thanh</li>
<li>To/nhỏ</li>
<li>Cao/thấp</li>
<li>Nhanh/chậm</li>
</ul>
</div>
<div className="p-4 bg-white rounded-lg border-l-4 border-red-500">
<p className="font-bold mb-2">🤲 KINESTHETIC (Xúc Giác)</p>
<p className="text-gray-700 mb-2">Hỏi: "Bạn cảm nhận gì?"</p>
<ul className="list-disc ml-4 text-xs space-y-1">
<li>Cảm giác trong cơ thể</li>
<li>Nhiệt độ, áp lực</li>
<li>Nặng/nhẹ</li>
<li>Vị trí trong cơ thể</li>
</ul>
</div>
</div>
<p className="mt-3 text-sm italic">
<strong>Lưu ý:</strong> Truy cập cả 3 hệ thống giúp ký ức trở nên sống động và đầy đủ hơn, tạo điều kiện cho thay đổi sâu.
</p>
</div>

{/* Future Pacing Explanation */}
<div className="border-2 border-teal-300 rounded-lg p-6 bg-teal-50">
<h3 className="text-xl font-bold text-teal-800 mb-4">🚀 Future Pacing - Kiểm Tra Mục Tiêu</h3>
<div className="space-y-3 text-sm">
<p className="font-semibold">Mục đích: Test xem mục tiêu có ecology (phù hợp với toàn bộ hệ thống) không</p>
<div className="p-3 bg-white rounded border-l-4 border-teal-500">
<p className="font-bold mb-2">Các bước Future Pacing:</p>
<ol className="list-decimal ml-5 space-y-2">
<li>Yêu cầu khách hàng tưởng tượng đã đạt được mục tiêu</li>
<li>Hỏi họ đang ở đâu, với ai, làm gì</li>
<li>Truy cập VAK: Thấy gì? Nghe gì? Cảm thấy gì?</li>
<li>Hỏi: "Có phần nào trong bạn phản đối mục tiêu này không?"</li>
<li>Nếu có phản đối → Khám phá secondary gain hoặc conflict</li>
</ol>
</div>
<p className="p-3 bg-yellow-100 rounded text-yellow-900">
<strong>⚠️ Lưu ý:</strong> Nếu khách hàng cảm thấy không thoải mái khi tưởng tượng mục tiêu, đó là dấu hiệu quan trọng. Có thể có niềm tin hạn chế hoặc lợi ích ẩn (secondary gain) cần giải quyết trước.
</p>
</div>
</div>
</div>
);

const renderLogical = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">📊 Logical Levels Alignment</h2>

<div className="bg-purple-50 border-l-4 border-purple-500 p-4">
<p className="font-bold">⏱️ Thời gian: 20-30 phút - 24 câu hỏi + Alignment Process</p>
<p className="text-sm mt-1">Đi từ Environment lên Spiritual, sau đó từ Spiritual xuống Environment</p>
</div>

{/* NEW: Alignment Process Explanation */}
<div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 border-2 border-blue-500 rounded-lg p-6">
<h3 className="text-xl font-bold mb-4">🔄 Quy Trình Logical Levels Alignment</h3>

<div className="grid md:grid-cols-2 gap-6">
{/* Going UP */}
<div className="bg-white rounded-lg p-5 border-2 border-blue-400">
<div className="flex items-center space-x-2 mb-4">
<ArrowUp className="w-6 h-6 text-blue-600" />
<h4 className="font-bold text-lg text-blue-800">Bước 1: Đi Lên (UP) 🔍</h4>
</div>
<p className="text-sm mb-3 font-semibold">Environment → Spiritual</p>
<ol className="space-y-2 text-sm">
<li className="flex items-start">
<span className="font-bold mr-2">1.</span>
<span><strong>Environment:</strong> Xác định bối cảnh vấn đề</span>
</li>
<li className="flex items-start">
<span className="font-bold mr-2">2.</span>
<span><strong>Behavior:</strong> Hành vi cụ thể là gì?</span>
</li>
<li className="flex items-start">
<span className="font-bold mr-2">3.</span>
<span><strong>Capabilities:</strong> Kỹ năng nào đang thiếu?</span>
</li>
<li className="flex items-start">
<span className="font-bold mr-2">4.</span>
<span><strong>Beliefs:</strong> Niềm tin nào cản trở?</span>
</li>
<li className="flex items-start">
<span className="font-bold mr-2">5.</span>
<span><strong>Identity:</strong> Bạn nghĩ bạn là ai?</span>
</li>
<li className="flex items-start">
<span className="font-bold mr-2">6.</span>
<span><strong>Purpose:</strong> Mục đích lớn hơn là gì?</span>
</li>
</ol>
<div className="mt-4 p-3 bg-blue-50 rounded text-xs">
<strong>Mục đích:</strong> Tìm cấp độ bị nghẽn (stuck). Thường vấn đề ở cấp cao hơn người ta nghĩ.
</div>
</div>

{/* Going DOWN */}
<div className="bg-white rounded-lg p-5 border-2 border-green-400">
<div className="flex items-center space-x-2 mb-4">
<ArrowDown className="w-6 h-6 text-green-600" />
<h4 className="font-bold text-lg text-green-800">Bước 2: Đi Xuống (DOWN) ✨</h4>
</div>
<p className="text-sm mb-3 font-semibold">Spiritual → Environment</p>
<ol className="space-y-2 text-sm">
<li className="flex items-start">
<span className="font-bold mr-2">1.</span>
<span><strong>Purpose:</strong> Kết nối với mục đích lớn</span>
</li>
<li className="flex items-start">
<span className="font-bold mr-2">2.</span>
<span><strong>Identity:</strong> Bạn là ai khi sống đúng mục đích?</span>
</li>
<li className="flex items-start">
<span className="font-bold mr-2">3.</span>
<span><strong>Beliefs:</strong> Niềm tin mới cần gì?</span>
</li>
<li className="flex items-start">
<span className="font-bold mr-2">4.</span>
<span><strong>Capabilities:</strong> Kỹ năng cần phát triển?</span>
</li>
<li className="flex items-start">
<span className="font-bold mr-2">5.</span>
<span><strong>Behavior:</strong> Hành động cụ thể là gì?</span>
</li>
<li className="flex items-start">
<span className="font-bold mr-2">6.</span>
<span><strong>Environment:</strong> Thay đổi môi trường như thế nào?</span>
</li>
</ol>
<div className="mt-4 p-3 bg-green-50 rounded text-xs">
<strong>Mục đích:</strong> Alignment - Căn chỉnh mọi cấp độ với mục đích cao nhất. Đây là bước tạo ra breakthrough.
</div>
</div>
</div>

{/* Key Insight */}
<div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
<p className="font-bold text-lg mb-2">🔑 Insight Quan Trọng:</p>
<p className="text-sm mb-3">
<strong>Đi lên (UP):</strong> Chẩn đoán - Tìm cấp độ nghẽn<br/>
<strong>Đi xuống (DOWN):</strong> Chữa lành - Alignment & Integration
</p>
<p className="text-sm italic">
"Một vấn đề không thể được giải quyết ở cùng cấp độ mà nó được tạo ra" - Einstein
</p>
</div>
</div>

{/* Original Questions Section */}
<div className="space-y-4">
{Object.entries({
purpose: { label: 'Cấp 6: Mục Đích / Tâm Linh', icon: '⭐', color: 'purple', number: '1 (UP) / 6 (DOWN)' },
identity: { label: 'Cấp 5: Bản Sắc / Vai Trò', icon: '🎭', color: 'red', number: '2 (UP) / 5 (DOWN)' },
beliefs: { label: 'Cấp 4: Niềm Tin & Giá Trị', icon: '💭', color: 'orange', number: '3 (UP) / 4 (DOWN)' },
capabilities: { label: 'Cấp 3: Khả Năng', icon: '🎓', color: 'blue', number: '4 (UP) / 3 (DOWN)' },
behavior: { label: 'Cấp 2: Hành Vi', icon: '🚶', color: 'green', number: '5 (UP) / 2 (DOWN)' },
environment: { label: 'Cấp 1: Môi Trường', icon: '🏠', color: 'yellow', number: '6 (UP) / 1 (DOWN)' }
}).map(([key, meta]) => {
const neurologicalColorClasses = {
  purple: { border: 'border-purple-200', text: 'text-purple-600', bg: 'bg-purple-50' },
  red: { border: 'border-red-200', text: 'text-red-600', bg: 'bg-red-50' },
  orange: { border: 'border-orange-200', text: 'text-orange-600', bg: 'bg-orange-50' },
  blue: { border: 'border-blue-200', text: 'text-blue-600', bg: 'bg-blue-50' },
  green: { border: 'border-green-200', text: 'text-green-600', bg: 'bg-green-50' },
  yellow: { border: 'border-yellow-200', text: 'text-yellow-600', bg: 'bg-yellow-50' }
};
const colors = neurologicalColorClasses[meta.color];
return (
<div key={key} className={`border-2 ${colors.border} rounded-lg p-6 bg-white shadow`}>
<div className="flex items-center justify-between mb-4">
<h3 className={`text-xl font-bold ${colors.text}`}>
{meta.icon} {meta.label}
</h3>
<span className="text-xs bg-gray-200 px-3 py-1 rounded-full font-mono">
{meta.number}
</span>
</div>

<div className="space-y-4">
{logicalLevelQuestions[key].map((question, idx) => (
<div key={idx} className="bg-gray-50 p-4 rounded">
<label className="block text-sm font-semibold mb-2">
{idx + 1}. {question}
</label>
<textarea
value={logicalAnswers[`${key}-${idx}`] || ''}
onChange={(e) => setLogicalAnswers({...logicalAnswers, [`${key}-${idx}`]: e.target.value})}
placeholder="Nhập câu trả lời của khách hàng..."
className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
rows="2"
/>
</div>
))}
</div>

<div className={`mt-4 p-3 ${colors.bg} rounded`}>
<p className="text-sm font-semibold">✅ Công cụ phù hợp khi nghẽn ở cấp này:</p>
<p className="text-sm mt-1">
{key === 'environment' && 'SCORE Model'}
{key === 'behavior' && 'Modeling, Anchoring'}
{key === 'capabilities' && 'Disney Model, Modeling'}
{key === 'beliefs' && 'Belief Change, Values Audit, Timeline'}
{key === 'identity' && 'Identity Reframe, Logical Levels'}
{key === 'purpose' && 'Purpose Exploration, Life Mapping'}
</p>
</div>
</div>
);
})}
</div>

{/* Alignment Checklist */}
<div className="border-2 border-green-300 rounded-lg p-6 bg-green-50">
<h3 className="text-xl font-bold text-green-700 mb-4">✅ Checklist Alignment Hoàn Chỉnh</h3>
<div className="space-y-2">
{[
'Đã xác định được cấp độ nghẽn chính (stuck level)',
'Purpose/Spiritual: Khách hàng thấy mục đích lớn hơn',
'Identity: Khách hàng có identity mới phù hợp với mục đích',
'Beliefs: Niềm tin mới được xác định rõ ràng',
'Capabilities: Biết cần học/phát triển kỹ năng gì',
'Behavior: Có hành động cụ thể để thực hiện',
'Environment: Biết cần thay đổi môi trường như thế nào',
'Tất cả các cấp độ đã được ALIGN với Purpose'
].map((item, idx) => (
<div key={idx} className="flex items-center space-x-3 p-3 bg-white rounded">
<input type="checkbox" className="w-5 h-5 text-green-600" />
<span className="text-sm">{item}</span>
</div>
))}
</div>
</div>
</div>
);

// Include other render functions (renderHome, renderQuick, etc.)
// For brevity, I'll just add the main component return

// If client view, show coachee dashboard
if (currentView === 'client') {
return (
<>
<ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
<CoacheeDashboard />
<Analytics />
<SpeedInsights />
</>
);
}

// Coach view
return (
<div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
{/* View Switcher */}
<ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />

{/* Session Timer & Clock */}
<AutoSaveIndicator lastSaved={lastSaved} isSaving={isSaving} sessionTimer={sessionTimer} />

{/* Mobile Menu Button */}
<button
onClick={() => setSidebarOpen(!sidebarOpen)}
className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-lg border border-gray-200"
>
{sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
</button>

{/* Overlay for mobile */}
{sidebarOpen && (
<div
className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
onClick={() => setSidebarOpen(false)}
/>
)}

{/* Sidebar */}
<div className={`
w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col
md:relative fixed inset-y-0 left-0 z-40
transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
md:translate-x-0 transition-transform duration-200
overflow-hidden
`}>
<div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
<h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Coaching Tools</h2>
<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enhanced v3.0</p>
</div>

<div className="flex-1 overflow-y-auto">
{/* Client Selector */}
<ClientSelector />

{/* Progress Bar */}
<div className="p-4 border-b border-gray-200 dark:border-gray-700">
<ProgressBar progress={progress} showLabel={true} />
</div>

{/* Theme Toggle */}
<div className="p-4 border-b border-gray-200 dark:border-gray-700">
<div className="flex items-center justify-between">
<span className="text-sm font-medium text-gray-700 dark:text-gray-300">Chế độ</span>
<ThemeToggle />
</div>
</div>

<nav className="p-4 space-y-1">
{sections.map((section, index) => {
const Icon = section.icon;
const isGroupEnd = ['readiness', 'goals', 'vakad', 'metaprograms', 'email'].includes(section.id);
const totalReadinessScore = Object.values(readinessScores).flat().reduce((a, b) => a + b, 0);
const isAllowed = isToolAllowed(section.id, totalReadinessScore);
const lockMessage = !isAllowed ? getToolLockMessage(section.id, totalReadinessScore) : null;

return (
<div key={section.id}>
<button
onClick={() => {
if (!isAllowed) {
alert(`🔒 ${lockMessage.message}\n\n💡 ${lockMessage.tip}\n\nĐiểm hiện tại: ${totalReadinessScore}\nĐiểm yêu cầu: ${lockMessage.minScore}`);
return;
}
setActiveSection(section.id);
setSidebarOpen(false);
}}
className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
activeSection === section.id
? 'bg-blue-600 text-white shadow-md'
: isAllowed
? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
: 'text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 cursor-not-allowed'
}`}
>
<div className="flex items-center space-x-3">
<Icon className="w-5 h-5" />
<span className="text-base font-medium">{section.name}</span>
</div>
{!isAllowed && <Lock className="w-4 h-4" />}
</button>
{isGroupEnd && index < sections.length - 1 && (
<div className="border-t border-gray-200 dark:border-gray-600 my-2 mx-2"></div>
)}
</div>
);
})}
</nav>
</div>

<div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
<div className="text-xs text-gray-500 dark:text-gray-400 text-center">
© Coach Sony Ho<br/>
All Rights Reserved
</div>
</div>
</div>

{/* Main Content */}
<div className="flex-1 overflow-auto bg-white dark:bg-gray-900">
<div className="p-6 md:p-10 max-w-6xl mx-auto text-base leading-relaxed mt-16 md:mt-0">
{activeSection === 'home' && renderHome()}
{activeSection === 'sessiontimer' && renderSessionTimer()}
{activeSection === 'personalhistory' && renderPersonalHistory()}
{activeSection === 'problemidentifier' && renderProblemIdentifier()}
{activeSection === 'toolrecommender' && renderToolRecommender()}
{activeSection === 'sessionnotes' && renderSessionNotes()}
{activeSection === 'readiness' && renderReadiness()}
{activeSection === 'values' && renderValuesHierarchy()}
{activeSection === 'beliefs' && renderLimitingBeliefs()}
{activeSection === 'energy' && renderEnergyAudit()}
{activeSection === 'goals' && renderSmartGoals()}
{activeSection === 'followup' && renderFollowUp()}
{activeSection === 'mapupdate' && renderMapUpdate()}
{activeSection === 'wheel' && renderWheelOfLife()}
{activeSection === 'som' && renderSOM()}
{activeSection === 'vakad' && renderVAKAD()}
{activeSection === 'reframing' && renderReframing()}
{activeSection === 'anchoring' && renderAnchoring()}
{activeSection === 'timeline' && renderTimeline()}
{activeSection === 'personalcolor' && renderPersonalColor()}
{activeSection === 'spiraldynamics' && renderSpiralDynamics()}
{activeSection === 'metaprograms' && renderMetaPrograms()}
{activeSection === 'questions' && renderQuestionLibrary()}
{activeSection === 'email' && renderEmailTemplates()}
{activeSection === 'analytics' && <AnalyticsDashboard />}
{activeSection === 'worksheet' && renderWorksheet()}
</div>
</div>
<Analytics />
<SpeedInsights />
</div>
);
};

export default CoachingAssessmentTool;
