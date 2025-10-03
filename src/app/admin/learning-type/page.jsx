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

export default function LearningTypeManagement() {
  const [learningTypes, setLearningTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showLearningTypeForm, setShowLearningTypeForm] = useState(false)
  const [editingLearningType, setEditingLearningType] = useState(null)
  const [notification, setNotification] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [learningTypeFormData, setLearningTypeFormData] = useState({
    name: "",
    description: "",
    status: "Available",
  })

  // --- Helper Functions ---
  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }, [])

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

  const fetchLearningTypes = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/learning-types/`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.detail || errorData.message || "Failed to fetch learning types."
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setLearningTypes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Fetch learning types error:", error)
      showNotification(`Failed to fetch learning types: ${error.message}`, "error")
      setLearningTypes([])
    } finally {
      setLoading(false)
    }
  }, [getAuthHeaders, showNotification])

  const handleLearningTypeSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)

    const { name, description, status } = learningTypeFormData

    if (!name?.trim()) {
      showNotification("Learning type name is required.", "error")
      setFormLoading(false)
      return
    }

    const url = editingLearningType
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-learning-type/${editingLearningType.id}/`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-learning-type/`
    const method = editingLearningType ? "PUT" : "POST"

    const payload = {
      name: name.trim(),
      description: description.trim() || "",
      status,
    }

    try {
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.detail || errorData.message || errorData.error || "Failed to save learning type."
        throw new Error(errorMessage)
      }

      const result = await response.json()
      showNotification(result.message || `Learning type ${editingLearningType ? "updated" : "created"} successfully.`, "success")
      await fetchLearningTypes()
      handleCancelLearningTypeForm()
    } catch (error) {
      showNotification(`Operation failed: ${error.message}`, "error")
      console.error("Learning type submit error:", error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteLearningType = async (learningTypeId) => {
    if (!learningTypeId) {
      showNotification("Cannot delete learning type: ID is missing.", "error")
      return
    }

    if (!window.confirm("Are you sure you want to delete this learning type? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete-learning-type/${learningTypeId}/`, {
          method: "DELETE",
          headers: getAuthHeaders(),
          credentials: "include",
        },
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.detail || errorData.message || errorData.error || "Failed to delete learning type."
        throw new Error(errorMessage)
      }

      showNotification("Learning type deleted successfully.", "success")
      await fetchLearningTypes()
    } catch (error) {
      showNotification(`Delete failed: ${error.message}`, "error")
      console.error("Delete learning type error:", error)
    }
  }

  const handleViewLearningType = async (learningTypeId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/learning-type/${learningTypeId}/`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to fetch learning type details.")
      }

      const typeDetail = await response.json()
      showNotification(`Viewing learning type: ${typeDetail.name} (${typeDetail.status})`, "info")
      console.log("Full learning type details:", typeDetail)
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
    fetchLearningTypes()
  }, [fetchLearningTypes])

  // --- Form/UI Handlers ---
  const resetLearningTypeForm = () => {
    setLearningTypeFormData({
      name: "",
      description: "",
      status: "Available",
    })
    setEditingLearningType(null)
  }

  const handleEditLearningType = (learningType) => {
    setEditingLearningType(learningType)
    setLearningTypeFormData({
      name: learningType.name || "",
      description: learningType.description || "",
      status: learningType.status || "Available",
    })
    setShowLearningTypeForm(true)
  }

  const handleCancelLearningTypeForm = () => {
    setShowLearningTypeForm(false)
    resetLearningTypeForm()
  }

  const handleExportLearningTypes = () => {
    if (!learningTypes.length) {
      showNotification("No learning types to export.", "info")
      return
    }

    const csvContent = [
      ["ID", "Name", "Description", "Status"],
      ...learningTypes.map((learningType) => [
        learningType.id || "",
        learningType.name || "",
        learningType.description || "",
        learningType.status || "",
      ]),
    ]
      .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `learning-types-export-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showNotification("Learning types exported successfully.", "success")
  }

  const filteredLearningTypes = useMemo(() => {
    if (!searchTerm) {
      return learningTypes
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase()
    return learningTypes.filter(
      (learningType) =>
        (learningType.name?.toLowerCase() || "").includes(lowercasedSearchTerm) ||
        (learningType.description?.toLowerCase() || "").includes(lowercasedSearchTerm) ||
        (learningType.status?.toLowerCase() || "").includes(lowercasedSearchTerm),
    )
  }, [learningTypes, searchTerm])

  // --- Render Logic ---
  if (loading && learningTypes.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-700">Loading learning types...</div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard-container">
      {notification && (
        <div
          className={`notification ${notification.type === "error" ? "notification-error" : "notification-success"}`}
          style={{
            position: "fixed", top: "20px", right: "20px", padding: "1rem", borderRadius: "8px",
            color: "white", backgroundColor: notification.type === "error" ? "#f56565" : "#48bb78",
            zIndex: 1000, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {notification.message}
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">🎓 Learning Type Management</h1>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Button className="btn-secondary" onClick={fetchLearningTypes} title="Refresh Data">
            🔄 Refresh
          </Button>
          <Button className="btn-secondary" onClick={handleExportLearningTypes} disabled={!learningTypes.length}>
            <Download size={16} /> Export CSV
          </Button>
          <Button
            className="btn-primary"
            onClick={() => {
              setShowLearningTypeForm(true)
              resetLearningTypeForm()
            }}
          >
            <Plus size={16} /> Add Learning Type
          </Button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{learningTypes.length}</div>
          <div className="stat-label">Total Types</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{learningTypes.filter((c) => c.status === "Available").length}</div>
          <div className="stat-label">Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{learningTypes.filter((c) => c.status !== "Available").length}</div>
          <div className="stat-label">Not Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{learningTypes.filter((c) => c.description).length}</div>
          <div className="stat-label">With Description</div>
        </div>
      </div>

      {showLearningTypeForm && (
        <div className="form-container" style={{ marginBottom: "2rem" }}>
          <div className="form-header">
            <h3>{editingLearningType ? "Edit Learning Type" : "Add New Learning Type"}</h3>
            <Button className="btn-secondary" onClick={handleCancelLearningTypeForm} style={{ padding: "0.5rem" }}>
              <X size={16} />
            </Button>
          </div>
          <form onSubmit={handleLearningTypeSubmit} className="user-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Learning Type Name *</label>
                <Input
                  id="name" className="form-input" value={learningTypeFormData.name}
                  onChange={(e) => setLearningTypeFormData({ ...learningTypeFormData, name: e.target.value })}
                  placeholder="e.g., Self-Paced, Group-Based, Blended" required
                />
              </div>
              <div className="form-group">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  id="status" className="form-input" value={learningTypeFormData.status}
                  onChange={(e) => setLearningTypeFormData({ ...learningTypeFormData, status: e.target.value })}
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description" className="form-input" value={learningTypeFormData.description}
                onChange={(e) => setLearningTypeFormData({ ...learningTypeFormData, description: e.target.value })}
                placeholder="Enter a brief description for this learning type" rows={3}
              />
            </div>
            <div className="form-actions">
              <Button type="submit" className="btn-primary" disabled={formLoading}>
                {formLoading ? "Saving..." : <><GraduationCap size={16} /> {editingLearningType ? "Update Type" : "Add Type"}</>}
              </Button>
              <Button type="button" className="btn-secondary" onClick={handleCancelLearningTypeForm} disabled={formLoading}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
          <Search size={20} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#718096" }} />
          <Input
            placeholder="Search learning types by name, description, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "40px" }}
            className="form-input"
          />
        </div>
      </div>

      <div className="data-table">
        <div className="table-header">
          <h3>All Learning Types ({filteredLearningTypes.length})</h3>
          {loading && <span style={{ marginLeft: "1rem", color: "#718096" }}>Loading...</span>}
        </div>
        <div className="table-content">
          <div
            className="table-row table-header-row"
            style={{
              fontWeight: "bold", backgroundColor: "#f0f9ff", display: "grid",
              gridTemplateColumns: "0.5fr 2fr 3fr 1fr 2fr", alignItems: "center",
            }}
          >
            <div>ID</div><div>Name</div><div>Description</div><div>Status</div><div>Actions</div>
          </div>
          {!loading && filteredLearningTypes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {learningTypes.length === 0 ? "No learning types found. Add one to get started." : "No types match your search."}
            </div>
          ) : (
            filteredLearningTypes.map((learningType) => (
              <div
                key={learningType.id} className="table-row"
                style={{ display: "grid", gridTemplateColumns: "0.5fr 2fr 3fr 1fr 2fr", alignItems: "center" }}
              >
                <div style={{ fontWeight: "600" }}>{learningType.id}</div>
                <div style={{ fontWeight: "600" }}>{learningType.name}</div>
                <div style={{ color: "#718096", fontSize: "0.875rem" }}>{learningType.description || "No description"}</div>
                <div>
                  <span className={`status-badge ${learningType.status === "Available" ? "status-active" : "status-inactive"}`}>
                    {learningType.status}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <Button size="sm" className="btn-secondary" onClick={() => handleViewLearningType(learningType.id)} title="View Details">
                    <Eye size={14} />
                  </Button>
                  <Button size="sm" className="btn-secondary" onClick={() => handleEditLearningType(learningType)} title="Edit Learning Type">
                    <Edit size={14} />
                  </Button>
                  <Button size="sm" onClick={() => handleDeleteLearningType(learningType.id)} title="Delete Learning Type" variant="destructive"
                    style={{ backgroundColor: "#f56565", color: "white", border: "none" }}>
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