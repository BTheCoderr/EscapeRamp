'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Shield,
  Bot,
  BarChart3,
  ArrowRight,
  Download
} from 'lucide-react';
import Link from 'next/link';

interface AuditResults {
  migrationComplexity: string;
  estimatedTime: string;
  dataIntegrity: string;
  risks: string[];
  recommendations: string[];
  costEstimate: string;
  nextSteps: string[];
}

export default function AuditPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    currentSoftware: '',
    targetSoftware: '',
    urgency: '',
    painPoints: '',
    fileCount: '',
    dataSize: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditResults, setAuditResults] = useState<AuditResults | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAuditResults({
        migrationComplexity: 'Medium',
        estimatedTime: '18-24 hours',
        dataIntegrity: '98%',
        risks: ['Custom fields may need manual mapping', 'Some historical data formatting issues'],
        recommendations: ['Backup all data before migration', 'Schedule during off-peak hours'],
        costEstimate: '$2,500 - $3,500',
        nextSteps: ['Schedule consultation call', 'Prepare data backup', 'Review migration plan']
      });
      setIsAnalyzing(false);
      setStep(3);
    }, 3000);
  };

  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-green-100 text-green-800">
          <Shield className="w-4 h-4 mr-2" />
          Free Migration Audit
        </Badge>
        <h1 className="text-3xl font-bold mb-4">
          Get Your Free QuickBooks Migration Audit
        </h1>
        <p className="text-gray-600">
          Upload your QuickBooks files and get a comprehensive analysis of your migration needs, 
          potential risks, and estimated timeline - all for free.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Step 1: Basic Information
          </CardTitle>
          <CardDescription>
            Tell us about your current setup and migration goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <Input
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Your Company Inc."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Software *</label>
                <select
                  required
                  value={formData.currentSoftware}
                  onChange={(e) => handleInputChange('currentSoftware', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="">Select software</option>
                  <option value="QuickBooks Desktop Pro">QuickBooks Desktop Pro</option>
                  <option value="QuickBooks Desktop Premier">QuickBooks Desktop Premier</option>
                  <option value="QuickBooks Desktop Enterprise">QuickBooks Desktop Enterprise</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Target Software *</label>
                <select
                  required
                  value={formData.targetSoftware}
                  onChange={(e) => handleInputChange('targetSoftware', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="">Select target</option>
                  <option value="QuickBooks Online">QuickBooks Online</option>
                  <option value="Xero">Xero</option>
                  <option value="FreshBooks">FreshBooks</option>
                  <option value="Wave">Wave</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Migration Urgency *</label>
              <select
                required
                value={formData.urgency}
                onChange={(e) => handleInputChange('urgency', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="">Select urgency</option>
                <option value="ASAP">ASAP (Within 1 week)</option>
                <option value="1-2 weeks">1-2 weeks</option>
                <option value="1-2 months">1-2 months</option>
                <option value="Just exploring">Just exploring</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Biggest Pain Points</label>
              <Textarea
                value={formData.painPoints}
                onChange={(e) => handleInputChange('painPoints', e.target.value)}
                placeholder="What challenges are you facing with your current setup?"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Number of QuickBooks Files</label>
                <Input
                  type="number"
                  value={formData.fileCount}
                  onChange={(e) => handleInputChange('fileCount', e.target.value)}
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Total Data Size (GB)</label>
                <Input
                  type="number"
                  value={formData.dataSize}
                  onChange={(e) => handleInputChange('dataSize', e.target.value)}
                  placeholder="2.5"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              <Bot className="w-4 h-4 mr-2" />
              Start Free Analysis
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bot className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-4">AI Analysis in Progress</h2>
        <p className="text-gray-600 mb-6">
          Our AI is analyzing your migration requirements and generating a comprehensive report...
        </p>
        <Progress value={75} className="mb-4" />
        <p className="text-sm text-gray-500">Analyzing data structure and mapping requirements...</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 text-left">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-medium">Data Validation</span>
            </div>
            <p className="text-sm text-gray-600">Checking file integrity and data quality</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <BarChart3 className="w-5 h-5 text-blue-500 mr-2" />
              <span className="font-medium">Complexity Assessment</span>
            </div>
            <p className="text-sm text-gray-600">Evaluating migration complexity and risks</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-purple-500 mr-2" />
              <span className="font-medium">Timeline Estimation</span>
            </div>
            <p className="text-sm text-gray-600">Calculating optimal migration timeline</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Your Migration Audit is Ready!</h1>
        <p className="text-gray-600">
          Here's your comprehensive analysis and personalized migration plan
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Migration Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Complexity</label>
                  <p className="text-lg font-semibold">{auditResults?.migrationComplexity}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Estimated Time</label>
                  <p className="text-lg font-semibold">{auditResults?.estimatedTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Data Integrity</label>
                  <p className="text-lg font-semibold text-green-600">{auditResults?.dataIntegrity}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Cost Estimate</label>
                  <p className="text-lg font-semibold">{auditResults?.costEstimate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Potential Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {auditResults?.risks.map((risk: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {auditResults?.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {auditResults?.nextSteps.map((step: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/dashboard">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Start Migration
                </Button>
              </Link>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" className="w-full">
                Schedule Consultation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
} 