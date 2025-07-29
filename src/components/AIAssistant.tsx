'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  type: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

interface IntakeData {
  user_email: string;
  software_used: string;
  urgency_level: 'ASAP' | '1-3 months' | 'Just exploring';
  pain_points: string;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi there 👋 I'm your Escape Ramp assistant. I can help guide your transition off QuickBooks Desktop. Let's get started!",
      timestamp: new Date(),
    }
  ]);
  const [currentStep, setCurrentStep] = useState<'welcome' | 'software' | 'urgency' | 'pain_points' | 'email' | 'complete'>('welcome');
  const [intakeData, setIntakeData] = useState<Partial<IntakeData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSubmitting]);

  const softwareOptions = [
    'QuickBooks Desktop Pro',
    'QuickBooks Desktop Premier',
    'QuickBooks Desktop Enterprise',
    'QuickBooks Online',
    'Xero',
    'FreshBooks',
    'Wave',
    'Other'
  ];

  const urgencyOptions = [
    { value: 'ASAP', label: 'ASAP - Need to migrate immediately', icon: AlertCircle },
    { value: '1-3 months', label: '1-3 months - Planning ahead', icon: Clock },
    { value: 'Just exploring', label: 'Just exploring options', icon: MessageCircle }
  ];

  const addMessage = (content: string, type: 'assistant' | 'user' = 'assistant') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSoftwareSelect = (software: string) => {
    setIntakeData(prev => ({ ...prev, software_used: software }));
    addMessage(`I'm currently using: ${software}`);
    
    setTimeout(() => {
      addMessage("Great! Now, how urgent is your migration?");
      setCurrentStep('urgency');
    }, 1000);
  };

  const handleUrgencySelect = (urgency: 'ASAP' | '1-3 months' | 'Just exploring') => {
    setIntakeData(prev => ({ ...prev, urgency_level: urgency }));
    addMessage(`My urgency level is: ${urgency}`);
    
    setTimeout(() => {
      addMessage("What's been the biggest blocker or frustration with your current setup?");
      setCurrentStep('pain_points');
    }, 1000);
  };

  const handlePainPointsSubmit = () => {
    if (!userInput.trim()) return;
    
    setIntakeData(prev => ({ ...prev, pain_points: userInput }));
    addMessage(userInput, 'user');
    setUserInput('');
    
    setTimeout(() => {
      addMessage("Thanks for sharing! What's your email address so we can send you your custom migration plan?");
      setCurrentStep('email');
    }, 1000);
  };

  const handleEmailSubmit = async () => {
    if (!userInput.trim() || !userInput.includes('@')) return;
    
    setIntakeData(prev => ({ ...prev, user_email: userInput }));
    addMessage(userInput, 'user');
    setUserInput('');
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...intakeData,
          user_email: userInput,
        }),
      });

      const result = await response.json();

      if (result.success) {
        addMessage("Got it! We'll use this to prep your custom migration plan.");
        
        if (intakeData.urgency_level === 'ASAP') {
          addMessage("Since you need this ASAP, I recommend scheduling a call or uploading your files immediately. Would you like to do that now?");
        }
        
        setCurrentStep('complete');
      } else {
        addMessage("Sorry, there was an issue saving your information. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting intake:', error);
      addMessage("Sorry, there was an issue saving your information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputSubmit = () => {
    if (!userInput.trim()) return;

    if (currentStep === 'pain_points') {
      handlePainPointsSubmit();
    } else if (currentStep === 'email') {
      handleEmailSubmit();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleInputSubmit();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            AI Migration Assistant
          </CardTitle>
          <CardDescription>
            Let me help you plan your QuickBooks migration
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <Card className="mb-6 h-[500px] overflow-hidden">
        <CardContent className="p-0">
          <div className="h-full flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isSubmitting && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Processing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              {currentStep === 'welcome' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-3">What accounting software are you using?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {softwareOptions.map((software) => (
                      <Button
                        key={software}
                        variant="outline"
                        onClick={() => handleSoftwareSelect(software)}
                        className="justify-start text-left h-auto py-3"
                      >
                        {software}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 'urgency' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-3">How urgent is your migration?</p>
                  <div className="space-y-2">
                    {urgencyOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <Button
                          key={option.value}
                          variant="outline"
                          onClick={() => handleUrgencySelect(option.value as any)}
                          className="justify-start text-left h-auto py-3 w-full"
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {option.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              {(currentStep === 'pain_points' || currentStep === 'email') && (
                <div className="flex gap-2">
                  {currentStep === 'pain_points' ? (
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Tell me about your biggest challenges..."
                      className="flex-1"
                      rows={2}
                    />
                  ) : (
                    <Input
                      type="email"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="your@email.com"
                      className="flex-1"
                    />
                  )}
                  <Button
                    onClick={handleInputSubmit}
                    disabled={!userInput.trim() || isSubmitting}
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {currentStep === 'complete' && (
                <div className="text-center py-4">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Your migration plan is being prepared! We'll email you shortly.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      {Object.keys(intakeData).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Migration Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {intakeData.software_used && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Software:</span>
                  <Badge variant="secondary">{intakeData.software_used}</Badge>
                </div>
              )}
              {intakeData.urgency_level && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Urgency:</span>
                  <Badge variant={intakeData.urgency_level === 'ASAP' ? 'destructive' : 'secondary'}>
                    {intakeData.urgency_level}
                  </Badge>
                </div>
              )}
              {intakeData.pain_points && (
                <div>
                  <span className="text-sm text-gray-600">Pain Points:</span>
                  <p className="text-sm mt-1">{intakeData.pain_points}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 