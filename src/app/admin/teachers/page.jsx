"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus, Search, Edit, Trash2, Download, Plus, X, Eye } from "lucide-react"
import Cookies from "js-cookie"
import "../admin.css"

// Helper function to read a cookie from the browser
function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
}

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState([])
  const [users, setUsers] = useState([])
  const [profilePictureFile, setProfilePictureFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showTeacherForm, setShowTeacherForm] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [notification, setNotification] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [teacherFormData, setTeacherFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    country: "",
    biography: "",
    qualifications: "",
    experience_years: "",
    status: "Available",
    profile_picture: "",
  })

  // --- Helper Functions ---
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

  // Fetch all users for the dropdown
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
        const errorMessage = errorData.detail || errorData.message || "Failed to fetch users."
        throw new Error(errorMessage)
      }

      const fetchedUsers = await response.json()
      console.log("Fetched users:", fetchedUsers) // Debug log
      setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : [])
    } catch (error) {
      console.error("Fetch users error:", error)
      showNotification(`Failed to fetch users: ${error.message}`, "error")
      setUsers([])
    } finally {
      setUsersLoading(false)
    }
  }, [getAuthHeaders, showNotification])

  // Fetch all teachers
  const fetchTeachers = useCallback(async () => {
    setLoading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL

      // Try view-teachers first, then fallback to teachers
      let response = await fetch(`${baseUrl}/api/view-teachers/`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      // If view-teachers fails, try teachers endpoint
      if (!response.ok) {
        console.log("view-teachers failed, trying teachers endpoint...")
        response = await fetch(`${baseUrl}/api/teachers/`, {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include",
        })
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.detail || errorData.message || "Failed to fetch teachers."
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("Fetched teachers:", data) // Debug log
      setTeachers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Fetch teachers error:", error)
      showNotification(`Failed to fetch teachers: ${error.message}`, "error")
      setTeachers([])
    } finally {
      setLoading(false)
    }
  }, [getAuthHeaders, showNotification])

  // Filter users that are not already teachers
  const availableUsers = useMemo(() => {
    const teacherUserIds = new Set(teachers.map((t) => t.user))
    return users.filter((user) => !teacherUserIds.has(user.id))
  }, [users, teachers])

  // Handles creating a new teacher
  const handleCreateTeacher = async () => {
    const {
      username,
      first_name,
      last_name,
      email,
      phone_number,
      address,
      city,
      country,
      biography,
      qualifications,
      experience_years,
      status,
    } = teacherFormData

    if (!username || !first_name || !last_name || !email) {
      showNotification("Username, first name, last name, and email are required.", "error")
      return
    }

    // Validate that the selected user exists
    const selectedUser = users.find((u) => u.username === username)
    if (!selectedUser) {
      showNotification("Selected user not found. Please refresh and try again.", "error")
      return
    }

    try {
      let body
      let headers

      if (profilePictureFile) {
        // Use FormData when there's a file
        const formData = new FormData()
        formData.append("username", username)
        formData.append("first_name", first_name.trim())
        formData.append("last_name", last_name.trim())
        formData.append("email", email.trim())
        formData.append("phone_number", phone_number.trim() || "")
        formData.append("address", address.trim() || "")
        formData.append("city", city.trim() || "")
        formData.append("country", country.trim() || "")
        formData.append("biography", biography.trim() || "")
        formData.append("qualifications", qualifications.trim() || "")
        formData.append("experience_years", experience_years || "0")
        formData.append("status", status)
        formData.append("profile_picture", profilePictureFile)

        body = formData
        headers = getAuthHeaders(true) // true for FormData
      } else {
        // Use JSON when there's no file
        const jsonData = {
          username,
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          email: email.trim(),
          phone_number: phone_number.trim() || "",
          address: address.trim() || "",
          city: city.trim() || "",
          country: country.trim() || "",
          biography: biography.trim() || "",
          qualifications: qualifications.trim() || "",
          experience_years: experience_years ? Number.parseInt(experience_years) : 0,
          status,
        }

        body = JSON.stringify(jsonData)
        headers = getAuthHeaders(false) // false for JSON
      }

      console.log("Creating teacher with:", profilePictureFile ? "FormData" : "JSON", body)

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-teacher/`
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        credentials: "include",
        body: body,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Create teacher error response:", errorData)
        const errorMessage = errorData.detail || errorData.message || errorData.error || "Failed to create teacher."
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log("Create teacher success:", result)
      showNotification(result.message || "Teacher created successfully.", "success")
      await fetchTeachers()
      handleCancelTeacherForm()
    } catch (error) {
      showNotification(`Creation failed: ${error.message}`, "error")
      console.error("Create teacher error:", error)
    }
  }

  // Handles updating an existing teacher
  const handleUpdateTeacher = async () => {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      address,
      city,
      country,
      biography,
      qualifications,
      experience_years,
      status,
    } = teacherFormData

    try {
      let body
      let headers

      if (profilePictureFile) {
        // Use FormData when there's a new file
        const formData = new FormData()
        formData.append("first_name", first_name.trim())
        formData.append("last_name", last_name.trim())
        formData.append("email", email.trim())
        formData.append("phone_number", phone_number.trim() || "")
        formData.append("address", address.trim() || "")
        formData.append("city", city.trim() || "")
        formData.append("country", country.trim() || "")
        formData.append("biography", biography.trim() || "")
        formData.append("qualifications", qualifications.trim() || "")
        formData.append("experience_years", experience_years || "0")
        formData.append("status", status)
        formData.append("profile_picture", profilePictureFile)

        body = formData
        headers = getAuthHeaders(true) // true for FormData
      } else {
        // Use JSON when there's no new file
        const jsonData = {
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          email: email.trim(),
          phone_number: phone_number.trim() || "",
          address: address.trim() || "",
          city: city.trim() || "",
          country: country.trim() || "",
          biography: biography.trim() || "",
          qualifications: qualifications.trim() || "",
          experience_years: experience_years ? Number.parseInt(experience_years) : 0,
          status,
        }

        body = JSON.stringify(jsonData)
        headers = getAuthHeaders(false) // false for JSON
      }

      console.log("Updating teacher with:", profilePictureFile ? "FormData" : "JSON", body)

      // Try multiple update endpoints
      const possibleEndpoints = [
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/teachers/${editingTeacher.id}/`,
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/${editingTeacher.id}/`,
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher-profile/edit/`,
      ]

      for (let i = 0; i < possibleEndpoints.length; i++) {
        const url = possibleEndpoints[i]
        console.log(`Trying update endpoint ${i + 1}/${possibleEndpoints.length}: ${url}`)

        try {
          const response = await fetch(url, {
            method: "PUT",
            headers: headers,
            credentials: "include",
            body: body,
          })

          if (response.ok) {
            const result = await response.json()
            console.log("Update teacher success:", result)
            showNotification(result.message || "Teacher updated successfully.", "success")
            await fetchTeachers()
            handleCancelTeacherForm()
            return // Success!
          } else {
            const errorData = await response.json().catch(() => ({}))
            console.log(`Update attempt ${i + 1} failed - Status: ${response.status}, Error:`, errorData)

            // If this is the last attempt, throw the error
            if (i === possibleEndpoints.length - 1) {
              const errorMessage =
                errorData.detail || errorData.message || errorData.error || "Failed to update teacher."
              throw new Error(errorMessage)
            }
          }
        } catch (error) {
          console.log(`Update network error on attempt ${i + 1}:`, error.message)

          // If this is the last attempt, throw the error
          if (i === possibleEndpoints.length - 1) {
            throw error
          }
        }
      }
    } catch (error) {
      showNotification(`Update failed: ${error.message}`, "error")
      console.error("Update teacher error:", error)
    }
  }

  // Main form submission handler
  const handleTeacherSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)

    const { username, first_name, last_name, email } = teacherFormData

    if (!first_name?.trim() || !last_name?.trim() || !email?.trim()) {
      showNotification("First name, last name, and email are required.", "error")
      setFormLoading(false)
      return
    }

    if (!editingTeacher && !username) {
      showNotification("Please select a user.", "error")
      setFormLoading(false)
      return
    }

    try {
      if (editingTeacher) {
        await handleUpdateTeacher()
      } else {
        await handleCreateTeacher()
      }
    } catch (error) {
      console.error("Form submission error:", error)
      showNotification(`Operation failed: ${error.message}`, "error")
    } finally {
      setFormLoading(false)
    }
  }

  // Handles deleting a teacher
  const handleDeleteTeacher = async (teacherId) => {
    if (!teacherId) {
      showNotification("Cannot delete teacher: Teacher ID is missing.", "error")
      return
    }

    if (!window.confirm("Are you sure you want to delete this teacher? This action cannot be undone.")) {
      return
    }

    // Try different possible endpoints for delete
    const possibleEndpoints = [
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete-teacher/${teacherId}/`,
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/teachers/${teacherId}/`,
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/${teacherId}/`,
    ]

    for (let i = 0; i < possibleEndpoints.length; i++) {
      const url = possibleEndpoints[i]
      console.log(`Trying delete endpoint ${i + 1}/${possibleEndpoints.length}: ${url}`)

      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: getAuthHeaders(),
          credentials: "include",
        })

        if (response.ok) {
          const result = response.status === 204 ? { message: "Teacher deleted successfully." } : await response.json()
          showNotification(result.message || "Teacher deleted successfully.", "success")
          await fetchTeachers()
          return // Success!
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.log(`Delete attempt ${i + 1} failed - Status: ${response.status}, Error:`, errorData)

          // If this is the last attempt, throw the error
          if (i === possibleEndpoints.length - 1) {
            const errorMessage = errorData.detail || errorData.message || errorData.error || "Failed to delete teacher."
            throw new Error(errorMessage)
          }
        }
      } catch (error) {
        console.log(`Delete network error on attempt ${i + 1}:`, error.message)

        // If this is the last attempt, throw the error
        if (i === possibleEndpoints.length - 1) {
          showNotification(`Delete failed: ${error.message}`, "error")
          console.error("Delete teacher error:", error)
          return
        }
      }
    }
  }

  // Handles viewing teacher details
  const handleViewTeacher = async (teacherId) => {
    // Try different view endpoints
    const possibleEndpoints = [
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/view-teacher/${teacherId}/`,
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/teachers/${teacherId}/`,
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/${teacherId}/`,
    ]

    for (let i = 0; i < possibleEndpoints.length; i++) {
      const url = possibleEndpoints[i]
      console.log(`Trying view endpoint ${i + 1}/${possibleEndpoints.length}: ${url}`)

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include",
        })

        if (response.ok) {
          const teacherDetail = await response.json()
          const teacherName = `${teacherDetail.first_name} ${teacherDetail.last_name}`
          showNotification(`Viewing teacher: ${teacherName} (${teacherDetail.email})`, "info")
          console.log("Full teacher details:", teacherDetail)
          return // Success!
        }
      } catch (error) {
        console.log(`View network error on attempt ${i + 1}:`, error.message)
      }
    }

    // If all attempts failed, show error
    showNotification("Failed to fetch teacher details.", "error")
  }

  // Search teachers by name
  const handleSearchTeachers = useCallback(
    async (searchQuery) => {
      if (!searchQuery.trim()) {
        fetchTeachers()
        return
      }

      setLoading(true)
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
        const response = await fetch(`${baseUrl}/api/search-teachers/?query=${encodeURIComponent(searchQuery)}`, {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include",
        })

        if (!response.ok) {
          // If search fails, fall back to client-side filtering
          console.log("Search API failed, using client-side filtering")
          fetchTeachers()
          return
        }

        const data = await response.json()
        console.log("Search results:", data)
        setTeachers(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Search error:", error)
        // Fall back to client-side filtering
        fetchTeachers()
      } finally {
        setLoading(false)
      }
    },
    [getAuthHeaders, fetchTeachers],
  )

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

  // Load users first, then teachers
  useEffect(() => {
    const loadData = async () => {
      await fetchUsers()
      await fetchTeachers()
    }
    loadData()
  }, []) // Remove dependencies to avoid infinite loops

  // Handle search with debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearchTeachers(searchTerm)
      } else {
        fetchTeachers()
      }
    }, 300)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // --- Form/UI Handlers ---
  const resetTeacherForm = () => {
    setTeacherFormData({
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      address: "",
      city: "",
      country: "",
      biography: "",
      qualifications: "",
      experience_years: "",
      status: "Available",
      profile_picture: "",
    })
    setEditingTeacher(null)
    setProfilePictureFile(null)
  }

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher)
    const userObject = users.find((u) => u.id === teacher.user)
    setTeacherFormData({
      username: userObject ? userObject.username : "",
      first_name: teacher.first_name || "",
      last_name: teacher.last_name || "",
      email: teacher.email || "",
      phone_number: teacher.phone_number || "",
      address: teacher.address || "",
      city: teacher.city || "",
      country: teacher.country || "",
      biography: teacher.biography || "",
      qualifications: teacher.qualifications || "",
      experience_years: teacher.experience_years ? teacher.experience_years.toString() : "",
      status: teacher.status || "Available",
      profile_picture: teacher.profile_picture || "",
    })
    setProfilePictureFile(null)
    setShowTeacherForm(true)
  }

  const handleCancelTeacherForm = () => {
    setShowTeacherForm(false)
    resetTeacherForm()
  }

  const handleExportTeachers = () => {
    if (!teachers.length) {
      showNotification("No teachers to export.", "info")
      return
    }

    const csvContent = [
      ["ID", "First Name", "Last Name", "Email", "Phone", "City", "Country", "Experience", "Status"],
      ...teachers.map((teacher) => [
        teacher.id || "",
        teacher.first_name || "",
        teacher.last_name || "",
        teacher.email || "",
        teacher.phone_number || "",
        teacher.city || "",
        teacher.country || "",
        teacher.experience_years || "",
        teacher.status || "",
      ]),
    ]
      .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `teachers-export-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showNotification("Teachers exported successfully.", "success")
  }

  // Client-side filtered list of teachers for display
  const filteredTeachers = useMemo(() => {
    if (!searchTerm) {
      return teachers
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase()
    return teachers.filter(
      (teacher) =>
        (teacher.first_name?.toLowerCase() || "").includes(lowercasedSearchTerm) ||
        (teacher.last_name?.toLowerCase() || "").includes(lowercasedSearchTerm) ||
        (teacher.email?.toLowerCase() || "").includes(lowercasedSearchTerm) ||
        (teacher.city?.toLowerCase() || "").includes(lowercasedSearchTerm) ||
        (teacher.status?.toLowerCase() || "").includes(lowercasedSearchTerm),
    )
  }, [teachers, searchTerm])

  // --- Render Logic ---
  if (loading && teachers.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-700">Loading teachers...</div>
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
        <h1 className="page-title">👨‍🏫 Teacher Management</h1>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Button
            className="btn-secondary"
            onClick={() => {
              fetchUsers()
              fetchTeachers()
            }}
            title="Refresh Data"
          >
            🔄 Refresh
          </Button>
          <Button className="btn-secondary" onClick={handleExportTeachers} disabled={!teachers.length}>
            <Download size={16} /> Export CSV
          </Button>
          <Button
            className="btn-primary"
            onClick={() => {
              if (users.length === 0) {
                showNotification("No users available. Please add users first.", "error")
                return
              }
              setShowTeacherForm(true)
              resetTeacherForm()
            }}
            disabled={usersLoading}
          >
            <UserPlus size={16} /> Add Teacher
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{teachers.length}</div>
          <div className="stat-label">Total Teachers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{teachers.filter((t) => t.status === "Available").length}</div>
          <div className="stat-label">Available Teachers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{teachers.filter((t) => t.experience_years >= 5).length}</div>
          <div className="stat-label">Experienced (5+ years)</div>
        </div>
      </div>

      {/* Users Status Info */}
      {usersLoading && (
        <div className="form-container" style={{ marginBottom: "2rem" }}>
          <div className="form-header">
            <h3>Loading Users...</h3>
          </div>
          <div className="user-form">
            <div className="text-center py-4">
              <div className="text-gray-600">Fetching available users...</div>
            </div>
          </div>
        </div>
      )}

      {!usersLoading && users.length === 0 && (
        <div className="form-container" style={{ marginBottom: "2rem" }}>
          <div className="form-header">
            <h3>⚠️ No Users Available</h3>
          </div>
          <div className="user-form">
            <div className="text-center py-4">
              <div className="text-gray-600 mb-2">No users found in the system.</div>
              <div className="text-gray-500">Please add users first before creating teachers.</div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Teacher Form */}
      {showTeacherForm && users.length > 0 && (
        <div className="form-container" style={{ marginBottom: "2rem" }}>
          <div className="form-header">
            <h3>{editingTeacher ? "Edit Teacher" : "Add New Teacher"}</h3>
            <Button className="btn-secondary" onClick={handleCancelTeacherForm} style={{ padding: "0.5rem" }}>
              <X size={16} />
            </Button>
          </div>
          <form onSubmit={handleTeacherSubmit} className="user-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  User * ({availableUsers.length} available)
                </label>
                <select
                  id="username"
                  className="form-input"
                  value={teacherFormData.username}
                  onChange={(e) => {
                    console.log("Selected username:", e.target.value) // Debug log
                    setTeacherFormData({ ...teacherFormData, username: e.target.value })
                  }}
                  required
                  disabled={!!editingTeacher}
                >
                  <option value="">-- Select a user --</option>
                  {availableUsers.map((user) => (
                    <option key={user.id} value={user.username}>
                      {user.username} ({user.email}) - ID: {user.id}
                    </option>
                  ))}
                </select>
                {teacherFormData.username && (
                  <div className="text-sm text-gray-600 mt-1">Selected User: {teacherFormData.username}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="first_name" className="form-label">
                  First Name *
                </label>
                <Input
                  id="first_name"
                  className="form-input"
                  value={teacherFormData.first_name}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, first_name: e.target.value })}
                  placeholder="Enter first name"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="last_name" className="form-label">
                  Last Name *
                </label>
                <Input
                  id="last_name"
                  className="form-input"
                  value={teacherFormData.last_name}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, last_name: e.target.value })}
                  placeholder="Enter last name"
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
                  value={teacherFormData.email}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, email: e.target.value })}
                  placeholder="Enter email"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone_number" className="form-label">
                  Phone Number
                </label>
                <Input
                  id="phone_number"
                  className="form-input"
                  value={teacherFormData.phone_number}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, phone_number: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
 <div className="form-group">
                <label htmlFor="experience_years" className="form-label">
                  Experience (Years)
                </label>
                <Input
                  id="experience_years"
                  type="number"
                  min="0"
                  max="50"
                  className="form-input"
                  value={teacherFormData.experience_years}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, experience_years: e.target.value })}
                  placeholder="Enter years of experience"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  className="form-input"
                  value={teacherFormData.status}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, status: e.target.value })}
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
<div className="form-group">
                <label htmlFor="city" className="form-label">
                  City
                </label>
                <Input
                  id="city"
                  className="form-input"
                  value={teacherFormData.city}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, city: e.target.value })}
                  placeholder="Enter city"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="country" className="form-label">
                  Country
                </label>
                <Input
                  id="country"
                  className="form-input"
                  value={teacherFormData.country}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, country: e.target.value })}
                  placeholder="Enter country"
                />
              </div>
<div className="form-group">
                <label htmlFor="qualifications" className="form-label">
                  Qualifications
                </label>
                <Input
                  id="qualifications"
                  className="form-input"
                  value={teacherFormData.qualifications}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, qualifications: e.target.value })}
                  placeholder="e.g., M.Ed, B.Sc, PhD"
                />
              </div>
            </div>
            <div className="form-row">
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
                      setTeacherFormData({ ...teacherFormData, profile_picture: URL.createObjectURL(file) })
                    }
                  }}
                />
              </div>
 <div className="form-group">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <Input
                  id="address"
                  className="form-input"
                  value={teacherFormData.address}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, address: e.target.value })}
                  placeholder="Enter full address"
                />
              </div>
            </div>
              <div className="form-group">
                <label htmlFor="biography" className="form-label">
                  Biography
                </label>
                <Input
                  id="biography"
                  className="form-input"
                  value={teacherFormData.biography}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, biography: e.target.value })}
                  placeholder="Brief biography or description"
                />
              </div>
            {teacherFormData.profile_picture && (
              <div className="form-row">
                <div className="form-group">
                  <div className="mt-2">
                    <img
                      src={teacherFormData.profile_picture || "/placeholder.svg"}
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
                    <Plus size={16} /> {editingTeacher ? "Update Teacher" : "Add Teacher"}
                  </>
                )}
              </Button>
              <Button type="button" className="btn-secondary" onClick={handleCancelTeacherForm} disabled={formLoading}>
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
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#718096",
            }}
          />
          <Input
            placeholder="Search teachers by name, email, city, status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "40px" }}
            className="form-input"
          />
        </div>
      </div>

      {/* Teachers Data Table */}
      <div className="data-table">
        <div className="table-header">
          <h3>All Teachers ({filteredTeachers.length})</h3>
          {loading && <span style={{ marginLeft: "1rem", color: "#718096" }}>Loading...</span>}
        </div>
        <div className="table-content">
          {/* Table Header */}
          <div
            className="table-row table-header-row"
            style={{
              fontWeight: "bold",
              backgroundColor: "#f0f9ff",
              display: "grid",
              gridTemplateColumns: "0.5fr 1.5fr 1.5fr 2fr 1.5fr 1.5fr 1fr 2fr",
              alignItems: "center",
            }}
          >
            <div>ID</div>
            <div>First Name</div>
            <div>Last Name</div>
            <div>Email</div>
            <div>City</div>
            <div>Experience</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          {/* Table Body */}
          {!loading && filteredTeachers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {teachers.length === 0
                ? "No teachers found. Add some teachers to get started."
                : "No teachers match your search criteria."}
            </div>
          ) : (
            filteredTeachers.map((teacher, index) => (
              <div
                key={teacher.id ? `${teacher.id}-${index}` : index}
                className="table-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.5fr 1.5fr 1.5fr 2fr 1.5fr 1.5fr 1fr 2fr",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: "600" }}>{teacher.id}</div>
                <div style={{ fontWeight: "600" }}>{teacher.first_name}</div>
                <div style={{ fontWeight: "600" }}>{teacher.last_name}</div>
                <div style={{ color: "#718096", fontSize: "0.875rem" }}>{teacher.email}</div>
                <div style={{ color: "#718096" }}>{teacher.city || "N/A"}</div>
                <div style={{ color: "#718096" }}>{teacher.experience_years || "0"} yrs</div>
                <div style={{ color: teacher.status === "Available" ? "#48bb78" : "#f56565", fontWeight: "500" }}>
                  {teacher.status || "N/A"}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <Button
                    size="sm"
                    className="btn-secondary"
                    onClick={() => handleViewTeacher(teacher.id)}
                    title="View Teacher Details"
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    <Eye size={14} />
                  </Button>
                  <Button
                    size="sm"
                    className="btn-secondary"
                    onClick={() => handleEditTeacher(teacher)}
                    title="Edit Teacher"
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDeleteTeacher(teacher.id)}
                    title="Delete Teacher"
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
