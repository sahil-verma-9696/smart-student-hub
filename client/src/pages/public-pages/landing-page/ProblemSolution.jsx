import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function ProblemSolution() {
  return (
    <section
      id="problem"
      className="px-4 py-24 sm:px-6 lg:px-8 bg-[#F7F4ED]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Problem */}
          <Card
            className="
              p-10 rounded-2xl 
              bg-white/80 backdrop-blur-sm
              border border-[#e6e0d6]
              shadow-sm hover:shadow-lg 
              transition-all duration-300
            "
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-red-100">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B234A]">The Challenge</h3>
            </div>

            <ul className="space-y-4">
              {[
                "Fragmented student records scattered across multiple institutions",
                "Time-consuming manual data entry and verification processes",
                "Lack of real-time visibility into student activities",
                "Data security and compliance concerns with legacy systems",
                "Inefficient reporting and analytics capabilities",
              ].map((item, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <span className="text-red-600 text-lg leading-[1] mt-[3px]">•</span>
                  <span className="text-[#4b5563]">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Solution */}
          <Card
            className="
              p-10 rounded-2xl 
              bg-[#2A4F8E]/5 
              border border-[#2A4F8E]/20
              shadow-sm hover:shadow-lg 
              transition-all duration-300
            "
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-[#2A4F8E]/10">
                <CheckCircle2 className="w-6 h-6 text-[#2A4F8E]" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B234A]">Our Solution</h3>
            </div>

            <ul className="space-y-4">
              {[
                "Unified platform integrating all HEIs under one system",
                "Automated data collection and management workflows",
                "Real-time dashboard for instant activity tracking",
                "Enterprise-grade security with government compliance",
                "Powerful analytics and comprehensive reporting tools",
              ].map((item, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <span className="text-[#2A4F8E] font-bold text-lg leading-[1] mt-[3px]">✓</span>
                  <span className="text-[#4b5563]">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

        </div>
      </div>
    </section>
  )
}
