import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function ProblemSolution() {
  return (
    <section id="about" className="px-4 py-20 sm:py-28 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Problem */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-display text-3xl text-slate-900">The Challenge</h3>
              </div>
            </div>

            <ul className="space-y-5">
              {[
                'Fragmented student records scattered across multiple institutions',
                'Time-consuming manual data entry and verification processes',
                'Lack of real-time visibility into student activities',
                'Data security and compliance concerns with legacy systems',
                'Inefficient reporting and analytics capabilities'
              ].map((item, index) => (
                <li key={index} className="flex gap-4 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 flex-shrink-0"></div>
                  <span className="text-slate-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-display text-3xl text-slate-900">Our Solution</h3>
              </div>
            </div>

            <ul className="space-y-5">
              {[
                'Unified platform integrating all HEIs under one system',
                'Automated data collection and management workflows',
                'Real-time dashboard for instant activity tracking',
                'Enterprise-grade security with government compliance',
                'Powerful analytics and comprehensive reporting tools'
              ].map((item, index) => (
                <li key={index} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}
