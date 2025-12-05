import { useState } from "react";
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import AuthModal from '@/components/publicComponents/AuthModal';

export default function Hero({ onGetStarted }) {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <section className="relative px-4 py-20 sm:py-28 lg:py-32 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Content */}
          <div className="space-y-8 animate-fadeInUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">
                Government Initiative • J&K Higher Education
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-slate-900 leading-[1.1] tracking-tight">
              Centralized Student Activity{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Records Platform
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl font-light">
              Transform how Higher Educational Institutions manage comprehensive student activity records. 
              A unified digital platform for J&K's Higher Education Department.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                onClick={onGetStarted}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-slate-300 hover:border-slate-900 px-8 py-6 text-base font-medium rounded-lg transition-all duration-200"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="border-l-2 border-slate-900 pl-4">
                <p className="font-display text-4xl text-slate-900 mb-1">100+</p>
                <p className="text-sm text-slate-600 font-medium">HEIs Connected</p>
              </div>
              <div className="border-l-2 border-slate-900 pl-4">
                <p className="font-display text-4xl text-slate-900 mb-1">50K+</p>
                <p className="text-sm text-slate-600 font-medium">Active Students</p>
              </div>
              <div className="border-l-2 border-slate-900 pl-4">
                <p className="font-display text-4xl text-slate-900 mb-1">99.9%</p>
                <p className="text-sm text-slate-600 font-medium">Uptime SLA</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative lg:h-[600px] animate-fadeIn animation-delay-300">
            <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
              
              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '50px 50px'
                }}></div>
              </div>

              {/* Floating Cards */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="space-y-4 w-full max-w-md">
                  {/* Card 1 */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">📊</span>
                      </div>
                      <span className="text-white font-semibold">Activity Tracking</span>
                    </div>
                    <p className="text-slate-300 text-sm">Real-time monitoring of student activities across all institutions</p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300 ml-8">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">🔒</span>
                      </div>
                      <span className="text-white font-semibold">Secure Platform</span>
                    </div>
                    <p className="text-slate-300 text-sm">Government-grade security with complete data compliance</p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">✓</span>
                      </div>
                      <span className="text-white font-semibold">Easy Verification</span>
                    </div>
                    <p className="text-slate-300 text-sm">Streamlined verification workflows for instant validation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal */}
          <AuthModal open={authOpen} onOpenChange={setAuthOpen} />

        </div>
      </div>
    </section>
  );
}
