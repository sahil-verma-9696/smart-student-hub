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
import useLoginUser from "@/hooks/useLoginUser";

export default function AuthModal({ open, onOpenChange }) {
  const [mode, setMode] = useState("");

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Institute registration fields
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

  // Update functions
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

  // Hooks
  const { registerInstitute, loading: registerLoading } = useRegisterInstitute();
  const { loginUser, loading: loginLoading } = useLoginUser();

  /**************************************
   * SUBMIT HANDLER
   **************************************/
  const handleSubmit = (e) => {
    e.preventDefault();

    /* ---------------------- LOGIN ---------------------- */
    // if (mode.includes("login")) {
    //   const role = mode.replace("-login", ""); // admin/student/faculty

    //   const payload = {
    //     email,
    //     password,
    //     role,
    //   };

    //   loginUser(payload);
    //   return;
    // }

    /* ------------------ REGISTER INSTITUTE ------------------ */
    if (mode === "register-institute") {
      const payload = {
        ...institute,
        is_affiliated: institute.is_affiliated === "true",
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
            {mode === "register-institute"
              ? "Please fill the required information to register your institute."
              : "Please choose an option to continue."}
          </DialogDescription>
        </DialogHeader>

        {/* ================= MAIN OPTIONS ================= */}
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

        {/* ================= FORMS ================= */}
        {mode && (
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">

            {/* ================= LOGIN FORM ================= */}
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
                  ["institute_type", "Institute Type (Autonomous/Private/Govt)"],
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
                      value={institute[key]}
                      onChange={(e) =>
                        handleInstituteChange(key, e.target.value)
                      }
                      required
                    />
                  </div>
                ))}

                <h3 className="font-semibold text-lg mt-4">Admin Details</h3>

                {[
                  ["admin_name", "Admin Name"],
                  ["admin_email", "Admin Email"],
                  ["admin_password", "Admin Password"],
                  ["admin_gender", "Admin Gender (male/female)"],
                ].map(([key, label]) => (
                  <div key={key} className="grid gap-2">
                    <Label>{label}</Label>
                    <Input
                      value={institute[key]}
                      onChange={(e) =>
                        handleInstituteChange(key, e.target.value)
                      }
                      type={key === "admin_password" ? "password" : "text"}
                      required
                    />
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
                      value={institute.admin_contactInfo[key]}
                      onChange={(e) =>
                        handleAdminContactChange(key, e.target.value)
                      }
                      required
                    />
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

                {["affiliation_university", "affiliation_id"].map((field) => (
                  <div key={field} className="grid gap-2">
                    <Label>
                      {field === "affiliation_university"
                        ? "Affiliation University"
                        : "Affiliation ID"}
                    </Label>
                    <Input
                      value={institute[field]}
                      onChange={(e) =>
                        handleInstituteChange(field, e.target.value)
                      }
                      required
                    />
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

            {/* BACK BUTTON */}
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
