import React, { useState } from 'react'
import CTA from './Cta'
import Header from './Header'
import Footer from './Footer'
import Hero from './Hero'
import Features from './Features'
import ProblemSolution from './ProblemSolution'
import Team from './Team'
import AuthModal from "@/components/publicComponents/AuthModal";

const LandingPage = () => {

    const [authOpen, setAuthOpen] = useState(false)

    return (
        <div>
            <Header className="bg-black" />

            {/* Pass setAuthOpen to Hero */}
            <Hero onGetStarted={() => setAuthOpen(true)} />

            <Features />
            <ProblemSolution />
            <Team />
            <CTA />
            <Footer />

            {/* Auth Modal */}
            <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
        </div>
    )
}

export default LandingPage
