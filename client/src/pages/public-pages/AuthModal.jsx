"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import useRegisterInstitute from "@/hooks/useRegisterInstitute";
import useAuthantication from "@/hooks/useAuthantication";
import { cn } from "@/lib/utils";

export default function AuthModal({ open, onOpenChange }) {
  const [mode, setMode] = useState("");

  // Login fields + errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState({});

  // Institute registration fields + errors
  const [institute, setInstitute] = useState({
    institute_name: "",
    institute_type: "",
    official_email: "",
    official_phone: "",
    address_line1: "",
    city: "",
    state: "",
    pincode: "",

    admin_name: "",
    admin_email: "",
    admin_password: "",
    admin_gender: "",

    admin_contactInfo: {
      phone: "",
      alternatePhone: "",
      address: "",
    },

    is_affiliated: "true",
    affiliation_university: "",
    affiliation_id: "",
  });

  const [registerErrors, setRegisterErrors] = useState({});

  // Hooks
  const {
    registerInstitute,
    loading: registerLoading,
    error: registerError,
  } = useRegisterInstitute();
  const {
    login,
    loading: loginLoading,
    error: loginError,
  } = useAuthantication();

  // Update fields
  const handleInstituteChange = (field, value) => {
    setInstitute((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdminContactChange = (field, value) => {
    setInstitute((prev) => ({
      ...prev,
      admin_contactInfo: {
        ...prev.admin_contactInfo,
        [field]: value,
      },
    }));
  };

  /******************************************
   * FORM VALIDATION
   ******************************************/
  const validateLogin = () => {
    const errs = {};
    if (!email) errs.email = "Email is required";
    if (!password) errs.password = "Password is required";
    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateInstitute = () => {
    const errs = {};
    const fields = [
      "institute_name",
      "institute_type",
      "official_email",
      "official_phone",
      "address_line1",
      "city",
      "state",
      "pincode",
      "admin_name",
      "admin_email",
      "admin_password",
      "admin_gender",
      "affiliation_university",
      "affiliation_id",
    ];

    fields.forEach((f) => {
      if (!institute[f]) errs[f] = "Required field";
    });

    if (!institute.admin_contactInfo.phone)
      errs["admin_contactInfo.phone"] = "Required";
    if (!institute.admin_contactInfo.address)
      errs["admin_contactInfo.address"] = "Required";

    setRegisterErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /******************************************
   * SUBMIT HANDLER
   ******************************************/
  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "login") {
      if (!validateLogin()) return;
      login({ email, password });
      return;
    }

    if (mode === "register-institute") {
      if (!validateInstitute()) return;

      registerInstitute({
        ...institute,
        is_affiliated: institute.is_affiliated === "true",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {mode ? mode.replace("-", " ").toUpperCase() : "Choose an Option"}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            {mode === "" ? "Please choose how you want to continue." : ""}
          </DialogDescription>
        </DialogHeader>

        {/* ================= SIMPLE TWO OPTIONS ================= */}
        {!mode && (
          <div className="grid gap-3 py-4">
            <Button onClick={() => setMode("login")} variant="outline">
              Login
            </Button>
            <Button onClick={() => setMode("register-institute")}>
              Register Institute
            </Button>
          </div>
        )}

        {/* ================= FORMS ================= */}
        {mode && (
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            {/* ================= SHOW API ERRORS ================= */}
            {mode === "login" && loginError && (
              <p className="text-red-500 text-sm border p-2 rounded">
                {loginError}
              </p>
            )}

            {mode === "register-institute" && registerError && (
              <p className="text-red-500 text-sm border p-2 rounded">
                {registerError}
              </p>
            )}

            {/* ================= LOGIN FORM ================= */}
            {mode === "login" && (
              <>
                {/* EMAIL */}
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input
                    className={cn(loginErrors.email && "border-red-500")}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setLoginErrors({ ...loginErrors, email: "" });
                    }}
                  />
                  {loginErrors.email && (
                    <span className="text-red-500 text-xs">
                      {loginErrors.email}
                    </span>
                  )}
                </div>

                {/* PASSWORD */}
                <div className="grid gap-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    className={cn(loginErrors.password && "border-red-500")}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginErrors({ ...loginErrors, password: "" });
                    }}
                  />
                  {loginErrors.password && (
                    <span className="text-red-500 text-xs">
                      {loginErrors.password}
                    </span>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginLoading}
                >
                  {loginLoading ? "Logging in..." : "Login"}
                </Button>
              </>
            )}

            {/* ================= REGISTER INSTITUTE FORM ================= */}
            {mode === "register-institute" && (
              <>
                <h3 className="font-semibold text-lg mt-2">
                  Institute Details
                </h3>

                {[
                  ["institute_name", "Institute Name"],
                  ["institute_type", "Institute Type"],
                  ["official_email", "Official Email"],
                  ["official_phone", "Official Phone"],
                  ["address_line1", "Address Line 1"],
                  ["city", "City"],
                  ["state", "State"],
                  ["pincode", "Pincode"],
                ].map(([key, label]) => (
                  <div key={key} className="grid gap-2">
                    <Label>{label}</Label>
                    <Input
                      className={cn(registerErrors[key] && "border-red-500")}
                      value={institute[key]}
                      onChange={(e) => {
                        handleInstituteChange(key, e.target.value);
                        setRegisterErrors({ ...registerErrors, [key]: "" });
                      }}
                    />
                    {registerErrors[key] && (
                      <span className="text-red-500 text-xs">
                        {registerErrors[key]}
                      </span>
                    )}
                  </div>
                ))}

                <h3 className="font-semibold text-lg mt-4">Admin Details</h3>

                {[
                  ["admin_name", "Admin Name"],
                  ["admin_email", "Admin Email"],
                  ["admin_password", "Admin Password"],
                  ["admin_gender", "Admin Gender"],
                ].map(([key, label]) => (
                  <div key={key} className="grid gap-2">
                    <Label>{label}</Label>
                    <Input
                      type={key === "admin_password" ? "password" : "text"}
                      className={cn(registerErrors[key] && "border-red-500")}
                      value={institute[key]}
                      onChange={(e) => {
                        handleInstituteChange(key, e.target.value);
                        setRegisterErrors({ ...registerErrors, [key]: "" });
                      }}
                    />
                    {registerErrors[key] && (
                      <span className="text-red-500 text-xs">
                        {registerErrors[key]}
                      </span>
                    )}
                  </div>
                ))}

                <h3 className="font-semibold text-lg mt-4">
                  Admin Contact Info
                </h3>

                {[
                  ["phone", "Phone"],
                  ["alternatePhone", "Alternate Phone"],
                  ["address", "Address"],
                ].map(([key, label]) => (
                  <div key={key} className="grid gap-2">
                    <Label>{label}</Label>
                    <Input
                      className={cn(
                        registerErrors[`admin_contactInfo.${key}`] &&
                          "border-red-500"
                      )}
                      value={institute.admin_contactInfo[key]}
                      onChange={(e) =>
                        handleAdminContactChange(key, e.target.value)
                      }
                    />
                    {registerErrors[`admin_contactInfo.${key}`] && (
                      <span className="text-red-500 text-xs">
                        {registerErrors[`admin_contactInfo.${key}`]}
                      </span>
                    )}
                  </div>
                ))}

                <h3 className="font-semibold text-lg mt-4">
                  Affiliation Details
                </h3>

                <div className="grid gap-2">
                  <Label>Is Affiliated?</Label>
                  <select
                    className="border p-2 rounded-md"
                    value={institute.is_affiliated}
                    onChange={(e) =>
                      handleInstituteChange("is_affiliated", e.target.value)
                    }
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                {["affiliation_university", "affiliation_id"].map((key) => (
                  <div key={key} className="grid gap-2">
                    <Label>
                      {key === "affiliation_university"
                        ? "Affiliation University"
                        : "Affiliation ID"}
                    </Label>
                    <Input
                      className={cn(registerErrors[key] && "border-red-500")}
                      value={institute[key]}
                      onChange={(e) => {
                        handleInstituteChange(key, e.target.value);
                        setRegisterErrors({ ...registerErrors, [key]: "" });
                      }}
                    />
                    {registerErrors[key] && (
                      <span className="text-red-500 text-xs">
                        {registerErrors[key]}
                      </span>
                    )}
                  </div>
                ))}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerLoading}
                >
                  {registerLoading ? "Registering..." : "Register Institute"}
                </Button>
              </>
            )}

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setMode("");
                setLoginErrors({});
                setRegisterErrors({});
              }}
            >
              Back
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
