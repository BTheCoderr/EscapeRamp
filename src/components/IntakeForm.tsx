'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '@/lib/store';
import { cn, getUrgencyColor } from '@/lib/utils';
import { Upload, FileText, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const intakeSchema = z.object({
  current_software: z.string().min(1, 'Current software is required'),
  target_software: z.string().min(1, 'Target software is required'),
  urgency: z.enum(['low', 'medium', 'high', 'critical']),
  data_preservation_requirements: z.array(z.string()).min(1, 'At least one data requirement is needed'),
  additional_notes: z.string().optional(),
});

type IntakeFormData = z.infer<typeof intakeSchema>;

const softwareOptions = [
  'QuickBooks Desktop Pro',
  'QuickBooks Desktop Premier',
  'QuickBooks Desktop Enterprise',
  'QuickBooks Online',
  'Xero',
  'Sage',
  'FreshBooks',
  'Wave',
  'Other',
];

const targetSoftwareOptions = [
  'QuickBooks Online',
  'Xero',
  'Sage Intacct',
  'NetSuite',
  'FreshBooks',
  'Wave',
  'Zoho Books',
  'Other',
];

const dataRequirements = [
  'Chart of Accounts',
  'Customer Records',
  'Vendor Records',
  'Transaction History',
  'Inventory Items',
  'Employee Records',
  'Bank Reconciliations',
  'Custom Fields',
  'Reports and Templates',
  'Attachments and Documents',
];

export function IntakeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { setIntakeResponse, setCurrentMigration } = useAppStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IntakeFormData>({
    resolver: zodResolver(intakeSchema),
    defaultValues: {
      urgency: 'medium',
      data_preservation_requirements: [],
    },
  });

  const watchedUrgency = watch('urgency');
  const watchedRequirements = watch('data_preservation_requirements');

  const onSubmit = async (data: IntakeFormData) => {
    setIsSubmitting(true);
    
    try {
      // For demo purposes, we'll use a mock user ID
      const mockUserId = 'demo-user-123';
      
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          user_id: mockUserId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit intake form');
      }

      const result = await response.json();
      
      // Update store with the response
      setIntakeResponse({
        id: result.intake_response_id,
        migration_id: result.migration_id,
        current_software: data.current_software,
        target_software: data.target_software,
        urgency: data.urgency,
        data_preservation_requirements: data.data_preservation_requirements,
        additional_notes: data.additional_notes,
        created_at: new Date().toISOString(),
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Intake submission error:', error);
      alert('Failed to submit intake form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRequirement = (requirement: string) => {
    const current = watchedRequirements;
    const updated = current.includes(requirement)
      ? current.filter(r => r !== requirement)
      : [...current, requirement];
    setValue('data_preservation_requirements', updated);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Intake Form Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your submission. Our AI assistant is analyzing your requirements
            and will generate a personalized migration plan for you.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• AI analysis of your migration requirements</li>
              <li>• Personalized migration plan generation</li>
              <li>• File upload and analysis phase</li>
              <li>• Step-by-step migration guidance</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Migration Intake Form
        </h1>
        <p className="text-gray-600">
          Tell us about your current setup and migration needs
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Current Software */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What software are you currently using?
          </label>
          <select
            {...register('current_software')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select your current software</option>
            {softwareOptions.map((software) => (
              <option key={software} value={software}>
                {software}
              </option>
            ))}
          </select>
          {errors.current_software && (
            <p className="mt-1 text-sm text-red-600">{errors.current_software.message}</p>
          )}
        </div>

        {/* Target Software */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What software would you like to migrate to?
          </label>
          <select
            {...register('target_software')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select your target software</option>
            {targetSoftwareOptions.map((software) => (
              <option key={software} value={software}>
                {software}
              </option>
            ))}
          </select>
          {errors.target_software && (
            <p className="mt-1 text-sm text-red-600">{errors.target_software.message}</p>
          )}
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How urgent is this migration?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['low', 'medium', 'high', 'critical'] as const).map((urgency) => (
              <label
                key={urgency}
                className={cn(
                  'flex items-center p-3 border rounded-lg cursor-pointer transition-colors',
                  watchedUrgency === urgency
                    ? getUrgencyColor(urgency)
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <input
                  type="radio"
                  value={urgency}
                  {...register('urgency')}
                  className="sr-only"
                />
                <div className="flex items-center space-x-2">
                  {urgency === 'critical' && <AlertCircle className="w-4 h-4" />}
                  {urgency === 'high' && <Clock className="w-4 h-4" />}
                  {urgency === 'medium' && <FileText className="w-4 h-4" />}
                  {urgency === 'low' && <CheckCircle className="w-4 h-4" />}
                  <span className="capitalize font-medium">{urgency}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Data Preservation Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What data do you need to preserve? (Select all that apply)
          </label>
          <div className="grid grid-cols-1 gap-2">
            {dataRequirements.map((requirement) => (
              <label
                key={requirement}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={watchedRequirements.includes(requirement)}
                  onChange={() => toggleRequirement(requirement)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm">{requirement}</span>
              </label>
            ))}
          </div>
          {errors.data_preservation_requirements && (
            <p className="mt-1 text-sm text-red-600">
              {errors.data_preservation_requirements.message}
            </p>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            {...register('additional_notes')}
            rows={4}
            placeholder="Any specific requirements, challenges, or questions about your migration..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </div>
          ) : (
            'Submit Intake Form'
          )}
        </button>
      </form>
    </div>
  );
} 