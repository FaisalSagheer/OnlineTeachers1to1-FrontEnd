"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2, Download, Plus, X, Eye } from "lucide-react"
import Cookies from "js-cookie"
import "../admin.css"

// Helper function to read a cookie from the browser
function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
}

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showSubjectForm, setShowSubjectForm] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [notification, setNotification] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [subjectFormData, setSubjectFormData] = useState({
    name: "",
    description: "",
    status: "Available",
  })

  // --- Helper Functions ---
  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }, [])

  // Gets authentication headers with both Bearer token and CSRF token
  const getAuthHeaders = useCallback(() => {
    const token = Cookies.get("accessToken")
    const csrfToken = getCookie("csrftoken")
    const headers = {
      "Content-Type": "application/json",
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

  // Fetch all subjects
  const fetchSubjects = useCallback(async () => {
    setLoading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      const response = await fetch(`${baseUrl}/api/subjects/`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.detail || errorData.message || "Failed to fetch subjects."
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("Fetched subjects:", data) // Debug log
      setSubjects(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Fetch subjects error:", error)
      showNotification(`Failed to fetch subjects: ${error.message}`, "error")
      setSubjects([])
    } finally {
      setLoading(false)
    }
  }, [getAuthHeaders, showNotification])

  // Handles creating a new subject
  const handleCreateSubject = async () => {
    const { name, description, status } = subjectFormData

    if (!name.trim()) {
      showNotification("Subject name is required.", "error")
      return
    }

    const payload = {
      name: name.trim(),
      description: description.trim() || "",
      status,
    }

    console.log("Creating subject with payload:", payload) // Debug log

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-subject/`

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Create subject error response:", errorData) // Debug log
        const errorMessage = errorData.detail || errorData.message || errorData.error || "Failed to create subject."
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log("Create subject success:", result) // Debug log
      showNotification(result.message || "Subject created successfully.", "success")
      await fetchSubjects()
      handleCancelSubjectForm()
    } catch (error) {
      showNotification(`Creation failed: ${error.message}`, "error")
      console.error("Create subject error:", error)
    }
  }

  // Handles updating an existing subject
  const handleUpdateSubject = async () => {
    const { name, description, status } = subjectFormData

    const payload = {
      name: name.trim(),
      description: description.trim() || "",
      status,
    }

    console.log("Updating subject with payload:", payload) // Debug log

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-subject/${editingSubject.id}/`

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Update subject error response:", errorData) // Debug log
        const errorMessage = errorData.detail || errorData.message || errorData.error || "Failed to update subject."
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log("Update subject success:", result) // Debug log
      showNotification(result.message || "Subject updated successfully.", "success")
      await fetchSubjects()
      handleCancelSubjectForm()
    } catch (error) {
      showNotification(`Update failed: ${error.message}`, "error")
      console.error("Update subject error:", error)
    }
  }

  // Main form submission handler
  const handleSubjectSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)

    const { name } = subjectFormData

    if (!name?.trim()) {
      showNotification("Subject name is required.", "error")
      setFormLoading(false)
      return
    }

    try {
      if (editingSubject) {
        await handleUpdateSubject()
      } else {
        await handleCreateSubject()
      }
    } catch (error) {
      console.error("Form submission error:", error)
      showNotification(`Operation failed: ${error.message}`, "error")
    } finally {
      setFormLoading(false)
    }
  }

  // Handles deleting a subject
  const handleDeleteSubject = async (subjectId) => {
    if (!subjectId) {
      showNotification("Cannot delete subject: Subject ID is missing.", "error")
      return
    }

    if (!window.confirm("Are you sure you want to delete this subject? This action cannot be undone.")) {
      return
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete-subject/${subjectId}/`
      const response = await fetch(url, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.detail || errorData.message || errorData.error || "Failed to delete subject."
        throw new Error(errorMessage)
      }

      // For DELETE requests, response might be empty (204 No Content)
      const result = response.status === 204 ? { message: "Subject deleted successfully." } : await response.json()
      showNotification(result.message || "Subject deleted successfully.", "success")
      await fetchSubjects()
    } catch (error) {
      showNotification(`Delete failed: ${error.message}`, "error")
      console.error("Delete subject error:", error)
    }
  }

  // Handles viewing subject details
  const handleViewSubject = async (subjectId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subject/${subjectId}/`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to fetch subject details.")
      }

      const subjectDetail = await response.json()
      showNotification(`Viewing subject: ${subjectDetail.name} (Status: ${subjectDetail.status})`, "info")
      console.log("Full subject details:", subjectDetail)
    } catch (error) {
      showNotification(`View failed: ${error.message}`, "error")
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

  // Load subjects
  useEffect(() => {
    fetchSubjects()
  }, [fetchSubjects])

  // --- Form/UI Handlers ---
  const resetSubjectForm = () => {
    setSubjectFormData({
      name: "",
      description: "",
      status: "Available",
    })
    setEditingSubject(null)
  }

  const handleEditSubject = (subject) => {
    setEditingSubject(subject)
    setSubjectFormData({
      name: subject.name || "",
      description: subject.description || "",
      status: subject.status || "Available",
    })
    setShowSubjectForm(true)
  }

  const handleCancelSubjectForm = () => {
    setShowSubjectForm(false)
    resetSubjectForm()
  }

  const handleExportSubjects = () => {
    if (!subjects.length) {
      showNotification("No subjects to export.", "info")
      return
    }

    const csvContent = [
      ["ID", "Name", "Description", "Status"],
      ...subjects.map((subject) => [
        subject.id || "",
        subject.name || "",
        subject.description || "",
        subject.status || "",
      ]),
    ]
      .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `subjects-export-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showNotification("Subjects exported successfully.", "success")
  }

  // Client-side filtered list of subjects for display
  const filteredSubjects = useMemo(() => {
    if (!searchTerm) {
      return subjects
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase()
    return subjects.filter(
      (subject) =>
        (subject.name?.toLowerCase() || "").includes(lowercasedSearchTerm) ||
        (subject.description?.toLowerCase() || "").includes(lowercasedSearchTerm) ||
        (subject.status?.toLowerCase() || "").includes(lowercasedSearchTerm),
    )
  }, [subjects, searchTerm])

  // --- Render Logic ---
  if (loading && subjects.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-700">Loading subjects...</div>
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
        <h1 className="page-title">📚 Subject Management</h1>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Button
            className="btn-secondary"
            onClick={() => {
              fetchSubjects()
            }}
            title="Refresh Data"
          >
            🔄 Refresh
          </Button>
          <Button className="btn-secondary" onClick={handleExportSubjects} disabled={!subjects.length}>
            <Download size={16} /> Export CSV
          </Button>
          <Button
            className="btn-primary"
            onClick={() => {
              setShowSubjectForm(true)
              resetSubjectForm()
            }}
          >
            <Plus size={16} /> Add Subject
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{subjects.length}</div>
          <div className="stat-label">Total Subjects</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{subjects.filter((s) => s.status === "Available").length}</div>
          <div className="stat-label">Available Subjects</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{subjects.filter((s) => s.status === "Not Available").length}</div>
          <div className="stat-label">Not Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{subjects.filter((s) => s.description).length}</div>
          <div className="stat-label">With Description</div>
        </div>
      </div>

      {/* Add/Edit Subject Form */}
      {showSubjectForm && (
        <div className="form-container" style={{ marginBottom: "2rem" }}>
          <div className="form-header">
            <h3>{editingSubject ? "Edit Subject" : "Add New Subject"}</h3>
            <Button className="btn-secondary" onClick={handleCancelSubjectForm} style={{ padding: "0.5rem" }}>
              <X size={16} />
            </Button>
          </div>
          <form onSubmit={handleSubjectSubmit} className="user-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Subject Name *
                </label>
                <Input
                  id="name"
                  className="form-input"
                  value={subjectFormData.name}
                  onChange={(e) => setSubjectFormData({ ...subjectFormData, name: e.target.value })}
                  placeholder="Enter subject name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  className="form-input"
                  value={subjectFormData.status}
                  onChange={(e) => setSubjectFormData({ ...subjectFormData, status: e.target.value })}
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <Input
                  id="description"
                  className="form-input"
                  value={subjectFormData.description}
                  onChange={(e) => setSubjectFormData({ ...subjectFormData, description: e.target.value })}
                  placeholder="Enter subject description"
                />
              </div>
            </div>
            <div className="form-actions">
              <Button type="submit" className="btn-primary" disabled={formLoading}>
                {formLoading ? (
                  <>
                    <span className="animate-spin mr-2">⚙️</span> Saving...
                  </>
                ) : (
                  <>
                    <Plus size={16} /> {editingSubject ? "Update Subject" : "Add Subject"}
                  </>
                )}
              </Button>
              <Button type="button" className="btn-secondary" onClick={handleCancelSubjectForm} disabled={formLoading}>
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
            placeholder="Search subjects by name, description, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "40px" }}
            className="form-input"
          />
        </div>
      </div>

      {/* Subjects Data Table */}
      <div className="data-table">
        <div className="table-header">
          <h3>All Subjects ({filteredSubjects.length})</h3>
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
              gridTemplateColumns: "0.5fr 2fr 3fr 1.5fr 2fr",
              alignItems: "center",
            }}
          >
            <div>ID</div>
            <div>Name</div>
            <div>Description</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          {/* Table Body */}
          {!loading && filteredSubjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {subjects.length === 0
                ? "No subjects found. Add some subjects to get started."
                : "No subjects match your search criteria."}
            </div>
          ) : (
            filteredSubjects.map((subject, index) => (
              <div
                key={subject.id ? `${subject.id}-${index}` : index}
                className="table-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.5fr 2fr 3fr 1.5fr 2fr",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: "600" }}>{subject.id}</div>
                <div style={{ fontWeight: "600" }}>{subject.name}</div>
                <div style={{ color: "#718096", fontSize: "0.875rem" }}>{subject.description || "No description"}</div>
                <div
                  style={{
                    color: subject.status === "Available" ? "#48bb78" : "#f56565",
                    fontWeight: "500",
                  }}
                >
                  {subject.status || "N/A"}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <Button
                    size="sm"
                    className="btn-secondary"
                    onClick={() => handleViewSubject(subject.id)}
                    title="View Subject Details"
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    <Eye size={14} />
                  </Button>
                  <Button
                    size="sm"
                    className="btn-secondary"
                    onClick={() => handleEditSubject(subject)}
                    title="Edit Subject"
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDeleteSubject(subject.id)}
                    title="Delete Subject"
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
