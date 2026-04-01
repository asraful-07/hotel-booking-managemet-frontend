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
  Edit2,
  Eye,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Shield,
  Clock,
  Search,
  Filter,
  ChevronDown,
  X,
  Save,
  Crown,
  Star,
  Users,
  Trash2,
  MoreVertical,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "ADMIN" | "MANAGER" | "CUSTOMER";
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UpdateRolePayload {
  userId: string;
  role: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  // View modal state
  const [viewUser, setViewUser] = useState<UserProfile | null>(null);

  // Edit role modal state
  const [editUser, setEditUser] = useState<UserProfile | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await httpClient.get<UserProfile[]>("/users");
      console.log(res);
      setUsers(res?.data ?? []);
    } catch (e: any) {
      console.log(e);
      setError(e?.response?.data?.message ?? "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openEditRoleModal = (user: UserProfile) => {
    setEditUser(user);
    setSelectedRole(user.role);
    setUpdateError(null);
  };

  const closeEditRoleModal = () => {
    if (isUpdating) return;
    setEditUser(null);
    setSelectedRole("");
    setUpdateError(null);
  };

  const handleUpdateRole = async () => {
    if (!editUser) return;

    setIsUpdating(true);
    setUpdateError(null);

    // Fix: Include userId in the payload
    const payload: UpdateRolePayload = {
      userId: editUser.id,
      role: selectedRole,
    };

    try {
      const res = await httpClient.patch<UserProfile>(
        `/users/role/${editUser.id}`,
        payload,
      );

      // Update user in list
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editUser.id
            ? {
                ...user,
                role: selectedRole as any,
                updatedAt: new Date().toISOString(),
              }
            : user,
        ),
      );

      setSuccess(`User role updated to ${selectedRole}!`);
      setTimeout(() => setSuccess(null), 3000);
      closeEditRoleModal();
    } catch (e: any) {
      console.error("Update error:", e);
      setUpdateError(
        e?.response?.data?.message ?? "Failed to update user role",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const openViewModal = async (userId: string) => {
    try {
      const res = await httpClient.get<UserProfile>(`/users/${userId}`);
      setViewUser(res?.data ?? null);
    } catch (e: any) {
      console.error("View error:", e);
      setUpdateError("Failed to load user details");
      setTimeout(() => setUpdateError(null), 3000);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          icon: Crown,
          label: "Admin",
        };
      case "manager":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          icon: Shield,
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm));
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf8f5] to-[#f5f0ea]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[#e8d9cc] border-t-[#caa05c] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#caa05c]" />
            </div>
          </div>
          <p className="text-sm text-[#ab8965] font-medium tracking-wide">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

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
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2c1810] to-[#5c3d2e] bg-clip-text text-transparent">
                Users Management
              </h1>
              <p className="text-[#ab8965] mt-1 text-sm">
                Manage and oversee all registered users
              </p>
            </div>
            <button
              onClick={fetchUsers}
              className="p-2 text-[#8b6946] hover:text-[#caa05c] transition-colors rounded-full hover:bg-[#f5f0ea]"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ab8965]" />
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f5] border border-[#e8d9cc] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#caa05c]/20 focus:border-[#caa05c] text-[#2c1810] placeholder:text-[#ab8965]/60"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ab8965]" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-[#faf8f5] border border-[#e8d9cc] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#caa05c]/20 focus:border-[#caa05c] text-[#2c1810] appearance-none cursor-pointer"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="CUSTOMER">Customer</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ab8965] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchUsers}
              className="px-4 py-1.5 bg-red-100 hover:bg-red-200 rounded-lg transition-colors text-red-700 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {!error && filteredUsers.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-[#f5f0ea] rounded-full flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-[#ab8965]" />
            </div>
            <p className="text-[#ab8965] text-lg">No users found</p>
            <p className="text-[#ab8965]/60 text-sm mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {!error && filteredUsers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#e8d9cc] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#faf8f5] border-b border-[#e8d9cc]">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#2c1810]">
                      User
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#2c1810]">
                      Contact
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#2c1810]">
                      Role
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#2c1810]">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#2c1810]">
                      Joined
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-[#2c1810]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8d9cc]">
                  {filteredUsers.map((user) => {
                    const roleInfo = getRoleBadge(user.role);
                    const RoleIcon = roleInfo.icon;
                    const joinDate = new Date(user.createdAt);

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-[#faf8f5]/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#caa05c] to-[#b8894a] flex items-center justify-center">
                                <span className="text-sm font-bold text-white">
                                  {getInitials(user.name)}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-[#2c1810]">
                                {user.name}
                              </p>
                              <p className="text-xs text-[#ab8965]">
                                {user.role}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm text-[#2c1810]">
                              <Mail className="w-3.5 h-3.5 text-[#ab8965]" />
                              <span>{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-1 text-sm text-[#2c1810]">
                                <Phone className="w-3.5 h-3.5 text-[#ab8965]" />
                                <span>{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleInfo.bg} ${roleInfo.text}`}
                          >
                            <RoleIcon className="w-3 h-3" />
                            {roleInfo.label}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {user.emailVerified ? (
                            <div className="flex items-center gap-1 text-emerald-600 text-xs">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Verified
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-amber-600 text-xs">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Pending
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-[#2c1810]">
                            <Calendar className="w-3.5 h-3.5 text-[#ab8965]" />
                            {joinDate.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openViewModal(user.id)}
                              className="p-2 text-[#8b6946] hover:text-[#caa05c] transition-colors rounded-lg hover:bg-[#f5f0ea]"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditRoleModal(user)}
                              className="p-2 text-[#8b6946] hover:text-[#caa05c] transition-colors rounded-lg hover:bg-[#f5f0ea]"
                              title="Edit Role"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer with count */}
            <div className="px-6 py-4 border-t border-[#e8d9cc] bg-[#faf8f5]">
              <p className="text-sm text-[#ab8965]">
                Showing {filteredUsers.length} of {users.length} users
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Role Modal */}
      {editUser && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeEditRoleModal();
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#2c1810] to-[#5c3d2e] px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Edit User Role</h2>
                <p className="text-white/70 text-sm mt-1">
                  Change user permissions
                </p>
              </div>
              <button
                onClick={closeEditRoleModal}
                disabled={isUpdating}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 p-4 bg-[#faf8f5] rounded-xl">
                {editUser.image ? (
                  <img
                    src={editUser.image}
                    alt={editUser.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#caa05c] to-[#b8894a] flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {getInitials(editUser.name)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-[#2c1810]">
                    {editUser.name}
                  </p>
                  <p className="text-sm text-[#ab8965]">{editUser.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2c1810] mb-2">
                  Select New Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#faf8f5] border border-[#e8d9cc] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#caa05c]/20 focus:border-[#caa05c] text-[#2c1810]"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <p className="text-xs text-[#ab8965] mt-2">
                  Note: Changing role affects user permissions
                </p>
              </div>

              {updateError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{updateError}</span>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeEditRoleModal}
                  disabled={isUpdating}
                  className="flex-1 py-2.5 border border-[#e8d9cc] rounded-xl text-sm font-medium text-[#8b6946] hover:bg-[#f5f0ea] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateRole}
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
                      Update Role
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {viewUser && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewUser(null);
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#2c1810] to-[#5c3d2e] px-6 py-4 sticky top-0 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">User Details</h2>
                <p className="text-white/70 text-sm mt-1">
                  Complete user information
                </p>
              </div>
              <button
                onClick={() => setViewUser(null)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#e8d9cc]">
                {viewUser.image ? (
                  <img
                    src={viewUser.image}
                    alt={viewUser.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-[#e8d9cc]"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#caa05c] to-[#b8894a] flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {getInitials(viewUser.name)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-[#2c1810]">
                    {viewUser.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadge(viewUser.role).bg} ${getRoleBadge(viewUser.role).text}`}
                    >
                      {React.createElement(getRoleBadge(viewUser.role).icon, {
                        className: "w-3 h-3",
                      })}
                      {getRoleBadge(viewUser.role).label}
                    </div>
                    {viewUser.emailVerified ? (
                      <div className="flex items-center gap-1 text-emerald-600 text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-600 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        Unverified
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-[#2c1810] mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#caa05c]" />
                  Contact Information
                </h4>
                <div className="bg-[#faf8f5] rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#ab8965]" />
                    <div>
                      <p className="text-xs text-[#ab8965]">Email Address</p>
                      <p className="text-sm font-medium text-[#2c1810]">
                        {viewUser.email}
                      </p>
                    </div>
                  </div>
                  {viewUser.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#ab8965]" />
                      <div>
                        <p className="text-xs text-[#ab8965]">Phone Number</p>
                        <p className="text-sm font-medium text-[#2c1810]">
                          {viewUser.phone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-[#2c1810] mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#caa05c]" />
                  Account Information
                </h4>
                <div className="bg-[#faf8f5] rounded-xl p-4 space-y-3">
                  <div className="flex justify-between py-2 border-b border-[#e8d9cc]">
                    <span className="text-[#ab8965]">User Email</span>
                    <span className="font-mono text-[#2c1810] text-sm">
                      {viewUser.email}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#e8d9cc]">
                    <span className="text-[#ab8965]">Role</span>
                    <span className="font-medium text-[#2c1810] capitalize">
                      {viewUser.role.toLowerCase()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#e8d9cc]">
                    <span className="text-[#ab8965]">Account Created</span>
                    <span className="text-[#2c1810]">
                      {new Date(viewUser.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-[#ab8965]">Last Updated</span>
                    <span className="text-[#2c1810]">
                      {new Date(viewUser.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setViewUser(null)}
                className="w-full py-2.5 bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white rounded-xl text-sm font-medium hover:shadow-md transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
