import * as Icons from '../icons';

const {
  Home,
  CheckCircle,
  Target,
  Map,
  FileText,
  BarChart3,
  Circle,
  TrendingUp,
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
  Flag,
  ClipboardList
} = Icons;

export const sections = [
  // === ĐIỀU HƯỚNG ===
  { id: 'home', name: '🏠 Trang Chủ', icon: Home },
  { id: 'sessiontimer', name: '⏱️ Session Timer', icon: Clock },

  // === TRONG BUỔI COACHING ===
  { id: 'problemidentifier', name: '🔍 1. Xác Định Vấn Đề', icon: Search },
  { id: 'toolrecommender', name: '💡 2. Gợi Ý Công Cụ', icon: Lightbulb },
  { id: 'sessionnotes', name: '📝 3. Ghi Chú Buổi', icon: BookOpen },

  // === BƯỚC 1: TIẾP ĐÓN KHÁCH HÀNG ===
  { id: 'personalhistory', name: '📋 Tiểu Sử Cá Nhân', icon: FileText },
  { id: 'readiness', name: '✅ Đánh Giá Sẵn Sàng', icon: CheckCircle },

  // === BƯỚC 2: ĐÁNH GIÁ BAN ĐẦU ===
  { id: 'wheel', name: '⭕ Bánh Xe Cuộc Đời', icon: Circle },
  { id: 'som', name: '🎯 Công Cụ SOM', icon: Target },

  // === BƯỚC 3: PHONG CÁCH HỌC TẬP ===
  { id: 'vakad', name: '👁️ Công Cụ VAKAD', icon: BarChart3 },
  { id: 'personalcolor', name: '🎨 Màu Sắc Cá Nhân', icon: Circle },

  // === BƯỚC 4: TƯ DUY & THẾ GIỚI QUAN ===
  { id: 'spiraldynamics', name: '🌀 Cấp Độ Tồn Tại', icon: TrendingUp },
  { id: 'metaprograms', name: '🧠 Meta-Programs NLP', icon: BarChart3 },

  // === BƯỚC 5: LÀM VIỆC CHUYÊN SÂU ===
  { id: 'values', name: '❤️ Values Hierarchy', icon: Heart },
  { id: 'beliefs', name: '🧠 Limiting Beliefs', icon: Brain },
  { id: 'energy', name: '⚡ Energy Audit', icon: Zap },
  { id: 'goals', name: '🎯 SMART Goals', icon: Flag },

  // === BƯỚC 6: KỸ THUẬT NLP ===
  { id: 'reframing', name: '🔄 Reframing Toolkit', icon: Layers },
  { id: 'anchoring', name: '⚓ Anchoring Guide', icon: Anchor },
  { id: 'timeline', name: '⏳ Timeline Therapy', icon: Activity },

  // === BƯỚC 7: KẾ HOẠCH HÀNH ĐỘNG ===
  { id: 'mapupdate', name: '🗺️ Map Update', icon: Map },

  // === TÀI NGUYÊN HỖ TRỢ ===
  { id: 'questions', name: '❓ Question Library', icon: HelpCircle },
  { id: 'email', name: '📧 Email Templates', icon: Mail },

  // === THEO DÕI & BÁO CÁO ===
  { id: 'followup', name: '📈 Buổi Theo Dõi', icon: TrendingUp },
  { id: 'analytics', name: '📊 Analytics Dashboard', icon: BarChart3 },
  { id: 'worksheet', name: '📄 Bảng Tổng Hợp', icon: ClipboardList }
];
