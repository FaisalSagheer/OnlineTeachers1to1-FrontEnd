"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, Edit, Trash2, Download, Plus, X, Eye } from "lucide-react";
import Cookies from "js-cookie";
import "../admin.css"; // Assuming this CSS file exists and has your styling

// Helper function to read a cookie from the browser
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showUserForm, setShowUserForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [notification, setNotification] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const [userFormData, setUserFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "",
    });

    // --- Helper Functions ---

    const showNotification = useCallback((message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    // Gets authentication headers, including Bearer and CSRF tokens
    const getAuthHeaders = useCallback(() => {
        const token = Cookies.get("accessToken");
        const csrfToken = getCookie("csrftoken");

        const headers = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        if (csrfToken) {
            headers["X-CSRFToken"] = csrfToken;
        }
        return headers;
    }, []);

    // --- API Calls ---

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        let fetchedData = [];
        let primaryApiError = null;

        // Attempt to fetch from the primary backend URL
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            // ✅ UPDATED URL
            const primaryUrl = searchTerm
                ? `${baseUrl}/api/admin-search-users/?query=${encodeURIComponent(searchTerm)}`
                : `${baseUrl}/api/admin-view-users/`;

            const response = await fetch(primaryUrl, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage =
                    errorData.detail || errorData.message || "Failed to fetch users.";
                throw new Error(errorMessage);
            }
            fetchedData = await response.json();
        } catch (error) {
            console.warn("Primary API failed, attempting fallback:", error);
            primaryApiError = error.message;
        }

        // If primary API fails, attempt fallback to a local relative path
        if (primaryApiError) {
            showNotification(`Primary API issue: ${primaryApiError}. Trying fallback...`, "error");
            try {
                // ✅ UPDATED URL
                const fallbackUrl = searchTerm
                    ? `/api/admin/search-users/?query=${encodeURIComponent(searchTerm)}`
                    : `/api/admin/users/`;

                const response = await fetch(fallbackUrl, {
                    headers: getAuthHeaders(),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const errorMessage =
                        errorData.detail || errorData.message || "Fallback API failed.";
                    throw new Error(errorMessage);
                }
                fetchedData = await response.json();
                showNotification("Successfully fetched users from fallback API.", "success");
            } catch (fallbackError) {
                console.error("Fallback API also failed:", fallbackError);
                showNotification(`Both APIs failed: ${fallbackError.message}`, "error");
                fetchedData = [];
            }
        }

        setUsers(fetchedData);
        setLoading(false);
    }, [getAuthHeaders, showNotification, searchTerm]);

    // Handles creating a new user
    const handleCreateUser = async () => {
        const { username, email, password, role } = userFormData;
        if (!password) {
            showNotification("Password is required for new users.", "error");
            return;
        }

        const payload = { username, email, password, role };
        // ✅ UPDATED URL
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin-create-user/`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage =
                    errorData.detail || errorData.message || "Failed to create user.";
                throw new Error(errorMessage);
            }
            showNotification("User created successfully.", "success");
            fetchUsers();
            handleCancelUserForm();
        } catch (error) {
            showNotification(`Creation failed: ${error.message}`, "error");
            console.error("Create user error:", error);
        }
    };

    // Handles updating an existing user
    const handleUpdateUser = async () => {
        const { username, email, password, role } = userFormData;
        const payload = { username, email, role };
        if (password) {
            payload.password = password;
        }
        // ✅ UPDATED URL
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin-edit-user/${editingUser.id}/`;

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage =
                    errorData.detail || errorData.message || "Failed to update user.";
                throw new Error(errorMessage);
            }
            showNotification("User updated successfully.", "success");
            fetchUsers();
            handleCancelUserForm();
        } catch (error) {
            showNotification(`Update failed: ${error.message}`, "error");
            console.error("Update user error:", error);
        }
    };

    // Main form submission handler; decides whether to create or update
    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        const { username, email } = userFormData;
        if (!username || !email) {
            showNotification("Username and Email are required.", "error");
            setFormLoading(false);
            return;
        }

        if (editingUser) {
            await handleUpdateUser();
        } else {
            await handleCreateUser();
        }

        setFormLoading(false);
    };

    // Handles deleting a user
    const handleDeleteUser = async (userId) => {
        if (!userId) {
            showNotification("Cannot delete user: User ID is missing.", "error");
            return;
        }

        if (
            !window.confirm(
                "Are you sure you want to delete this user? This action cannot be undone.",
            )
        ) {
            return;
        }
        try {
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin-delete-user/${userId}/`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage =
                    errorData.detail || errorData.message || "Failed to delete user.";
                throw new Error(errorMessage);
            }
            showNotification("User deleted successfully.", "success");
            fetchUsers();
        } catch (error) {
            showNotification(`Delete failed: ${error.message}`, "error");
            console.error("Delete user error:", error);
        }
    };

    // Handles fetching and displaying a single user's details
    const handleViewUser = async (userId) => {
        setLoading(true);
        try {
            // ✅ UPDATED URL
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin-view-user/${userId}/`,
                {
                    headers: getAuthHeaders(),
                },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage =
                    errorData.detail || errorData.message || `Failed to fetch user details.`;
                throw new Error(errorMessage);
            }

            const userDetail = await response.json();
            showNotification(`Viewing user: ${userDetail.username} (${userDetail.email}) (${userDetail.role})`, "info");
            console.log("Full user details:", userDetail);
        } catch (error) {
            console.error("View user error:", error);
            showNotification(`Failed to view user: ${error.message}`, "error");
        } finally {
            setLoading(false);
        }
    };

    // --- Effect Hooks ---

    // This effect runs once on mount to "prime" the CSRF cookie from the backend
    useEffect(() => {
        const getCsrfToken = async () => {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-csrf/`, {
                    credentials: "include",
                });
            } catch (error) {
                console.error("Could not fetch CSRF token:", error);
            }
        };
        getCsrfToken();
    }, []);

    // This effect fetches the list of users whenever the fetchUsers function changes (i.e., on search)
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // --- Form/UI Handlers ---
    const resetUserForm = () => {
        setUserFormData({ username: "", email: "", password: "", role: "" });
        setEditingUser(null);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setUserFormData({
            username: user.username,
            email: user.email,
            password: "",
            role: user.role,
        });
        setShowUserForm(true);
    };

    const handleCancelUserForm = () => {
        setShowUserForm(false);
        resetUserForm();
    };

    const handleExportUsers = () => {
        if (!users.length) {
            showNotification("No users to export.", "info");
            return;
        }
        const csvContent = [
            ["ID", "Username", "Email", "Created At"],
            ...users.map((user) => [
                user.id || "",
                user.username || "",
                user.email || "",
                user.role || "",
                user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A",
            ]),
        ]
            .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification("Users exported successfully.", "success");
    };

    // Memoized filtered list of users for search functionality
    const filteredUsers = useMemo(() => {
        if (!searchTerm) {
            return users;
        }
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return users.filter(
            (user) =>
                (user.username?.toLowerCase() || "").includes(lowercasedSearchTerm) ||
                (user.email?.toLowerCase() || "").includes(lowercasedSearchTerm) ||
                (user.role?.toLowerCase() || "").includes(lowercasedSearchTerm),
        );
    }, [users, searchTerm]);

    // --- Render Logic ---
    if (loading && users.length === 0 && !searchTerm) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-xl text-gray-700">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-container">
            {/* Notification pop-up */}
            {notification && (
                <div
                    className={`notification ${notification.type === "error" ? "notification-error" : "notification-success"}`}
                    style={{
                        position: "fixed",
                        top: "20px",
                        right: "20px",
                        padding: "1rem",
                        borderRadius: "8px",
                        color: "white",
                        backgroundColor: notification.type === "error" ? "#f56565" : "#48bb78",
                        zIndex: 1000,
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {notification.message}
                </div>
            )}

            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">User Management</h1>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <Button className="btn-secondary" onClick={handleExportUsers}>
                        <Download size={16} /> Export CSV
                    </Button>
                    <Button
                        className="btn-primary"
                        onClick={() => {
                            setShowUserForm(true);
                            resetUserForm();
                        }}
                    >
                        <UserPlus size={16} /> Add User
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{users.length}</div>
                    <div className="stat-label">Total Users</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {users.filter((u) => u.status === "Active").length}
                    </div>
                    <div className="stat-label">Active Users</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {users.filter((u) => u.role === "Admin").length}
                    </div>
                    <div className="stat-label">Admin Users</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {users.filter((u) => u.status === "Inactive").length}
                    </div>
                    <div className="stat-label">Inactive Users</div>
                </div>
            </div>

            {/* Add/Edit User Form */}
            {showUserForm && (
                <div className="form-container" style={{ marginBottom: "2rem" }}>
                    <div className="form-header">
                        <h3>{editingUser ? "Edit User" : "Add New User"}</h3>
                        <Button
                            className="btn-secondary"
                            onClick={handleCancelUserForm}
                            style={{ padding: "0.5rem" }}
                        >
                            <X size={16} />
                        </Button>
                    </div>
                    <form onSubmit={handleUserSubmit} className="user-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="username" className="form-label">
                                    Username *
                                </label>
                                <Input
                                    id="username"
                                    className="form-input"
                                    value={userFormData.username}
                                    onChange={(e) =>
                                        setUserFormData({
                                            ...userFormData,
                                            username: e.target.value,
                                        })
                                    }
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email *
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    className="form-input"
                                    value={userFormData.email}
                                    onChange={(e) =>
                                        setUserFormData({ ...userFormData, email: e.target.value })
                                    }
                                    placeholder="Enter email"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">
                                    Password {!editingUser && "*"}
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    className="form-input"
                                    value={userFormData.password}
                                    onChange={(e) =>
                                        setUserFormData({
                                            ...userFormData,
                                            password: e.target.value,
                                        })
                                    }
                                    placeholder={
                                        editingUser
                                            ? "Leave blank to keep current password"
                                            : "Enter password"
                                    }
                                    required={!editingUser}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="role" className="form-label">
                                    Role *
                                </label>
                                <select
                                    id="role"
                                    className="form-input"
                                    value={userFormData.role}
                                    onChange={(e) =>
                                        setUserFormData({ ...userFormData, role: e.target.value })
                                    }
                                    required
                                >
                                    <option value="">Select role</option>
                                    <option value="admin">Admin</option>
                                    <option value="parent">Parent</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="student">Student</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-actions">
                            <Button type="submit" className="btn-primary" disabled={formLoading}>
                                {formLoading ? (
                                    <>
                                        <span className="mr-2 animate-spin">⚙️</span> Saving...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={16} />{" "}
                                        {editingUser ? "Update User" : "Add User"}
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                className="btn-secondary"
                                onClick={handleCancelUserForm}
                                disabled={formLoading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search Bar */}
            <div
                style={{
                    display: "flex",
                    gap: "1rem",
                    marginBottom: "2rem",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
                    <Search
                        size={20}
                        style={{
                            position: "absolute",
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#718096",
                        }}
                    />
                    <Input
                        placeholder="Search users by username or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: "40px" }}
                        className="form-input"
                    />
                </div>
            </div>

            {/* Users Data Table */}
            <div className="data-table">
                <div className="table-header">
                    <h3>Users ({filteredUsers.length})</h3>
                    {loading && searchTerm && (
                        <span style={{ marginLeft: "1rem", color: "#718096" }}>Searching...</span>
                    )}
                </div>
                <div className="table-content">
                    {/* Table Header */}
                    <div
                        className="table-header-row table-row"
                        style={{
                            fontWeight: "bold",
                            backgroundColor: "#f0f9ff",
                            display: "grid",
                            gridTemplateColumns: "1fr 2fr 2fr 1.5fr 2fr 2fr", // Added column for actions at end
                            alignItems: "center",
                        }}
                    >
                        <div>ID</div>
                        <div>Username</div>
                        <div>Email</div>
                        <div>Role</div>
                        <div>Created At</div>
                        <div>Actions</div> {/* Moved actions to last column */}
                    </div>

                    {/* Table Body */}
                    {!loading && filteredUsers.length === 0 ? (
                        <div className="py-8 text-center text-gray-500">No users found.</div>
                    ) : (
                        filteredUsers.map((user, index) => (
                            <div
                                key={user.id ? `${user.id}-${index}` : index}
                                className="table-row"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 2fr 2fr 1.5fr 2fr 2fr", // Match header layout
                                    alignItems: "center",
                                }}
                            >
                                <div style={{ fontWeight: "600" }}>{user.id}</div>
                                <div style={{ fontWeight: "600" }}>{user.username}</div>
                                <div style={{ color: "#718096" }}>{user.email}</div>
                                <div style={{ color: "#718096" }}>{user.role}</div>
                                <div style={{ fontSize: "0.875rem", color: "#718096" }}>
                                    {user.created_at
                                        ? new Date(user.created_at).toLocaleDateString()
                                        : "N/A"}
                                </div>
                                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                    <Button
                                        size="sm"
                                        className="btn-secondary"
                                        onClick={() => handleViewUser(user.id)}
                                        title="View User Details"
                                        style={{ padding: "0.25rem 0.5rem" }}
                                    >
                                        <Eye size={14} />
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="btn-secondary"
                                        onClick={() => handleEditUser(user)}
                                        title="Edit User"
                                        style={{ padding: "0.25rem 0.5rem" }}
                                    >
                                        <Edit size={14} />
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => handleDeleteUser(user.id)}
                                        title="Delete User"
                                        style={{
                                            padding: "0.25rem 0.5rem",
                                            backgroundColor: "#f56565",
                                            color: "white",
                                            border: "none",
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
