"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus, Search, Edit, Trash2, Download, Plus, X, Eye } from "lucide-react"
import Cookies from "js-cookie"
import "../admin.css"

function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
}

export default function ParentManagement() {
  const [parents, setParents] = useState([])
  const [users, setUsers] = useState([])
  const [profilePictureFile, setProfilePictureFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showParentForm, setShowParentForm] = useState(false)
  const [editingParent, setEditingParent] = useState(null)
  const [notification, setNotification] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [parentFormData, setParentFormData] = useState({
    user_id: "",
    username: "",
    full_name: "",
    contact_number: "",
    address: "",
    email: "",
    profile_picture: "",
    national_identification_no: "",
    occupation: "",
  })

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }, [])

  // Gets authentication headers with both Bearer token and CSRF token
  const getAuthHeaders = useCallback((isFormData = false) => {
    const token = Cookies.get("accessToken")
    const csrfToken = getCookie("csrftoken")
    const headers = {}

    // Only set Content-Type for JSON, let browser set it for FormData
    if (!isFormData) {
      headers["Content-Type"] = "application/json"
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    if (csrfToken) {
      headers["X-CSRFToken"] = csrfToken
    }

    return headers
  }, [])

  // --- API Calls ---
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin-view-users/`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to fetch users.")
      }

      const data = await response.json()
      setUsers(data)
    } catch (error) {
      showNotification(`Error fetching users: ${error.message}`, "error")
    } finally {
      setUsersLoading(false)
    }
  }, [getAuthHeaders, showNotification])

  const fetchParents = useCallback(async () => {
    setLoading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      const primaryUrl = searchTerm
        ? `${baseUrl}/api/parent/?search=${encodeURIComponent(searchTerm)}`
        : `${baseUrl}/api/view-parents/`

      const response = await fetch(primaryUrl, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to fetch parents.")
      }

      const fetchedData = await response.json()
      setParents(fetchedData)
    } catch (error) {
      showNotification(`API Error: ${error.message}`, "error")
      setParents([])
    } finally {
      setLoading(false)
    }
  }, [getAuthHeaders, showNotification, searchTerm])

  // Filter users that are not already parents
  const availableUsers = useMemo(() => {
    const parentUserIds = new Set(parents.map((p) => p.user))
    return users.filter((user) => !parentUserIds.has(user.id))
  }, [users, parents])

  const handleCreateParent = async () => {
    setFormLoading(true)
    try {
      // Find the selected user to get the user_id
      const selectedUser = users.find((user) => user.username === parentFormData.username)
      if (!selectedUser) {
        throw new Error("Selected user not found")
      }

      let body
      let headers

      if (profilePictureFile) {
        // Use FormData when there's a file
        const formData = new FormData()
        formData.append("user_id", selectedUser.id.toString())
        formData.append("username", parentFormData.username)
        formData.append("full_name", parentFormData.full_name)
        formData.append("contact_number", parentFormData.contact_number)
        formData.append("address", parentFormData.address)
        formData.append("email", parentFormData.email)
        formData.append("national_identification_no", parentFormData.national_identification_no)
        formData.append("occupation", parentFormData.occupation)
        formData.append("profile_picture", profilePictureFile)

        body = formData
        headers = getAuthHeaders(true) // true for FormData
      } else {
        // Use JSON when there's no file
        const jsonData = {
          user_id: selectedUser.id,
          username: parentFormData.username,
          full_name: parentFormData.full_name,
          contact_number: parentFormData.contact_number,
          address: parentFormData.address,
          email: parentFormData.email,
          national_identification_no: parentFormData.national_identification_no,
          occupation: parentFormData.occupation,
        }
        body = JSON.stringify(jsonData)
        headers = getAuthHeaders(false) // false for JSON
      }

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-parent/`
      console.log("Creating parent with:", profilePictureFile ? "FormData" : "JSON", body)

      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        credentials: "include",
        body: body,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Create parent error:", errorData)
        throw new Error(errorData.detail || errorData.message || "Failed to create parent.")
      }

      const result = await response.json()
      console.log("Create parent success:", result)
      showNotification("Parent created successfully.", "success")
      await fetchParents()
      handleCancelParentForm()
    } catch (error) {
      console.error("Create parent error:", error)
      showNotification(`Creation failed: ${error.message}`, "error")
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateParent = async () => {
    setFormLoading(true)
    try {
      let body
      let headers

      if (profilePictureFile) {
        // Use FormData when there's a new file
        const formData = new FormData()
        
        formData.append("full_name", parentFormData.full_name)
        formData.append("contact_number", parentFormData.contact_number)
        formData.append("address", parentFormData.address)
        formData.append("email", parentFormData.email)
        formData.append("national_identification_no", parentFormData.national_identification_no)
        formData.append("occupation", parentFormData.occupation)
        formData.append("profile_picture", profilePictureFile)

        body = formData
        headers = getAuthHeaders(true) // true for FormData
      } else {
        // Use JSON when there's no new file
        const jsonData = {
          full_name: parentFormData.full_name,
          contact_number: parentFormData.contact_number,
          address: parentFormData.address,
          email: parentFormData.email,
          national_identification_no: parentFormData.national_identification_no,
          occupation: parentFormData.occupation,
        }
        body = JSON.stringify(jsonData)
        headers = getAuthHeaders(false) // false for JSON
      }

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-delete-parent/${editingParent.id}/`
      console.log("Updating parent with:", profilePictureFile ? "FormData" : "JSON", body)

      const response = await fetch(url, {
        method: "PUT",
        headers: headers,
        credentials: "include",
        body: body,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Update parent error:", errorData)
        throw new Error(errorData.detail || errorData.message || "Failed to update parent.")
      }

      const result = await response.json()
      console.log("Update parent success:", result)
      showNotification("Parent updated successfully.", "success")
      await fetchParents()
      handleCancelParentForm()
    } catch (error) {
      console.error("Update parent error:", error)
      showNotification(`Update failed: ${error.message}`, "error")
    } finally {
      setFormLoading(false)
    }
  }

  const handleParentSubmit = async (e) => {
    e.preventDefault()
    const { username, full_name, email, contact_number } = parentFormData

    if (!full_name || !email || !contact_number) {
      showNotification("Full name, email, and contact number are required.", "error")
      return
    }

    if (!editingParent && !username) {
      showNotification("You must select a user before creating a parent.", "error")
      return
    }

    if (editingParent) {
      await handleUpdateParent()
    } else {
      await handleCreateParent()
    }
  }

  const handleDeleteParent = async (parentId) => {
    if (!window.confirm("Are you sure you want to delete this parent?")) return

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-delete-parent/${parentId}/`
      const response = await fetch(url, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to delete parent.")
      }

      showNotification("Parent deleted successfully.", "success")
      await fetchParents()
    } catch (error) {
      showNotification(`Delete failed: ${error.message}`, "error")
    }
  }

  const handleViewParent = async (parentId) => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-delete-parent/${parentId}/`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to fetch parent details.")
      }

      const parentDetail = await response.json()
      showNotification(`Viewing parent: ${parentDetail.full_name} (${parentDetail.email})`, "info")
      console.log("Full parent details:", parentDetail)
    } catch (error) {
      showNotification(`View failed: ${error.message}`, "error")
    } finally {
      setLoading(false)
    }
  }

  // --- Effect Hooks ---
  // This effect runs once on mount to "prime" the CSRF cookie from the backend
  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-csrf/`, {
          credentials: "include",
        })
      } catch (error) {
        console.error("Could not fetch CSRF token:", error)
      }
    }
    getCsrfToken()
  }, [])

  useEffect(() => {
    fetchParents()
    fetchUsers()
  }, [fetchParents, fetchUsers])

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchParents()
    }, 300)
    return () => clearTimeout(handler)
  }, [searchTerm, fetchParents])

  const resetParentForm = () => {
    setParentFormData({
      user_id: "",
      username: "",
      full_name: "",
      contact_number: "",
      address: "",
      email: "",
      profile_picture: "",
      national_identification_no: "",
      occupation: "",
    })
    setEditingParent(null)
    setProfilePictureFile(null)
  }

  const handleEditParent = (parent) => {
    setEditingParent(parent)
    const userObject = users.find((u) => u.id === parent.user)
    setParentFormData({
      user_id: parent.user || "",
      username: userObject ? userObject.username : "",
      full_name: parent.full_name || "",
      contact_number: parent.contact_number || "",
      address: parent.address || "",
      email: parent.email || "",
      profile_picture: parent.profile_picture || "",
      national_identification_no: parent.national_identification_no || "",
      occupation: parent.occupation || "",
    })
    setProfilePictureFile(null)
    setShowParentForm(true)
  }

  const handleCancelParentForm = () => {
    setShowParentForm(false)
    resetParentForm()
  }

  const handleExportParents = () => {
    if (!parents.length) {
      showNotification("No parents to export.", "info")
      return
    }

    const csvContent = [
      ["ID", "User ID", "Full Name", "Contact", "Email", "Address", "Occupation", "National ID"],
      ...parents.map((p) => [
        p.id,
        p.user,
        p.full_name,
        p.contact_number,
        p.email,
        p.address,
        p.occupation,
        p.national_identification_no,
      ]),
    ]
      .map((row) => row.map((field) => `"${String(field || "").replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `parents-export-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showNotification("Parents exported successfully.", "success")
  }

  const filteredParents = useMemo(() => {
    if (!searchTerm) return parents
    const lowercasedSearchTerm = searchTerm.toLowerCase()
    return parents.filter(
      (p) =>
        p.full_name?.toLowerCase().includes(lowercasedSearchTerm) ||
        p.email?.toLowerCase().includes(lowercasedSearchTerm) ||
        p.contact_number?.toLowerCase().includes(lowercasedSearchTerm) ||
        p.occupation?.toLowerCase().includes(lowercasedSearchTerm),
    )
  }, [parents, searchTerm])

  if (loading && parents.length === 0 && !searchTerm) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-700">Loading parents...</div>
      </div>
    )
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
            zIndex: 1000,
            backgroundColor: notification.type === "error" ? "#f56565" : "#48bb78",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {notification.message}
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">👪 Parent Management</h1>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Button className="btn-secondary" onClick={handleExportParents}>
            <Download size={16} /> Export CSV
          </Button>
          <Button
            className="btn-primary"
            onClick={() => {
              resetParentForm()
              setShowParentForm(true)
            }}
          >
            <UserPlus size={16} /> Add Parent
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{parents.length}</div>
          <div className="stat-label">Total Parents</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{parents.filter((p) => p.status === "Active").length}</div>
          <div className="stat-label">Active Parents</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{parents.filter((p) => p.occupation === "Teacher").length}</div>
          <div className="stat-label">Teacher Parents</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{parents.filter((p) => p.contact_number).length}</div>
          <div className="stat-label">With Contact Info</div>
        </div>
      </div>

      {/* Add/Edit Parent Form */}
      {showParentForm && (
        <div className="form-container" style={{ marginBottom: "2rem" }}>
          <div className="form-header">
            <h3>{editingParent ? "Edit Parent" : "Add New Parent"}</h3>
            <Button className="btn-secondary" onClick={handleCancelParentForm} style={{ padding: "0.5rem" }}>
              <X size={16} />
            </Button>
          </div>
          <form onSubmit={handleParentSubmit} className="user-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="user" className="form-label">
                  User *
                </label>
                <select
                  id="user"
                  className="form-input"
                  value={parentFormData.username}
                  onChange={(e) => setParentFormData({ ...parentFormData, username: e.target.value })}
                  required
                  disabled={!!editingParent || usersLoading}
                >
                  <option value="" disabled>
                    {usersLoading ? "Loading users..." : "Select a user"}
                  </option>
                  {!usersLoading && availableUsers.length === 0 && (
                    <option value="" disabled>
                      No available users
                    </option>
                  )}
                  {availableUsers.map((user) => (
                    <option key={user.id} value={user.username}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="full_name" className="form-label">
                  Full Name *
                </label>
                <Input
                  id="full_name"
                  className="form-input"
                  value={parentFormData.full_name}
                  onChange={(e) => setParentFormData({ ...parentFormData, full_name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  className="form-input"
                  value={parentFormData.email}
                  onChange={(e) => setParentFormData({ ...parentFormData, email: e.target.value })}
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact_number" className="form-label">
                  Contact Number *
                </label>
                <Input
                  id="contact_number"
                  className="form-input"
                  value={parentFormData.contact_number}
                  onChange={(e) => setParentFormData({ ...parentFormData, contact_number: e.target.value })}
                  placeholder="Enter contact number"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <Input
                  id="address"
                  className="form-input"
                  value={parentFormData.address}
                  onChange={(e) => setParentFormData({ ...parentFormData, address: e.target.value })}
                  placeholder="Enter address"
                />
              </div>
              <div className="form-group">
                <label htmlFor="occupation" className="form-label">
                  Occupation
                </label>
                <Input
                  id="occupation"
                  className="form-input"
                  value={parentFormData.occupation}
                  onChange={(e) => setParentFormData({ ...parentFormData, occupation: e.target.value })}
                  placeholder="Enter occupation"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="national_identification_no" className="form-label">
                  National ID
                </label>
                <Input
                  id="national_identification_no"
                  className="form-input"
                  value={parentFormData.national_identification_no}
                  onChange={(e) => setParentFormData({ ...parentFormData, national_identification_no: e.target.value })}
                  placeholder="Enter national ID"
                />
              </div>
              <div className="form-group">
                <label htmlFor="profile_picture" className="form-label">
                  Upload Profile Picture
                </label>
                <Input
                  id="profile_picture"
                  className="form-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      setProfilePictureFile(file)
                      setParentFormData({ ...parentFormData, profile_picture: URL.createObjectURL(file) })
                    }
                  }}
                />
              </div>
            </div>
            {parentFormData.profile_picture && (
              <div className="form-row">
                <div className="form-group">
                  <div className="mt-2">
                    <img
                      src={parentFormData.profile_picture || "/placeholder.svg"}
                      alt="Profile Preview"
                      className="w-24 h-24 object-cover rounded-full"
                      style={{ width: "96px", height: "96px", objectFit: "cover", borderRadius: "50%" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="form-actions">
              <Button type="submit" className="btn-primary" disabled={formLoading}>
                {formLoading ? (
                  <>
                    <span className="animate-spin mr-2">⚙️</span> Saving...
                  </>
                ) : (
                  <>
                    <Plus size={16} /> {editingParent ? "Update Parent" : "Add Parent"}
                  </>
                )}
              </Button>
              <Button type="button" className="btn-secondary" onClick={handleCancelParentForm} disabled={formLoading}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
          <Search
            size={20}
            style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#718096" }}
          />
          <Input
            placeholder="Search parents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "40px" }}
            className="form-input"
          />
        </div>
      </div>

      {/* Parents Data Table */}
      <div className="data-table">
        <div className="table-header">
          <h3>Parents ({filteredParents.length})</h3>
          {loading && searchTerm && <span style={{ marginLeft: "1rem", color: "#718096" }}>Searching...</span>}
        </div>
        <div className="table-content">
          {/* Table Header */}
          <div
            className="table-row table-header-row"
            style={{
              fontWeight: "bold",
              backgroundColor: "#f0f9ff",
              display: "grid",
              gridTemplateColumns: "0.5fr 1.5fr 2fr 1.5fr 2fr 1.5fr 2fr",
              alignItems: "center",
            }}
          >
            <div>ID</div>
            <div>Full Name</div>
            <div>Email</div>
            <div>Contact</div>
            <div>Address</div>
            <div>Occupation</div>
            <div>Actions</div>
          </div>
          {/* Table Body */}
          {!loading && filteredParents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No parents found.</div>
          ) : (
            filteredParents.map((parent, index) => (
              <div
                key={parent.id ? `${parent.id}-${index}` : index}
                className="table-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.5fr 1.5fr 2fr 1.5fr 2fr 1.5fr 2fr",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: "600" }}>{parent.id}</div>
                <div style={{ fontWeight: "600" }}>{parent.full_name}</div>
                <div style={{ color: "#718096" }}>{parent.email}</div>
                <div style={{ color: "#718096" }}>{parent.contact_number}</div>
                <div style={{ color: "#718096", fontSize: "0.875rem" }}>
                  {parent.address
                    ? parent.address.length > 30
                      ? `${parent.address.substring(0, 30)}...`
                      : parent.address
                    : "N/A"}
                </div>
                <div style={{ color: "#718096" }}>{parent.occupation || "N/A"}</div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <Button
                    size="sm"
                    className="btn-secondary"
                    onClick={() => handleViewParent(parent.id)}
                    title="View Parent Details"
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    <Eye size={14} />
                  </Button>
                  <Button
                    size="sm"
                    className="btn-secondary"
                    onClick={() => handleEditParent(parent)}
                    title="Edit Parent"
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDeleteParent(parent.id)}
                    title="Delete Parent"
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
  )
}
