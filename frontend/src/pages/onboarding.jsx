"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { OrganizationSetup } from "@/components/onboarding/organization-setup";
import { DepartmentSetup } from "@/components/onboarding/department-setup";
import { UserInvitation } from "@/components/onboarding/user-invitation";
import { SystemConfiguration } from "@/components/onboarding/system-configuration";
import { OnboardingComplete } from "@/components/onboarding/onboarding-complete";

const steps = [
  {
    id: 1,
    title: "Organization Setup",
    description: "Configure your institution details",
  },
  {
    id: 2,
    title: "Department Structure",
    description: "Set up departments and academic structure",
  },
  {
    id: 3,
    title: "Invite Users",
    description: "Add faculty and students to the platform",
  },
  {
    id: 4,
    title: "System Configuration",
    description: "Configure integrations and settings",
  },
  {
    id: 5,
    title: "Complete Setup",
    description: "Review and finalize your setup",
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  const handleStepComplete = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    if (stepId < steps.length) {
      setCurrentStep(stepId + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (completedSteps.length / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <OrganizationSetup onComplete={() => handleStepComplete(1)} />;
      case 2:
        return <DepartmentSetup onComplete={() => handleStepComplete(2)} />;
      case 3:
        return <UserInvitation onComplete={() => handleStepComplete(3)} />;
      case 4:
        return <SystemConfiguration onComplete={() => handleStepComplete(4)} />;
      case 5:
        return <OnboardingComplete onComplete={() => handleStepComplete(5)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to Smart Student Hub
          </h1>
          <p className="text-muted-foreground">
            Let's set up your institution in just a few steps
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Setup Progress</CardTitle>
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}
              </span>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center text-center ${
                    step.id === currentStep
                      ? "text-primary"
                      : completedSteps.includes(step.id)
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                      step.id === currentStep
                        ? "bg-primary text-primary-foreground"
                        : completedSteps.includes(step.id)
                        ? "bg-green-600 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {completedSteps.includes(step.id) ? "✓" : step.id}
                  </div>
                  <div className="text-xs font-medium">{step.title}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="mb-8">{renderStepContent()}</div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleStepBack}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Need help? Contact support at support@smartstudenthub.com
          </div>
        </div>
      </div>
    </div>
  );
}
