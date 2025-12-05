import { Button } from "@/components/ui/button";
import useAuthContext from "@/hooks/useAuthContext";
import { ArrowRight, Calendar } from "lucide-react";

export default function CTA() {
  const { isUserAuthenticated } = useAuthContext();
  return (
    <section className="px-4 py-20 sm:py-28 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="relative bg-slate-900 rounded-3xl overflow-hidden">
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          {/* Gradient Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"></div>

          {/* Content */}
          <div className="relative p-12 sm:p-16 lg:p-20 text-center">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-6 max-w-3xl mx-auto">
              Ready to Transform Student Record Management?
            </h2>

            <p className="text-slate-300 text-lg sm:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Join the revolution in educational technology. Get started with Smart Student Hub today 
              and streamline your institution's student activity management.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!isUserAuthenticated && (
                <Button
                  size="lg"
                  className="bg-white hover:bg-slate-100 text-slate-900 px-8 py-6 text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Get Started Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              )}

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 hover:border-white text-white hover:bg-white/10 px-8 py-6 text-base font-medium rounded-lg transition-all duration-200"
              >
                <Calendar className="mr-2 w-5 h-5" />
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
