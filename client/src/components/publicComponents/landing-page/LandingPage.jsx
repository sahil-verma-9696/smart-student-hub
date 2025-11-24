import React, { useState } from "react";
import CTA from "./Cta";
import Header from "./Header";
import Footer from "./Footer";
import Hero from "./Hero";
import Features from "./Features";
import ProblemSolution from "./ProblemSolution";
import Team from "./Team";
import AuthModal from "@/components/publicComponents/AuthModal";
import useAuthContext from "@/hooks/useAuthContext";
import { useNavigate } from "react-router";

const LandingPage = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const { isUserAuthenticated, userRole } = useAuthContext();
  const navigate = useNavigate();

  function handleGetStarted() {
    if (!isUserAuthenticated) {
      setAuthOpen(true);
    } else {
      navigate(`/${userRole}`);
    }
  }

  return (
    <div>
      <Header className="bg-black" />

      {/* Pass setAuthOpen to Hero */}
      <Hero onGetStarted={handleGetStarted} />

      <Features />
      <ProblemSolution />
      <Team />
      <CTA />
      <Footer />

      {/* Auth Modal */}
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
};

export default LandingPage;
