"use client"
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  MapPin, 
  School, 
  Home, 
  Cpu, 
  MessageCircle, 
  Phone, 
  Mail, 
  Sparkles,
  Globe,
  Rocket,
  Star,
  ChevronRight,
  ChevronLeft,
  Zap
} from 'lucide-react'

type SurveyFormData = {
  name: string
  age: string
  country: string
  city: string
  schoolName: string
  preferredHouse: string
  techExperience: 'Yes' | 'No' | ''
  techDetails: string
  heardAboutUs: string
  phone: string
  email: string
}

export default function SurveyPage() {
  const [formData, setFormData] = useState<SurveyFormData>({
    name: '',
    age: '',
    country: '',
    city: '',
    schoolName: '',
    preferredHouse: '',
    techExperience: '',
    techDetails: '',
    heardAboutUs: '',
    phone: '',
    email: '',
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [celebrateField, setCelebrateField] = useState('')
  const [hoveredHouse, setHoveredHouse] = useState('')

  const handleChange =
    (field: keyof SurveyFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }))
      
      if (e.target.value && !formData[field]) {
        setCelebrateField(field)
        setTimeout(() => setCelebrateField(''), 1000)
      }
    }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Survey submitted!', formData)
  }

  const houses = [
    { value: '🤖 AI House', emoji: '🤖', name: 'AI', color: 'from-blue-400 to-purple-500' },
    { value: '🛡️ Cyber Security House', emoji: '🛡️', name: 'Cyber', color: 'from-green-400 to-teal-500' },
    { value: '💻 Programming House', emoji: '💻', name: 'Code', color: 'from-yellow-400 to-orange-500' },
    { value: '🦾 Robotics House', emoji: '🦾', name: 'Robots', color: 'from-red-400 to-pink-500' },
    { value: '📊 Data House', emoji: '📊', name: 'Data', color: 'from-indigo-400 to-blue-500' },
    { value: '🎨 Creative Arts House', emoji: '🎨', name: 'Arts', color: 'from-pink-400 to-rose-500' }
  ]

  // Step validation
  const isStep1Valid = formData.name && formData.age && formData.country && formData.city && formData.schoolName
  const isStep2Valid = formData.preferredHouse && formData.techExperience && (formData.techExperience === 'No' || formData.techDetails)
  const isStep3Valid = formData.heardAboutUs && formData.phone && formData.email

  const canGoToStep2 = isStep1Valid
  const canGoToStep3 = isStep2Valid
  const canSubmit = isStep1Valid && isStep2Valid && isStep3Valid

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative flex items-center justify-center p-4 overflow-hidden">
      
      {/* Floating Stars Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              scale: 0
            }}
            animate={{ 
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
              scale: [0, 1, 0],
              rotate: 360
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
          </motion.div>
        ))}
      </div>

      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-500/20 rounded-full mix-blend-screen filter blur-[100px]"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-500/20 rounded-full mix-blend-screen filter blur-[100px]"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-2xl border-2 border-white/30 rounded-3xl shadow-2xl overflow-hidden">
          
          <div className="flex flex-col h-full">
            
            {/* Compact Header */}
            <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 p-4 md:p-6 border-b-2 border-white/20">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ 
                      y: [0, -8, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Rocket className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </motion.div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-black text-white">
                      Welcome! ⭐
                    </h1>
                    <p className="text-purple-200 text-xs md:text-sm">
                      Step {currentStep} of {totalSteps}
                    </p>
                  </div>
                </div>
                
                {/* Progress Dots */}
                <div className="flex gap-2">
                  {[1, 2, 3].map((step) => (
                    <motion.div
                      key={step}
                      className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                        step <= currentStep ? 'bg-green-400' : 'bg-white/30'
                      }`}
                      animate={step === currentStep ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content - Fixed Height */}
            <div className="p-4 md:p-6 h-[500px] md:h-[520px] overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* STEP 1: Personal Info */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                        Tell Us About You! 😊
                      </h2>
                      <p className="text-purple-200 text-sm">Basic information</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2">
                        <AnimatedInputField 
                          icon={User} 
                          placeholder="Your awesome name" 
                          value={formData.name} 
                          onChange={handleChange('name')}
                          celebrate={celebrateField === 'name'}
                        />
                      </div>
                      
                      <AnimatedInputField 
                        icon={Sparkles} 
                        placeholder="Age" 
                        type="number" 
                        min="5" 
                        max="18"
                        value={formData.age} 
                        onChange={handleChange('age')}
                        celebrate={celebrateField === 'age'}
                      />
                      
                      <AnimatedInputField 
                        icon={Globe} 
                        placeholder="Country" 
                        value={formData.country} 
                        onChange={handleChange('country')}
                        celebrate={celebrateField === 'country'}
                      />
                      
                      <AnimatedInputField 
                        icon={MapPin} 
                        placeholder="City" 
                        value={formData.city} 
                        onChange={handleChange('city')}
                        celebrate={celebrateField === 'city'}
                      />
                      
                      <div className="md:col-span-2">
                        <AnimatedInputField 
                          icon={School} 
                          placeholder="School name" 
                          value={formData.schoolName} 
                          onChange={handleChange('schoolName')}
                          celebrate={celebrateField === 'schoolName'}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: House & Tech */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                        Pick Your Dream House! 🏰
                      </h2>
                      <p className="text-purple-200 text-sm">Choose wisely!</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
                      {houses.map((house) => (
                        <motion.button
                          key={house.value}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, preferredHouse: house.value }))
                            setCelebrateField('preferredHouse')
                            setTimeout(() => setCelebrateField(''), 1000)
                          }}
                          onHoverStart={() => setHoveredHouse(house.value)}
                          onHoverEnd={() => setHoveredHouse('')}
                          className={`relative p-3 rounded-xl border-2 transition-all ${
                            formData.preferredHouse === house.value
                              ? 'border-white bg-white/20 shadow-lg'
                              : 'border-white/30 bg-white/5'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-center">
                            <div className="text-3xl md:text-4xl mb-1">{house.emoji}</div>
                            <p className="text-white font-bold text-xs">{house.name}</p>
                          </div>
                          
                          {formData.preferredHouse === house.value && (
                            <motion.div
                              className="absolute -top-1 -right-1"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <div className="bg-green-500 rounded-full p-1">
                                <Zap className="w-3 h-3 text-white fill-white" />
                              </div>
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>

                    <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                      <p className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-orange-400" /> Tech Experience?
                      </p>
                      <div className="flex gap-3 mb-3">
                        <motion.button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, techExperience: 'Yes' }))}
                          className={`flex-1 py-3 rounded-lg text-base font-bold ${
                            formData.techExperience === 'Yes'
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                              : 'bg-white/10 text-white/60'
                          }`}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          👍 Yes!
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, techExperience: 'No', techDetails: '' }))}
                          className={`flex-1 py-3 rounded-lg text-base font-bold ${
                            formData.techExperience === 'No'
                              ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white'
                              : 'bg-white/10 text-white/60'
                          }`}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          👋 Not yet
                        </motion.button>
                      </div>

                      <AnimatePresence>
                        {formData.techExperience === 'Yes' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <textarea
                              value={formData.techDetails}
                              onChange={handleChange('techDetails')}
                              placeholder="What you've learned (Scratch, Python...)"
                              className="w-full bg-white/10 border-2 border-white/30 rounded-lg p-3 text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                              rows={2}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Contact & Source */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                        Almost Done! 🎉
                      </h2>
                      <p className="text-purple-200 text-sm">Parent contact info</p>
                    </div>

                    <div className="space-y-3">
                      <AnimatedInputField 
                        icon={Phone} 
                        placeholder="Parent's phone" 
                        type="tel"
                        value={formData.phone} 
                        onChange={handleChange('phone')}
                        celebrate={celebrateField === 'phone'}
                      />
                      <AnimatedInputField 
                        icon={Mail} 
                        placeholder="Parent's email" 
                        type="email"
                        value={formData.email} 
                        onChange={handleChange('email')}
                        celebrate={celebrateField === 'email'}
                      />
                    </div>

                    <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                      <p className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-purple-400" /> How'd you find us?
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: '📱 Social media', emoji: '📱', label: 'Social' },
                          { value: '👫 Friend / Classmate', emoji: '👫', label: 'Friend' },
                          { value: '🏫 School', emoji: '🏫', label: 'School' },
                          { value: '✨ Other', emoji: '✨', label: 'Other' }
                        ].map((source) => (
                          <motion.button
                            key={source.value}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, heardAboutUs: source.value }))
                              setCelebrateField('heardAboutUs')
                              setTimeout(() => setCelebrateField(''), 1000)
                            }}
                            className={`p-3 rounded-lg border-2 ${
                              formData.heardAboutUs === source.value
                                ? 'border-white bg-white/20'
                                : 'border-white/30 bg-white/5'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="text-2xl mb-1">{source.emoji}</div>
                            <div className="text-white text-xs font-bold">{source.label}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Footer */}
            <div className="p-4 md:p-6 pt-2 border-t-2 border-white/20 bg-black/10">
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <motion.button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl flex items-center gap-2 border-2 border-white/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Back</span>
                  </motion.button>
                )}

                {currentStep < 3 && (
                  <motion.button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    disabled={currentStep === 1 ? !canGoToStep2 : !canGoToStep3}
                    className={`flex-1 py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 ${
                      (currentStep === 1 && canGoToStep2) || (currentStep === 2 && canGoToStep3)
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                    }`}
                    whileHover={(currentStep === 1 && canGoToStep2) || (currentStep === 2 && canGoToStep3) ? { scale: 1.02 } : {}}
                    whileTap={(currentStep === 1 && canGoToStep2) || (currentStep === 2 && canGoToStep3) ? { scale: 0.98 } : {}}
                  >
                    Next <ChevronRight className="w-5 h-5" />
                  </motion.button>
                )}

                {currentStep === 3 && (
                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`flex-1 py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 ${
                      canSubmit
                        ? 'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white'
                        : 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                    }`}
                    whileHover={canSubmit ? { scale: 1.02 } : {}}
                    whileTap={canSubmit ? { scale: 0.98 } : {}}
                    animate={canSubmit ? {
                      boxShadow: [
                        '0 0 20px rgba(139, 92, 246, 0.5)',
                        '0 0 40px rgba(59, 130, 246, 0.5)',
                        '0 0 20px rgba(139, 92, 246, 0.5)'
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span>🎉 Let's Go!</span>
                    <Sparkles className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Animated Input Field Component
function AnimatedInputField({ 
  icon: Icon, 
  placeholder, 
  value, 
  onChange, 
  type = "text",
  min,
  max,
  celebrate
}: { 
  icon: any, 
  placeholder: string, 
  value: string, 
  onChange: any, 
  type?: string,
  min?: string,
  max?: string,
  celebrate?: boolean
}) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative group">
      <motion.div 
        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        animate={isFocused ? { scale: 1.2, x: 2 } : { scale: 1, x: 0 }}
      >
        <Icon className={`h-4 w-4 transition-colors ${
          isFocused ? 'text-yellow-300' : 'text-purple-300'
        }`} />
      </motion.div>
      
      <motion.input
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="block w-full pl-10 pr-3 py-3 bg-white/10 border-2 border-white/30 rounded-xl text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white/20 focus:border-yellow-300 transition-all"
        placeholder={placeholder}
        required
        whileFocus={{ scale: 1.01 }}
      />
      
      <AnimatePresence>
        {celebrate && (
          <motion.div
            className="absolute -top-6 right-0 flex gap-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 0], y: [0, -15, -30] }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}