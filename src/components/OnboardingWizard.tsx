'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  HelpCircle, 
  Calculator,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  questions: OnboardingQuestion[];
}

interface OnboardingQuestion {
  id: string;
  question: string;
  type: 'radio' | 'checkbox' | 'text' | 'number';
  options?: string[];
  help?: string;
  required?: boolean;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Escape Ramp',
    description: 'Let\'s make your QuickBooks migration smooth and stress-free',
    icon: Shield,
    questions: [
      {
        id: 'experience_level',
        question: 'How would you describe your accounting experience?',
        type: 'radio',
        options: [
          'I\'m new to accounting software',
          'I use QuickBooks regularly',
          'I\'m an accounting professional',
          'I manage multiple businesses'
        ],
        help: 'This helps us customize your migration plan'
      }
    ]
  },
  {
    id: 'current_setup',
    title: 'Your Current Setup',
    description: 'Tell us about your QuickBooks configuration',
    icon: Calculator,
    questions: [
      {
        id: 'quickbooks_version',
        question: 'Which QuickBooks version are you using?',
        type: 'radio',
        options: [
          'QuickBooks Desktop Pro',
          'QuickBooks Desktop Premier',
          'QuickBooks Desktop Enterprise',
          'QuickBooks Online',
          'I\'m not sure'
        ],
        required: true
      },
      {
        id: 'business_size',
        question: 'How many transactions do you process monthly?',
        type: 'radio',
        options: [
          'Less than 100',
          '100-500',
          '500-1000',
          '1000+'
        ],
        help: 'This affects migration complexity and timeline'
      },
      {
        id: 'key_features',
        question: 'Which features are most important to you?',
        type: 'checkbox',
        options: [
          'Invoicing and payments',
          'Expense tracking',
          'Payroll',
          'Inventory management',
          'Multi-user access',
          'Mobile app access',
          'Third-party integrations',
          'Advanced reporting'
        ],
        help: 'Select all that apply'
      }
    ]
  },
  {
    id: 'migration_goals',
    title: 'Migration Goals',
    description: 'What do you want to achieve with this migration?',
    icon: TrendingUp,
    questions: [
      {
        id: 'primary_reason',
        question: 'What\'s your main reason for migrating?',
        type: 'radio',
        options: [
          'Reduce costs',
          'Better features and functionality',
          'Cloud access and mobility',
          'Better customer support',
          'Integration with other tools',
          'Compliance requirements'
        ],
        required: true
      },
      {
        id: 'timeline',
        question: 'When do you need to complete the migration?',
        type: 'radio',
        options: [
          'ASAP (within 1 week)',
          'Soon (within 1 month)',
          'Flexible (1-3 months)',
          'No rush (3+ months)'
        ],
        help: 'This helps us prioritize your migration'
      },
      {
        id: 'budget_range',
        question: 'What\'s your budget for the new software?',
        type: 'radio',
        options: [
          'Under $50/month',
          '$50-100/month',
          '$100-200/month',
          '$200+/month',
          'I need to see the options first'
        ]
      }
    ]
  },
  {
    id: 'data_priorities',
    title: 'Data Priorities',
    description: 'What data is most critical to preserve?',
    icon: Clock,
    questions: [
      {
        id: 'critical_data',
        question: 'Which data is absolutely critical to preserve?',
        type: 'checkbox',
        options: [
          'Chart of accounts',
          'Customer and vendor records',
          'Transaction history',
          'Bank reconciliations',
          'Custom fields and forms',
          'Reports and templates',
          'Attachments and documents',
          'User permissions and roles'
        ],
        required: true
      },
      {
        id: 'data_volume',
        question: 'How many years of data do you need to migrate?',
        type: 'radio',
        options: [
          'Current year only',
          'Last 2 years',
          'Last 5 years',
          'All historical data',
          'I\'m not sure'
        ]
      }
    ]
  }
];

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showHelp, setShowHelp] = useState<string | null>(null);
  const { setUser } = useAppStore();

  const currentStepData = onboardingSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === onboardingSteps.length - 1;

  const handleAnswer = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const canProceed = () => {
    const currentQuestions = currentStepData.questions;
    return currentQuestions.every(q => {
      if (!q.required) return true;
      const answer = answers[q.id];
      if (q.type === 'checkbox') {
        return Array.isArray(answer) && answer.length > 0;
      }
      return answer !== undefined && answer !== '';
    });
  };

  const handleNext = () => {
    if (isLastStep) {
      // Complete onboarding
      completeOnboarding();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const completeOnboarding = async () => {
    try {
      // Create user profile based on onboarding answers
      const userProfile = {
        id: 'demo-user-123',
        email: 'demo@escaperamp.com',
        name: 'Demo User',
        company_name: 'Demo Company',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(userProfile);

      // You could also save this to your database here
      console.log('Onboarding completed:', userProfile);
      
      // Redirect to main dashboard or show completion
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / onboardingSteps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Escape Ramp
          </h1>
          <p className="text-gray-600">
            Let&apos;s create your personalized migration plan
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {onboardingSteps.length}</span>
            <span>{Math.round(getProgressPercentage())}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Step Header */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <currentStepData.icon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600">{currentStepData.description}</p>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {currentStepData.questions.map((question) => (
              <div key={question.id} className="space-y-3">
                <div className="flex items-start justify-between">
                  <label className="text-lg font-medium text-gray-900">
                    {question.question}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {question.help && (
                    <button
                      onClick={() => setShowHelp(showHelp === question.id ? null : question.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <HelpCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {question.help && showHelp === question.id && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">{question.help}</p>
                  </div>
                )}

                {/* Question Input */}
                <div className="space-y-2">
                  {question.type === 'radio' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors"
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={(e) => handleAnswer(question.id, e.target.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-gray-900">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === 'checkbox' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={Array.isArray(answers[question.id]) && answers[question.id].includes(option)}
                            onChange={(e) => {
                              const current = Array.isArray(answers[question.id]) ? (answers[question.id] as string[]) : [];
                              const updated = e.target.checked
                                ? [...current, option]
                                : current.filter((item: string) => item !== option);
                              handleAnswer(question.id, updated);
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-900">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === 'text' && (
                    <textarea
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswer(question.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Enter your answer..."
                    />
                  )}

                  {question.type === 'number' && (
                    <input
                      type="number"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswer(question.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter a number..."
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={isFirstStep}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>{isLastStep ? 'Complete Setup' : 'Next'}</span>
              {!isLastStep && <ArrowRight className="w-4 h-4" />}
              {isLastStep && <CheckCircle className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Skip onboarding and go to dashboard
          </button>
        </div>
      </div>
    </div>
  );
} 