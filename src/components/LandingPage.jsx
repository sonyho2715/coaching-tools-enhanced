import { useState } from 'react';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import {
  Brain,
  Target,
  BarChart3,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Clock,
  ChevronDown,
  ChevronUp,
  Heart,
  Sparkles,
  Award,
  TrendingUp,
  MessageCircle,
  Play
} from 'lucide-react';

// Navigation Component
const Navigation = ({ onScrollTo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CoachTools</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => onScrollTo('features')} className="text-gray-600 hover:text-gray-900 transition-colors">
              Tính Năng
            </button>
            <button onClick={() => onScrollTo('how-it-works')} className="text-gray-600 hover:text-gray-900 transition-colors">
              Cách Hoạt Động
            </button>
            <button onClick={() => onScrollTo('testimonials')} className="text-gray-600 hover:text-gray-900 transition-colors">
              Đánh Giá
            </button>
            <button onClick={() => onScrollTo('pricing')} className="text-gray-600 hover:text-gray-900 transition-colors">
              Bảng Giá
            </button>
            <button onClick={() => onScrollTo('faq')} className="text-gray-600 hover:text-gray-900 transition-colors">
              FAQ
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Đăng Nhập
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25">
                Dùng Thử Miễn Phí
              </button>
            </SignUpButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-0.5 bg-gray-600 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-gray-600 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-gray-600 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              <button onClick={() => { onScrollTo('features'); setMobileMenuOpen(false); }} className="text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Tính Năng</button>
              <button onClick={() => { onScrollTo('how-it-works'); setMobileMenuOpen(false); }} className="text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Cách Hoạt Động</button>
              <button onClick={() => { onScrollTo('testimonials'); setMobileMenuOpen(false); }} className="text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Đánh Giá</button>
              <button onClick={() => { onScrollTo('pricing'); setMobileMenuOpen(false); }} className="text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Bảng Giá</button>
              <button onClick={() => { onScrollTo('faq'); setMobileMenuOpen(false); }} className="text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">FAQ</button>
              <div className="flex gap-2 px-4 pt-3 border-t border-gray-100">
                <SignInButton mode="modal">
                  <button className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg font-medium">Đăng Nhập</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">Đăng Ký</button>
                </SignUpButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Hero Section
const HeroSection = () => (
  <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-blue-50 via-white to-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Công cụ đánh giá coaching chuyên nghiệp
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Nâng Tầm{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Buổi Coaching
            </span>{' '}
            Của Bạn
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
            Bộ công cụ đánh giá toàn diện giúp coach chuyên nghiệp hiểu sâu khách hàng,
            tăng hiệu quả buổi coaching và tạo ra kết quả đột phá.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <SignUpButton mode="modal">
              <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2">
                Bắt Đầu Miễn Phí
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </SignUpButton>
            <button className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              Xem Demo
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br ${
                    i === 1 ? 'from-pink-400 to-rose-400' :
                    i === 2 ? 'from-blue-400 to-indigo-400' :
                    i === 3 ? 'from-green-400 to-emerald-400' :
                    'from-orange-400 to-amber-400'
                  }`} />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">500+</span> coach đang sử dụng
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-gray-600 ml-1">4.9/5 đánh giá</span>
            </div>
          </div>
        </div>

        {/* Right - Visual */}
        <div className="relative lg:pl-8">
          <div className="relative">
            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Wheel of Life</h3>
                  <p className="text-sm text-gray-500">Đánh giá tổng quan cuộc sống</p>
                </div>
              </div>

              {/* Sample Chart */}
              <div className="relative w-full aspect-square max-w-xs mx-auto">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Background circles */}
                  {[20, 40, 60, 80, 100].map(r => (
                    <circle key={r} cx="100" cy="100" r={r * 0.8} fill="none" stroke="#e5e7eb" strokeWidth="1" />
                  ))}
                  {/* Radar polygon */}
                  <polygon
                    points="100,30 160,60 170,120 140,170 60,170 30,120 40,60"
                    fill="url(#gradient)"
                    fillOpacity="0.3"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                  {/* Data points */}
                  {[[100, 30], [160, 60], [170, 120], [140, 170], [60, 170], [30, 120], [40, 60]].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="5" fill="#3b82f6" />
                  ))}
                </svg>

                {/* Labels */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-xs font-medium text-gray-600">Sức Khỏe</div>
                <div className="absolute top-1/4 right-0 translate-x-2 text-xs font-medium text-gray-600">Sự Nghiệp</div>
                <div className="absolute bottom-1/4 right-0 translate-x-2 text-xs font-medium text-gray-600">Tài Chính</div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 text-xs font-medium text-gray-600">Gia Đình</div>
                <div className="absolute bottom-1/4 left-0 -translate-x-2 text-xs font-medium text-gray-600">Quan Hệ</div>
                <div className="absolute top-1/4 left-0 -translate-x-2 text-xs font-medium text-gray-600">Phát Triển</div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100 animate-bounce-slow">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tiến bộ</p>
                  <p className="text-sm font-bold text-green-600">+24%</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Khách hàng</p>
                  <p className="text-sm font-bold text-gray-900">1,234</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: Target,
      title: 'Wheel of Life',
      description: 'Đánh giá tổng quan 8 lĩnh vực cuộc sống, xác định điểm mạnh và điểm cần cải thiện.',
      color: 'blue'
    },
    {
      icon: Brain,
      title: 'VAK Assessment',
      description: 'Xác định phong cách học tập và giao tiếp của khách hàng (Visual, Auditory, Kinesthetic).',
      color: 'purple'
    },
    {
      icon: Zap,
      title: 'Meta Programs',
      description: 'Hiểu sâu patterns tư duy và hành vi để tùy chỉnh phương pháp coaching hiệu quả.',
      color: 'orange'
    },
    {
      icon: Heart,
      title: 'Values Hierarchy',
      description: 'Khám phá hệ thống giá trị cốt lõi để định hướng mục tiêu phù hợp với bản thân.',
      color: 'pink'
    },
    {
      icon: MessageCircle,
      title: 'Sleight of Mouth',
      description: 'Công cụ reframe niềm tin giới hạn thành niềm tin tích cực, mở ra khả năng mới.',
      color: 'green'
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Theo dõi tiến trình khách hàng qua các buổi coaching với báo cáo trực quan.',
      color: 'indigo'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    pink: 'bg-pink-100 text-pink-600',
    green: 'bg-green-100 text-green-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Tính năng mạnh mẽ
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Công Cụ Đánh Giá Toàn Diện
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bộ công cụ được thiết kế dành riêng cho coach chuyên nghiệp,
            giúp bạn hiểu khách hàng sâu sắc hơn và tạo ra kết quả đột phá.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100"
            >
              <div className={`w-14 h-14 rounded-xl ${colorClasses[feature.color]} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const steps = [
    {
      step: '01',
      title: 'Đăng Ký Tài Khoản',
      description: 'Tạo tài khoản miễn phí chỉ trong 30 giây. Không cần thẻ tín dụng.',
      icon: Users
    },
    {
      step: '02',
      title: 'Thêm Khách Hàng',
      description: 'Tạo hồ sơ khách hàng và bắt đầu đánh giá với các công cụ có sẵn.',
      icon: Target
    },
    {
      step: '03',
      title: 'Tiến Hành Đánh Giá',
      description: 'Sử dụng các công cụ đánh giá để hiểu sâu nhu cầu và tiềm năng khách hàng.',
      icon: Brain
    },
    {
      step: '04',
      title: 'Theo Dõi Tiến Trình',
      description: 'Xem báo cáo trực quan, theo dõi tiến bộ và điều chỉnh phương pháp coaching.',
      icon: BarChart3
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
            <CheckCircle className="w-4 h-4" />
            Dễ dàng sử dụng
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cách Hoạt Động
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chỉ 4 bước đơn giản để bắt đầu nâng cao chất lượng buổi coaching của bạn.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent z-0" />
              )}

              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-sm font-bold text-blue-600 mb-2">Bước {item.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Nguyễn Minh Tâm',
      role: 'Life Coach, Hà Nội',
      image: null,
      content: 'Công cụ này đã thay đổi hoàn toàn cách tôi tiến hành buổi coaching. Khách hàng của tôi đạt kết quả nhanh hơn gấp 2 lần.',
      rating: 5
    },
    {
      name: 'Trần Thị Hương',
      role: 'Executive Coach, TP.HCM',
      image: null,
      content: 'Wheel of Life và Meta Programs giúp tôi hiểu khách hàng doanh nhân sâu sắc hơn. ROI coaching tăng rõ rệt.',
      rating: 5
    },
    {
      name: 'Lê Văn Đức',
      role: 'NLP Coach, Đà Nẵng',
      image: null,
      content: 'Sleight of Mouth trong app này là tuyệt vời! Giúp tôi reframe niềm tin giới hạn của khách hàng hiệu quả hơn nhiều.',
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            Đánh giá từ người dùng
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Coach Nói Gì Về Chúng Tôi
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hàng trăm coach chuyên nghiệp đã tin tưởng sử dụng công cụ của chúng tôi.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing Section
const PricingSection = () => {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: 'Miễn Phí',
      price: { monthly: 0, annual: 0 },
      description: 'Dành cho coach mới bắt đầu',
      features: [
        'Wheel of Life',
        'Readiness Assessment',
        'Session Notes',
        '3 khách hàng',
        'Export PDF cơ bản'
      ],
      cta: 'Bắt Đầu Ngay',
      popular: false
    },
    {
      name: 'Professional',
      price: { monthly: 19, annual: 190 },
      description: 'Dành cho coach chuyên nghiệp',
      features: [
        'Tất cả tính năng Free',
        'VAK Assessment',
        'Personal History Check',
        'Values Hierarchy',
        'Không giới hạn khách hàng',
        'Export PDF nâng cao',
        'Analytics Dashboard'
      ],
      cta: 'Nâng Cấp Ngay',
      popular: true
    },
    {
      name: 'Pro',
      price: { monthly: 49, annual: 490 },
      description: 'Dành cho coach cao cấp',
      features: [
        'Tất cả tính năng Professional',
        'Meta Programs',
        'Sleight of Mouth',
        'Spiral Dynamics',
        'Timeline Therapy Tools',
        'Team Management',
        'Priority Support',
        'Custom Branding'
      ],
      cta: 'Liên Hệ Tư Vấn',
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            <Award className="w-4 h-4" />
            Bảng giá linh hoạt
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Chọn Gói Phù Hợp Với Bạn
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Bắt đầu miễn phí, nâng cấp khi cần. Không có chi phí ẩn.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                !annual ? 'bg-white shadow text-gray-900' : 'text-gray-600'
              }`}
            >
              Hàng Tháng
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                annual ? 'bg-white shadow text-gray-900' : 'text-gray-600'
              }`}
            >
              Hàng Năm
              <span className="ml-2 text-xs text-green-600 font-bold">-17%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-xl scale-105'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 text-sm font-bold rounded-full">
                  Phổ Biến Nhất
                </div>
              )}

              <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-6 ${plan.popular ? 'text-blue-100' : 'text-gray-500'}`}>
                {plan.description}
              </p>

              <div className="mb-6">
                <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  ${annual ? plan.price.annual : plan.price.monthly}
                </span>
                <span className={plan.popular ? 'text-blue-100' : 'text-gray-500'}>
                  /{annual ? 'năm' : 'tháng'}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      plan.popular ? 'text-blue-200' : 'text-green-500'
                    }`} />
                    <span className={plan.popular ? 'text-blue-50' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <SignUpButton mode="modal">
                <button className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}>
                  {plan.cta}
                </button>
              </SignUpButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// FAQ Section
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'Tôi có thể dùng thử miễn phí không?',
      answer: 'Có, gói Free hoàn toàn miễn phí và không giới hạn thời gian. Bạn có thể sử dụng các công cụ cơ bản như Wheel of Life, Readiness Assessment với tối đa 3 khách hàng.'
    },
    {
      question: 'Dữ liệu khách hàng của tôi có được bảo mật không?',
      answer: 'Chúng tôi sử dụng mã hóa SSL và tuân thủ các tiêu chuẩn bảo mật cao nhất. Dữ liệu của bạn được lưu trữ an toàn và chỉ bạn mới có quyền truy cập.'
    },
    {
      question: 'Tôi có thể hủy đăng ký bất cứ lúc nào không?',
      answer: 'Có, bạn có thể hủy đăng ký bất cứ lúc nào. Không có ràng buộc hợp đồng hay phí hủy. Tài khoản sẽ chuyển về gói Free sau khi hết hạn thanh toán.'
    },
    {
      question: 'Có hỗ trợ tiếng Việt không?',
      answer: 'Có, toàn bộ giao diện và công cụ đều hỗ trợ tiếng Việt đầy đủ. Đội ngũ hỗ trợ của chúng tôi cũng có thể tư vấn bằng tiếng Việt.'
    },
    {
      question: 'Làm sao để nâng cấp gói?',
      answer: 'Bạn có thể nâng cấp gói bất cứ lúc nào từ trang Settings trong ứng dụng. Phần chênh lệch sẽ được tính pro-rata cho thời gian còn lại của gói hiện tại.'
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <MessageCircle className="w-4 h-4" />
            Câu hỏi thường gặp
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            FAQ
          </h2>
          <p className="text-lg text-gray-600">
            Những câu hỏi chúng tôi thường nhận được.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => (
  <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
        Sẵn Sàng Nâng Tầm Coaching Của Bạn?
      </h2>
      <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
        Tham gia cùng hàng trăm coach chuyên nghiệp đã tin tưởng sử dụng công cụ của chúng tôi.
      </p>
      <SignUpButton mode="modal">
        <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-xl inline-flex items-center gap-2">
          Bắt Đầu Miễn Phí Ngay
          <ArrowRight className="w-5 h-5" />
        </button>
      </SignUpButton>
      <p className="mt-4 text-blue-200 text-sm">
        Không cần thẻ tín dụng. Dùng thử miễn phí mãi mãi.
      </p>
    </div>
  </section>
);

// Footer
const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-8 mb-12">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CoachTools</span>
          </div>
          <p className="text-gray-400 max-w-md mb-6">
            Công cụ đánh giá coaching chuyên nghiệp giúp bạn hiểu khách hàng sâu sắc hơn
            và tạo ra kết quả đột phá.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Sản Phẩm</h4>
          <ul className="space-y-2">
            <li><a href="#features" className="hover:text-white transition-colors">Tính Năng</a></li>
            <li><a href="#pricing" className="hover:text-white transition-colors">Bảng Giá</a></li>
            <li><a href="#" className="hover:text-white transition-colors">API</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Hỗ Trợ</h4>
          <ul className="space-y-2">
            <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Liên Hệ</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Điều Khoản</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Bảo Mật</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} CoachTools by Sony Ho. All rights reserved.
        </p>
        <p className="text-sm mt-2 md:mt-0">
          Made with <Heart className="w-4 h-4 inline text-red-500" /> in Vietnam
        </p>
      </div>
    </div>
  </footer>
);

// Main Landing Page Component
export default function LandingPage() {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation onScrollTo={scrollTo} />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
