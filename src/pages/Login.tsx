import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  Database, 
  Warehouse, 
  ShieldCheck, 
  ArrowRight, 
  Package, 
  MapPin,
  UserCircle2,
  Crown,
  Settings,
  DollarSign,
  Users,
  TrendingUp,
  Headphones,
  Store,
  User,
  Shield,
  BarChart3,
  CreditCard,
  MessageSquare,
  Megaphone,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  Globe,
  Cpu,
  Wifi,
  Activity,
  Languages,
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { ROUTE_PATHS, USER_ROLES, UserRole } from '@/lib/index';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

// Language type
type Language = 'en' | 'my';
type AuthMode = 'login' | 'signup' | 'forgot' | 'verify' | 'reset';

// Translations object
const translations = {
  en: {
    // Branding
    brandName: 'BRITIUM EXPRESS',
    brandSubtitle: 'Delivery System',
    brandTagline: 'BRITIUM EXPRESS, YOUR FAST AND TRUSTWORTHY PARTNER',
    
    // Auth Modes
    signIn: 'SIGN IN',
    signUp: 'SIGN UP',
    forgotPassword: 'FORGOT PASSWORD',
    resetPassword: 'RESET PASSWORD',
    verifyEmail: 'VERIFY EMAIL',
    
    // Header
    tagline: 'CYBER LUXURY EXPRESS DELIVERY SYSTEM',
    description: 'Next-Generation Authentication Portal with Ultra-Modern Role-Based Access Control',
    
    // Role Selection
    roleSelectionTitle: 'ROLE SELECTION PORTAL',
    roleSelectionDesc: 'Choose your access level to enter the secure cyber environment',
    
    // Tabs
    operations: 'OPERATIONS',
    administration: 'ADMINISTRATION',
    businessUsers: 'BUSINESS USERS',
    
    // Tab Descriptions
    operationalRoles: 'OPERATIONAL ROLES',
    operationalDesc: 'SOP-based logistics and delivery operations',
    adminRoles: 'ADMINISTRATION & MANAGEMENT',
    adminDesc: 'System control, user management, and authority assignment',
    businessRoles: 'BUSINESS & CUSTOMER PORTALS',
    businessDesc: 'Merchant services, customer support, and business intelligence',
    
    // Auth Form Fields
    email: 'EMAIL ADDRESS',
    username: 'USERNAME',
    password: 'PASSWORD',
    confirmPassword: 'CONFIRM PASSWORD',
    fullName: 'FULL NAME',
    phoneNumber: 'PHONE NUMBER',
    companyName: 'COMPANY NAME',
    
    // Placeholders
    enterEmail: 'Enter your email address',
    enterUsername: 'Enter username',
    enterPassword: 'Enter password',
    confirmPasswordPlaceholder: 'Confirm your password',
    enterFullName: 'Enter your full name',
    enterPhone: 'Enter phone number',
    enterCompany: 'Enter company name (optional)',
    
    // Buttons
    signInButton: 'SIGN IN TO PORTAL',
    signUpButton: 'CREATE ACCOUNT',
    sendResetLink: 'SEND RESET LINK',
    resetPasswordButton: 'RESET PASSWORD',
    verifyEmailButton: 'VERIFY EMAIL',
    resendCode: 'RESEND CODE',
    backToLogin: 'BACK TO LOGIN',
    
    // Auth Messages
    signingIn: 'SIGNING IN...',
    creatingAccount: 'CREATING ACCOUNT...',
    sendingReset: 'SENDING RESET LINK...',
    verifying: 'VERIFYING...',
    
    // Links
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    forgotPasswordLink: 'Forgot your password?',
    
    // Verification
    verificationTitle: 'EMAIL VERIFICATION REQUIRED',
    verificationDesc: 'We sent a verification code to your email address. Please enter the code below.',
    verificationCode: 'VERIFICATION CODE',
    enterCode: 'Enter 6-digit code',
    
    // Reset Password
    resetTitle: 'RESET YOUR PASSWORD',
    resetDesc: 'Enter your email address and we will send you a reset link.',
    resetSuccessTitle: 'RESET LINK SENT',
    resetSuccessDesc: 'Check your email for password reset instructions.',
    
    // Temporary Password
    tempPasswordTitle: 'TEMPORARY PASSWORD DETECTED',
    tempPasswordDesc: 'You must change your password before accessing the system.',
    newPassword: 'NEW PASSWORD',
    mustChangePassword: 'Password change is mandatory for security.',
    
    // Role Names and Descriptions
    roles: {
      // Removed APP_OWNER as requested
      SUPER_ADMIN: { name: 'Super Administrator', desc: 'Platform Management & User Control' },
      FINANCE_ADMIN: { name: 'Finance Administrator', desc: 'Revenue, Payments & Merchant Operations' },
      OPERATIONS_ADMIN: { name: 'Operations Administrator', desc: 'Logistics & Warehouse Control Center' },
      MARKETING_ADMIN: { name: 'Marketing Administrator', desc: 'Growth, Campaigns & Customer Engagement' },
      CUSTOMER_SERVICE_ADMIN: { name: 'Service Administrator', desc: 'Customer Experience & Support Quality' },
      RDR: { name: 'Rider/Courier', desc: '(စက်ဘီး/ဆိုင်ကယ်ဖြင့်ကုန်ပစ္စည်းပို့ဆောင်သူ/ မော်တော်ယာဉ်ဖြင့် ပို့ဆောင်သူ)' },
      DES: { name: 'Data Entry Specialist', desc: 'အချက်အလက်ရေးသွင်းသူ' },
      WH: { name: 'Warehouse Manager', desc: 'Receiving & Dispatch Operations' },
      SUP: { name: 'Operations Supervisor', desc: 'Audit, Inventory & Quality Control' },
      SSM: { name: 'Substation Manager', desc: 'ရုံးခွဲမန်နေဂျာ' },
      SSR: { name: 'Last Mile Specialist', desc: 'လမ်းကြောင်းကျွမ်းကျင်သူ' },
      MERCHANT: { name: 'Merchant Portal', desc: 'Enterprise Shipping & Analytics Dashboard' },
      CUSTOMER: { name: 'Customer Portal', desc: 'Package Tracking & Support Services' },
      MARKETING: { name: 'Marketing Manager', desc: 'Campaign Management & Growth Analytics' },
      CUSTOMER_SERVICE: { name: 'Customer Service', desc: 'Live Chat, Tickets & Customer Support' },
      FINANCE_USER: { name: 'Finance User', desc: 'Payment Processing & Financial Reports' },
      ANALYST: { name: 'Business Analyst', desc: 'Data Intelligence & Performance Insights' }
    },
    
    // Footer
    copyright: '© 2026 BRITIUM EXPRESS GLOBAL ENTERPRISE',
    version: 'v3.0.0-PRODUCTION',
    securePortal: 'SECURE PORTAL',
    securityPolicy: 'SECURITY POLICY',
    enterpriseSupport: 'ENTERPRISE SUPPORT',
    documentation: 'DOCUMENTATION',
    
    // Error Messages
    invalidCredentials: 'Invalid email or password',
    emailRequired: 'Email address is required',
    passwordRequired: 'Password is required',
    passwordMismatch: 'Passwords do not match',
    weakPassword: 'Password must be at least 8 characters',
    invalidEmail: 'Please enter a valid email address',
    accountExists: 'Account already exists with this email',
    accountNotFound: 'No account found with this email',
    verificationFailed: 'Invalid verification code',
    
    // Success Messages
    accountCreated: 'Account created successfully',
    passwordReset: 'Password reset successfully',
    emailVerified: 'Email verified successfully',
    
    // Badges
    badges: {
      ADMIN: 'ADMIN',
      FINANCE: 'FINANCE',
      OPS: 'OPS',
      MARKETING: 'MARKETING',
      SERVICE: 'SERVICE',
      BUSINESS: 'BUSINESS',
      CUSTOMER: 'CUSTOMER',
      GROWTH: 'GROWTH',
      SUPPORT: 'SUPPORT',
      ANALYTICS: 'ANALYTICS'
    }
  },
  my: {
    // Branding
    brandName: 'BRITIUM EXPRESS',
    brandSubtitle: 'သယ်ယူပို့ဆောင်ရေးဝန်ဆောင်မှုစနစ်',
    brandTagline: 'BRITIUM EXPRESS, မြန်ဆန်စိတ်ချရသော သင့်၏အဖော်မွန်',
    
    // Auth Modes
    signIn: 'အကောင့်ဝင်ရောက်ခြင်း',
    signUp: 'အကောင့်ဖွင့်ခြင်း',
    forgotPassword: 'စကားဝှက် မေ့နေခြင်း',
    resetPassword: 'စကားဝှက် ပြန်လည်သတ်မှတ်ခြင်း',
    verifyEmail: 'အီးမေးလ် အတည်ပြုခြင်း',
    
    // Header
    tagline: 'ဆိုင်ဘာ လူဇရီ အမြန်ပို့ဆောင်ရေး စနစ်',
    description: 'ခေတ်မီ အခန်းကဏ္ဍအခြေခံ ထိန်းချုပ်မှုဖြင့် နောက်ဆုံးမျိုးဆက် အထောက်အထား စိစစ်ရေး ပေါ်တယ်',
    
    // Role Selection
    roleSelectionTitle: 'အခန်းကဏ္ဍ ရွေးချယ်ရေး ပေါ်တယ်',
    roleSelectionDesc: 'လုံခြုံသော ဆိုင်ဘာ ပတ်ဝန်းကျင်သို့ ဝင်ရောက်ရန် သင့်အသုံးပြုခွင့်အဆင့်ကို ရွေးချယ်ပါ',
    
    // Tabs
    operations: 'လုပ်ငန်းများ',
    administration: 'စီမံခန့်ခွဲမှု',
    businessUsers: 'စီးပွားရေး အသုံးပြုသူများ',
    
    // Tab Descriptions
    operationalRoles: 'လုပ်ငန်း အခန်းကဏ္ဍများ',
    operationalDesc: 'SOP အခြေခံ လော်ဂျစ်တစ် နှင့် ပို့ဆောင်ရေး လုပ်ငန်းများ',
    adminRoles: 'စီမံခန့်ခွဲမှု နှင့် ကြီးကြပ်မှု',
    adminDesc: 'စနစ်ထိန်းချုပ်မှု၊ အသုံးပြုသူ စီမံခန့်ခွဲမှု နှင့် အခွင့်အာဏာ ခွဲဝေမှု',
    businessRoles: 'စီးပွားရေး နှင့် ဖောက်သည် ပေါ်တယ်များ',
    businessDesc: 'ကုန်သည် ဝန်ဆောင်မှုများ၊ ဖောက်သည် ပံ့ပိုးမှု နှင့် စီးပွားရေး ဉာဏ်ရည်',
    
    // Auth Form Fields
    email: 'အီးမေးလ် လိပ်စာ',
    username: 'အသုံးပြုသူအမည်',
    password: 'စကားဝှက်',
    confirmPassword: 'စကားဝှက် အတည်ပြုခြင်း',
    fullName: 'အမည်အပြည့်အစုံ',
    phoneNumber: 'ဖုန်းနံပါတ်',
    companyName: 'ကုမ္ပဏီအမည်',
    
    // Placeholders
    enterEmail: 'သင့်အီးမေးလ် လိပ်စာ ရိုက်ထည့်ပါ',
    enterUsername: 'အသုံးပြုသူအမည် ရိုက်ထည့်ပါ',
    enterPassword: 'စကားဝှက် ရိုက်ထည့်ပါ',
    confirmPasswordPlaceholder: 'စကားဝှက်ကို အတည်ပြုပါ',
    enterFullName: 'သင့်အမည်အပြည့်အစုံ ရိုက်ထည့်ပါ',
    enterPhone: 'ဖုန်းနံပါတ် ရိုက်ထည့်ပါ',
    enterCompany: 'ကုမ္ပဏီအမည် ရိုက်ထည့်ပါ (ရွေးချယ်ခွင့်)',
    
    // Buttons
    signInButton: 'ပေါ်တယ်သို့ ဝင်ရောက်ပါ',
    signUpButton: 'အကောင့် ဖန်တီးပါ',
    sendResetLink: 'ပြန်လည်သတ်မှတ်ရေး လင့်ခ် ပို့ပါ',
    resetPasswordButton: 'စကားဝှက် ပြန်လည်သတ်မှတ်ပါ',
    verifyEmailButton: 'အီးမေးလ် အတည်ပြုပါ',
    resendCode: 'ကုဒ် ပြန်ပို့ပါ',
    backToLogin: 'အကောင့်ဝင်ရောက်ခြင်းသို့ ပြန်သွားပါ',
    
    // Auth Messages
    signingIn: 'အကောင့်ဝင်နေသည်...',
    creatingAccount: 'အကောင့်ဖန်တီးနေသည်...',
    sendingReset: 'ပြန်လည်သတ်မှတ်ရေး လင့်ခ် ပို့နေသည်...',
    verifying: 'အတည်ပြုနေသည်...',
    
    // Links
    noAccount: 'အကောင့်မရှိသေးဘူးလား?',
    hasAccount: 'အကောင့်ရှိပြီးသားလား?',
    forgotPasswordLink: 'စကားဝှက် မေ့နေပါသလား?',
    
    // Verification
    verificationTitle: 'အီးမေးလ် အတည်ပြုခြင်း လိုအပ်သည်',
    verificationDesc: 'သင့်အီးမေးလ် လိပ်စာသို့ အတည်ပြုကုဒ် ပို့ပေးပြီးပါပြီ။ အောက်တွင် ကုဒ်ကို ရိုက်ထည့်ပါ။',
    verificationCode: 'အတည်ပြုကုဒ်',
    enterCode: '၆ လုံး ကုဒ် ရိုက်ထည့်ပါ',
    
    // Reset Password
    resetTitle: 'သင့်စကားဝှက်ကို ပြန်လည်သတ်မှတ်ပါ',
    resetDesc: 'သင့်အီးမေးလ် လိပ်စာကို ရိုက်ထည့်ပါ၊ ပြန်လည်သတ်မှတ်ရေး လင့်ခ် ပို့ပေးပါမည်။',
    resetSuccessTitle: 'ပြန်လည်သတ်မှတ်ရေး လင့်ခ် ပို့ပြီးပါပြီ',
    resetSuccessDesc: 'စကားဝှက် ပြန်လည်သတ်မှတ်ရေး လမ်းညွှန်ချက်များအတွက် သင့်အီးမေးလ်ကို စစ်ဆေးပါ။',
    
    // Temporary Password
    tempPasswordTitle: 'ယာယီ စကားဝှက် တွေ့ရှိသည်',
    tempPasswordDesc: 'စနစ်သို့ မဝင်ရောက်မီ သင့်စကားဝှက်ကို ပြောင်းလဲရပါမည်။',
    newPassword: 'စကားဝှက်အသစ်',
    mustChangePassword: 'လုံခြုံရေးအတွက် စကားဝှက် ပြောင်းလဲခြင်း မဖြစ်မနေ လုပ်ရပါမည်။',
    
    // Role Names and Descriptions
    roles: {
      // Removed APP_OWNER as requested
      SUPER_ADMIN: { name: 'စူပါ စီမံခန့်ခွဲသူ', desc: 'ပလပ်ဖောင်း စီမံခန့်ခွဲမှု နှင့် အသုံးပြုသူ ထိန်းချုပ်မှု' },
      FINANCE_ADMIN: { name: 'ဘဏ္ဍာရေး စီမံခန့်ခွဲသူ', desc: 'ဝင်ငွေ၊ ငွေပေးချေမှု နှင့် ကုန်သည် လုပ်ငန်းများ' },
      OPERATIONS_ADMIN: { name: 'လုပ်ငန်း စီမံခန့်ခွဲသူ', desc: 'လော်ဂျစ်တစ် နှင့် ကုန်ရုံ ထိန်းချုပ်မှု ဗဟိုချက်' },
      MARKETING_ADMIN: { name: 'စျေးကွက်ရှာဖွေရေး စီမံခန့်ခွဲသူ', desc: 'တိုးတက်မှု၊ လှုပ်ရှားမှုများ နှင့် ဖောက်သည် ပါဝင်မှု' },
      CUSTOMER_SERVICE_ADMIN: { name: 'ဝန်ဆောင်မှု စီမံခန့်ခွဲသူ', desc: 'ဖောက်သည် အတွေ့အကြုံ နှင့် ပံ့ပိုးမှု အရည်အသွေး' },
      RDR: { name: '(စက်ဘီး/ဆိုင်ကယ်ဖြင့်ကုန်ပစ္စည်းပို့ဆောင်သူ/ မော်တော်ယာဉ်ဖြင့် ပို့ဆောင်သူ)', desc: 'ကောက်ယူခြင်း၊ တံဆိပ်ကပ်ခြင်း နှင့် ပို့ဆောင်ခြင်း လုပ်ငန်းများ' },
      DES: { name: 'အချက်အလက်ရေးသွင်းသူ', desc: 'ရုံးတွင်း မှတ်ပုံတင်ခြင်း နှင့် AWB စီမံခန့်ခွဲမှု' },
      WH: { name: 'ကုန်ရုံ မန်နေဂျာ', desc: 'လက်ခံခြင်း နှင့် ပို့ဆောင်ခြင်း လုပ်ငန်းများ' },
      SUP: { name: 'လုပ်ငန်း ကြီးကြပ်သူ', desc: 'စာရင်းစစ်ခြင်း၊ စာရင်းကောက်ခြင်း နှင့် အရည်အသွေး ထိန်းချုပ်မှု' },
      SSM: { name: 'ရုံးခွဲမန်နေဂျာ', desc: 'ဒေသဆိုင်ရာ ဗဟိုချက် နှင့် ကွန်ယက် စီမံခန့်ခွဲမှု' },
      SSR: { name: 'လမ်းကြောင်းကျွမ်းကျင်သူ', desc: 'နောက်ဆုံး ပို့ဆောင်မှု နှင့် ဖောက်သည် အတွေ့အကြုံ' },
      MERCHANT: { name: 'ကုန်သည် ပေါ်တယ်', desc: 'လုပ်ငန်း ပို့ဆောင်မှု နှင့် ခွဲခြမ်းစိတ်ဖြာမှု ဒက်ရှ်ဘုတ်' },
      CUSTOMER: { name: 'ဖောက်သည် ပေါ်တယ်', desc: 'ပက်ကေ့ချ် ခြေရာခံခြင်း နှင့် ပံ့ပိုးမှု ဝန်ဆောင်မှုများ' },
      MARKETING: { name: 'စျေးကွက်ရှာဖွေရေး မန်နေဂျာ', desc: 'လှုပ်ရှားမှု စီမံခန့်ခွဲမှု နှင့် တိုးတက်မှု ခွဲခြမ်းစိတ်ဖြာမှု' },
      CUSTOMER_SERVICE: { name: 'ဖောက်သည် ဝန်ဆောင်မှု', desc: 'တိုက်ရိုက် စကားပြောခြင်း၊ လက်မှတ်များ နှင့် ဖောက်သည် ပံ့ပိုးမှု' },
      FINANCE_USER: { name: 'ဘဏ္ဍာရေး အသုံးပြုသူ', desc: 'ငွေပေးချေမှု လုပ်ငန်းစဉ် နှင့် ဘဏ္ဍာရေး အစီရင်ခံစာများ' },
      ANALYST: { name: 'စီးပွားရေး ခွဲခြမ်းစိတ်ဖြာသူ', desc: 'ဒေတာ ဉာဏ်ရည် နှင့် စွမ်းဆောင်ရည် ထိုးထွင်းသိမြင်မှု' }
    },
    
    // Footer
    copyright: '© ၂၀၂၆ BRITIUM EXPRESS ကမ္ဘာ့ လုပ်ငန်း',
    version: 'v၃.၀.၀-ထုတ်လုပ်မှု',
    securePortal: 'လုံခြုံသော ပေါ်တယ်',
    securityPolicy: 'လုံခြုံရေး မူဝါဒ',
    enterpriseSupport: 'လုပ်ငန်း ပံ့ပိုးမှု',
    documentation: 'စာရွက်စာတမ်းများ',
    
    // Error Messages
    invalidCredentials: 'မမှန်ကန်သော အီးမေးလ် သို့မဟုတ် စကားဝှက်',
    emailRequired: 'အီးမေးလ် လိပ်စာ လိုအပ်သည်',
    passwordRequired: 'စကားဝှက် လိုအပ်သည်',
    passwordMismatch: 'စကားဝှက်များ မတူညီပါ',
    weakPassword: 'စကားဝှက်သည် အနည်းဆုံး ၈ လုံး ရှိရပါမည်',
    invalidEmail: 'မှန်ကန်သော အီးမေးလ် လိပ်စာ ရိုက်ထည့်ပါ',
    accountExists: 'ဤအီးမေးလ်ဖြင့် အကောင့် ရှိပြီးသားဖြစ်သည်',
    accountNotFound: 'ဤအီးမေးလ်ဖြင့် အကောင့် မတွေ့ရှိပါ',
    verificationFailed: 'မမှန်ကန်သော အတည်ပြုကုဒ်',
    
    // Success Messages
    accountCreated: 'အကောင့် အောင်မြင်စွာ ဖန်တီးပြီးပါပြီ',
    passwordReset: 'စကားဝှက် အောင်မြင်စွာ ပြန်လည်သတ်မှတ်ပြီးပါပြီ',
    emailVerified: 'အီးမေးလ် အောင်မြင်စွာ အတည်ပြုပြီးပါပြီ',
    
    // Badges
    badges: {
      ADMIN: 'စီမံခန့်ခွဲသူ',
      FINANCE: 'ဘဏ္ဍာရေး',
      OPS: 'လုပ်ငန်းများ',
      MARKETING: 'စျေးကွက်ရှာဖွေရေး',
      SERVICE: 'ဝန်ဆောင်မှု',
      BUSINESS: 'စီးပွားရေး',
      CUSTOMER: 'ဖောက်သည်',
      GROWTH: 'တိုးတက်မှု',
      SUPPORT: 'ပံ့ပိုးမှု',
      ANALYTICS: 'ခွဲခြမ်းစိတ်ဖြာမှု'
    }
  }
};

// Operational Roles (Original SOP-based roles)
const OPERATIONAL_ROLES = [
  {
    role: 'RDR' as UserRole,
    icon: Truck,
    color: 'from-electric-400/20 to-electric-600/20',
    iconColor: 'text-electric-400',
    gradient: 'bg-gradient-to-br from-electric-500 to-electric-600'
  },
  {
    role: 'DES' as UserRole,
    icon: Database,
    color: 'from-neon-purple/20 to-purple-600/20',
    iconColor: 'text-neon-purple',
    gradient: 'bg-gradient-to-br from-neon-purple to-purple-600'
  },
  {
    role: 'WH' as UserRole,
    icon: Warehouse,
    color: 'from-plasma-orange/20 to-orange-600/20',
    iconColor: 'text-plasma-orange',
    gradient: 'bg-gradient-to-br from-plasma-orange to-orange-600'
  },
  {
    role: 'SUP' as UserRole,
    icon: ShieldCheck,
    color: 'from-matrix-green/20 to-emerald-600/20',
    iconColor: 'text-matrix-green',
    gradient: 'bg-gradient-to-br from-matrix-green to-emerald-600'
  },
  {
    role: 'SSM' as UserRole,
    icon: MapPin,
    color: 'from-electric-blue/20 to-blue-600/20',
    iconColor: 'text-electric-blue',
    gradient: 'bg-gradient-to-br from-electric-blue to-blue-600'
  },
  {
    role: 'SSR' as UserRole,
    icon: Package,
    color: 'from-cyber-gold/20 to-yellow-600/20',
    iconColor: 'text-cyber-gold',
    gradient: 'bg-gradient-to-br from-cyber-gold to-yellow-600'
  }
];

// Admin & Management Roles (Removed APP_OWNER)
const ADMIN_ROLES = [
  {
    role: 'SUPER_ADMIN' as any,
    icon: Shield,
    color: 'from-neon-purple/20 to-violet-600/20',
    iconColor: 'text-neon-purple',
    gradient: 'bg-gradient-to-br from-neon-purple to-violet-600',
    badge: 'ADMIN',
    badgeColor: 'bg-neon-purple'
  },
  {
    role: 'FINANCE_ADMIN' as any,
    icon: DollarSign,
    color: 'from-matrix-green/20 to-green-600/20',
    iconColor: 'text-matrix-green',
    gradient: 'bg-gradient-to-br from-matrix-green to-green-600',
    badge: 'FINANCE',
    badgeColor: 'bg-matrix-green'
  },
  {
    role: 'OPERATIONS_ADMIN' as any,
    icon: Settings,
    color: 'from-electric-blue/20 to-blue-600/20',
    iconColor: 'text-electric-blue',
    gradient: 'bg-gradient-to-br from-electric-blue to-blue-600',
    badge: 'OPS',
    badgeColor: 'bg-electric-blue'
  },
  {
    role: 'MARKETING_ADMIN' as any,
    icon: Megaphone,
    color: 'from-holographic-pink/20 to-pink-600/20',
    iconColor: 'text-holographic-pink',
    gradient: 'bg-gradient-to-br from-holographic-pink to-pink-600',
    badge: 'MARKETING',
    badgeColor: 'bg-holographic-pink'
  },
  {
    role: 'CUSTOMER_SERVICE_ADMIN' as any,
    icon: Headphones,
    color: 'from-electric-400/20 to-teal-600/20',
    iconColor: 'text-electric-400',
    gradient: 'bg-gradient-to-br from-electric-400 to-teal-600',
    badge: 'SERVICE',
    badgeColor: 'bg-electric-400'
  }
];

// Business User Roles
const BUSINESS_ROLES = [
  {
    role: 'MERCHANT' as any,
    icon: Store,
    color: 'from-cyber-gold/20 to-amber-600/20',
    iconColor: 'text-cyber-gold',
    gradient: 'bg-gradient-to-br from-cyber-gold to-amber-600',
    badge: 'BUSINESS',
    badgeColor: 'bg-cyber-gold'
  },
  {
    role: 'CUSTOMER' as any,
    icon: User,
    color: 'from-slate-400/20 to-slate-600/20',
    iconColor: 'text-slate-400',
    gradient: 'bg-gradient-to-br from-slate-400 to-slate-600',
    badge: 'CUSTOMER',
    badgeColor: 'bg-slate-500'
  },
  {
    role: 'MARKETING' as any,
    icon: TrendingUp,
    color: 'from-holographic-pink/20 to-rose-600/20',
    iconColor: 'text-holographic-pink',
    gradient: 'bg-gradient-to-br from-holographic-pink to-rose-600',
    badge: 'GROWTH',
    badgeColor: 'bg-holographic-pink'
  },
  {
    role: 'CUSTOMER_SERVICE' as any,
    icon: MessageSquare,
    color: 'from-matrix-green/20 to-emerald-600/20',
    iconColor: 'text-matrix-green',
    gradient: 'bg-gradient-to-br from-matrix-green to-emerald-600',
    badge: 'SUPPORT',
    badgeColor: 'bg-matrix-green'
  },
  {
    role: 'FINANCE_USER' as any,
    icon: CreditCard,
    color: 'from-matrix-green/20 to-green-600/20',
    iconColor: 'text-matrix-green',
    gradient: 'bg-gradient-to-br from-matrix-green to-green-600',
    badge: 'FINANCE',
    badgeColor: 'bg-matrix-green'
  },
  {
    role: 'ANALYST' as any,
    icon: BarChart3,
    color: 'from-neon-purple/20 to-purple-600/20',
    iconColor: 'text-neon-purple',
    gradient: 'bg-gradient-to-br from-neon-purple to-purple-600',
    badge: 'ANALYTICS',
    badgeColor: 'bg-neon-purple'
  }
];

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, resetPassword, verifyEmail, changePassword, isAuthenticated, checkMustChangePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('operations');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [language, setLanguage] = useState<Language>('en');
  const [error, setError] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    companyName: '',
    verificationCode: '',
    newPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  const t = translations[language];

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || ROUTE_PATHS.DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setError('');
  };

  const validateForm = () => {
    if (authMode === 'login') {
      if (!formData.email) {
        setError(t.emailRequired);
        return false;
      }
      if (!formData.password) {
        setError(t.passwordRequired);
        return false;
      }
    } else if (authMode === 'signup') {
      if (!formData.email || !formData.password || !formData.fullName) {
        setError('All fields are required');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError(t.passwordMismatch);
        return false;
      }
      if (formData.password.length < 8) {
        setError(t.weakPassword);
        return false;
      }
    }
    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      if (authMode === 'login') {
        // Production Firebase authentication
        await login(formData.email, formData.password, selectedRole as UserRole);
        
        // Check if password change is required
        if (checkMustChangePassword()) {
          setMustChangePassword(true);
          setAuthMode('reset');
          return;
        }
        
        toast.success(`Welcome back!`);
        
        // Route based on role
        if (selectedRole === 'SUPER_ADMIN') {
          navigate('/admin/super-admin');
        } else if (selectedRole?.includes('ADMIN')) {
          navigate('/admin/dashboard');
        } else if (selectedRole === 'MERCHANT') {
          navigate('/merchant/portal');
        } else if (selectedRole === 'CUSTOMER') {
          navigate('/customer/portal');
        } else {
          navigate(ROUTE_PATHS.DASHBOARD);
        }
      } else if (authMode === 'signup') {
        // Production Firebase signup
        await signup(formData.email, formData.password, {
          displayName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          companyName: formData.companyName,
          role: selectedRole as UserRole || 'CUSTOMER'
        });
        setAuthMode('verify');
        toast.success(t.accountCreated);
      } else if (authMode === 'forgot') {
        // Production password reset
        await resetPassword(formData.email);
        toast.success('Reset link sent to your email');
      } else if (authMode === 'verify') {
        // Email verification (handled by Firebase automatically)
        toast.success(t.emailVerified);
        setAuthMode('login');
      } else if (authMode === 'reset') {
        // Production password change
        if (mustChangePassword) {
          // For temporary password change
          await changePassword(formData.password, formData.newPassword);
        } else {
          // For regular password reset (would need reset token in production)
          toast.success('Password reset functionality requires email verification');
        }
        toast.success(t.passwordReset);
        setMustChangePassword(false);
        setAuthMode('login');
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const RoleCard = ({ item, index }: { item: any, index: number }) => (
    <motion.div
      key={item.role}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div
        className={`role-card-cyber ${
          selectedRole === item.role ? 'selected' : ''
        }`}
        onClick={() => handleRoleSelect(item.role)}
      >
        {item.badge && (
          <Badge 
            className={`absolute -top-2 -right-2 ${item.badgeColor} text-white text-xs font-bold px-2 py-1 shadow-lg animate-neon-pulse ${language === 'my' ? 'myanmar-text' : ''}`}
          >
            {t.badges[item.badge as keyof typeof t.badges]}
          </Badge>
        )}
        
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl backdrop-blur-xl border border-white/20 transition-all duration-300 group-hover:scale-110 ${selectedRole === item.role ? 'bg-white/20' : 'bg-white/10'}`}>
            <item.icon className={`w-6 h-6 ${selectedRole === item.role ? 'text-white' : item.iconColor}`} />
          </div>
          {selectedRole === item.role && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center text-white/90"
            >
              <Sparkles className="w-4 h-4 mr-1 animate-neon-pulse" />
              <span className={`text-xs font-medium font-cyber ${language === 'my' ? 'myanmar-text' : ''}`}>
                SELECTED
              </span>
            </motion.div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className={`font-cyber font-bold text-lg ${selectedRole === item.role ? 'text-white' : 'text-white/90'} ${language === 'my' ? 'myanmar-heading' : ''}`}>
            {t.roles[item.role as keyof typeof t.roles].name}
          </h3>
          <p className={`text-sm leading-relaxed font-modern ${selectedRole === item.role ? 'text-white/80' : 'text-white/60'} ${language === 'my' ? 'myanmar-text' : ''}`}>
            {t.roles[item.role as keyof typeof t.roles].desc}
          </p>
        </div>
      </div>
    </motion.div>
  );

  const AuthForm = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={authMode}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {authMode === 'verify' ? (
          <div className="text-center py-8">
            <div className="mb-6 p-4 rounded-full bg-electric-blue/20 w-fit mx-auto">
              <Mail className="w-12 h-12 text-electric-blue" />
            </div>
            <h3 className={`font-cyber font-bold text-white mb-2 ${language === 'my' ? 'myanmar-heading' : ''}`}>
              {t.verificationTitle}
            </h3>
            <p className={`text-sm text-white/60 mb-6 ${language === 'my' ? 'myanmar-text' : ''}`}>
              {t.verificationDesc}
            </p>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label className={`text-sm font-cyber text-white ${language === 'my' ? 'myanmar-text' : ''}`}>
                  {t.verificationCode}
                </Label>
                <Input
                  type="text"
                  value={formData.verificationCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, verificationCode: e.target.value }))}
                  placeholder={t.enterCode}
                  className="input-cyber text-center text-2xl tracking-widest"
                  maxLength={6}
                  required
                />
              </div>
              
              {error && (
                <Alert className="border-holographic-pink/50 bg-holographic-pink/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-white">{error}</AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" className="btn-holographic w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {t.verifying}
                  </div>
                ) : (
                  t.verifyEmailButton
                )}
              </Button>
              
              <div className="flex justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {t.backToLogin}
                </button>
                <button
                  type="button"
                  onClick={() => {/* Resend code logic */}}
                  className="text-electric-blue hover:text-electric-300 transition-colors"
                >
                  {t.resendCode}
                </button>
              </div>
            </form>
          </div>
        ) : authMode === 'forgot' ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className={`font-cyber font-bold text-white mb-2 ${language === 'my' ? 'myanmar-heading' : ''}`}>
                {t.resetTitle}
              </h3>
              <p className={`text-sm text-white/60 ${language === 'my' ? 'myanmar-text' : ''}`}>
                {t.resetDesc}
              </p>
            </div>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label className={`text-sm font-cyber text-white ${language === 'my' ? 'myanmar-text' : ''}`}>
                  {t.email}
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder={t.enterEmail}
                  className="input-cyber"
                  required
                />
              </div>
              
              {error && (
                <Alert className="border-holographic-pink/50 bg-holographic-pink/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-white">{error}</AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" className="btn-holographic w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {t.sendingReset}
                  </div>
                ) : (
                  t.sendResetLink
                )}
              </Button>
              
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="w-full text-center text-white/60 hover:text-white transition-colors text-sm"
              >
                {t.backToLogin}
              </button>
            </form>
          </div>
        ) : authMode === 'reset' ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className={`font-cyber font-bold text-white mb-2 ${language === 'my' ? 'myanmar-heading' : ''}`}>
                {mustChangePassword ? t.tempPasswordTitle : t.resetPassword}
              </h3>
              <p className={`text-sm text-white/60 ${language === 'my' ? 'myanmar-text' : ''}`}>
                {mustChangePassword ? t.tempPasswordDesc : 'Enter your new password'}
              </p>
              {mustChangePassword && (
                <Alert className="mt-4 border-cyber-gold/50 bg-cyber-gold/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-white">{t.mustChangePassword}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label className={`text-sm font-cyber text-white ${language === 'my' ? 'myanmar-text' : ''}`}>
                  {t.newPassword}
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder={t.enterPassword}
                    className="input-cyber pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-white/60 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className={`text-sm font-cyber text-white ${language === 'my' ? 'myanmar-text' : ''}`}>
                  {t.confirmPassword}
                </Label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder={t.confirmPasswordPlaceholder}
                  className="input-cyber"
                  required
                />
              </div>
              
              {error && (
                <Alert className="border-holographic-pink/50 bg-holographic-pink/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-white">{error}</AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" className="btn-holographic w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {t.verifying}
                  </div>
                ) : (
                  t.resetPasswordButton
                )}
              </Button>
            </form>
          </div>
        ) : authMode === 'signup' ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className={`font-cyber font-bold text-white mb-2 ${language === 'my' ? 'myanmar-heading' : ''}`}>
                {t.signUp}
              </h3>
              <p className={`text-sm text-white/60 ${language === 'my' ? 'myanmar-text' : ''}`}>
                Create your account to access the portal
              </p>
            </div>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={`text-sm font-cyber text-white ${language === 'my' ? 'myanmar-text' : ''}`}>
                    {t.fullName}
                  </Label>
                  <Input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder={t.enterFullName}
                    className="input-cyber"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className={`text-sm font-cyber text-white ${language === 'my' ? 'myanmar-text' : ''}`}>
                    {t.phoneNumber}
                  </Label>
                  <Input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder={t.enterPhone}
                    className="input-cyber"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className={`text-sm font-cyber text-white ${language === 'my' ? 'myanmar-text' : ''}`}>
                  {t.email}
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder={t.enterEmail}
                  className="input-cyber"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className={`text-sm font-cyber text-white ${language === 'my' ? 'myanmar-text' : ''}`}>
                  {t.companyName}
                </Label>
                <Input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder={t.enterCompany}
                  className="input-cyber"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={`text-sm font-cyber text-white ${language === 'my' ? 'myanmar-text' : ''}`}>
                    {t.password}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder={t.enterPassword}
                      className="input-cyber pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-white/60 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className={`text-sm font-cyber text-white ${language === 'my' ? 'myanmar-text' : ''}`}>
                    {t.confirmPassword}
                  </Label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder={t.confirmPasswordPlaceholder}
                    className="input-cyber"
                    required
                  />
                </div>
              </div>
              
              {error && (
                <Alert className="border-holographic-pink/50 bg-holographic-pink/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-white">{error}</AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" className="btn-holographic w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {t.creatingAccount}
                  </div>
                ) : (
                  t.signUpButton
                )}
              </Button>
              
              <div className="text-center">
                <span className={`text-white/60 text-sm ${language === 'my' ? 'myanmar-text' : ''}`}>
                  {t.hasAccount}{' '}
                </span>
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-electric-blue hover:text-electric-300 transition-colors text-sm font-medium"
                >
                  {t.signIn}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Login Form
          <div className="space-y-6">
            {selectedRole && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-electric-blue/10 to-neon-purple/10 border border-electric-blue/20 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-electric-blue/20 backdrop-blur-xl">
                    <UserCircle2 className="w-5 h-5 text-electric-blue" />
                  </div>
                  <div>
                    <p className={`font-cyber font-semibold text-sm text-white ${language === 'my' ? 'myanmar-text' : ''}`}>
                      {t.roles[selectedRole as keyof typeof t.roles]?.name}
                    </p>
                    <p className={`text-xs text-white/60 font-modern ${language === 'my' ? 'myanmar-text' : ''}`}>
                      {t.roles[selectedRole as keyof typeof t.roles]?.desc}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label className={`text-sm font-cyber text-white ${language === 'my' ? 'myanmar-text' : ''}`}>
                  {t.email}
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder={t.enterEmail}
                  className="input-cyber"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className={`text-sm font-cyber text-white ${language === 'my' ? 'myanmar-text' : ''}`}>
                  {t.password}
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder={t.enterPassword}
                    className="input-cyber pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-white/60 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              {error && (
                <Alert className="border-holographic-pink/50 bg-holographic-pink/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-white">{error}</AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" className="btn-holographic w-full" disabled={isLoading || !selectedRole}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {t.signingIn}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {t.signInButton}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
              
              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {t.forgotPasswordLink}
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-electric-blue hover:text-electric-300 transition-colors"
                >
                  {t.signUp}
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Language Switcher */}
      <div className="language-switcher">
        <div className="flex gap-1">
          <button
            onClick={() => setLanguage('en')}
            className={language === 'en' ? 'active' : ''}
          >
            <Languages className="w-4 h-4 mr-1" />
            EN
          </button>
          <button
            onClick={() => setLanguage('my')}
            className={`${language === 'my' ? 'active' : ''} myanmar-text`}
          >
            မြန်မာ
          </button>
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] bg-gradient-to-br from-electric-blue/10 via-neon-purple/5 to-transparent blur-3xl rounded-full animate-float" />
        <div className="absolute -bottom-[20%] -right-[20%] w-[60%] h-[60%] bg-gradient-to-tl from-cyber-gold/10 via-electric-blue/5 to-transparent blur-3xl rounded-full animate-float-delayed" />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-gradient-to-bl from-holographic-pink/8 to-transparent blur-2xl rounded-full animate-float" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl space-y-8">
          {/* Enhanced Header with New Branding */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <div className="logo-cyber inline-flex items-center justify-center mb-6">
              <img 
                src="/favicon.ico" 
                alt="Britium Express Logo" 
                className="w-16 h-16 animate-neon-pulse"
              />
            </div>
            
            <div className="space-y-3">
              <h1 className={`text-5xl md:text-6xl font-cyber font-black tracking-tight ${language === 'my' ? 'myanmar-heading' : ''}`}>
                <span className="gradient-text">{t.brandName}</span>
              </h1>
              <h2 className={`text-2xl md:text-3xl font-cyber font-bold ${language === 'my' ? 'myanmar-heading' : ''}`}>
                <span className="neon-text">{t.brandSubtitle}</span>
              </h2>
              <div className="flex items-center justify-center gap-3 text-lg text-white/70">
                <Cpu className="w-5 h-5 text-electric-blue animate-pulse" />
                <span className={`font-cyber ${language === 'my' ? 'myanmar-text' : ''}`}>{t.brandTagline}</span>
                <Activity className="w-5 h-5 text-cyber-gold animate-pulse" />
              </div>
              <p className={`text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-modern ${language === 'my' ? 'myanmar-text' : ''}`}>
                {t.description}
              </p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Role Selection - Ultra Modern */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="cyber-card">
                  <div className="border-b border-white/10 bg-gradient-to-r from-electric-blue/5 to-neon-purple/5 p-6 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-electric-blue/20 backdrop-blur-xl">
                        <UserCircle2 className="w-6 h-6 text-electric-blue" />
                      </div>
                      <div>
                        <h2 className={`text-2xl font-cyber font-bold text-white ${language === 'my' ? 'myanmar-heading' : ''}`}>
                          {t.roleSelectionTitle}
                        </h2>
                        <p className={`text-base text-white/60 font-modern ${language === 'my' ? 'myanmar-text' : ''}`}>
                          {t.roleSelectionDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <div className="grid grid-cols-3 gap-2 mb-8 p-1 bg-white/5 backdrop-blur-xl rounded-2xl">
                        <button 
                          onClick={() => setActiveTab('operations')}
                          className={`tab-cyber flex items-center gap-2 py-3 text-sm ${activeTab === 'operations' ? 'active' : ''} ${language === 'my' ? 'myanmar-text' : ''}`}
                        >
                          <Truck className="w-4 h-4" />
                          {t.operations}
                        </button>
                        <button 
                          onClick={() => setActiveTab('admin')}
                          className={`tab-cyber flex items-center gap-2 py-3 text-sm ${activeTab === 'admin' ? 'active' : ''} ${language === 'my' ? 'myanmar-text' : ''}`}
                        >
                          <Crown className="w-4 h-4" />
                          {t.administration}
                        </button>
                        <button 
                          onClick={() => setActiveTab('business')}
                          className={`tab-cyber flex items-center gap-2 py-3 text-sm ${activeTab === 'business' ? 'active' : ''} ${language === 'my' ? 'myanmar-text' : ''}`}
                        >
                          <Users className="w-4 h-4" />
                          {t.businessUsers}
                        </button>
                      </div>

                      <TabsContent value="operations" className="space-y-6">
                        <div className="text-center mb-6">
                          <h3 className={`text-xl font-cyber font-bold text-white mb-2 ${language === 'my' ? 'myanmar-heading' : ''}`}>
                            {t.operationalRoles}
                          </h3>
                          <p className={`text-white/60 font-modern ${language === 'my' ? 'myanmar-text' : ''}`}>
                            {t.operationalDesc}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {OPERATIONAL_ROLES.map((item, index) => (
                            <RoleCard key={item.role} item={item} index={index} />
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="admin" className="space-y-6">
                        <div className="text-center mb-6">
                          <h3 className={`text-xl font-cyber font-bold text-white mb-2 ${language === 'my' ? 'myanmar-heading' : ''}`}>
                            {t.adminRoles}
                          </h3>
                          <p className={`text-white/60 font-modern ${language === 'my' ? 'myanmar-text' : ''}`}>
                            {t.adminDesc}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {ADMIN_ROLES.map((item, index) => (
                            <RoleCard key={item.role} item={item} index={index} />
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="business" className="space-y-6">
                        <div className="text-center mb-6">
                          <h3 className={`text-xl font-cyber font-bold text-white mb-2 ${language === 'my' ? 'myanmar-heading' : ''}`}>
                            {t.businessRoles}
                          </h3>
                          <p className={`text-white/60 font-modern ${language === 'my' ? 'myanmar-text' : ''}`}>
                            {t.businessDesc}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {BUSINESS_ROLES.map((item, index) => (
                            <RoleCard key={item.role} item={item} index={index} />
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Enhanced Authentication Form */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="sticky top-8"
              >
                <div className="cyber-card">
                  <div className="border-b border-white/10 bg-gradient-to-r from-electric-blue/5 to-neon-purple/5 p-6 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-electric-blue/20 backdrop-blur-xl">
                        <Lock className="w-5 h-5 text-electric-blue" />
                      </div>
                      <div>
                        <h3 className={`text-xl font-cyber font-bold text-white ${language === 'my' ? 'myanmar-heading' : ''}`}>
                          {authMode === 'login' ? t.signIn : 
                           authMode === 'signup' ? t.signUp :
                           authMode === 'forgot' ? t.forgotPassword :
                           authMode === 'verify' ? t.verifyEmail :
                           t.resetPassword}
                        </h3>
                        <p className={`text-white/60 font-modern ${language === 'my' ? 'myanmar-text' : ''}`}>
                          Production Authentication
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {authMode === 'login' && !selectedRole ? (
                      <div className="text-center py-12">
                        <div className="mb-4 p-4 rounded-full bg-white/5 backdrop-blur-xl w-fit mx-auto border border-white/10">
                          <UserCircle2 className="w-12 h-12 text-white/60" />
                        </div>
                        <h3 className={`font-cyber font-semibold text-white mb-2 ${language === 'my' ? 'myanmar-heading' : ''}`}>
                          SELECT YOUR ROLE
                        </h3>
                        <p className={`text-sm text-white/60 leading-relaxed font-modern ${language === 'my' ? 'myanmar-text' : ''}`}>
                          Choose a role from the portal selection to continue with secure authentication
                        </p>
                      </div>
                    ) : (
                      <AuthForm />
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="cyber-card"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4 px-4 py-6">
              <div className="flex items-center gap-4">
                <span className={`font-cyber font-semibold ${language === 'my' ? 'myanmar-text' : ''}`}>
                  {t.copyright}
                </span>
                <div className="w-1 h-1 rounded-full bg-electric-blue animate-pulse"></div>
                <span className="font-mono">{t.version}</span>
                <div className="w-1 h-1 rounded-full bg-cyber-gold animate-pulse"></div>
                <Badge className={`text-xs bg-electric-blue/20 text-electric-blue border-electric-blue/30 font-cyber ${language === 'my' ? 'myanmar-text' : ''}`}>
                  {t.securePortal}
                </Badge>
              </div>
              <div className="flex items-center gap-6">
                <a href="#" className={`hover:text-electric-blue transition-colors font-cyber ${language === 'my' ? 'myanmar-text' : ''}`}>
                  {t.securityPolicy}
                </a>
                <a href="#" className={`hover:text-cyber-gold transition-colors font-cyber ${language === 'my' ? 'myanmar-text' : ''}`}>
                  {t.enterpriseSupport}
                </a>
                <a href="#" className={`hover:text-neon-purple transition-colors font-cyber ${language === 'my' ? 'myanmar-text' : ''}`}>
                  {t.documentation}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;