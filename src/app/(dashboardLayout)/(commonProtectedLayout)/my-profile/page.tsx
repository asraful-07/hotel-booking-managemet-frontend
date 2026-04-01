/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { httpClient } from "@/lib/axios/httpClient";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Camera,
  Edit2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Home,
  RefreshCw,
  Shield,
  Clock,
  MapPin,
  Briefcase,
  Heart,
  Star,
} from "lucide-react";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  image?: string;
}

export default function MyProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editImage, setEditImage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await httpClient.get<Profile>("/auth/me");
      console.log(res);
      setProfile(res?.data ?? null);
    } catch (e: any) {
      console.log(e);
      setError(e?.response?.data?.message ?? "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const openEditModal = () => {
    if (profile) {
      setEditName(profile.name);
      setEditPhone(profile.phone || "");
      setEditImage(profile.image || "");
      setUpdateError(null);
      setIsEditModalOpen(true);
    }
  };

  const closeEditModal = () => {
    if (isUpdating) return;
    setIsEditModalOpen(false);
    setEditName("");
    setEditPhone("");
    setEditImage("");
    setUpdateError(null);
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;

    setIsUpdating(true);
    setUpdateError(null);

    const payload: UpdateProfilePayload = {};
    if (editName !== profile.name) payload.name = editName;
    if (editPhone !== (profile.phone || "")) payload.phone = editPhone;
    if (editImage !== (profile.image || "")) payload.image = editImage;

    // If no changes, just close modal
    if (Object.keys(payload).length === 0) {
      closeEditModal();
      setIsUpdating(false);
      return;
    }

    try {
      const res = await httpClient.patch<Profile>(
        `/users/me/${profile.id}`,
        payload,
      );
      setProfile(res?.data ?? null);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
      closeEditModal();
    } catch (e: any) {
      console.error("Update error:", e);
      setUpdateError(e?.response?.data?.message ?? "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          icon: Shield,
          label: "Administrator",
        };
      case "manager":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          icon: Briefcase,
          label: "Manager",
        };
      default:
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          icon: User,
          label: "Customer",
        };
    }
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9+\-\s()]+$/;
    return phoneRegex.test(phone);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf8f5] to-[#f5f0ea]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[#e8d9cc] border-t-[#caa05c] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="w-6 h-6 text-[#caa05c]" />
            </div>
          </div>
          <p className="text-sm text-[#ab8965] font-medium tracking-wide">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf8f5] to-[#f5f0ea] p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-[#2c1810] mb-2">
            Failed to Load Profile
          </h2>
          <p className="text-[#ab8965] mb-6">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-6 py-2.5 bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white rounded-xl font-medium hover:shadow-md transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const roleInfo = getRoleBadge(profile.role);
  const RoleIcon = roleInfo.icon;
  const joinDate = new Date(profile.createdAt);
  const isEmailVerified = profile.emailVerified;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f5f0ea]">
      {/* Success Toast */}
      {success && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 shadow-lg">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <p className="text-emerald-700 font-medium">{success}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-[#e8d9cc]">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2c1810] to-[#5c3d2e] bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-[#ab8965] mt-1 text-sm">
                Manage your personal information
              </p>
            </div>
            <button
              onClick={fetchProfile}
              className="p-2 text-[#8b6946] hover:text-[#caa05c] transition-colors rounded-full hover:bg-[#f5f0ea]"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8d9cc] overflow-hidden">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-[#caa05c]/20 to-[#b8894a]/20" />

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="absolute -top-12 left-6">
              <div className="relative">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#caa05c] to-[#b8894a] flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-2xl font-bold text-white">
                      {getInitials(profile.name)}
                    </span>
                  </div>
                )}
                <button
                  onClick={openEditModal}
                  className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                >
                  <Camera className="w-4 h-4 text-[#caa05c]" />
                </button>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={openEditModal}
                className="px-4 py-2 border border-[#e8d9cc] rounded-xl text-sm font-medium text-[#8b6946] hover:bg-[#f5f0ea] transition-colors flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>

            {/* User Details */}
            <div className="mt-14">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#2c1810]">
                    {profile.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <div
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${roleInfo.bg} ${roleInfo.text}`}
                    >
                      <RoleIcon className="w-3 h-3" />
                      {roleInfo.label}
                    </div>
                    {isEmailVerified ? (
                      <div className="flex items-center gap-1 text-emerald-600 text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Verified Email
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-600 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        Email Not Verified
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[#ab8965] text-sm">
                    <Calendar className="w-4 h-4" />
                    Joined{" "}
                    {joinDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-[#e8d9cc]">
                <div className="flex items-center gap-3 p-3 bg-[#faf8f5] rounded-xl">
                  <div className="p-2 bg-white rounded-lg">
                    <Mail className="w-5 h-5 text-[#caa05c]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#ab8965]">Email Address</p>
                    <p className="text-sm font-medium text-[#2c1810]">
                      {profile.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#faf8f5] rounded-xl">
                  <div className="p-2 bg-white rounded-lg">
                    <Phone className="w-5 h-5 text-[#caa05c]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#ab8965]">Phone Number</p>
                    <p className="text-sm font-medium text-[#2c1810]">
                      {profile.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-[#e8d9cc]">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-[#caa05c] mb-1">
                    <Star className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-[#ab8965]">Member Since</p>
                  <p className="text-sm font-semibold text-[#2c1810]">
                    {joinDate.getFullYear()}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-[#caa05c] mb-1">
                    <Clock className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-[#ab8965]">Last Updated</p>
                  <p className="text-sm font-semibold text-[#2c1810]">
                    {new Date(profile.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-[#caa05c] mb-1">
                    <Shield className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-[#ab8965]">Account Status</p>
                  <p className="text-sm font-semibold text-emerald-600">
                    Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-[#e8d9cc] p-6">
          <h3 className="text-lg font-semibold text-[#2c1810] mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#caa05c]" />
            Account Information
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-[#e8d9cc]">
              <span className="text-[#ab8965]">User Name</span>
              <span className="font-mono text-[#2c1810]">{profile.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#e8d9cc]">
              <span className="text-[#ab8965]">Role</span>
              <span className="font-medium text-[#2c1810] capitalize">
                {profile.role}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#ab8965]">Email Verification</span>
              <span
                className={`font-medium ${isEmailVerified ? "text-emerald-600" : "text-amber-600"}`}
              >
                {isEmailVerified ? "Verified" : "Pending"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal with Scrolling */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeEditModal();
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-[#2c1810] to-[#5c3d2e] px-6 py-4 flex justify-between items-center flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                <p className="text-white/70 text-sm mt-1">
                  Update your personal information
                </p>
              </div>
              <button
                onClick={closeEditModal}
                disabled={isUpdating}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Avatar Preview */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {editImage ? (
                    <img
                      src={editImage}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-[#e8d9cc]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "";
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#caa05c] to-[#b8894a] flex items-center justify-center border-4 border-[#e8d9cc]">
                      <span className="text-2xl font-bold text-white">
                        {getInitials(editName || profile.name)}
                      </span>
                    </div>
                  )}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full px-2 py-0.5 shadow-md">
                    <Camera className="w-3 h-3 text-[#caa05c]" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-[#2c1810] mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#faf8f5] border border-[#e8d9cc] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#caa05c]/20 focus:border-[#caa05c] text-[#2c1810]"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-[#2c1810] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#faf8f5] border border-[#e8d9cc] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#caa05c]/20 focus:border-[#caa05c] text-[#2c1810]"
                    placeholder="Enter your phone number"
                  />
                  <p className="text-xs text-[#ab8965] mt-1">
                    Enter a valid phone number (e.g., +8801234567890)
                  </p>
                </div>

                {/* Image URL Field */}
                <div>
                  <label className="block text-sm font-medium text-[#2c1810] mb-2">
                    Profile Image URL
                  </label>
                  <input
                    type="text"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#faf8f5] border border-[#e8d9cc] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#caa05c]/20 focus:border-[#caa05c] text-[#2c1810]"
                    placeholder="https://example.com/your-image.jpg"
                  />
                  <p className="text-xs text-[#ab8965] mt-1">
                    Enter a valid image URL (optional)
                  </p>
                </div>

                {/* Read-only Email */}
                <div>
                  <label className="block text-sm font-medium text-[#2c1810] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-2.5 bg-gray-100 border border-[#e8d9cc] rounded-xl text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-[#ab8965] mt-1">
                    Email cannot be changed
                  </p>
                </div>

                {/* Read-only Role */}
                <div>
                  <label className="block text-sm font-medium text-[#2c1810] mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={profile.role}
                    disabled
                    className="w-full px-4 py-2.5 bg-gray-100 border border-[#e8d9cc] rounded-xl text-gray-500 cursor-not-allowed capitalize"
                  />
                </div>
              </div>

              {updateError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{updateError}</span>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-[#e8d9cc] flex-shrink-0 bg-white">
              <div className="flex gap-3">
                <button
                  onClick={closeEditModal}
                  disabled={isUpdating}
                  className="flex-1 py-2.5 border border-[#e8d9cc] rounded-xl text-sm font-medium text-[#8b6946] hover:bg-[#f5f0ea] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  disabled={isUpdating}
                  className="flex-1 bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white py-2.5 rounded-xl text-sm font-medium hover:shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
