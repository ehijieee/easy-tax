'use client'

import { useState } from 'react'
import { RegisterForm } from '@/components/auth/register-form'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX } from 'lucide-react'

export default function RegisterPage() {
  const [language, setLanguage] = useState<'english' | 'pidgin'>('english')
  const [audioEnabled, setAudioEnabled] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Language Toggle */}
        <div className="bg-white rounded-lg shadow-sm p-4">
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

        <RegisterForm language={language} />
      </div>
    </div>
  )
}
