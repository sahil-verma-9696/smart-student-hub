"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useRegisterInstitute from "@/hooks/useRegisterInstitute";

export default function AuthModal({ open, onOpenChange }) {
  const [mode, setMode] = useState("");

  // Common fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register Institute fields
  const [instName, setInstName] = useState("");
  const [instAff, setInstAff] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  const { registerInstitute, loading } = useRegisterInstitute({});

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "admin-login") {
      window.location.href = `/admin`;
    }

    if (mode === "register-institute") {
      registerInstitute({
        instName,
        instAff,
        adminName,
        adminEmail,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {mode ? mode.replace("-", " ").toUpperCase() : "Choose an Option"}
          </DialogTitle>
        </DialogHeader>

        {!mode && (
          <div className="grid gap-3 py-4">
            <Button onClick={() => setMode("admin-login")} variant="outline">
              Admin Login
            </Button>
            <Button onClick={() => setMode("student-login")} variant="outline">
              Student Login
            </Button>
            <Button onClick={() => setMode("faculty-login")} variant="outline">
              Faculty Login
            </Button>
            <Button onClick={() => setMode("register-institute")}>
              Register Institute
            </Button>
          </div>
        )}

        {mode && (
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            {/* Login forms */}
            {(mode === "admin-login" ||
              mode === "student-login" ||
              mode === "faculty-login") && (
              <>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Login
                </Button>
              </>
            )}

            {/* Register Institute Form */}
            {mode === "register-institute" && (
              <>
                <div className="grid gap-2">
                  <Label>Institute Name</Label>
                  <Input
                    value={instName}
                    onChange={(e) => setInstName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Institute Affiliation</Label>
                  <Input
                    value={instAff}
                    onChange={(e) => setInstAff(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Admin Name</Label>
                  <Input
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Admin Email</Label>
                  <Input
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Registering..." : "Register Institute"}
                </Button>
              </>
            )}

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setMode("")}
            >
              Back
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
