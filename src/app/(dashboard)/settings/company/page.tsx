"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { Company } from "@/lib/mock/types";
import { companyRepo } from "@/lib/mock/repository";

const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  address: z.object({
    line1: z.string().min(1, "Address line 1 is required"),
    line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "ZIP code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  taxId: z.string().optional(),
  fiscalYearStart: z.number().min(1).max(12),
  baseCurrency: z.string().min(3, "Currency code is required"),
  dateFormat: z.string().min(1, "Date format is required"),
  timeZone: z.string().min(1, "Time zone is required"),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export default function CompanySettingsPage() {
  const [company, setCompany] = React.useState<Company | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        zip: "",
        country: "United States",
      },
      phone: "",
      email: "",
      website: "",
      taxId: "",
      fiscalYearStart: 1,
      baseCurrency: "USD",
      dateFormat: "MM/dd/yyyy",
      timeZone: "America/Los_Angeles",
    },
  });

  React.useEffect(() => {
    const loadCompany = async () => {
      try {
        const companyData = await companyRepo.get();
        setCompany(companyData);
        
        // Update form with loaded data
        form.reset({
          name: companyData.name,
          address: companyData.address || {
            line1: "",
            line2: "",
            city: "",
            state: "",
            zip: "",
            country: "United States",
          },
          phone: companyData.phone || "",
          email: companyData.email || "",
          website: companyData.website || "",
          taxId: companyData.taxId || "",
          fiscalYearStart: companyData.fiscalYearStart,
          baseCurrency: companyData.baseCurrency,
          dateFormat: companyData.dateFormat,
          timeZone: companyData.timeZone,
        });
      } catch (error) {
        console.error("Failed to load company data:", error);
        toast.error("Failed to load company settings");
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [form]);

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      setSaving(true);
      await companyRepo.update(data);
      toast.success("Company settings saved successfully");
    } catch (error) {
      console.error("Failed to save company settings:", error);
      toast.error("Failed to save company settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Company Information</h3>
          <p className="text-sm text-muted-foreground">
            Update your company details and business information.
          </p>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="animate-pulse h-5 bg-muted rounded w-32"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse h-10 bg-muted rounded"></div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Company Information</h3>
        <p className="text-sm text-muted-foreground">
          Update your company details and business information.
        </p>
      </div>
      
      <Separator />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Your company's basic details and contact information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Enter company name"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID / EIN</Label>
                <Input
                  id="taxId"
                  {...form.register("taxId")}
                  placeholder="XX-XXXXXXX"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...form.register("phone")}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="info@company.com"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                {...form.register("website")}
                placeholder="https://www.company.com"
              />
              {form.formState.errors.website && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.website.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle>Business Address</CardTitle>
            <CardDescription>
              Your company's physical address for invoices and legal documents.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address.line1">Address Line 1 *</Label>
              <Input
                id="address.line1"
                {...form.register("address.line1")}
                placeholder="123 Main Street"
              />
              {form.formState.errors.address?.line1 && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.address.line1.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address.line2">Address Line 2</Label>
              <Input
                id="address.line2"
                {...form.register("address.line2")}
                placeholder="Suite 100"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address.city">City *</Label>
                <Input
                  id="address.city"
                  {...form.register("address.city")}
                  placeholder="San Francisco"
                />
                {form.formState.errors.address?.city && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.address.city.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address.state">State *</Label>
                <Input
                  id="address.state"
                  {...form.register("address.state")}
                  placeholder="CA"
                />
                {form.formState.errors.address?.state && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.address.state.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address.zip">ZIP Code *</Label>
                <Input
                  id="address.zip"
                  {...form.register("address.zip")}
                  placeholder="94105"
                />
                {form.formState.errors.address?.zip && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.address.zip.message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address.country">Country *</Label>
              <Select
                value={form.watch("address.country")}
                onValueChange={(value) => form.setValue("address.country", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Business Settings</CardTitle>
            <CardDescription>
              Configure your fiscal year, currency, and regional settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fiscalYearStart">Fiscal Year Start</Label>
                <Select
                  value={form.watch("fiscalYearStart").toString()}
                  onValueChange={(value) => form.setValue("fiscalYearStart", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">January</SelectItem>
                    <SelectItem value="2">February</SelectItem>
                    <SelectItem value="3">March</SelectItem>
                    <SelectItem value="4">April</SelectItem>
                    <SelectItem value="5">May</SelectItem>
                    <SelectItem value="6">June</SelectItem>
                    <SelectItem value="7">July</SelectItem>
                    <SelectItem value="8">August</SelectItem>
                    <SelectItem value="9">September</SelectItem>
                    <SelectItem value="10">October</SelectItem>
                    <SelectItem value="11">November</SelectItem>
                    <SelectItem value="12">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="baseCurrency">Base Currency</Label>
                <Select
                  value={form.watch("baseCurrency")}
                  onValueChange={(value) => form.setValue("baseCurrency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select
                  value={form.watch("dateFormat")}
                  onValueChange={(value) => form.setValue("dateFormat", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/dd/yyyy">MM/dd/yyyy</SelectItem>
                    <SelectItem value="dd/MM/yyyy">dd/MM/yyyy</SelectItem>
                    <SelectItem value="yyyy-MM-dd">yyyy-MM-dd</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeZone">Time Zone</Label>
                <Select
                  value={form.watch("timeZone")}
                  onValueChange={(value) => form.setValue("timeZone", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
