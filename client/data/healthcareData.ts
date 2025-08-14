// Comprehensive Healthcare Data for ClinicStreams Application

export interface FeatureData {
  name: string;
  clinicStreams: boolean | string;
  epicMyChart: boolean | string;
  cernerPowerChart: boolean | string;
  allscripts: boolean | string;
  nextGen: boolean | string;
  category: 'core' | 'advanced' | 'integration' | 'analytics' | 'support';
  importance: 'high' | 'medium' | 'low';
  description: string;
  icon: string;
}

export interface CompetitorData {
  name: string;
  color: string;
  logo: string;
  marketShare: number;
  yearFounded: number;
  headquarters: string;
  specialties: string[];
  pricing: string;
  targetMarket: string;
}

export interface HealthcareModule {
  id: string;
  name: string;
  icon: string;
  description: string;
  features: string[];
  benefits: string[];
  color: string;
  position: [number, number, number];
  connections: string[];
}

export interface JourneyStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  features: string[];
  benefits: string[];
  timeline: string;
  color: string;
}

export interface NavigationStep {
  id: string;
  title: string;
  icon: string;
  description: string;
  completed: boolean;
  active: boolean;
  route: string;
}

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  color: string;
  popular: boolean;
}

export interface Testimonial {
  name: string;
  title: string;
  organization: string;
  quote: string;
  avatar: string;
  rating: number;
}

export interface Statistic {
  value: string;
  label: string;
  description: string;
  icon: string;
  color: string;
}

// Comprehensive Feature Comparison Data
export const featuresData: FeatureData[] = [
  {
    name: 'Patient Portal Access',
    clinicStreams: true,
    epicMyChart: true,
    cernerPowerChart: true,
    allscripts: 'Limited',
    nextGen: true,
    category: 'core',
    importance: 'high',
    description: 'Comprehensive patient portal with appointment scheduling, medical records access, secure messaging, and prescription management.',
    icon: '👥'
  },
  {
    name: 'AI-Powered Analytics',
    clinicStreams: true,
    epicMyChart: 'Limited',
    cernerPowerChart: false,
    allscripts: false,
    nextGen: 'Basic',
    category: 'analytics',
    importance: 'high',
    description: 'Advanced AI analytics for predictive healthcare insights, personalized treatment recommendations, and population health management.',
    icon: '🤖'
  },
  {
    name: 'Telemedicine Integration',
    clinicStreams: true,
    epicMyChart: true,
    cernerPowerChart: 'Limited',
    allscripts: 'Add-on',
    nextGen: true,
    category: 'advanced',
    importance: 'high',
    description: 'Seamless telemedicine capabilities with HD video calls, screen sharing, remote monitoring, and virtual consultation tools.',
    icon: '💻'
  },
  {
    name: 'Mobile Application',
    clinicStreams: true,
    epicMyChart: true,
    cernerPowerChart: true,
    allscripts: 'iOS Only',
    nextGen: 'Android Only',
    category: 'core',
    importance: 'medium',
    description: 'Full-featured mobile apps for iOS and Android with offline capabilities, push notifications, and biometric authentication.',
    icon: '📱'
  },
  {
    name: 'Real-time Patient Monitoring',
    clinicStreams: true,
    epicMyChart: false,
    cernerPowerChart: 'Limited',
    allscripts: false,
    nextGen: false,
    category: 'advanced',
    importance: 'high',
    description: 'Real-time patient monitoring with IoT device integration, automated alerts, and continuous vital sign tracking.',
    icon: '📊'
  },
  {
    name: 'Custom Workflow Builder',
    clinicStreams: true,
    epicMyChart: 'Limited',
    cernerPowerChart: 'Premium',
    allscripts: 'Custom Dev',
    nextGen: false,
    category: 'advanced',
    importance: 'medium',
    description: 'Flexible workflow customization to match your clinic\'s specific processes with drag-and-drop interface and automation rules.',
    icon: '⚙️'
  },
  {
    name: 'API Integration Suite',
    clinicStreams: true,
    epicMyChart: 'Limited',
    cernerPowerChart: true,
    allscripts: 'Premium',
    nextGen: 'Basic',
    category: 'integration',
    importance: 'medium',
    description: 'Comprehensive API suite for third-party integrations, custom applications, and seamless data exchange with external systems.',
    icon: '🔗'
  },
  {
    name: '24/7 Technical Support',
    clinicStreams: true,
    epicMyChart: 'Business Hours',
    cernerPowerChart: 'Premium',
    allscripts: 'Email Only',
    nextGen: 'Limited',
    category: 'support',
    importance: 'medium',
    description: 'Round-the-clock technical support with dedicated account managers, live chat, phone support, and comprehensive documentation.',
    icon: '🆘'
  },
  {
    name: 'HIPAA Compliance & Security',
    clinicStreams: true,
    epicMyChart: true,
    cernerPowerChart: true,
    allscripts: true,
    nextGen: true,
    category: 'core',
    importance: 'high',
    description: 'Full HIPAA compliance with advanced encryption, audit trails, access controls, and regular security assessments.',
    icon: '🔒'
  },
  {
    name: 'Predictive Analytics Dashboard',
    clinicStreams: true,
    epicMyChart: false,
    cernerPowerChart: 'Basic',
    allscripts: false,
    nextGen: false,
    category: 'analytics',
    importance: 'high',
    description: 'Machine learning-powered predictive analytics for patient outcomes, resource planning, and operational optimization.',
    icon: '📈'
  },
  {
    name: 'Voice Recognition & Dictation',
    clinicStreams: true,
    epicMyChart: 'Add-on',
    cernerPowerChart: 'Premium',
    allscripts: 'Third-party',
    nextGen: false,
    category: 'advanced',
    importance: 'medium',
    description: 'Advanced voice recognition for clinical documentation, hands-free operation, and natural language processing.',
    icon: '🎤'
  },
  {
    name: 'Automated Billing & Claims',
    clinicStreams: true,
    epicMyChart: true,
    cernerPowerChart: true,
    allscripts: 'Limited',
    nextGen: true,
    category: 'core',
    importance: 'high',
    description: 'Automated billing processes, insurance verification, claims management, and revenue cycle optimization.',
    icon: '💰'
  },
  {
    name: 'Clinical Decision Support',
    clinicStreams: true,
    epicMyChart: 'Basic',
    cernerPowerChart: true,
    allscripts: 'Limited',
    nextGen: 'Basic',
    category: 'advanced',
    importance: 'high',
    description: 'Evidence-based clinical decision support with drug interaction alerts, diagnostic assistance, and treatment recommendations.',
    icon: '🩺'
  },
  {
    name: 'Population Health Management',
    clinicStreams: true,
    epicMyChart: 'Premium',
    cernerPowerChart: 'Limited',
    allscripts: false,
    nextGen: 'Basic',
    category: 'analytics',
    importance: 'medium',
    description: 'Comprehensive population health analytics, risk stratification, care gap identification, and outcome tracking.',
    icon: '👥'
  },
  {
    name: 'Laboratory Integration',
    clinicStreams: true,
    epicMyChart: true,
    cernerPowerChart: true,
    allscripts: 'Basic',
    nextGen: true,
    category: 'integration',
    importance: 'high',
    description: 'Seamless integration with laboratory systems, automated result delivery, and clinical correlation tools.',
    icon: '🔬'
  },
  {
    name: 'Pharmacy Management',
    clinicStreams: true,
    epicMyChart: 'Basic',
    cernerPowerChart: true,
    allscripts: 'Limited',
    nextGen: 'Basic',
    category: 'core',
    importance: 'medium',
    description: 'Complete pharmacy management with e-prescribing, medication tracking, formulary management, and drug interaction checks.',
    icon: '💊'
  },
  {
    name: 'Patient Engagement Tools',
    clinicStreams: true,
    epicMyChart: 'Limited',
    cernerPowerChart: 'Basic',
    allscripts: 'Add-on',
    nextGen: 'Limited',
    category: 'advanced',
    importance: 'medium',
    description: 'Advanced patient engagement with educational content, care plans, appointment reminders, and health goal tracking.',
    icon: '📋'
  },
  {
    name: 'Multi-location Support',
    clinicStreams: true,
    epicMyChart: true,
    cernerPowerChart: true,
    allscripts: 'Premium',
    nextGen: 'Limited',
    category: 'core',
    importance: 'medium',
    description: 'Comprehensive multi-location support with centralized management, location-specific workflows, and unified reporting.',
    icon: '🏥'
  },
  {
    name: 'Custom Reporting Engine',
    clinicStreams: true,
    epicMyChart: 'Basic',
    cernerPowerChart: 'Premium',
    allscripts: 'Limited',
    nextGen: 'Basic',
    category: 'analytics',
    importance: 'medium',
    description: 'Advanced reporting engine with custom dashboards, automated reports, data visualization, and export capabilities.',
    icon: '📊'
  },
  {
    name: 'Data Backup & Recovery',
    clinicStreams: true,
    epicMyChart: true,
    cernerPowerChart: true,
    allscripts: 'Basic',
    nextGen: 'Limited',
    category: 'core',
    importance: 'high',
    description: 'Comprehensive data backup and disaster recovery with automated backups, cloud storage, and rapid restoration capabilities.',
    icon: '💾'
  }
];

// Competitor Information
export const competitorsData: CompetitorData[] = [
  {
    name: 'ClinicStreams',
    color: '#3b82f6',
    logo: '🏥',
    marketShare: 15,
    yearFounded: 2020,
    headquarters: 'San Francisco, CA',
    specialties: ['AI Analytics', 'Telemedicine', 'Patient Engagement'],
    pricing: 'Competitive',
    targetMarket: 'Small to Medium Practices'
  },
  {
    name: 'Epic MyChart',
    color: '#8b5cf6',
    logo: '📊',
    marketShare: 31,
    yearFounded: 1979,
    headquarters: 'Verona, WI',
    specialties: ['Large Health Systems', 'Interoperability'],
    pricing: 'Premium',
    targetMarket: 'Large Health Systems'
  },
  {
    name: 'Cerner PowerChart',
    color: '#10b981',
    logo: '⚕️',
    marketShare: 25,
    yearFounded: 1979,
    headquarters: 'North Kansas City, MO',
    specialties: ['Clinical Documentation', 'Population Health'],
    pricing: 'Premium',
    targetMarket: 'Hospitals & Health Systems'
  },
  {
    name: 'Allscripts',
    color: '#f59e0b',
    logo: '📋',
    marketShare: 12,
    yearFounded: 1986,
    headquarters: 'Chicago, IL',
    specialties: ['Practice Management', 'Revenue Cycle'],
    pricing: 'Mid-range',
    targetMarket: 'Ambulatory Practices'
  },
  {
    name: 'NextGen',
    color: '#ef4444',
    logo: '🔬',
    marketShare: 8,
    yearFounded: 1974,
    headquarters: 'Irvine, CA',
    specialties: ['Specialty Care', 'Practice Management'],
    pricing: 'Mid-range',
    targetMarket: 'Specialty Practices'
  }
];

// Healthcare Modules (Circular Design Elements)
export const healthcareModules: HealthcareModule[] = [
  {
    id: 'insurance',
    name: 'Insurance',
    icon: '🛡️',
    description: 'Comprehensive insurance verification, claims processing, and benefits management',
    features: ['Real-time verification', 'Claims automation', 'Benefits tracking', 'Prior authorization'],
    benefits: ['Reduced claim denials', 'Faster reimbursement', 'Improved cash flow'],
    color: '#3b82f6',
    position: [0, 8, 0],
    connections: ['admission', 'accounts']
  },
  {
    id: 'admission',
    name: 'Admission',
    icon: '🏥',
    description: 'Streamlined patient admission process with automated workflows',
    features: ['Patient registration', 'Bed management', 'Admission tracking', 'Discharge planning'],
    benefits: ['Reduced wait times', 'Improved patient flow', 'Better resource utilization'],
    color: '#10b981',
    position: [6, 6, 0],
    connections: ['frontoffice', 'nursing']
  },
  {
    id: 'frontoffice',
    name: 'Front Office',
    icon: '🏢',
    description: 'Complete front office management with scheduling and patient communication',
    features: ['Appointment scheduling', 'Patient check-in', 'Insurance verification', 'Communication tools'],
    benefits: ['Efficient operations', 'Better patient experience', 'Reduced administrative burden'],
    color: '#8b5cf6',
    position: [8, 0, 0],
    connections: ['admission', 'lab']
  },
  {
    id: 'lab',
    name: 'Laboratory',
    icon: '🔬',
    description: 'Advanced laboratory information management system',
    features: ['Test ordering', 'Result tracking', 'Quality control', 'Integration with analyzers'],
    benefits: ['Faster turnaround', 'Improved accuracy', 'Better clinical decisions'],
    color: '#06b6d4',
    position: [6, -6, 0],
    connections: ['frontoffice', 'systems']
  },
  {
    id: 'accounts',
    name: 'Accounts',
    icon: '💰',
    description: 'Financial management and revenue cycle optimization',
    features: ['Billing automation', 'Payment processing', 'Financial reporting', 'Revenue analytics'],
    benefits: ['Increased revenue', 'Reduced costs', 'Better financial visibility'],
    color: '#f59e0b',
    position: [0, -8, 0],
    connections: ['insurance', 'lab']
  },
  {
    id: 'ambulance',
    name: 'Ambulance',
    icon: '🚑',
    description: 'Emergency medical services coordination and dispatch',
    features: ['Dispatch management', 'GPS tracking', 'Communication systems', 'Resource allocation'],
    benefits: ['Faster response times', 'Better coordination', 'Improved outcomes'],
    color: '#ef4444',
    position: [-6, -6, 0],
    connections: ['accounts', 'nursing']
  },
  {
    id: 'nursing',
    name: 'Nursing',
    icon: '👩‍⚕️',
    description: 'Comprehensive nursing care management and documentation',
    features: ['Care planning', 'Medication administration', 'Vital signs tracking', 'Documentation'],
    benefits: ['Better patient care', 'Improved compliance', 'Reduced errors'],
    color: '#ec4899',
    position: [-8, 0, 0],
    connections: ['admission', 'ambulance']
  },
  {
    id: 'systems',
    name: 'Systems',
    icon: '🖥️',
    description: 'IT infrastructure and system integration management',
    features: ['System monitoring', 'Data integration', 'Security management', 'Backup & recovery'],
    benefits: ['Reliable operations', 'Data security', 'System efficiency'],
    color: '#6b7280',
    position: [-6, 6, 0],
    connections: ['nursing', 'insurance']
  }
];

// Healthcare Journey Steps
export const journeySteps: JourneyStep[] = [
  {
    id: 'discovery',
    title: 'Discovery',
    subtitle: 'Understanding Your Needs',
    description: 'We begin by understanding your unique healthcare challenges and requirements',
    icon: '🔍',
    features: ['Needs assessment', 'Current system analysis', 'Stakeholder interviews', 'Gap identification'],
    benefits: ['Tailored solutions', 'Clear roadmap', 'Informed decisions'],
    timeline: '1-2 weeks',
    color: '#3b82f6'
  },
  {
    id: 'planning',
    title: 'Planning',
    subtitle: 'Strategic Implementation Plan',
    description: 'Develop a comprehensive implementation strategy tailored to your organization',
    icon: '📋',
    features: ['Implementation roadmap', 'Resource planning', 'Timeline development', 'Risk assessment'],
    benefits: ['Structured approach', 'Minimized disruption', 'Clear expectations'],
    timeline: '2-3 weeks',
    color: '#10b981'
  },
  {
    id: 'setup',
    title: 'Setup',
    subtitle: 'System Configuration',
    description: 'Configure and customize the system to match your workflows and requirements',
    icon: '⚙️',
    features: ['System configuration', 'Data migration', 'Workflow setup', 'Integration configuration'],
    benefits: ['Optimized workflows', 'Seamless integration', 'Data continuity'],
    timeline: '3-4 weeks',
    color: '#8b5cf6'
  },
  {
    id: 'training',
    title: 'Training',
    subtitle: 'User Education & Support',
    description: 'Comprehensive training programs to ensure successful adoption',
    icon: '🎓',
    features: ['Role-based training', 'Hands-on workshops', 'Documentation', 'Certification programs'],
    benefits: ['User confidence', 'Faster adoption', 'Reduced errors'],
    timeline: '2-3 weeks',
    color: '#f59e0b'
  },
  {
    id: 'golive',
    title: 'Go-Live',
    subtitle: 'System Launch',
    description: 'Smooth transition to the new system with continuous support',
    icon: '🚀',
    features: ['Phased rollout', 'Live support', 'Performance monitoring', 'Issue resolution'],
    benefits: ['Smooth transition', 'Immediate support', 'Quick issue resolution'],
    timeline: '1-2 weeks',
    color: '#ef4444'
  },
  {
    id: 'optimization',
    title: 'Optimization',
    subtitle: 'Continuous Improvement',
    description: 'Ongoing optimization and enhancement based on usage patterns and feedback',
    icon: '📈',
    features: ['Performance analysis', 'Workflow optimization', 'Feature enhancements', 'Regular reviews'],
    benefits: ['Improved efficiency', 'Enhanced features', 'Better outcomes'],
    timeline: 'Ongoing',
    color: '#06b6d4'
  }
];

// Navigation Steps for 3D Experience
export const navigationSteps: NavigationStep[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    icon: '🚀',
    description: 'Start your ClinicStreams journey',
    completed: false,
    active: true,
    route: '/welcome'
  },
  {
    id: 'features',
    title: 'Features',
    icon: '⚡',
    description: 'Explore our comprehensive feature set',
    completed: false,
    active: false,
    route: '/features'
  },
  {
    id: 'journey',
    title: 'Journey',
    icon: '🏥',
    description: 'Discover the implementation process',
    completed: false,
    active: false,
    route: '/journey'
  },
  {
    id: 'comparison',
    title: 'Compare',
    icon: '🆚',
    description: 'Compare with other solutions',
    completed: false,
    active: false,
    route: '/comparison'
  },
  {
    id: 'demo',
    title: 'Demo',
    icon: '🎯',
    description: 'Schedule your personalized demo',
    completed: false,
    active: false,
    route: '/demo'
  }
];

// Loading Stages for 3D Experience
export const loadingStages = [
  'Initializing Healthcare Systems...',
  'Loading Patient Database...',
  'Configuring Medical Records...',
  'Setting up Security Protocols...',
  'Activating AI Analytics...',
  'Preparing Clinical Workflows...',
  'Loading Integration Layer...',
  'Finalizing System Setup...'
];

// System Status for Loading Screen
export const systemStatus = [
  { name: 'Patient Database', icon: '👥', threshold: 0.1 },
  { name: 'Medical Records', icon: '📋', threshold: 0.2 },
  { name: 'Scheduling System', icon: '📅', threshold: 0.3 },
  { name: 'Security Protocols', icon: '🔒', threshold: 0.4 },
  { name: 'Analytics Engine', icon: '📊', threshold: 0.5 },
  { name: 'AI Diagnostics', icon: '🤖', threshold: 0.6 },
  { name: 'Integration Layer', icon: '🔗', threshold: 0.7 },
  { name: 'Clinical Workflows', icon: '⚕️', threshold: 0.8 },
  { name: 'Patient Portal', icon: '🌐', threshold: 0.9 },
  { name: 'Final Checks', icon: '✅', threshold: 0.95 }
];

// Statistics and Metrics
export const statistics = [
  {
    value: '99.9%',
    label: 'System Uptime',
    description: 'Reliable healthcare operations',
    icon: '⚡',
    color: '#10b981'
  },
  {
    value: '500+',
    label: 'Healthcare Facilities',
    description: 'Trusted by providers worldwide',
    icon: '🏥',
    color: '#3b82f6'
  },
  {
    value: '2M+',
    label: 'Patients Served',
    description: 'Improving patient outcomes',
    icon: '👥',
    color: '#8b5cf6'
  },
  {
    value: '40%',
    label: 'Cost Reduction',
    description: 'Average operational savings',
    icon: '💰',
    color: '#f59e0b'
  },
  {
    value: '24/7',
    label: 'Support Available',
    description: 'Always here when you need us',
    icon: '🆘',
    color: '#ef4444'
  },
  {
    value: '150+',
    label: 'Integrations',
    description: 'Seamless third-party connections',
    icon: '🔗',
    color: '#06b6d4'
  }
];

// Pricing Tiers
export const pricingTiers = [
  {
    name: 'Starter',
    price: '$299',
    period: '/month',
    description: 'Perfect for small practices',
    features: [
      'Up to 5 providers',
      'Basic EHR functionality',
      'Patient portal',
      'Appointment scheduling',
      'Basic reporting',
      'Email support'
    ],
    color: '#3b82f6',
    popular: false
  },
  {
    name: 'Professional',
    price: '$599',
    period: '/month',
    description: 'Ideal for growing practices',
    features: [
      'Up to 15 providers',
      'Advanced EHR features',
      'Telemedicine',
      'Custom workflows',
      'Advanced analytics',
      'Priority support',
      'API access'
    ],
    color: '#10b981',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$1,299',
    period: '/month',
    description: 'For large healthcare organizations',
    features: [
      'Unlimited providers',
      'Full feature suite',
      'AI-powered insights',
      'Multi-location support',
      'Custom integrations',
      '24/7 dedicated support',
      'Training & consultation'
    ],
    color: '#8b5cf6',
    popular: false
  }
];

// Testimonials
export const testimonials = [
  {
    name: 'Dr. Sarah Johnson',
    title: 'Chief Medical Officer',
    organization: 'Metro Health Center',
    quote: 'ClinicStreams has transformed how we deliver healthcare. The AI analytics have helped us improve patient outcomes by 30%.',
    avatar: '👩‍⚕️',
    rating: 5
  },
  {
    name: 'Michael Chen',
    title: 'IT Director',
    organization: 'Regional Medical Group',
    quote: 'The integration capabilities are outstanding. We connected all our systems seamlessly in just 2 weeks.',
    avatar: '👨‍💼',
    rating: 5
  },
  {
    name: 'Dr. Emily Rodriguez',
    title: 'Practice Manager',
    organization: 'Family Care Associates',
    quote: 'Our administrative efficiency improved by 40% after implementing ClinicStreams. The ROI was immediate.',
    avatar: '👩‍⚕️',
    rating: 5
  }
];

// ROI Calculator Data
export const roiMetrics = {
  timeReduction: {
    adminTasks: 40,
    documentation: 35,
    billing: 50,
    scheduling: 60
  },
  costSavings: {
    staffReduction: 25,
    paperReduction: 80,
    errorReduction: 45,
    complianceCosts: 30
  },
  revenueIncrease: {
    patientVolume: 20,
    billableTime: 15,
    claimApproval: 25,
    patientSatisfaction: 35
  }
};

export default {
  featuresData,
  competitorsData,
  healthcareModules,
  journeySteps,
  navigationSteps,
  loadingStages,
  systemStatus,
  statistics,
  pricingTiers,
  testimonials,
  roiMetrics
};
