import React, { useState } from "react";
import CTA from "./Cta";
import Header from "./Header";
import Footer from "./Footer";
import Hero from "./Hero";
import Features from "./Features";
import ProblemSolution from "./ProblemSolution";
import Team from "./Team";
import useAuthContext from "@/hooks/useAuthContext";
import { useNavigate } from "react-router";
import AuthModal from "../AuthModal";

const LandingPage = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const { isUserAuthenticated, user } = useAuthContext();
  const navigate = useNavigate();

  function handleGetStarted() {
    if (!isUserAuthenticated) {
      setAuthOpen(true);
    } else {
      navigate(`/${user?.basicUserDetails?.role}`);
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
