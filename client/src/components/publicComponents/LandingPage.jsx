import React from 'react'
import CTA from './Cta'
import Header from './Header'
import Footer from './Footer'
import Hero from './Hero'
import Features from './Features'
import ProblemSolution from './ProblemSolution'
import Team from './team'

const LandingPage = () => {
    return (
        <div>
            <Header className = "bg-black"/>
            <Hero />
            <Features />
            <ProblemSolution />
            <Team />
            <CTA />
            <Footer /> 


        </div>
    )
}

export default LandingPage