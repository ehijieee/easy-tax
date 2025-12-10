'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Calculator, BookOpen, CreditCard, Shield, Users, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/shared/language-switcher'

export default function Home() {
  const [audioEnabled, setAudioEnabled] = useState(false)
  const t = useTranslations()

  const features = [
    {
      icon: BookOpen,
      title: t('features.items.education.title'),
      description: t('features.items.education.description')
    },
    {
      icon: Calculator,
      title: t('features.items.calculator.title'),
      description: t('features.items.calculator.description')
    },
    {
      icon: CreditCard,
      title: t('features.items.payments.title'),
      description: t('features.items.payments.description')
    },
    {
      icon: Shield,
      title: t('features.items.security.title'),
      description: t('features.items.security.description')
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Language Toggle */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center">
            <LanguageSwitcher />
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/calculator">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  {t('hero.cta1')}
                </Button>
              </Link>
              <Link href="/education">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                  <BookOpen className="w-5 h-5 mr-2" />
                  {t('hero.cta2')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('features.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('problem.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('problem.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/calculator">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                    <Calculator className="w-5 h-5 mr-2" />
                    {t('common.startCalculating')}
                  </Button>
                </Link>
                <Link href="/education">
                  <Button size="lg" variant="outline">
                    <BookOpen className="w-5 h-5 mr-2" />
                    {t('common.learnMore')}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <Users className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('target.title')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('target.description')}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="font-semibold text-blue-900">₦600</div>
                    <div className="text-blue-700">{t('common.serviceFee')}</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <div className="font-semibold text-green-900">Secure</div>
                    <div className="text-green-700">{t('common.payments')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculator">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                <Calculator className="w-5 h-5 mr-2" />
                {t('cta.calculate')}
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
                <Users className="w-5 h-5 mr-2" />
                {t('cta.getStarted')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">EasyTax</h3>
            <p className="text-gray-400 mb-6">
              {t('footer.description')}
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <Link href="/education" className="hover:text-white">{t('navigation.learn')}</Link>
              <Link href="/calculator" className="hover:text-white">{t('navigation.calculate')}</Link>
              <Link href="/dashboard" className="hover:text-white">{t('navigation.dashboard')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
