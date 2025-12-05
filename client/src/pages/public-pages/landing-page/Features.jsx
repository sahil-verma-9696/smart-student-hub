import { Card } from '@/components/ui/card'
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
    <section
      id="features"
      className="
        px-4 py-24 sm:px-6 lg:px-8 
        bg-[#F7F4ED] 
      "
    >
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="space-y-4 mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#0B234A]">
            Powerful Features
          </h2>
          <p className="text-lg text-[#4b5563] max-w-2xl mx-auto">
            Everything you need to streamline student activity management in one unified system
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="
                  p-8 rounded-2xl 
                  bg-white/70 backdrop-blur-sm 
                  border border-[#e6e0d6] 
                  shadow-sm
                  hover:shadow-xl 
                  hover:-translate-y-[4px]
                  transition-all duration-300
                "
              >
                {/* Icon Container */}
                <div 
                  className="
                    inline-flex items-center justify-center
                    w-14 h-14 rounded-xl
                    bg-[#2A4F8E]/10
                    backdrop-blur-sm
                    shadow-md
                    mb-6
                  "
                >
                  <Icon className="w-7 h-7 text-[#2A4F8E]" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-[#0B234A] mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[#4b5563] leading-relaxed">
                  {feature.description}
                </p>

              </Card>
            )
          })}
        </div>

      </div>
    </section>
  )
}
