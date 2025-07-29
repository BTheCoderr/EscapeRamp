'use client';

import { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  XCircle,
  Info,
  Calculator,
  Zap,
  Shield,
  Users,
  Clock,
  Star,
  Calendar
} from 'lucide-react';

interface PricingPlan {
  name: string;
  provider: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  pros: string[];
  cons: string[];
  rating: number;
  category: 'accounting' | 'erp' | 'specialized';
  setupCost: number;
  migrationCost: number;
  totalFirstYear: number;
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'QuickBooks Online',
    provider: 'Intuit',
    monthlyPrice: 30,
    annualPrice: 300,
    features: [
      'Basic accounting',
      'Invoice creation',
      'Expense tracking',
      'Bank reconciliation',
      'Mobile app',
      'Basic reporting'
    ],
    pros: [
      'Widely recognized',
      'Easy to use',
      'Good mobile app',
      'Large user community'
    ],
    cons: [
      'Annual price increases',
      'Limited customization',
      'Add-ons are expensive',
      'Poor customer support'
    ],
    rating: 3.5,
    category: 'accounting',
    setupCost: 0,
    migrationCost: 500,
    totalFirstYear: 860
  },
  {
    name: 'Xero',
    provider: 'Xero Limited',
    monthlyPrice: 25,
    annualPrice: 250,
    features: [
      'Advanced accounting',
      'Multi-currency',
      'Project tracking',
      'Advanced reporting',
      '800+ integrations',
      'Real-time collaboration'
    ],
    pros: [
      'Better value for money',
      'Superior reporting',
      'Excellent integrations',
      'Great customer support'
    ],
    cons: [
      'Learning curve',
      'Limited payroll options',
      'Some features complex'
    ],
    rating: 4.2,
    category: 'accounting',
    setupCost: 0,
    migrationCost: 400,
    totalFirstYear: 650
  },
  {
    name: 'Sage Intacct',
    provider: 'Sage',
    monthlyPrice: 400,
    annualPrice: 4800,
    features: [
      'Enterprise accounting',
      'Multi-entity management',
      'Advanced analytics',
      'Custom dashboards',
      'Workflow automation',
      'Advanced security'
    ],
    pros: [
      'Enterprise-grade',
      'Excellent reporting',
      'Scalable',
      'Strong security'
    ],
    cons: [
      'Expensive',
      'Complex setup',
      'Requires training',
      'Overkill for small businesses'
    ],
    rating: 4.0,
    category: 'erp',
    setupCost: 2000,
    migrationCost: 1500,
    totalFirstYear: 8300
  },
  {
    name: 'FreshBooks',
    provider: 'FreshBooks',
    monthlyPrice: 17,
    annualPrice: 170,
    features: [
      'Simple invoicing',
      'Time tracking',
      'Expense management',
      'Client portal',
      'Mobile app',
      'Basic reporting'
    ],
    pros: [
      'Very user-friendly',
      'Great for freelancers',
      'Affordable',
      'Good mobile experience'
    ],
    cons: [
      'Limited accounting features',
      'Not suitable for complex businesses',
      'Limited integrations'
    ],
    rating: 4.1,
    category: 'accounting',
    setupCost: 0,
    migrationCost: 300,
    totalFirstYear: 470
  },
  {
    name: 'Wave',
    provider: 'Wave Financial',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      'Free accounting',
      'Invoice creation',
      'Expense tracking',
      'Receipt scanning',
      'Basic reporting',
      'Mobile app'
    ],
    pros: [
      'Completely free',
      'Easy to use',
      'Good for small businesses',
      'No hidden fees'
    ],
    cons: [
      'Limited features',
      'No advanced reporting',
      'Limited support',
      'May not scale well'
    ],
    rating: 3.8,
    category: 'accounting',
    setupCost: 0,
    migrationCost: 200,
    totalFirstYear: 200
  }
];

export function CostComparison() {
  const [selectedPlans, setSelectedPlans] = useState<string[]>(['QuickBooks Online', 'Xero']);
  const [timeframe, setTimeframe] = useState<'monthly' | 'annual' | '3year'>('annual');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const filteredPlans = pricingPlans.filter(plan => selectedPlans.includes(plan.name));

  const getTimeframeMultiplier = () => {
    switch (timeframe) {
      case 'monthly': return 1;
      case 'annual': return 12;
      case '3year': return 36;
      default: return 12;
    }
  };

  const calculateTotalCost = (plan: PricingPlan) => {
    const multiplier = getTimeframeMultiplier();
    const subscriptionCost = timeframe === 'monthly' 
      ? plan.monthlyPrice * multiplier 
      : (timeframe === 'annual' ? plan.annualPrice : plan.annualPrice * 3);
    
    return subscriptionCost + plan.setupCost + plan.migrationCost;
  };

  const getSavings = (currentPlan: PricingPlan, newPlan: PricingPlan) => {
    const currentCost = calculateTotalCost(currentPlan);
    const newCost = calculateTotalCost(newPlan);
    return currentCost - newCost;
  };

  const getROI = (savings: number, migrationCost: number) => {
    if (migrationCost === 0) return Infinity;
    return ((savings - migrationCost) / migrationCost) * 100;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Cost Comparison Calculator
        </h1>
        <p className="text-gray-600">
          Compare QuickBooks alternatives and see your potential savings
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Compare Plans
            </label>
            <div className="space-y-2">
              {pricingPlans.map((plan) => (
                <label key={plan.name} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedPlans.includes(plan.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPlans(prev => [...prev, plan.name]);
                      } else {
                        setSelectedPlans(prev => prev.filter(p => p !== plan.name));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900">{plan.name}</span>
                  <span className="text-xs text-gray-500">({plan.provider})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Timeframe Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Timeframe
            </label>
            <div className="space-y-2">
              {[
                { value: 'monthly', label: 'Monthly', icon: Clock },
                { value: 'annual', label: 'Annual', icon: Calendar },
                { value: '3year', label: '3 Years', icon: TrendingUp }
              ].map((option) => {
                const Icon = option.icon;
                return (
                  <label key={option.value} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value={option.value}
                      checked={timeframe === option.value}
                      onChange={(e) => setTimeframe(e.target.value as any)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{option.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Setup Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Migration Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total ({timeframe === 'monthly' ? '1 month' : timeframe === 'annual' ? '1 year' : '3 years'})
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  vs QuickBooks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPlans.map((plan) => {
                const totalCost = calculateTotalCost(plan);
                const quickbooksPlan = pricingPlans.find(p => p.name === 'QuickBooks Online');
                const savings = quickbooksPlan ? getSavings(quickbooksPlan, plan) : 0;
                const roi = getROI(savings, plan.migrationCost);

                return (
                  <tr key={plan.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                        <div className="text-sm text-gray-500">{plan.provider}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${timeframe === 'monthly' ? plan.monthlyPrice : plan.annualPrice / 12}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${plan.setupCost}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${plan.migrationCost}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${totalCost.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {savings !== 0 && (
                        <div className={`flex items-center space-x-1 ${savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {savings > 0 ? (
                            <TrendingDown className="w-4 h-4" />
                          ) : (
                            <TrendingUp className="w-4 h-4" />
                          )}
                          <span className="text-sm font-medium">
                            ${Math.abs(savings).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= plan.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">({plan.rating})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setShowDetails(showDetails === plan.name ? null : plan.name)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {showDetails === plan.name ? 'Hide' : 'Details'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Expandable Details */}
        {showDetails && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            {filteredPlans
              .filter(plan => showDetails === plan.name)
              .map((plan) => {
                const totalCost = calculateTotalCost(plan);
                const quickbooksPlan = pricingPlans.find(p => p.name === 'QuickBooks Online');
                const savings = quickbooksPlan ? getSavings(quickbooksPlan, plan) : 0;
                const roi = getROI(savings, plan.migrationCost);

                return (
                  <div key={plan.name} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Features */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Features</h4>
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pros */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Pros</h4>
                        <ul className="space-y-2">
                          {plan.pros.map((pro, index) => (
                            <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Cons */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Cons</h4>
                        <ul className="space-y-2">
                          {plan.cons.map((con, index) => (
                            <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* ROI Analysis */}
                    {savings > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-medium text-green-900 mb-2">ROI Analysis</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-green-700">Total Savings:</span>
                            <div className="font-semibold text-green-900">${savings.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-green-700">ROI:</span>
                            <div className="font-semibold text-green-900">{roi.toFixed(1)}%</div>
                          </div>
                          <div>
                            <span className="text-green-700">Payback Period:</span>
                            <div className="font-semibold text-green-900">
                              {roi > 0 ? `${(plan.migrationCost / (savings / getTimeframeMultiplier())).toFixed(1)} months` : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Migration Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              ${Math.max(...filteredPlans.map(p => getSavings(pricingPlans[0], p))).toLocaleString()}
            </div>
            <div className="text-sm text-blue-700">Maximum Potential Savings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {filteredPlans.length}
            </div>
            <div className="text-sm text-blue-700">Alternatives Compared</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {filteredPlans.filter(p => getSavings(pricingPlans[0], p) > 0).length}
            </div>
            <div className="text-sm text-blue-700">Cost-Effective Options</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.max(...filteredPlans.map(p => p.rating)).toFixed(1)}
            </div>
            <div className="text-sm text-blue-700">Highest Rated Alternative</div>
          </div>
        </div>
      </div>
    </div>
  );
} 