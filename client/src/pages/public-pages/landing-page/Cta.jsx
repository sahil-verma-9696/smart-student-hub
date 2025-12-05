import { Button } from "@/components/ui/button";
import useAuthContext from "@/hooks/useAuthContext";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  const { isUserAuthenticated } = useAuthContext();

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8 bg-[#F7F4ED]">
      <div
        className="
          max-w-4xl mx-auto 
          rounded-3xl 
          p-12 sm:p-16 
          text-center
          bg-white/80 backdrop-blur-md
          border border-[#e6e0d6]
          shadow-sm hover:shadow-md 
          transition-all duration-300
        "
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B234A] mb-4">
          Ready to Transform Student Record Management?
        </h2>

        <p className="text-lg text-[#4b5563] mb-10 max-w-2xl mx-auto">
          Streamline your institution with a centralized, secure, and efficient
          student activity management platform designed for modern HEIs.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          {/* Get Started (only if user not logged in) */}
          {!isUserAuthenticated && (
            <Button
              size="lg"
              className="
                bg-[#2A4F8E] 
                hover:bg-[#1E3A6A] 
                text-white 
                px-8 py-6 
                shadow-md
              "
            >
              Get Started Today
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}

          {/* Schedule Demo */}
          <Button
            size="lg"
            variant="outline"
            className="
              border-[#2A4F8E] 
              text-[#2A4F8E] 
              hover:bg-[#2A4F8E]/10 
              px-8 py-6
            "
          >
            Schedule Demo
          </Button>

        </div>
      </div>
    </section>
  );
}
