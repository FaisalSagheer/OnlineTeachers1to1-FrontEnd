"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2, Download, Plus, X, Eye, GraduationCap } from "lucide-react"
import Cookies from "js-cookie"
import "../admin.css"

// Helper function to read a cookie from the browser
function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
}

export default function CurriculumTypeManagement() {
  const [curriculumTypes, setCurriculumTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCurriculumForm, setShowCurriculumForm] = useState(false)
  const [editingCurriculum, setEditingCurriculum] = useState(null)
  const [notification, setNotification] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [curriculumFormData, setCurriculumFormData] = useState({
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
  const getAuthHeaders = useCallback((isFormData = false) => {
    const token = Cookies.get("accessToken")
    const csrfToken = getCookie("csrftoken")
    const headers = {}

    // Only set Content-Type for JSON requests, not for FormData
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

  // Fetch all curriculum types
  const fetchCurriculumTypes = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/curriculum-types/`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.detail || errorData.message || "Failed to fetch curriculum types."
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("Fetched curriculum types:", data)
      setCurriculumTypes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Fetch curriculum types error:", error)
      showNotification(`Failed to fetch curriculum types: ${error.message}`, "error")
      setCurriculumTypes([])
    } finally {
      setLoading(false)
    }
  }, [getAuthHeaders, showNotification])

  // Handles creating/updating a curriculum type
  const handleCurriculumSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)

    const { name, description, status } = curriculumFormData

    if (!name?.trim()) {
      showNotification("Curriculum type name is required.", "error")
      setFormLoading(false)
      return
    }

    const url = editingCurriculum
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-curriculum-type/${editingCurriculum.id}/`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-curriculum-type/`
    const method = editingCurriculum ? "PUT" : "POST"

    // Try with FormData first
    const formData = new FormData()
    formData.append("name", name.trim())
    formData.append("description", description.trim() || "")
    formData.append("status", status)

    try {
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(true), // true for FormData
        credentials: "include",
        body: formData,
      })

      if (!response.ok) {
        // If FormData fails, try with JSON
        if (response.status === 415 || response.status === 400) {
          const jsonPayload = {
            name: name.trim(),
            description: description.trim() || "",
            status,
          }

          const jsonResponse = await fetch(url, {
            method,
            headers: getAuthHeaders(false), // false for JSON
            credentials: "include",
            body: JSON.stringify(jsonPayload),
          })

          if (!jsonResponse.ok) {
            const errorData = await jsonResponse.json().catch(() => ({}))
            const errorMessage =
              errorData.detail || errorData.message || errorData.error || "Failed to save curriculum type."
            throw new Error(errorMessage)
          }

          const result = await jsonResponse.json()
          showNotification(
            result.message || `Curriculum type ${editingCurriculum ? "updated" : "created"} successfully.`,
            "success",
          )
          await fetchCurriculumTypes()
          handleCancelCurriculumForm()
          return
        }

        const errorData = await response.json().catch(() => ({}))
        const errorMessage =
          errorData.detail || errorData.message || errorData.error || "Failed to save curriculum type."
        throw new Error(errorMessage)
      }

      const result = await response.json()
      showNotification(
        result.message || `Curriculum type ${editingCurriculum ? "updated" : "created"} successfully.`,
        "success",
      )
      await fetchCurriculumTypes()
      handleCancelCurriculumForm()
    } catch (error) {
      showNotification(`Operation failed: ${error.message}`, "error")
      console.error("Curriculum submit error:", error)
    } finally {
      setFormLoading(false)
    }
  }

  // Handles deleting a curriculum type
  const handleDeleteCurriculum = async (curriculumId) => {
    if (!curriculumId) {
      showNotification("Cannot delete curriculum type: ID is missing.", "error")
      return
    }

    if (!window.confirm("Are you sure you want to delete this curriculum type? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete-curriculum-type/${curriculumId}/`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
          credentials: "include",
        },
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage =
          errorData.detail || errorData.message || errorData.error || "Failed to delete curriculum type."
        throw new Error(errorMessage)
      }

      const result =
        response.status === 204 ? { message: "Curriculum type deleted successfully." } : await response.json()
      showNotification(result.message || "Curriculum type deleted successfully.", "success")
      await fetchCurriculumTypes()
    } catch (error) {
      showNotification(`Delete failed: ${error.message}`, "error")
      console.error("Delete curriculum error:", error)
    }
  }

  // Handles viewing curriculum type details
  const handleViewCurriculum = async (curriculumId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/curriculum-type/${curriculumId}/`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to fetch curriculum type details.")
      }

      const curriculumDetail = await response.json()
      showNotification(`Viewing curriculum: ${curriculumDetail.name} (${curriculumDetail.status})`, "info")
      console.log("Full curriculum details:", curriculumDetail)
    } catch (error) {
      showNotification(`View failed: ${error.message}`, "error")
    }
  }

  // --- Effect Hooks ---
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
    fetchCurriculumTypes()
  }, [fetchCurriculumTypes])

  // --- Form/UI Handlers ---
  const resetCurriculumForm = () => {
    setCurriculumFormData({
      name: "",
      description: "",
      status: "Available",
    })
    setEditingCurriculum(null)
  }

  const handleEditCurriculum = (curriculum) => {
    setEditingCurriculum(curriculum)
    setCurriculumFormData({
      name: curriculum.name || "",
      description: curriculum.description || "",
      status: curriculum.status || "Available",
    })
    setShowCurriculumForm(true)
  }

  const handleCancelCurriculumForm = () => {
    setShowCurriculumForm(false)
    resetCurriculumForm()
  }

  const handleExportCurriculums = () => {
    if (!curriculumTypes.length) {
      showNotification("No curriculum types to export.", "info")
      return
    }

    const csvContent = [
      ["ID", "Name", "Description", "Status"],
      ...curriculumTypes.map((curriculum) => [
        curriculum.id || "",
        curriculum.name || "",
        curriculum.description || "",
        curriculum.status || "",
      ]),
    ]
      .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `curriculum-types-export-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showNotification("Curriculum types exported successfully.", "success")
  }

  // Client-side filtered list of curriculum types for display
  const filteredCurriculums = useMemo(() => {
    if (!searchTerm) {
      return curriculumTypes
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase()
    return curriculumTypes.filter(
      (curriculum) =>
        (curriculum.name?.toLowerCase() || "").includes(lowercasedSearchTerm) ||
        (curriculum.description?.toLowerCase() || "").includes(lowercasedSearchTerm) ||
        (curriculum.status?.toLowerCase() || "").includes(lowercasedSearchTerm),
    )
  }, [curriculumTypes, searchTerm])

  // --- Render Logic ---
  if (loading && curriculumTypes.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-700">Loading curriculum types...</div>
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
        <h1 className="page-title">🎓 Curriculum Type Management</h1>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Button className="btn-secondary" onClick={fetchCurriculumTypes} title="Refresh Data">
            🔄 Refresh
          </Button>
          <Button className="btn-secondary" onClick={handleExportCurriculums} disabled={!curriculumTypes.length}>
            <Download size={16} /> Export CSV
          </Button>
          <Button
            className="btn-primary"
            onClick={() => {
              setShowCurriculumForm(true)
              resetCurriculumForm()
            }}
          >
            <Plus size={16} /> Add Curriculum Type
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{curriculumTypes.length}</div>
          <div className="stat-label">Total Types</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{curriculumTypes.filter((c) => c.status === "Available").length}</div>
          <div className="stat-label">Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{curriculumTypes.filter((c) => c.status === "Unavailable").length}</div>
          <div className="stat-label">Unavailable</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{curriculumTypes.filter((c) => c.description).length}</div>
          <div className="stat-label">With Description</div>
        </div>
      </div>

      {/* Add/Edit Curriculum Form */}
      {showCurriculumForm && (
        <div className="form-container" style={{ marginBottom: "2rem" }}>
          <div className="form-header">
            <h3>{editingCurriculum ? "Edit Curriculum Type" : "Add New Curriculum Type"}</h3>
            <Button className="btn-secondary" onClick={handleCancelCurriculumForm} style={{ padding: "0.5rem" }}>
              <X size={16} />
            </Button>
          </div>
          <form onSubmit={handleCurriculumSubmit} className="user-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Curriculum Type Name *
                </label>
                <Input
                  id="name"
                  className="form-input"
                  value={curriculumFormData.name}
                  onChange={(e) => setCurriculumFormData({ ...curriculumFormData, name: e.target.value })}
                  placeholder="e.g., British, American, IB, Cambridge"
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
                  value={curriculumFormData.status}
                  onChange={(e) => setCurriculumFormData({ ...curriculumFormData, status: e.target.value })}
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                className="form-input"
                value={curriculumFormData.description}
                onChange={(e) => setCurriculumFormData({ ...curriculumFormData, description: e.target.value })}
                placeholder="Enter curriculum type description"
                rows={3}
              />
            </div>
            <div className="form-actions">
              <Button type="submit" className="btn-primary" disabled={formLoading}>
                {formLoading ? (
                  <>
                    <span className="animate-spin mr-2">⚙️</span> Saving...
                  </>
                ) : (
                  <>
                    <GraduationCap size={16} /> {editingCurriculum ? "Update Curriculum Type" : "Add Curriculum Type"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                className="btn-secondary"
                onClick={handleCancelCurriculumForm}
                disabled={formLoading}
              >
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
            placeholder="Search curriculum types by name, description, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "40px" }}
            className="form-input"
          />
        </div>
      </div>

      {/* Curriculum Types Data Table */}
      <div className="data-table">
        <div className="table-header">
          <h3>All Curriculum Types ({filteredCurriculums.length})</h3>
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
              gridTemplateColumns: "0.5fr 2fr 3fr 1fr 2fr",
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
          {!loading && filteredCurriculums.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {curriculumTypes.length === 0
                ? "No curriculum types found. Add some curriculum types to get started."
                : "No curriculum types match your search criteria."}
            </div>
          ) : (
            filteredCurriculums.map((curriculum, index) => (
              <div
                key={curriculum.id ? `${curriculum.id}-${index}` : index}
                className="table-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.5fr 2fr 3fr 1fr 2fr",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: "600" }}>{curriculum.id}</div>
                <div style={{ fontWeight: "600" }}>{curriculum.name}</div>
                <div style={{ color: "#718096", fontSize: "0.875rem" }}>
                  {curriculum.description || "No description"}
                </div>
                <div>
                  <span
                    className={`status-badge ${curriculum.status === "Available" ? "status-active" : "status-inactive"}`}
                  >
                    {curriculum.status}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <Button
                    size="sm"
                    className="btn-secondary"
                    onClick={() => handleViewCurriculum(curriculum.id)}
                    title="View Curriculum Details"
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    <Eye size={14} />
                  </Button>
                  <Button
                    size="sm"
                    className="btn-secondary"
                    onClick={() => handleEditCurriculum(curriculum)}
                    title="Edit Curriculum Type"
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDeleteCurriculum(curriculum.id)}
                    title="Delete Curriculum Type"
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
