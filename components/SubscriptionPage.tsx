import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import {
  CheckCircle2, ArrowLeft, Sparkles, Zap, Award, Globe,
  CreditCard, Shield, Clock, ArrowRight
} from 'lucide-react';
import BizCaseLogo from './BizCaseLogo';
import DarkModeToggle from './DarkModeToggle';
import { useLanguage } from '../contexts/LanguageContext';
import SettingsMenu from './SettingsMenu';
import { useAuth } from '../contexts/AuthContext';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f172a]">
      {/* Header */}
      <header className={`w-full bg-white dark:bg-[#1e293b] border-b border-[#E6E9EF] dark:border-[#334155] sticky top-0 z-40 transition-all duration-200 ${isScrolled ? 'bg-[#F8F9FB]/90 dark:bg-[#0f172a]/90 backdrop-blur-md shadow-sm py-3' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate('/home')}
            >
              <BizCaseLogo size="md" showText={true} />
            </div>
            <div className="flex items-center space-x-3">
              <DarkModeToggle />
              <button
                onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
                className="flex items-center space-x-2 px-3 py-2 bg-[#1F4AA8] dark:bg-[#4C86FF] text-white rounded-xl hover:bg-[#153A73] dark:hover:bg-[#1F4AA8] transition-all text-sm font-medium shadow-sm hover:shadow-md"
              >
                <Globe className="w-4 h-4" />
                <span>{language === 'vi' ? 'VI' : 'EN'}</span>
              </button>
              {user && <SettingsMenu user={user} />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center space-x-2 text-[#737373] hover:text-[#1F4AA8] transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{language === 'vi' ? 'Quay lại' : 'Back'}</span>
        </button>

        {/* Hero Section with Highlight */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F4AA8] via-[#4C86FF] to-[#1F4AA8] rounded-3xl opacity-10 dark:opacity-20 blur-3xl"></div>
          <div className="relative bg-gradient-to-br from-[#1F4AA8] to-[#153A73] rounded-3xl p-12 text-white shadow-2xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <span className="text-sm font-semibold">✨ {language === 'vi' ? 'Gói Premium' : 'Premium Plan'}</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                {language === 'vi' ? 'Nâng Cấp Tài Khoản' : 'Upgrade Your Account'}
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-6">
                {language === 'vi'
                  ? 'Mở khóa toàn bộ tính năng premium và nâng cao kỹ năng giải case của bạn'
                  : 'Unlock all premium features and elevate your case-solving skills'}
              </p>
              <div className="flex items-center justify-center space-x-2 text-3xl font-bold">
                <span>$20</span>
                <span className="text-lg text-white/70">/{language === 'vi' ? 'tháng' : 'month'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pricing Card */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#1e293b] border-2 border-[#1F4AA8] dark:border-[#4C86FF] rounded-2xl shadow-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1F4AA8]/10 dark:bg-[#4C86FF]/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
              <div className="relative z-10">
              <div className="mb-8">
                <div className="inline-block bg-[#E6F0FF] dark:bg-[#1F4AA8]/20 px-3 py-1 rounded-full mb-4">
                  <span className="text-sm font-semibold text-[#1F4AA8] dark:text-[#4C86FF]">
                    {language === 'vi' ? '⭐ Gói Phổ Biến Nhất' : '⭐ Most Popular'}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-[#1F4AA8] dark:text-[#4C86FF] mb-4">
                  {language === 'vi' ? 'Gói Premium' : 'Premium Plan'}
                </h2>
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-6xl font-bold text-[#1F4AA8] dark:text-[#4C86FF]">$20</span>
                  <span className="text-xl text-[#737373] dark:text-[#94a3b8]">/{language === 'vi' ? 'tháng' : 'month'}</span>
                </div>
                <p className="text-[#737373] dark:text-[#94a3b8] mt-2">
                  {language === 'vi' ? 'Thanh toán hàng tháng, hủy bất cứ lúc nào' : 'Billed monthly, cancel anytime'}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {[
                  language === 'vi' ? 'Truy cập không giới hạn vào tất cả case studies' : 'Unlimited access to all case studies',
                  language === 'vi' ? 'Chatbot Lumi với tính năng nâng cao' : 'Lumi chatbot with advanced features',
                  language === 'vi' ? 'Analysis Dashboard chi tiết và real-time' : 'Detailed real-time analysis dashboard',
                  language === 'vi' ? 'PDF processing và document analysis' : 'PDF processing and document analysis',
                  language === 'vi' ? 'Learning path được cá nhân hóa' : 'Personalized learning paths',
                  language === 'vi' ? 'Priority support từ team' : 'Priority support from our team',
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-[#F8F9FB] dark:bg-[#0f172a] rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-[#1F4AA8] dark:text-[#4C86FF] flex-shrink-0" />
                    <span className="text-[#2E2E2E] dark:text-[#e2e8f0] font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Stripe Payment Form */}
              <Elements stripe={stripePromise}>
                <CheckoutForm 
                  priceId={import.meta.env.VITE_STRIPE_PRICE_ID || 'price_placeholder'}
                  language={language}
                />
              </Elements>
            </div>
          </div>

          {/* Benefits Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1e293b] border border-[#E6E9EF] dark:border-[#334155] rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#1F4AA8] dark:text-[#4C86FF] mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-[#153A73] dark:text-[#1F4AA8]" />
                {language === 'vi' ? 'Bảo Mật' : 'Security'}
              </h3>
              <p className="text-sm text-[#737373] dark:text-[#94a3b8]">
                {language === 'vi'
                  ? 'Thanh toán được xử lý an toàn bởi Stripe. Chúng tôi không lưu trữ thông tin thẻ tín dụng của bạn.'
                  : 'Payments are securely processed by Stripe. We do not store your credit card information.'}
              </p>
            </div>

            <div className="bg-white dark:bg-[#1e293b] border border-[#E6E9EF] dark:border-[#334155] rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#1F4AA8] dark:text-[#4C86FF] mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-[#153A73] dark:text-[#1F4AA8]" />
                {language === 'vi' ? 'Hủy Bất Cứ Lúc Nào' : 'Cancel Anytime'}
              </h3>
              <p className="text-sm text-[#737373] dark:text-[#94a3b8]">
                {language === 'vi'
                  ? 'Không có ràng buộc dài hạn. Hủy subscription của bạn bất cứ lúc nào trong settings.'
                  : 'No long-term commitment. Cancel your subscription anytime in settings.'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#1F4AA8] to-[#153A73] rounded-2xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                {language === 'vi' ? 'Bắt Đầu Ngay' : 'Start Now'}
              </h3>
              <p className="text-sm text-white/90 mb-4">
                {language === 'vi'
                  ? 'Truy cập ngay vào tất cả tính năng premium sau khi thanh toán thành công.'
                  : 'Get immediate access to all premium features after successful payment.'}
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <Zap className="w-4 h-4" />
                <span>{language === 'vi' ? 'Kích hoạt tức thì' : 'Instant activation'}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Checkout Form Component
const CheckoutForm: React.FC<{ priceId: string; language: string }> = ({ priceId, language }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // Create payment intent on mount
    // In production, this should call your backend API
    // For now, we'll use a placeholder
    const createPaymentIntent = async () => {
      try {
        // This should be replaced with actual backend API call
        // const response = await fetch('/api/create-subscription', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ priceId }),
        // });
        // const { clientSecret } = await response.json();
        // setClientSecret(clientSecret);
        
        // Placeholder - in production, get this from your backend
        setClientSecret('placeholder_secret');
      } catch (err) {
        setError('Failed to initialize payment');
      }
    };

    createPaymentIntent();
  }, [priceId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found');
      setIsProcessing(false);
      return;
    }

    try {
      // In production, this should call your backend to create a subscription
      // For demo purposes, we'll simulate a successful payment
      
      // Actual Stripe subscription creation should be:
      // const { error: submitError } = await stripe.confirmCardPayment(clientSecret, {
      //   payment_method: {
      //     card: cardElement,
      //   },
      // });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate to success page or update user subscription status
      navigate('/home?subscription=success');
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#2E2E2E',
        fontFamily: 'Inter, system-ui, sans-serif',
        '::placeholder': {
          color: '#a3a3a3',
        },
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-[#E6E9EF] rounded-xl p-4 bg-[#F8F9FB]">
        <div className="flex items-center space-x-2 mb-3">
          <CreditCard className="w-5 h-5 text-[#1F4AA8]" />
          <span className="font-semibold text-[#1F4AA8]">
            {language === 'vi' ? 'Thông Tin Thanh Toán' : 'Payment Information'}
          </span>
        </div>
        <CardElement options={cardElementOptions} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full px-8 py-5 bg-gradient-to-r from-[#1F4AA8] to-[#4C86FF] dark:from-[#4C86FF] dark:to-[#1F4AA8] text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>{language === 'vi' ? 'Đang xử lý...' : 'Processing...'}</span>
          </>
        ) : (
          <>
            <span>{language === 'vi' ? 'Thanh Toán $20/Tháng' : 'Subscribe $20/Month'}</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      <p className="text-xs text-center text-[#737373]">
        {language === 'vi'
          ? 'Bằng cách thanh toán, bạn đồng ý với Điều khoản Dịch vụ và Chính sách Bảo mật của chúng tôi.'
          : 'By subscribing, you agree to our Terms of Service and Privacy Policy.'}
      </p>
    </form>
  );
};

export default SubscriptionPage;

