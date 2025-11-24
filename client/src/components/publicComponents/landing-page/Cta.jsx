import { Button } from "@/components/ui/button";
import useAuthContext from "@/hooks/useAuthContext";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  const { isUserAuthenticated } = useAuthContext();
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#3b82f6] to-[#3b82f6]/80 rounded-2xl p-12 sm:p-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to Transform Student Record Management?
        </h2>

        <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
          Join the revolution in educational technology. Get started with Smart
          Student Hub today and streamline your institution's student activity
          management.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isUserAuthenticated && (
            <Button
              size="lg"
              className="bg-white hover:bg-white/90 text-[#3b82f6]"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}

          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground text-[#3b82f6]-foreground hover:bg-[#3b82f6]-foreground/10"
          >
            Schedule Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
