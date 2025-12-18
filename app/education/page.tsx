'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Play, Volume2, VolumeX, FileText, Image, Video, HelpCircle } from 'lucide-react'

interface EducationalContent {
  id: string
  title: string
  language: string
  content_type: string
  content_url: string
  created_at: string
}

export default function EducationPage() {
  const [language, setLanguage] = useState<'english' | 'pidgin'>('english')
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [content, setContent] = useState<EducationalContent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null)
  const supabase = createClient()

  const contentTypes = {
    article: { icon: FileText, color: 'bg-blue-100 text-blue-600' },
    video: { icon: Video, color: 'bg-red-100 text-red-600' },
    audio: { icon: Volume2, color: 'bg-green-100 text-green-600' },
    infographic: { icon: Image, color: 'bg-purple-100 text-purple-600' }
  }

  const contentData = {
    english: {
      title: 'Tax Education Portal',
      description: 'Learn about Nigerian taxes in simple, easy-to-understand language',
      categories: {
        'Personal Income Tax': {
          description: 'Understanding how personal income tax works in Nigeria',
          content: [
            {
              title: 'What is Personal Income Tax?',
              type: 'article',
              description: 'Learn the basics of personal income tax and who needs to pay it'
            },
            {
              title: 'PAYE System Explained',
              type: 'video',
              description: 'Understanding the Pay As You Earn system for employees'
            },
            {
              title: 'Tax Brackets and Rates',
              type: 'infographic',
              description: 'Visual guide to Nigerian tax brackets and rates'
            }
          ]
        },
        'Company Income Tax': {
          description: 'Everything about corporate tax obligations',
          content: [
            {
              title: 'Company Income Tax Basics',
              type: 'article',
              description: 'Understanding corporate tax requirements'
            },
            {
              title: 'Filing Requirements',
              type: 'video',
              description: 'Step-by-step guide to filing company taxes'
            }
          ]
        },
        'Value Added Tax (VAT)': {
          description: 'Understanding VAT in Nigeria',
          content: [
            {
              title: 'VAT Registration',
              type: 'article',
              description: 'When and how to register for VAT'
            },
            {
              title: 'VAT Returns',
              type: 'video',
              description: 'How to file VAT returns'
            }
          ]
        }
      },
      faq: [
        {
          question: 'Who needs to pay personal income tax?',
          answer: 'Any individual earning income in Nigeria, whether employed or self-employed, is required to pay personal income tax.'
        },
        {
          question: 'What is the tax-free threshold?',
          answer: 'The first ₦300,000 of annual income is taxed at 7%, with progressive rates for higher income brackets.'
        },
        {
          question: 'When are taxes due?',
          answer: 'Personal income tax is typically due by March 31st of the following year, while company taxes have different deadlines.'
        }
      ]
    },
    pidgin: {
      title: 'Tax Education Portal',
      description: 'Learn about Nigerian tax for simple, easy-to-understand language',
      categories: {
        'Personal Income Tax': {
          description: 'Understanding how personal income tax work for Nigeria',
          content: [
            {
              title: 'Wetin be Personal Income Tax?',
              type: 'article',
              description: 'Learn the basics of personal income tax and who need to pay am'
            },
            {
              title: 'PAYE System Explained',
              type: 'video',
              description: 'Understanding the Pay As You Earn system for workers'
            },
            {
              title: 'Tax Brackets and Rates',
              type: 'infographic',
              description: 'Picture guide to Nigerian tax brackets and rates'
            }
          ]
        },
        'Company Income Tax': {
          description: 'Everything about company tax obligations',
          content: [
            {
              title: 'Company Income Tax Basics',
              type: 'article',
              description: 'Understanding company tax requirements'
            },
            {
              title: 'Filing Requirements',
              type: 'video',
              description: 'Step-by-step guide to filing company taxes'
            }
          ]
        },
        'Value Added Tax (VAT)': {
          description: 'Understanding VAT for Nigeria',
          content: [
            {
              title: 'VAT Registration',
              type: 'article',
              description: 'When and how to register for VAT'
            },
            {
              title: 'VAT Returns',
              type: 'video',
              description: 'How to file VAT returns'
            }
          ]
        }
      },
      faq: [
        {
          question: 'Who need to pay personal income tax?',
          answer: 'Any person wey dey earn money for Nigeria, whether you dey work for company or you dey work for yourself, you need to pay personal income tax.'
        },
        {
          question: 'Wetin be the tax-free threshold?',
          answer: 'The first ₦300,000 of annual income dey taxed at 7%, with progressive rates for higher income.'
        },
        {
          question: 'When taxes dey due?',
          answer: 'Personal income tax dey due by March 31st of the following year, while company taxes get different deadlines.'
        }
      ]
    }
  }

  const currentContent = contentData[language]

  useEffect(() => {
    fetchContent()
  }, [language])

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('educational_content')
        .select('*')
        .eq('language', language)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching content:', error)
      } else {
        setContent(data || [])
      }
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderContentType = (type: string) => {
    const contentType = contentTypes[type as keyof typeof contentTypes]
    if (!contentType) return null

    const Icon = contentType.icon
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${contentType.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </div>
    )
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {currentContent.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {currentContent.description}
          </p>
        </div>

        {/* Content Categories */}
        <div className="space-y-8">
          {Object.entries(currentContent.categories).map(([categoryName, categoryData]) => (
            <div key={categoryName}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{categoryName}</h2>
              <p className="text-gray-600 mb-6">{categoryData.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryData.content.map((item, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setSelectedContent(item as any)}>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        {renderContentType(item.type)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        {item.description}
                      </CardDescription>
                      <Button variant="outline" className="w-full">
                        <BookOpen className="w-4 h-4 mr-2" />
                        {language === 'english' ? 'Learn More' : 'Learn More'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {language === 'english' ? 'Frequently Asked Questions' : 'Questions People Dey Ask'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentContent.faq.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-blue-600 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            {language === 'english' 
              ? 'Ready to Calculate Your Tax?' 
              : 'Ready to Calculate Your Tax?'
            }
          </h3>
          <p className="text-blue-100 mb-6">
            {language === 'english'
              ? 'Now that you understand the basics, use our calculator to estimate your tax liability.'
              : 'Now say you understand the basics, use our calculator to estimate your tax liability.'
            }
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <BookOpen className="w-5 h-5 mr-2" />
            {language === 'english' ? 'Calculate My Tax' : 'Calculate My Tax'}
          </Button>
        </div>
      </div>
    </div>
  )
}
