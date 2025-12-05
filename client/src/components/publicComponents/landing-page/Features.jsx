import { BarChart3, Users, Lock, Zap, FileText, CheckCircle } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Centralized Management',
    description: 'Manage all student records from a single unified platform across multiple HEIs'
  },
  {
    icon: BarChart3,
    title: 'Comprehensive Analytics',
    description: 'Real-time insights and detailed reports on student activities and performance'
  },
  {
    icon: Lock,
    title: 'Secure & Compliant',
    description: 'Government-grade security with full data privacy and compliance standards'
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Instant synchronization across all institutions with live data tracking'
  },
  {
    icon: FileText,
    title: 'Digital Records',
    description: 'Complete digitization of student activity records for easy access and archival'
  },
  {
    icon: CheckCircle,
    title: 'Verification Ready',
    description: 'Built-in verification workflows for seamless validation and certification'
  }
]

export default function Features() {
  return (
    <section id="features" className="px-4 py-20 sm:py-28 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-slate-900 mb-6">
            Powerful Features
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-light">
            Everything you need to streamline student activity management across your institution
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative"
              >
                {/* Hover Background */}
                <div className="absolute inset-0 bg-slate-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative p-8 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="font-display text-xl text-slate-900">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom Border */}
                <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-slate-900 transition-colors duration-300"></div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
