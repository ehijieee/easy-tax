'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { calculatePersonalIncomeTax } from '@/lib/tax-calculator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calculator, Volume2, VolumeX, Save, Download } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function CalculatorPage() {
  const [language, setLanguage] = useState<'english' | 'pidgin'>('english')
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [formData, setFormData] = useState({
    income: '',
    occupation: '',
    businessType: '',
    state: ''
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const content = {
    english: {
      title: 'Tax Calculator',
      description: 'Calculate your federal and state taxes using official Nigerian tax brackets',
      income: 'Annual Income (₦)',
      occupation: 'Occupation',
      businessType: 'Business Type',
      state: 'State',
      calculate: 'Calculate Tax',
      saving: 'Saving calculation...',
      save: 'Save Calculation',
      download: 'Download Report',
      federalTax: 'Federal Tax',
      stateTax: 'State Tax',
      totalTax: 'Total Tax',
      effectiveRate: 'Effective Rate',
      taxableIncome: 'Taxable Income',
      personalAllowance: 'Personal Allowance',
      consolidatedRelief: 'Consolidated Relief',
      calculateAgain: 'Calculate Again',
      backToHome: 'Back to Home'
    },
    pidgin: {
      title: 'Tax Calculator',
      description: 'Calculate your federal and state tax using government tax brackets',
      income: 'Annual Income (₦)',
      occupation: 'Occupation',
      businessType: 'Business Type',
      state: 'State',
      calculate: 'Calculate Tax',
      saving: 'Saving calculation...',
      save: 'Save Calculation',
      download: 'Download Report',
      federalTax: 'Federal Tax',
      stateTax: 'State Tax',
      totalTax: 'Total Tax',
      effectiveRate: 'Effective Rate',
      taxableIncome: 'Taxable Income',
      personalAllowance: 'Personal Allowance',
      consolidatedRelief: 'Consolidated Relief',
      calculateAgain: 'Calculate Again',
      backToHome: 'Back to Home'
    }
  }

  const currentContent = content[language]

  const occupations = [
    'Employee (PAYE)',
    'Self-Employed',
    'Business Owner',
    'Freelancer',
    'Contractor',
    'Other'
  ]

  const businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'Limited Liability Company',
    'Public Limited Company',
    'Cooperative Society',
    'Other'
  ]

  const states = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
    'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
    'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
    'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
    'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
    'FCT Abuja'
  ]

  const handleCalculate = () => {
    const income = parseFloat(formData.income)
    if (!income || income <= 0) return

    const calculation = calculatePersonalIncomeTax(income)
    setResult(calculation)
  }

  const handleSave = async () => {
    if (!result) return

    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { error } = await supabase
          .from('tax_calculations')
          .insert({
            user_id: user.id,
            income: parseFloat(formData.income),
            business_type: formData.businessType,
            occupation: formData.occupation,
            federal_tax: result.federalTax,
            state_tax: result.stateTax
          })

        if (error) {
          console.error('Error saving calculation:', error)
        }
      }
    } catch (error) {
      console.error('Error saving calculation:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDownload = () => {
    if (!result) return

    const report = `
Tax Calculation Report
====================
Income: ${formatCurrency(parseFloat(formData.income))}
Occupation: ${formData.occupation}
Business Type: ${formData.businessType}
State: ${formData.state}

Tax Breakdown:
- Federal Tax: ${formatCurrency(result.federalTax)}
- State Tax: ${formatCurrency(result.stateTax)}
- Total Tax: ${formatCurrency(result.totalTax)}
- Effective Rate: ${result.effectiveRate}%

Allowances:
- Personal Allowance: ${formatCurrency(result.breakdown.personalAllowance)}
- Consolidated Relief: ${formatCurrency(result.breakdown.consolidatedRelief)}
- Taxable Income: ${formatCurrency(result.breakdown.taxableIncome)}

Generated on: ${new Date().toLocaleDateString()}
    `

    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tax-calculation-report.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Language Toggle */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={() => setLanguage('english')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  language === 'english' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('pidgin')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  language === 'pidgin' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pidgin
              </button>
            </div>
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {currentContent.title}
          </h1>
          <p className="text-lg text-gray-600">
            {currentContent.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                <Calculator className="w-6 h-6 mr-3 text-blue-600" />
                Tax Information
              </CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                Enter your details to calculate your tax liability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div>
                <label htmlFor="income" className="block text-sm font-semibold text-gray-800 mb-2">
                  {currentContent.income}
                </label>
                <Input
                  id="income"
                  type="number"
                  value={formData.income}
                  onChange={(e) => setFormData(prev => ({ ...prev, income: e.target.value }))}
                  placeholder="Enter your annual income"
                  className="w-full h-12 text-lg font-semibold text-gray-900 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200 placeholder:text-gray-500"
                />
              </div>

              <div>
                <label htmlFor="occupation" className="block text-sm font-semibold text-gray-800 mb-2">
                  {currentContent.occupation}
                </label>
                <Select value={formData.occupation} onValueChange={(value) => setFormData(prev => ({ ...prev, occupation: value }))}>
                  <SelectTrigger className="h-12 text-lg font-medium">
                    <SelectValue placeholder="Select your occupation" />
                  </SelectTrigger>
                  <SelectContent>
                    {occupations.map((occupation) => (
                      <SelectItem key={occupation} value={occupation}>
                        {occupation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="businessType" className="block text-sm font-semibold text-gray-800 mb-2">
                  {currentContent.businessType}
                </label>
                <Select value={formData.businessType} onValueChange={(value) => setFormData(prev => ({ ...prev, businessType: value }))}>
                  <SelectTrigger className="h-12 text-lg font-medium">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-semibold text-gray-800 mb-2">
                  {currentContent.state}
                </label>
                <Select value={formData.state} onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}>
                  <SelectTrigger className="h-12 text-lg font-medium">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleCalculate} 
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                size="lg"
              >
                <Calculator className="w-6 h-6 mr-3" />
                {currentContent.calculate}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-gray-900">Tax Calculation Results</CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                Your estimated tax liability breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-blue-600 font-medium">{currentContent.federalTax}</div>
                      <div className="text-2xl font-bold text-blue-900">{formatCurrency(result.federalTax)}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-green-600 font-medium">{currentContent.stateTax}</div>
                      <div className="text-2xl font-bold text-green-900">{formatCurrency(result.stateTax)}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 font-medium">{currentContent.totalTax}</div>
                    <div className="text-3xl font-bold text-gray-900">{formatCurrency(result.totalTax)}</div>
                    <div className="text-sm text-gray-500">Effective Rate: {result.effectiveRate}%</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{currentContent.taxableIncome}</span>
                      <span className="font-medium">{formatCurrency(result.breakdown.taxableIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{currentContent.personalAllowance}</span>
                      <span className="font-medium">{formatCurrency(result.breakdown.personalAllowance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{currentContent.consolidatedRelief}</span>
                      <span className="font-medium">{formatCurrency(result.breakdown.consolidatedRelief)}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleSave} disabled={saving} variant="outline" className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? currentContent.saving : currentContent.save}
                    </Button>
                    <Button onClick={handleDownload} variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      {currentContent.download}
                    </Button>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={() => setResult(null)} variant="outline" className="flex-1">
                      {currentContent.calculateAgain}
                    </Button>
                    <Button onClick={() => router.push('/')} variant="outline" className="flex-1">
                      {currentContent.backToHome}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Enter your information and click "Calculate Tax" to see your results
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
