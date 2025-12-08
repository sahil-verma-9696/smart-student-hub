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

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState({});

  // Institute state with YOUR keys
  const [institute, setInstitute] = useState({
    inst_name: "",
    inst_type: "",
    inst_email: "",
    inst_phone: "",
    inst_address_line1: "",
    inst_city: "",
    inst_state: "",
    inst_pincode: "",

    admin_name: "",
    admin_email: "",
    admin_password: "",
    admin_gender: "",

    admin_contactInfo: {
      phone: "",
      alternatePhone: "",
      address: "",
    },

    inst_is_affiliated: "true",
    inst_affiliation_university: "",
    inst_affiliation_id: "",
  });

  const [registerErrors, setRegisterErrors] = useState({});

  // Hooks
  const { registerInstitute, loading: registerLoading, error: registerError } =
    useRegisterInstitute();

  const { login, loading: loginLoading, error: loginError } =
    useAuthantication();

  // Update normal field
  const handleInstituteChange = (field, value) => {
    setInstitute((prev) => ({ ...prev, [field]: value }));
  };

  // Update nested contact info
  const handleAdminContactChange = (field, value) => {
    setInstitute((prev) => ({
      ...prev,
      admin_contactInfo: { ...prev.admin_contactInfo, [field]: value },
    }));
  };

  /******************************************
   * LOGIN VALIDATION
   ******************************************/
  const validateLogin = () => {
    const errs = {};
    if (!email) errs.email = "Email is required";
    if (!password) errs.password = "Password is required";

    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /******************************************
   * INSTITUTE VALIDATION (USING YOUR KEYS)
   ******************************************/
  const validateInstitute = () => {
    const requiredFields = [
      "inst_name",
      "inst_type",
      "inst_email",
      "inst_phone",
      "inst_address_line1",
      "inst_city",
      "inst_state",
      "inst_pincode",

      "admin_name",
      "admin_email",
      "admin_password",
      "admin_gender",

      "inst_affiliation_university",
      "inst_affiliation_id",
    ];

    const errs = {};

    requiredFields.forEach((key) => {
      if (!institute[key]) errs[key] = "Required field";
    });

    // nested contact info
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

      // prepare trimmed payload
      const payload = {
        ...institute,
        inst_is_affiliated: institute.inst_is_affiliated === "true",
      };

      registerInstitute(payload);
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

        {/* ================= OPTIONS ================= */}
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
            {/* ==== GLOBAL API ERRORS ==== */}
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

                <Button type="submit" className="w-full" disabled={loginLoading}>
                  {loginLoading ? "Logging in..." : "Login"}
                </Button>
              </>
            )}

            {/* ================= REGISTER INSTITUTE ================= */}
            {mode === "register-institute" && (
              <>
                <h3 className="font-semibold text-lg mt-2">Institute Details</h3>

                {/* Using EXACT state keys */}
                {[
                  ["inst_name", "Institute Name"],
                  ["inst_type", "Institute Type"],
                  ["inst_email", "Official Email"],
                  ["inst_phone", "Phone Number"],
                  ["inst_address_line1", "Address Line 1"],
                  ["inst_city", "City"],
                  ["inst_state", "State"],
                  ["inst_pincode", "Pincode"],
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

                {/* SELECT */}
                <div className="grid gap-2">
                  <Label>Is Affiliated?</Label>
                  <select
                    className="border p-2 rounded-md"
                    value={institute.inst_is_affiliated}
                    onChange={(e) =>
                      handleInstituteChange("inst_is_affiliated", e.target.value)
                    }
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                {/* TEXT INPUTS */}
                {[
                  ["inst_affiliation_university", "Affiliation University"],
                  ["inst_affiliation_id", "Affiliation ID"],
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
