import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, AlertTriangle } from "lucide-react";
import {ConfigField} from "./config-field";
import { adminCredentialsConfig } from "./ui-config";

export function AdminCredentialsSection({
  data,
  onChange,
  onVerify,
  verifyingField,
}) {
  // const allVerified =
  //   data.verification.adminEmail.verified &&
  //   data.verification.adminPhone.verified;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-foreground">
                {adminCredentialsConfig.title}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {adminCredentialsConfig.description}
              </CardDescription>
            </div>
          </div>
          {/* <Badge
            variant="outline"
            className={
              allVerified
                ? "bg-success/10 text-success border-success/30"
                : "bg-warning/10 text-warning border-warning/30"
            }
          >
            {allVerified ? (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Fully Verified
              </>
            ) : (
              <>
                <AlertTriangle className="h-3 w-3 mr-1" />
                Verification Pending
              </>
            )}
          </Badge> */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminCredentialsConfig.fields.map((field) => (
            <ConfigField
              key={field.id}
              config={field}
              value={data[field.id]}
              onChange={(val) => onChange(field.id, val)}
              isVerified={
                field.verification?.required
                  ? data.verification[field.id]?.verified
                  : undefined
              }
              onVerify={
                field.verification?.required
                  ? () => onVerify(field.id)
                  : undefined
              }
              isVerifying={verifyingField === field.id}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
