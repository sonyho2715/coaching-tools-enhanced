const CoachingAssessmentTool = () => {
const { useState } = React;
const [activeSection, setActiveSection] = useState('home');
const [clientName, setClientName] = useState('');
const [clientAge, setClientAge] = useState('');
const [clientLocation, setClientLocation] = useState('');
const [sessionDate, setSessionDate] = useState('');
const [sessionNotes, setSessionNotes] = useState('');
const [actionPlan, setActionPlan] = useState(['', '', '']);
const [coachObservations, setCoachObservations] = useState('');
const [redFlags, setRedFlags] = useState([]);
const [sessionGoal, setSessionGoal] = useState('');
const [nextSessionDate, setNextSessionDate] = useState('');

const [readinessScores, setReadinessScores] = useState({
commitment: [0, 0, 0, 0],
change: [0, 0, 0, 0],
awareness: [0, 0, 0, 0],
resources: [0, 0, 0, 0]
});

const [quickAssessment, setQuickAssessment] = useState({
readiness: 0,
problemClear: null,
stuckLevel: null
});

const [logicalAnswers, setLogicalAnswers] = useState({});
const [scoreAnswers, setScoreAnswers] = useState({});
const [disneyAnswers, setDisneyAnswers] = useState({});
const [mapUpdateAnswers, setMapUpdateAnswers] = useState({});
const [personalHistoryAnswers, setPersonalHistoryAnswers] = useState({});
const [somAnswers, setSomAnswers] = useState({});
const [vakadAnswers, setVakadAnswers] = useState({});
const [personalColorAnswers, setPersonalColorAnswers] = useState({});
const [personalAssessmentAnswers, setPersonalAssessmentAnswers] = useState({});
const [followUpReadinessScores, setFollowUpReadinessScores] = useState({
  commitment: [0, 0, 0, 0],
  change: [0, 0, 0, 0],
  awareness: [0, 0, 0, 0],
  resources: [0, 0, 0, 0]
});

const [wheelOfLife, setWheelOfLife] = useState({
spirituality: { current: 0, target: 10, needs: '' },
career: { current: 0, target: 10, needs: '' },
family: { current: 0, target: 10, needs: '' },
relationships: { current: 0, target: 10, needs: '' },
health: { current: 0, target: 10, needs: '' },
personal: { current: 0, target: 10, needs: '' },
leisure: { current: 0, target: 10, needs: '' },
contribution: { current: 0, target: 10, needs: '' }
});

const totalScore = Object.values(readinessScores).flat().reduce((a, b) => a + b, 0);

const getReadinessLevel = (score) => {
if (score >= 140) return { level: 'Sẵn sàng cao', color: 'text-green-600', bg: 'bg-green-50', icon: '✅', tools: 'Disney Model, Logical Levels, Timeline Therapy' };
if (score >= 100) return { level: 'Sẵn sàng trung bình', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '⚠️', tools: 'SCORE Model, Well-Formed Outcome, Values Work' };
if (score >= 60) return { level: 'Sẵn sàng thấp', color: 'text-orange-600', bg: 'bg-orange-50', icon: '⚠️', tools: 'Belief Audit, Motivation Building, Rapport' };
return { level: 'Chưa sẵn sàng', color: 'text-red-600', bg: 'bg-red-50', icon: '❌', tools: 'Tạm hoãn coaching, Tư vấn thêm' };
};

const readiness = getReadinessLevel(totalScore);

const sections = [
{ id: 'home', name: 'Trang Chủ', icon: Home },
{ id: 'personalhistory', name: 'Personal History Check', icon: FileText },
{ id: 'quick', name: 'Đánh Giá Nhanh', icon: Target },
{ id: 'readiness', name: 'Đánh Giá Sẵn Sàng', icon: CheckCircle },
{ id: 'followup', name: 'Follow-up Meeting', icon: TrendingUp },
{ id: 'mapupdate', name: 'Map Update', icon: Map },
{ id: 'wheel', name: 'Wheel of Life', icon: Circle },
{ id: 'som', name: 'SOM Tool', icon: Target },
{ id: 'vakad', name: 'VAKAD Tool', icon: BarChart3 },
{ id: 'personalcolor', name: 'Personal Color', icon: Circle },
{ id: 'personalassessment', name: 'Personal Assessment', icon: CheckCircle },
{ id: 'worksheet', name: 'Worksheet', icon: ClipboardList }
];

const readinessQuestions = {
commitment: [
'Tôi sẵn sàng dành thời gian và công sức cho quá trình coaching này',
'Tôi cam kết thực hiện các bài tập và nhiệm vụ được giao',
'Tôi sẵn sàng trung thực và cởi mở trong quá trình coaching',
'Tôi hiểu rằng thay đổi cần có thời gian và kiên trì'
],
change: [
'Tôi tin rằng tôi có thể thay đổi tình huống hiện tại của mình',
'Tôi sẵn sàng từ bỏ những thói quen/niềm tin cũ không còn phục vụ tôi',
'Tôi sẵn sàng bước ra khỏi vùng an toàn của mình',
'Tôi sẵn sàng chịu trách nhiệm cho kết quả của mình'
],
awareness: [
'Tôi hiểu rõ vấn đề/thách thức mà tôi đang đối mặt',
'Tôi biết vấn đề này ảnh hưởng đến cuộc sống tôi như thế nào',
'Tôi nhận ra vai trò của mình trong việc tạo ra/duy trì vấn đề này',
'Tôi có thể mô tả cụ thể những gì tôi muốn thay đổi'
],
resources: [
'Tôi có hệ thống hỗ trợ (gia đình, bạn bè, đồng nghiệp)',
'Tôi có đủ thời gian để tham gia quá trình coaching',
'Tôi có đủ nguồn lực (tài chính, tinh thần) để duy trì quá trình',
'Tôi biết cách quản lý stress và cảm xúc trong quá trình thay đổi'
]
};

const mapUpdateQuestions = [
{
category: 'Nhận Trách Nhiệm',
questions: [
'Vai trò của bạn trong việc tạo ra tình huống hiện tại là gì?',
'Bạn đã đóng góp như thế nào vào vấn đề này?',
'Những quyết định nào của bạn đã dẫn đến kết quả này?',
'Bạn có thể kiểm soát điều gì trong tình huống này?'
]
},
{
category: 'Từ Nạn Nhân → Chủ Động',
questions: [
'Thay vì "Tại sao điều này xảy ra với tôi?", hãy hỏi "Tôi có thể học được gì từ điều này?"',
'Thay vì "Họ làm tôi cảm thấy…", hãy hỏi "Tôi chọn cảm thấy… vì điều gì?"',
'Điều gì bạn có thể làm NGAY BÂY GIỜ để cải thiện tình huống?',
'Quyền lực nào bạn đang từ bỏ khi đổ lỗi cho người/điều khác?'
]
},
{
category: 'Chọn Lựa & Hậu Quả',
questions: [
'Nếu bạn tiếp tục làm những gì đang làm, kết quả sẽ là gì?',
'Bạn có chọn lựa nào khác không?',
'Hậu quả của việc KHÔNG thay đổi là gì?',
'Lợi ích của việc giữ nguyên vấn đề là gì? (Secondary gain)'
]
},
{
category: 'Cam Kết Hành Động',
questions: [
'Bạn sẵn sàng làm gì để thay đổi tình huống này?',
'Bạn cam kết điều gì từ hôm nay?',
'Ai sẽ giữ bạn chịu trách nhiệm (accountable)?',
'Bạn sẽ đo lường tiến độ như thế nào?'
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
'Môi trường nào hiện tại đang cản trở bạn?',
'Bạn cần thay đổi gì trong môi trường để đạt mục tiêu?',
'Nơi nào bạn cảm thấy thoải mái nhất để làm việc?',
'Thời gian nào trong ngày bạn làm việc hiệu quả nhất?'
],
behavior: [
'Bạn đang làm gì mỗi ngày liên quan đến vấn đề này?',
'Hành vi nào bạn cần dừng lại?',
'Hành vi nào bạn cần bắt đầu?',
'Thói quen nào đang cản trở bạn?'
],
capabilities: [
'Kỹ năng nào bạn cần để đạt mục tiêu?',
'Bạn đã từng học hoặc làm điều tương tự chưa?',
'Ai có thể hướng dẫn bạn?',
'Bạn cần học điều gì để tiến bộ?'
],
beliefs: [
'Bạn tin gì về bản thân liên quan đến vấn đề này?',
'Niềm tin nào đang cản trở bạn?',
'Bạn tin điều gì về khả năng đạt được mục tiêu?',
'Điều gì quan trọng nhất với bạn? (Giá trị)'
],
identity: [
'Bạn là ai?',
'Bạn muốn trở thành ai?',
'Vai trò nào bạn đang đóng trong cuộc sống?',
'Bạn sẽ là ai khi đạt được mục tiêu?'
],
purpose: [
'Mục đích sống của bạn là gì?',
'Bạn đóng góp gì cho thế giới?',
'Di sản bạn muốn để lại là gì?',
'Điều gì thực sự quan trọng với bạn?'
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

const renderHome = () => (
<div className="space-y-6">
<div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
<h1 className="text-3xl font-bold mb-4">🎯 Công Cụ Đánh Giá Khách Hàng</h1>
<p className="text-xl mb-2">Hệ Thống Toàn Diện Cho Coach - Enhanced v2.0</p>
<p className="opacity-90">Xác định sẵn sàng, điểm nghẽn, trách nhiệm và công cụ phù hợp</p>
</div>

<div className="bg-red-50 border-2 border-red-400 rounded-lg p-6">
<h3 className="text-lg font-bold text-red-800 mb-3">⚠️ DISCLAIMER / TUYÊN BỐ MIỄN TRỪ TRÁCH NHIỆM</h3>
<div className="space-y-2 text-sm text-red-900">
<p className="font-semibold">© Coach Sony Ho - All Rights Reserved</p>
<p><strong>Bản quyền:</strong> Công cụ này thuộc bản quyền của Coach Sony Ho. Nghiêm cấm sao chép, phân phối, hoặc sử dụng cho mục đích thương mại mà không có sự cho phép bằng văn bản.</p>
<p><strong>Mục đích sử dụng:</strong> Công cụ này được thiết kế để hỗ trợ các coach chuyên nghiệp trong quá trình đánh giá khách hàng. Không thay thế tư vấn y tế, tâm lý, hoặc pháp lý chuyên môn.</p>
<p><strong>Trách nhiệm:</strong> Người sử dụng công cụ phải có đào tạo coaching/NLP phù hợp. Coach Sony Ho không chịu trách nhiệm về việc sử dụng sai mục đích hoặc kết quả không mong muốn.</p>
<p><strong>Liên hệ:</strong> Để được cấp phép sử dụng hoặc đào tạo, vui lòng liên hệ trực tiếp với Coach Sony Ho.</p>
</div>
</div>

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

<div className="border-2 border-blue-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer" onClick={() => setActiveSection('quick')}>
<Target className="w-12 h-12 text-blue-600 mb-3" />
<h3 className="text-xl font-bold mb-2">Đánh Giá Nhanh</h3>
<p className="text-gray-600">3 câu hỏi vàng - 3 phút</p>
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

<div className="border-2 border-indigo-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer" onClick={() => setActiveSection('logical')}>
<BarChart3 className="w-12 h-12 text-indigo-600 mb-3" />
<h3 className="text-xl font-bold mb-2">Logical Levels</h3>
<p className="text-gray-600">24 câu - Alignment</p>
</div>

<div className="border-2 border-pink-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer" onClick={() => setActiveSection('score')}>
<Map className="w-12 h-12 text-pink-600 mb-3" />
<h3 className="text-xl font-bold mb-2">SCORE Model</h3>
<p className="text-gray-600">Enhanced + Reframe</p>
</div>

<div className="border-2 border-red-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer" onClick={() => setActiveSection('disney')}>
<AlertCircle className="w-12 h-12 text-red-600 mb-3" />
<h3 className="text-xl font-bold mb-2">Disney Model</h3>
<p className="text-gray-600">3 góc nhìn</p>
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
<li><strong>Đánh Giá Nhanh:</strong> 3 câu hỏi vàng (3 phút)</li>
<li><strong>Đánh Giá Sẵn Sàng:</strong> 16 câu chi tiết (10 phút)</li>
<li><strong>Map Update:</strong> 16 câu về trách nhiệm (15 phút)</li>
<li><strong>Wheel of Life:</strong> 8 lĩnh vực cuộc sống (10 phút)</li>
<li><strong>Xác Định Nghẽn:</strong> Logical Levels/SCORE/Disney (20-30 phút)</li>
<li><strong>Chọn Công Cụ:</strong> Ma trận khuyến nghị</li>
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
</div>
);

const renderQuick = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">⚡ Đánh Giá Nhanh - 3 Câu Hỏi Vàng</h2>

<div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
<p className="font-bold">⏱️ Thời gian: 3 phút - Phù hợp khi cần quyết định nhanh</p>
</div>

<div className="space-y-6">
<div className="border rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold mb-4 text-blue-600">1️⃣ MỨC ĐỘ SẴN SÀNG</h3>
<p className="text-lg mb-4"><strong>"Từ 1-10, bạn sẵn sàng thay đổi bao nhiêu?"</strong></p>

<div className="mb-4">
<input
type="range"
min="0"
max="10"
value={quickAssessment.readiness}
onChange={(e) => setQuickAssessment({...quickAssessment, readiness: parseInt(e.target.value)})}
className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
/>
<div className="text-center text-3xl font-bold text-blue-600 mt-2">
{quickAssessment.readiness}/10
</div>
</div>

<div className="bg-gray-50 p-4 rounded space-y-2">
<div className={`flex items-center justify-between p-3 rounded ${quickAssessment.readiness >= 1 && quickAssessment.readiness <= 4 ? 'bg-red-100 border-2 border-red-500' : 'bg-red-50'}`}>
<span className="font-semibold">1-4 điểm</span>
<ChevronRight className="w-5 h-5" />
<span className="font-bold">Xây dựng động lực, Belief Audit</span>
</div>
<div className={`flex items-center justify-between p-3 rounded ${quickAssessment.readiness >= 5 && quickAssessment.readiness <= 7 ? 'bg-yellow-100 border-2 border-yellow-500' : 'bg-yellow-50'}`}>
<span className="font-semibold">5-7 điểm</span>
<ChevronRight className="w-5 h-5" />
<span className="font-bold">SCORE Model, Well-Formed Outcome</span>
</div>
<div className={`flex items-center justify-between p-3 rounded ${quickAssessment.readiness >= 8 && quickAssessment.readiness <= 10 ? 'bg-green-100 border-2 border-green-500' : 'bg-green-50'}`}>
<span className="font-semibold">8-10 điểm</span>
<ChevronRight className="w-5 h-5" />
<span className="font-bold">Disney Model, Logical Levels</span>
</div>
</div>
</div>

<div className="border rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold mb-4 text-green-600">2️⃣ VẤN ĐỀ RÕ RÀNG?</h3>
<p className="text-lg mb-4"><strong>"Bạn có thể mô tả vấn đề trong 1-2 câu không?"</strong></p>

<div className="space-y-3 mb-4">
<button
onClick={() => setQuickAssessment({...quickAssessment, problemClear: true})}
className={`w-full p-4 rounded-lg border-2 transition ${quickAssessment.problemClear === true ? 'bg-green-100 border-green-500' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
>
<div className="flex items-center justify-between">
<span className="font-semibold">✅ CÓ - Rõ ràng</span>
<ChevronRight className="w-5 h-5" />
<span className="font-bold text-sm">Tiếp tục Câu 3</span>
</div>
</button>

<button
onClick={() => setQuickAssessment({...quickAssessment, problemClear: false})}
className={`w-full p-4 rounded-lg border-2 transition ${quickAssessment.problemClear === false ? 'bg-red-100 border-red-500' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
>
<div className="flex items-center justify-between">
<span className="font-semibold">❌ KHÔNG - Mơ hồ</span>
<ChevronRight className="w-5 h-5" />
<span className="font-bold text-sm">Dùng Meta Model</span>
</div>
</button>
</div>

{quickAssessment.problemClear === false && (
<div className="bg-blue-50 border border-blue-200 p-4 rounded">
<p className="font-bold mb-2">💡 Câu hỏi Meta Model gợi ý:</p>
<ul className="list-disc ml-6 text-sm space-y-1">
<li>"Cụ thể là gì?"</li>
<li>"Ví dụ như thế nào?"</li>
<li>"Luôn luôn? Không bao giờ?"</li>
<li>"So với điều gì?"</li>
</ul>
</div>
)}
</div>

<div className="border rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold mb-4 text-purple-600">3️⃣ CẤP ĐỘ NGHẼN</h3>
<p className="text-lg mb-4"><strong>"Khách hàng nói gì? Chọn câu phù hợp nhất:"</strong></p>

<div className="space-y-3">
{[
{ level: 'environment', label: 'Môi trường', phrase: '"Nếu tôi ở nơi khác..."', tool: 'SCORE Model', color: 'blue' },
{ level: 'behavior', label: 'Hành vi', phrase: '"Tôi cứ làm mãi như vậy..."', tool: 'Modeling/Anchoring', color: 'green' },
{ level: 'capabilities', label: 'Khả năng', phrase: '"Tôi không biết làm thế nào..."', tool: 'Disney Model', color: 'purple' },
{ level: 'beliefs', label: 'Niềm tin', phrase: '"Tôi không thể/xứng đáng..."', tool: 'Belief Change', color: 'orange' },
{ level: 'identity', label: 'Bản sắc', phrase: '"Tôi không phải người..."', tool: 'Identity Reframe', color: 'red' },
{ level: 'purpose', label: 'Mục đích', phrase: '"Để làm gì? Vô nghĩa..."', tool: 'Purpose Work', color: 'pink' }
].map((item) => (
<button
key={item.level}
onClick={() => setQuickAssessment({...quickAssessment, stuckLevel: item.level})}
className={`w-full p-4 rounded-lg border-2 transition ${quickAssessment.stuckLevel === item.level ? `bg-${item.color}-100 border-${item.color}-500` : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
>
<div className="flex justify-between items-start">
<div className="text-left">
<p className="font-bold">{item.label}</p>
<p className="text-sm text-gray-600">{item.phrase}</p>
</div>
<span className={`bg-${item.color}-200 text-${item.color}-900 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2`}>
{item.tool}
</span>
</div>
</button>
))}
</div>
</div>

{quickAssessment.readiness > 0 && (
<div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-6">
<h3 className="text-xl font-bold mb-4">📊 KẾT QUẢ ĐÁNH GIÁ NHANH</h3>
<div className="space-y-3">
<div className="flex justify-between items-center">
<span className="font-semibold">Mức độ sẵn sàng:</span>
<span className="font-bold text-lg">{quickAssessment.readiness}/10</span>
</div>
<div className="flex justify-between items-center">
<span className="font-semibold">Vấn đề rõ ràng:</span>
<span className="font-bold">{quickAssessment.problemClear === null ? '-' : quickAssessment.problemClear ? 'CÓ ✅' : 'KHÔNG ❌'}</span>
</div>
<div className="flex justify-between items-center">
<span className="font-semibold">Cấp độ nghẽn:</span>
<span className="font-bold">{quickAssessment.stuckLevel || '-'}</span>
</div>
</div>
</div>
)}
</div>
</div>
);

const renderReadiness = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">✅ Đánh Giá Mức Độ Sẵn Sàng Chi Tiết</h2>

<div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
<p className="font-bold">⏱️ Thời gian: 10-15 phút - 16 câu hỏi với thang điểm 1-10</p>
</div>

<div className={`${readiness.bg} border-l-4 border-current p-6 rounded-lg ${readiness.color}`}>
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
<div key={key} className="border-2 rounded-lg p-6 bg-white shadow">
<div className="flex items-center justify-between mb-4">
<h3 className="text-xl font-bold">{meta.icon} {meta.label}</h3>
<span className={`text-2xl font-bold text-${meta.color}-600`}>
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
<span className={`text-2xl font-bold text-${meta.color}-600 w-12 text-center`}>
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
</div>
</div>
);

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
</div>
);

const renderWheelOfLife = () => {
const averageScore = Object.values(wheelOfLife).reduce((sum, area) => sum + area.current, 0) / 8;

return (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">⭕ Wheel of Life - Bánh Xe Cuộc Sống</h2>

<div className="bg-gradient-to-r from-purple-100 to-pink-100 border-l-4 border-purple-500 p-4">
<p className="font-bold">⏱️ Thời gian: 10-15 phút - Đánh giá 8 lĩnh vực và xác định cần gì để đạt 10 điểm</p>
<p className="text-sm mt-2">Điểm trung bình hiện tại: <strong>{averageScore.toFixed(1)}/10</strong></p>
</div>

<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
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

return (
<div key={key} className={`border-2 border-${meta.color}-200 rounded-lg p-6 bg-white shadow`}>
<div className="flex items-center justify-between mb-4">
<div className="flex items-center space-x-2">
<span className="text-3xl">{meta.icon}</span>
<h3 className={`text-lg font-bold text-${meta.color}-600`}>{meta.label}</h3>
</div>
<div className="text-right">
<div className="text-2xl font-bold">{data.current}/10</div>
{gap > 0 && (
<div className="text-xs text-gray-500">Cần +{gap} điểm</div>
)}
</div>
</div>

<div className="space-y-4">
<div>
<label className="block text-sm font-semibold mb-2">Điểm hiện tại (0-10)</label>
<div className="flex items-center space-x-3">
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
className="w-16 p-2 border border-gray-300 rounded text-center font-bold"
/>
</div>
</div>

<div>
<label className="block text-sm font-semibold mb-2">Mục tiêu</label>
<input
type="number"
min="0"
max="10"
value={data.target}
onChange={(e) => setWheelOfLife({
...wheelOfLife,
[key]: { ...data, target: Math.min(10, Math.max(0, parseInt(e.target.value) || 0)) }
})}
className="w-full p-2 border border-gray-300 rounded font-bold"
/>
</div>

<div>
<label className="block text-sm font-semibold mb-2">
Cần gì để đạt {data.target} điểm?
</label>
<textarea
value={data.needs}
onChange={(e) => setWheelOfLife({
...wheelOfLife,
[key]: { ...data, needs: e.target.value }
})}
placeholder="Ví dụ: Tập gym 3 lần/tuần, Ngủ đủ 7-8 tiếng, Khám sức khỏe định kỳ..."
className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500"
rows="4"
/>
</div>

<div className={`h-3 bg-gray-200 rounded-full overflow-hidden`}>
<div
className={`h-full bg-${meta.color}-500 transition-all duration-300`}
style={{ width: `${(data.current / 10) * 100}%` }}
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
}).map(([key, meta]) => (
<div key={key} className={`border-2 border-${meta.color}-200 rounded-lg p-6 bg-white`}>
<h3 className={`text-xl font-bold text-${meta.color}-600 mb-4`}>{meta.label}</h3>

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

<div className={`mt-4 p-3 bg-${meta.color}-50 rounded`}>
<p className="text-sm font-semibold">✅ Nếu nghẽn ở vai trò này:</p>
<p className="text-sm mt-1">
{key === 'dreamer' && 'Khuyến khích sử dụng tư duy Dreamer, đặt câu hỏi mở về tương lai lý tưởng'}
{key === 'realist' && 'Sử dụng góc nhìn Realist, xây dựng kế hoạch hành động chi tiết'}
{key === 'critic' && 'Chuyển từ Negative Critic sang Positive Critic, tìm giải pháp thay vì chỉ chỉ ra vấn đề'}
</p>
</div>
</div>
))}
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
</div>
);

const renderFollowUp = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">🔄 Follow-up Meeting - Buổi Gặp Tiếp Theo</h2>

<div className="bg-gradient-to-r from-green-100 to-blue-100 border-l-4 border-green-500 p-4">
<p className="font-bold">Đánh giá sẵn sàng cho buổi follow-up - Review tiến độ và cam kết tiếp theo</p>
</div>

<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
<h3 className="font-bold text-lg mb-3">📋 Mục Đích Follow-up Meeting</h3>
<ul className="list-disc ml-6 space-y-2 text-sm">
<li>Review action plan từ session trước - Khách hàng đã hoàn thành những gì?</li>
<li>Đánh giá lại mức độ sẵn sàng sau khi đã thực hiện</li>
<li>Xác định breakthrough và challenges</li>
<li>Điều chỉnh công cụ và phương pháp coaching</li>
<li>Set action plan mới</li>
</ul>
</div>

{/* Repeat Readiness Assessment */}
<div className={`bg-gradient-to-r ${readiness.bg} border-l-4 border-current p-6 rounded-lg text-${readiness.color}`}>
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
}).map(([key, meta]) => (
<div key={key} className="border-2 rounded-lg p-6 bg-white shadow">
<div className="flex items-center justify-between mb-4">
<h3 className="text-xl font-bold">{meta.icon} {meta.label}</h3>
<span className={`text-2xl font-bold text-${meta.color}-600`}>
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
<span className={`text-2xl font-bold text-${meta.color}-600 w-12 text-center`}>
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
))}
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
<h2 className="text-2xl font-bold mb-4">🎯 SOM Tool - Subject, Object, Meta</h2>

<div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
<p className="font-bold">SOM Model - Ba vị trí tri giác để hiểu vấn đề sâu hơn</p>
</div>

<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
<h3 className="font-bold text-lg mb-3">📚 SOM Model Là Gì?</h3>
<div className="space-y-2 text-sm">
<p><strong>Subject (Chủ Thể):</strong> Nhìn từ góc độ của chính mình - "Tôi thấy/cảm thấy thế nào?"</p>
<p><strong>Object (Đối Tượng):</strong> Nhìn từ góc độ người khác - "Họ thấy/cảm thấy thế nào về tôi?"</p>
<p><strong>Meta (Siêu Nhận Thức):</strong> Nhìn từ bên ngoài - "Một người quan sát trung lập sẽ thấy gì?"</p>
</div>
</div>

<div className="border-2 border-indigo-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-indigo-600 mb-4">1️⃣ Subject Position - Vị Trí Chủ Thể</h3>
<div className="space-y-4">
<div>
<label className="block text-sm font-semibold mb-2">Từ góc độ của BẠN, tình huống này như thế nào?</label>
<textarea
value={somAnswers['subject'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, subject: e.target.value})}
placeholder="Tôi thấy..., Tôi cảm thấy..., Tôi muốn..."
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Bạn muốn gì từ tình huống này?</label>
<textarea
value={somAnswers['subject_want'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, subject_want: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>
</div>
</div>

<div className="border-2 border-green-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-green-600 mb-4">2️⃣ Object Position - Vị Trí Đối Tượng</h3>
<div className="space-y-4">
<div>
<label className="block text-sm font-semibold mb-2">Hãy "trở thành" người kia. Từ góc độ của HỌ, họ thấy tình huống như thế nào?</label>
<textarea
value={somAnswers['object'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, object: e.target.value})}
placeholder="Từ vị trí của [tên người], tôi thấy..., tôi cảm thấy..."
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Người đó muốn gì từ bạn?</label>
<textarea
value={somAnswers['object_want'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, object_want: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="3"
/>
</div>
</div>
</div>

<div className="border-2 border-purple-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-purple-600 mb-4">3️⃣ Meta Position - Vị Trí Siêu Nhận Thức</h3>
<div className="space-y-4">
<div>
<label className="block text-sm font-semibold mb-2">Hãy bước ra ngoài. Một người quan sát khách quan sẽ thấy gì?</label>
<textarea
value={somAnswers['meta'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, meta: e.target.value})}
placeholder="Từ góc độ khách quan, tôi thấy..."
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Insight / Giải pháp nào xuất hiện từ vị trí Meta?</label>
<textarea
value={somAnswers['meta_insight'] || ''}
onChange={(e) => setSomAnswers({...somAnswers, meta_insight: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>
</div>
</div>

<div className="bg-green-50 border border-green-200 rounded-lg p-6">
<h3 className="font-bold text-green-800 mb-3">💡 Coach Tips:</h3>
<ul className="list-disc ml-6 space-y-2 text-sm">
<li>Khuyến khích khách hàng THẬT SỰ bước vào từng vị trí</li>
<li>Có thể dùng ghế khác nhau cho mỗi vị trí</li>
<li>Meta position thường cho insight mạnh nhất</li>
<li>Hỏi: "Từ vị trí này, bạn có lời khuyên gì cho Subject position?"</li>
</ul>
</div>
</div>
);

const renderVAKAD = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">👁️👂🤲 VAKAD Tool - Visual, Auditory, Kinesthetic, Auditory Digital</h2>

<div className="bg-purple-50 border-l-4 border-purple-500 p-4">
<p className="font-bold">VAKAD - Xác định hệ thống đại diện ưu tiên của khách hàng</p>
</div>

<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
<h3 className="font-bold text-lg mb-3">📚 VAKAD Là Gì?</h3>
<div className="grid md:grid-cols-2 gap-4 text-sm">
<div className="p-3 bg-white rounded">
<p className="font-bold">👁️ Visual (Thị Giác):</p>
<p>Người học qua hình ảnh. Từ ngữ: "Tôi thấy", "Rõ ràng", "Hình dung"</p>
</div>
<div className="p-3 bg-white rounded">
<p className="font-bold">👂 Auditory (Thính Giác):</p>
<p>Người học qua âm thanh. Từ ngữ: "Tôi nghe", "Nghe có vẻ", "Nói cho tôi"</p>
</div>
<div className="p-3 bg-white rounded">
<p className="font-bold">🤲 Kinesthetic (Cảm Giác):</p>
<p>Người học qua cảm xúc/hành động. Từ ngữ: "Tôi cảm thấy", "Nắm bắt", "Cảm nhận"</p>
</div>
<div className="p-3 bg-white rounded">
<p className="font-bold">💭 Auditory Digital (Nội Tâm):</p>
<p>Người học qua logic/phân tích. Từ ngữ: "Tôi hiểu", "Có lý", "Phân tích"</p>
</div>
</div>
</div>

<div className="border-2 border-blue-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-blue-600 mb-4">👁️ Visual - Thị Giác</h3>
<div className="space-y-4">
<div>
<label className="block text-sm font-semibold mb-2">Khi bạn nghĩ về [vấn đề], bạn THẤY gì?</label>
<textarea
value={vakadAnswers['visual'] || ''}
onChange={(e) => setVakadAnswers({...vakadAnswers, visual: e.target.value})}
placeholder="Hình ảnh, màu sắc, cảnh tượng..."
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Tần suất sử dụng từ ngữ Visual (1-10)</label>
<input
type="range"
min="0"
max="10"
value={vakadAnswers['visual_score'] || 0}
onChange={(e) => setVakadAnswers({...vakadAnswers, visual_score: parseInt(e.target.value)})}
className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
/>
<div className="text-center text-2xl font-bold text-blue-600">{vakadAnswers['visual_score'] || 0}/10</div>
</div>
</div>
</div>

<div className="border-2 border-green-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-green-600 mb-4">👂 Auditory - Thính Giác</h3>
<div className="space-y-4">
<div>
<label className="block text-sm font-semibold mb-2">Khi bạn nghĩ về [vấn đề], bạn NGHE thấy gì?</label>
<textarea
value={vakadAnswers['auditory'] || ''}
onChange={(e) => setVakadAnswers({...vakadAnswers, auditory: e.target.value})}
placeholder="Giọng nói, âm thanh, lời nói..."
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Tần suất sử dụng từ ngữ Auditory (1-10)</label>
<input
type="range"
min="0"
max="10"
value={vakadAnswers['auditory_score'] || 0}
onChange={(e) => setVakadAnswers({...vakadAnswers, auditory_score: parseInt(e.target.value)})}
className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
/>
<div className="text-center text-2xl font-bold text-green-600">{vakadAnswers['auditory_score'] || 0}/10</div>
</div>
</div>
</div>

<div className="border-2 border-red-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-red-600 mb-4">🤲 Kinesthetic - Cảm Giác</h3>
<div className="space-y-4">
<div>
<label className="block text-sm font-semibold mb-2">Khi bạn nghĩ về [vấn đề], bạn CẢM NHẬN gì?</label>
<textarea
value={vakadAnswers['kinesthetic'] || ''}
onChange={(e) => setVakadAnswers({...vakadAnswers, kinesthetic: e.target.value})}
placeholder="Cảm xúc, cảm giác trong cơ thể..."
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Tần suất sử dụng từ ngữ Kinesthetic (1-10)</label>
<input
type="range"
min="0"
max="10"
value={vakadAnswers['kinesthetic_score'] || 0}
onChange={(e) => setVakadAnswers({...vakadAnswers, kinesthetic_score: parseInt(e.target.value)})}
className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
/>
<div className="text-center text-2xl font-bold text-red-600">{vakadAnswers['kinesthetic_score'] || 0}/10</div>
</div>
</div>
</div>

<div className="border-2 border-purple-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-purple-600 mb-4">💭 Auditory Digital - Nội Tâm</h3>
<div className="space-y-4">
<div>
<label className="block text-sm font-semibold mb-2">Khi bạn nghĩ về [vấn đề], bạn SUY NGHĨ/PHÂN TÍCH gì?</label>
<textarea
value={vakadAnswers['auditory_digital'] || ''}
onChange={(e) => setVakadAnswers({...vakadAnswers, auditory_digital: e.target.value})}
placeholder="Logic, phân tích, hiểu biết..."
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Tần suất sử dụng từ ngữ Auditory Digital (1-10)</label>
<input
type="range"
min="0"
max="10"
value={vakadAnswers['auditory_digital_score'] || 0}
onChange={(e) => setVakadAnswers({...vakadAnswers, auditory_digital_score: parseInt(e.target.value)})}
className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
/>
<div className="text-center text-2xl font-bold text-purple-600">{vakadAnswers['auditory_digital_score'] || 0}/10</div>
</div>
</div>
</div>

<div className="border-2 border-indigo-300 rounded-lg p-6 bg-indigo-50">
<h3 className="text-xl font-bold text-indigo-800 mb-4">📊 Hệ Thống Đại Diện Ưu Tiên</h3>
<div className="grid md:grid-cols-4 gap-4">
<div className="p-4 bg-white rounded text-center">
<p className="text-sm mb-2">Visual</p>
<p className="text-3xl font-bold text-blue-600">{vakadAnswers['visual_score'] || 0}</p>
</div>
<div className="p-4 bg-white rounded text-center">
<p className="text-sm mb-2">Auditory</p>
<p className="text-3xl font-bold text-green-600">{vakadAnswers['auditory_score'] || 0}</p>
</div>
<div className="p-4 bg-white rounded text-center">
<p className="text-sm mb-2">Kinesthetic</p>
<p className="text-3xl font-bold text-red-600">{vakadAnswers['kinesthetic_score'] || 0}</p>
</div>
<div className="p-4 bg-white rounded text-center">
<p className="text-sm mb-2">Auditory Digital</p>
<p className="text-3xl font-bold text-purple-600">{vakadAnswers['auditory_digital_score'] || 0}</p>
</div>
</div>
</div>

<div className="bg-green-50 border border-green-200 rounded-lg p-6">
<h3 className="font-bold text-green-800 mb-3">💡 Cách Sử Dụng VAKAD:</h3>
<ul className="list-disc ml-6 space-y-2 text-sm">
<li><strong>Matching:</strong> Sử dụng từ ngữ theo hệ thống ưu tiên của khách hàng</li>
<li><strong>Visual:</strong> Dùng sơ đồ, vẽ, hình ảnh</li>
<li><strong>Auditory:</strong> Giải thích bằng lời, dùng ẩn dụ âm thanh</li>
<li><strong>Kinesthetic:</strong> Để họ cảm nhận, thực hành</li>
<li><strong>Auditory Digital:</strong> Dùng logic, số liệu, phân tích</li>
</ul>
</div>
</div>
);

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

const renderPersonalAssessment = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">📋 Personal Assessment Tool - Đánh Giá Cá Nhân Toàn Diện</h2>

<div className="bg-gradient-to-r from-purple-100 to-indigo-100 border-l-4 border-purple-500 p-4">
<p className="font-bold">Tổng hợp đánh giá về năng lực, giá trị, niềm tin, và mục tiêu cá nhân</p>
</div>

<div className="border-2 border-purple-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-purple-600 mb-4">1️⃣ Strengths & Weaknesses - Điểm Mạnh & Điểm Yếu</h3>
<div className="space-y-4">
<div>
<label className="block text-sm font-semibold mb-2">Top 5 điểm mạnh của bạn</label>
<textarea
value={personalAssessmentAnswers['strengths'] || ''}
onChange={(e) => setPersonalAssessmentAnswers({...personalAssessmentAnswers, strengths: e.target.value})}
placeholder="1.
2.
3.
4.
5."
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="6"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Top 5 điểm yếu cần cải thiện</label>
<textarea
value={personalAssessmentAnswers['weaknesses'] || ''}
onChange={(e) => setPersonalAssessmentAnswers({...personalAssessmentAnswers, weaknesses: e.target.value})}
placeholder="1.
2.
3.
4.
5."
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="6"
/>
</div>
</div>
</div>

<div className="border-2 border-blue-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-blue-600 mb-4">2️⃣ Core Values - Giá Trị Cốt Lõi</h3>
<div className="space-y-4">
<div>
<label className="block text-sm font-semibold mb-2">Top 5 giá trị quan trọng nhất với bạn</label>
<textarea
value={personalAssessmentAnswers['values'] || ''}
onChange={(e) => setPersonalAssessmentAnswers({...personalAssessmentAnswers, values: e.target.value})}
placeholder="1.
2.
3.
4.
5."
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="6"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Hiện tại bạn đang sống đúng với giá trị của mình bao nhiêu %?</label>
<input
type="range"
min="0"
max="100"
value={personalAssessmentAnswers['values_alignment'] || 0}
onChange={(e) => setPersonalAssessmentAnswers({...personalAssessmentAnswers, values_alignment: parseInt(e.target.value)})}
className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
/>
<div className="text-center text-3xl font-bold text-blue-600">{personalAssessmentAnswers['values_alignment'] || 0}%</div>
</div>
</div>
</div>

<div className="border-2 border-green-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-green-600 mb-4">3️⃣ Limiting Beliefs - Niềm Tin Hạn Chế</h3>
<div className="space-y-4">
<div>
<label className="block text-sm font-semibold mb-2">Những niềm tin đang cản trở bạn</label>
<textarea
value={personalAssessmentAnswers['limiting_beliefs'] || ''}
onChange={(e) => setPersonalAssessmentAnswers({...personalAssessmentAnswers, limiting_beliefs: e.target.value})}
placeholder="VD: Tôi không đủ giỏi..., Tôi không xứng đáng..., Tôi không thể..."
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="5"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Niềm tin mới bạn muốn có</label>
<textarea
value={personalAssessmentAnswers['empowering_beliefs'] || ''}
onChange={(e) => setPersonalAssessmentAnswers({...personalAssessmentAnswers, empowering_beliefs: e.target.value})}
placeholder="VD: Tôi có khả năng..., Tôi xứng đáng..., Tôi có thể..."
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="5"
/>
</div>
</div>
</div>

<div className="border-2 border-orange-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-orange-600 mb-4">4️⃣ Life Balance - Cân Bằng Cuộc Sống</h3>
<div className="space-y-4">
{['Work', 'Health', 'Relationships', 'Personal Growth', 'Finance', 'Fun & Recreation'].map((area, idx) => (
<div key={idx}>
<label className="block text-sm font-semibold mb-2">{area} - Mức độ hài lòng (0-10)</label>
<input
type="range"
min="0"
max="10"
value={personalAssessmentAnswers[`balance_${area.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`] || 0}
onChange={(e) => setPersonalAssessmentAnswers({...personalAssessmentAnswers, [`balance_${area.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`]: parseInt(e.target.value)})}
className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
/>
<div className="text-center text-xl font-bold text-orange-600">
{personalAssessmentAnswers[`balance_${area.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`] || 0}/10
</div>
</div>
))}
</div>
</div>

<div className="border-2 border-pink-200 rounded-lg p-6 bg-white shadow">
<h3 className="text-xl font-bold text-pink-600 mb-4">5️⃣ Personal Goals - Mục Tiêu Cá Nhân</h3>
<div className="space-y-4">
<div>
<label className="block text-sm font-semibold mb-2">3 mục tiêu lớn trong 1 năm tới</label>
<textarea
value={personalAssessmentAnswers['goals_1year'] || ''}
onChange={(e) => setPersonalAssessmentAnswers({...personalAssessmentAnswers, goals_1year: e.target.value})}
placeholder="1.
2.
3."
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Big Dream - Ước mơ lớn nhất trong đời</label>
<textarea
value={personalAssessmentAnswers['big_dream'] || ''}
onChange={(e) => setPersonalAssessmentAnswers({...personalAssessmentAnswers, big_dream: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>
<div>
<label className="block text-sm font-semibold mb-2">Điều gì đang ngăn cản bạn đạt ước mơ đó?</label>
<textarea
value={personalAssessmentAnswers['obstacles'] || ''}
onChange={(e) => setPersonalAssessmentAnswers({...personalAssessmentAnswers, obstacles: e.target.value})}
className="w-full p-3 border border-gray-300 rounded-lg resize-none"
rows="4"
/>
</div>
</div>
</div>

<div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
<h3 className="font-bold text-purple-800 mb-3">💡 Sử Dụng Personal Assessment:</h3>
<ul className="list-disc ml-6 space-y-2 text-sm">
<li>Dùng làm baseline để theo dõi tiến độ coaching</li>
<li>Xác định focus areas để coaching</li>
<li>Review lại sau 3-6 tháng để thấy sự thay đổi</li>
<li>Kết hợp với Wheel of Life để có cái nhìn tổng quan</li>
</ul>
</div>
</div>
);

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
].map((item, idx) => (
<div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition">
<span className="text-sm flex-1">{item.problem}</span>
<div className="flex items-center gap-2">
<span className="text-xs text-gray-500">{item.time}</span>
<span className={`bg-${item.color}-100 text-${item.color}-800 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap`}>
{item.tool}
</span>
</div>
</div>
))}
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

const renderWorksheet = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold mb-4">📝 Session Worksheet - Comprehensive</h2>

<div className="bg-gradient-to-r from-green-100 to-blue-100 border-l-4 border-green-500 p-4">
<p className="font-bold">Ghi chú toàn diện cho session - Bao gồm đánh giá, quan sát, red flags và kế hoạch</p>
</div>

<div className="border rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold mb-4">👤 Thông Tin Khách Hàng & Session</h3>
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

<div className="border rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold mb-4">📊 Tóm Tắt Đánh Giá</h3>
<div className="space-y-3 bg-gray-50 p-4 rounded">
<div className="flex justify-between">
<span className="font-semibold">Mức độ sẵn sàng (Nhanh):</span>
<span className="font-bold">{quickAssessment.readiness}/10</span>
</div>
<div className="flex justify-between">
<span className="font-semibold">Điểm sẵn sàng chi tiết:</span>
<span className="font-bold">{totalScore}/160 - {readiness.level}</span>
</div>
<div className="flex justify-between">
<span className="font-semibold">Cấp độ nghẽn chính:</span>
<span className="font-bold">{quickAssessment.stuckLevel || 'Chưa xác định'}</span>
</div>
<div className="flex justify-between">
<span className="font-semibold">Wheel of Life TB:</span>
<span className="font-bold">{(Object.values(wheelOfLife).reduce((sum, area) => sum + area.current, 0) / 8).toFixed(1)}/10</span>
</div>
<div className="flex justify-between">
<span className="font-semibold">Công cụ đề xuất:</span>
<span className="font-bold text-blue-600">{readiness.tools}</span>
</div>
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
].map((flag, idx) => (
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
<span className={`bg-${flag.color}-200 text-${flag.color}-900 px-2 py-1 rounded text-xs font-bold`}>
{flag.level}
</span>
</div>
))}
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

{/* NEW: Coach Observations */}
<div className="border rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold mb-4">👁️ Quan Sát Của Coach (Calibration)</h3>
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

<div className="border rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold mb-4">📝 Ghi Chú Session</h3>
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

<div className="border rounded-lg p-6 bg-white shadow">
<h3 className="text-lg font-bold mb-4">✅ Action Plan & Cam Kết</h3>
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

<div className="flex gap-3">
<button
onClick={() => {
const wheelAvg = (Object.values(wheelOfLife).reduce((sum, area) => sum + area.current, 0) / 8).toFixed(1);
const content = `# COACHING SESSION REPORT - COMPREHENSIVE
© Coach Sony Ho - All Rights Reserved

============================================
THÔNG TIN SESSION
============================================
Khách hàng: ${clientName || 'N/A'}
Ngày: ${sessionDate || 'N/A'}
Mục tiêu session: ${sessionGoal || 'N/A'}
Session tiếp theo: ${nextSessionDate || 'N/A'}

============================================
ĐÁNH GIÁ
============================================
Mức độ sẵn sàng (Nhanh): ${quickAssessment.readiness}/10
Điểm chi tiết: ${totalScore}/160 - ${readiness.level}
Cấp độ nghẽn: ${quickAssessment.stuckLevel || 'Chưa xác định'}
Wheel of Life TB: ${wheelAvg}/10
Công cụ đề xuất: ${readiness.tools}

============================================
RED FLAGS
============================================
${redFlags.length > 0 ? '⚠️ CÓ RED FLAGS:\n' + redFlags.map(f => `- ${f}`).join('\n') : '✅ Không có red flags nghiêm trọng'}
${redFlags.length > 0 ? '\n\n⚠️ HÀNH ĐỘNG: Xem xét chuyển tiếp chuyên gia phù hợp' : ''}

============================================
QUAN SÁT CỦA COACH
============================================
${coachObservations || 'Không có ghi chú'}

============================================
GHI CHÚ SESSION
============================================
${sessionNotes || 'Không có ghi chú'}

============================================
ACTION PLAN & CAM KẾT
============================================
${actionPlan.filter(a => a).map((a, i) => `${i + 1}. ${a}`).join('\n') || 'Không có action plan'}

============================================
ĐÁNH GIÁ CHI TIẾT WHEEL OF LIFE
============================================
${Object.entries(wheelAreas).map(([key, meta]) => 
`${meta.label}: ${wheelOfLife[key].current}/10
  Cần: ${wheelOfLife[key].needs || 'Chưa xác định'}`
).join('\n\n')}

============================================
© Coach Sony Ho - All Rights Reserved
Công cụ này chỉ dành cho coach được đào tạo
============================================
`.trim();

const blob = new Blob([content], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `coaching-report-${clientName || 'client'}-${sessionDate || 'date'}.txt`;
a.click();
URL.revokeObjectURL(url);
}}
className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
>
<Download className="w-5 h-5" />
Xuất Báo Cáo Đầy Đủ (.txt)
</button>

<button
onClick={() => window.print()}
className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
>
<FileText className="w-5 h-5" />
In Báo Cáo
</button>
</div>

{/* Best Practices Reminder */}
<div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-6">
<h3 className="text-lg font-bold text-blue-800 mb-3">📚 Best Practices - Lưu Ý Cuối</h3>
<div className="space-y-2 text-sm">
<p>✅ <strong>Follow-up:</strong> Email/SMS cảm ơn trong 24h, nhắc action plan</p>
<p>✅ <strong>Confidentiality:</strong> Bảo mật tuyệt đối thông tin khách hàng</p>
<p>✅ <strong>Boundaries:</strong> Giữ ranh giới nghề nghiệp, không làm therapist</p>
<p>✅ <strong>Self-care:</strong> Coach cũng cần nghỉ ngơi và nạp năng lượng</p>
<p>✅ <strong>Supervision:</strong> Thảo luận case khó với mentor/supervisor</p>
<p>✅ <strong>CPD:</strong> Học hỏi liên tục, cập nhật kỹ năng</p>
</div>
</div>
</div>
);

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
}).map(([key, meta]) => (
<div key={key} className={`border-2 border-${meta.color}-200 rounded-lg p-6 bg-white shadow`}>
<h3 className={`text-xl font-bold text-${meta.color}-600 mb-4`}>{meta.label}</h3>

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
<div className={`mt-4 p-3 bg-${meta.color}-50 rounded border-l-4 border-${meta.color}-500`}>
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
))}
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
}).map(([key, meta]) => (
<div key={key} className={`border-2 border-${meta.color}-200 rounded-lg p-6 bg-white shadow`}>
<div className="flex items-center justify-between mb-4">
<h3 className={`text-xl font-bold text-${meta.color}-600`}>
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

<div className={`mt-4 p-3 bg-${meta.color}-50 rounded`}>
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
))}
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

return (
<div className="min-h-screen bg-gray-50 flex">
{/* Sidebar */}
<div className="w-64 bg-white border-r border-gray-200 flex flex-col">
<div className="p-6 border-b border-gray-200">
<h2 className="text-xl font-bold text-gray-800">Coaching Tools</h2>
<p className="text-sm text-gray-500 mt-1">Enhanced v2.0</p>
</div>

<nav className="flex-1 p-4 space-y-1 overflow-y-auto">
{sections.map((section) => {
const Icon = section.icon;
return (
<button
key={section.id}
onClick={() => setActiveSection(section.id)}
className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
activeSection === section.id
? 'bg-blue-600 text-white'
: 'text-gray-700 hover:bg-gray-100'
}`}
>
<Icon className="w-5 h-5" />
<span className="text-sm font-medium">{section.name}</span>
</button>
);
})}
</nav>

<div className="p-4 border-t border-gray-200">
<div className="text-xs text-gray-500 text-center">
© Coach Sony Ho<br/>
All Rights Reserved
</div>
</div>
</div>

{/* Main Content */}
<div className="flex-1 overflow-auto">
<div className="p-8 max-w-5xl mx-auto">
{activeSection === 'home' && renderHome()}
{activeSection === 'personalhistory' && renderPersonalHistory()}
{activeSection === 'quick' && renderQuick()}
{activeSection === 'readiness' && renderReadiness()}
{activeSection === 'followup' && renderFollowUp()}
{activeSection === 'mapupdate' && renderMapUpdate()}
{activeSection === 'wheel' && renderWheelOfLife()}
{activeSection === 'som' && renderSOM()}
{activeSection === 'vakad' && renderVAKAD()}
{activeSection === 'personalcolor' && renderPersonalColor()}
{activeSection === 'personalassessment' && renderPersonalAssessment()}
{activeSection === 'worksheet' && renderWorksheet()}
</div>
</div>
</div>
);
};

window.CoachingAssessmentTool = CoachingAssessmentTool;
