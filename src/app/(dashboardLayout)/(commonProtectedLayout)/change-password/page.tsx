/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  AlertCircle,
  Key,
  Fingerprint,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fake state for demo
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fake validation states
  const [currentPasswordError, setCurrentPasswordError] = useState<
    string | null
  >(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  // Fake password strength
  const getPasswordStrength = (password: string) => {
    if (!password) return null;
    if (password.length < 6)
      return { label: "Weak", color: "text-red-500", bg: "bg-red-100" };
    if (password.length < 8)
      return { label: "Fair", color: "text-amber-500", bg: "bg-amber-100" };
    if (
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      password.length >= 8
    ) {
      return {
        label: "Strong",
        color: "text-emerald-500",
        bg: "bg-emerald-100",
      };
    }
    return { label: "Good", color: "text-blue-500", bg: "bg-blue-100" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const fakeValidateForm = () => {
    let isValid = true;

    if (!currentPassword) {
      setCurrentPasswordError("Current password is required");
      isValid = false;
    } else {
      setCurrentPasswordError(null);
    }

    if (!newPassword) {
      setNewPasswordError("New password is required");
      isValid = false;
    } else if (newPassword.length < 6) {
      setNewPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setNewPasswordError(null);
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError(null);
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fakeValidateForm()) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // Fake API call simulation
    setTimeout(() => {
      // Demo success
      if (currentPassword === "password123") {
        setError("Current password is incorrect");
        setIsSubmitting(false);
      } else {
        setSuccess(
          "Password changed successfully! You can now login with your new password.",
        );
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccess(null), 5000);
        setIsSubmitting(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f5f0ea] py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-[#caa05c]/10 to-[#b8894a]/10 rounded-full mb-4">
            <Key className="w-8 h-8 text-[#caa05c]" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2c1810] to-[#5c3d2e] bg-clip-text text-transparent">
            Change Password
          </h1>
          <p className="text-[#ab8965] mt-2 text-sm">
            Keep your account secure with a strong password
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <Alert className="mb-6 bg-emerald-50 border-emerald-200">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <AlertDescription className="text-emerald-700">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Password Change Form */}
        <Card className="border-[#e8d9cc] shadow-lg">
          <CardHeader className="border-b border-[#e8d9cc] bg-[#faf8f5]/50">
            <CardTitle className="text-xl text-[#2c1810] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#caa05c]" />
              Security Settings
            </CardTitle>
            <CardDescription className="text-[#ab8965]">
              Enter your current password and choose a new one
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              {/* Current Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="currentPassword"
                  className="text-[#2c1810] flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-[#caa05c]" />
                  Current Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={`bg-[#faf8f5] border-[#e8d9cc] focus-visible:ring-[#caa05c] pr-10 ${
                      currentPasswordError
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ab8965] hover:text-[#caa05c] transition-colors"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {currentPasswordError && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {currentPasswordError}
                  </p>
                )}
                <p className="text-xs text-[#ab8965]">
                  Hint: Try "password123" to see error message, or any other
                  password for success
                </p>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="text-[#2c1810] flex items-center gap-2"
                >
                  <Key className="w-4 h-4 text-[#caa05c]" />
                  New Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter a strong password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`bg-[#faf8f5] border-[#e8d9cc] focus-visible:ring-[#caa05c] pr-10 ${
                      newPasswordError
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ab8965] hover:text-[#caa05c] transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          newPassword.length < 6
                            ? "w-1/3 bg-red-500"
                            : newPassword.length < 8
                              ? "w-2/3 bg-amber-500"
                              : "w-full bg-emerald-500"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${passwordStrength?.color}`}
                    >
                      {passwordStrength?.label}
                    </span>
                  </div>
                )}

                {newPasswordError && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {newPasswordError}
                  </p>
                )}
                <div className="space-y-1">
                  <p className="text-xs text-[#ab8965]">
                    Password requirements:
                  </p>
                  <ul className="text-xs text-[#ab8965] space-y-0.5 ml-4 list-disc">
                    <li>At least 6 characters long</li>
                    <li>
                      Include uppercase and lowercase letters (recommended)
                    </li>
                    <li>Include numbers (recommended)</li>
                  </ul>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-[#2c1810] flex items-center gap-2"
                >
                  <Fingerprint className="w-4 h-4 text-[#caa05c]" />
                  Confirm New Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`bg-[#faf8f5] border-[#e8d9cc] focus-visible:ring-[#caa05c] pr-10 ${
                      confirmPasswordError
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ab8965] hover:text-[#caa05c] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {confirmPasswordError}
                  </p>
                )}
                {newPassword &&
                  confirmPassword &&
                  newPassword === confirmPassword &&
                  newPassword.length >= 6 && (
                    <p className="text-xs text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Passwords match!
                    </p>
                  )}
              </div>
            </CardContent>

            <CardFooter className="border-t border-[#e8d9cc] bg-[#faf8f5]/50 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white hover:shadow-md transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Security Tips */}
        <div className="mt-6 p-4 bg-[#faf8f5] rounded-xl border border-[#e8d9cc]">
          <h3 className="text-sm font-semibold text-[#2c1810] mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#caa05c]" />
            Security Tips
          </h3>
          <ul className="text-xs text-[#ab8965] space-y-1.5">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>
                Use a unique password that you don't use for other accounts
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>
                Avoid using personal information like your name or birthday
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>Enable two-factor authentication for extra security</span>
            </li>
          </ul>
        </div>

        {/* Demo Note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-[#ab8965]">
            <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-1" />
            Demo Mode: Enter "password123" as current password to see error
            message
          </p>
        </div>
      </div>
    </div>
  );
}
