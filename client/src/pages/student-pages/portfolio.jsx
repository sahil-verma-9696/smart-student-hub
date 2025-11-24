import { PortfolioBuilder } from "@/components/portfolio/portfolio-builder";
import { PortfolioPreview } from "@/components/portfolio/portfolio-preview";
import { PortfolioTemplates } from "@/components/portfolio/portfolio-templates";

export default function PortfolioPage() {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Digital Portfolio
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and share your verified academic and professional portfolio
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PortfolioTemplates />
            <PortfolioBuilder />
          </div>

          <div className="space-y-6">
            <PortfolioPreview />
          </div>
        </div>
      </div>
    </main>
  );
}
