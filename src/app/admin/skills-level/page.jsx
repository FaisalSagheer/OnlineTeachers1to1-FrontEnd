"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2, Download, Plus, X, Eye, Target } from "lucide-react"
import Cookies from "js-cookie"
import "../admin.css"

// Helper function to read a cookie from the browser
function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
}

export default function SkillLevelManagement() {
  const [skillLevels, setSkillLevels] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showSkillForm, setShowSkillForm] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [notification, setNotification] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [skillFormData, setSkillFormData] = useState({
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

  // Fetch all skill levels
  const fetchSkillLevels = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/skill-levels/`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.detail || errorData.message || "Failed to fetch skill levels."
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("Fetched skill levels:", data)
      setSkillLevels(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Fetch skill levels error:", error)
      showNotification(`Failed to fetch skill levels: ${error.message}`, "error")
      setSkillLevels([])
    } finally {
      setLoading(false)
    }
  }, [getAuthHeaders, showNotification])

  // Handles creating/updating a skill level
  const handleSkillSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)

    const { name, description, status } = skillFormData

    if (!name?.trim()) {
      showNotification("Skill level name is required.", "error")
      setFormLoading(false)
      return
    }

    const url = editingSkill
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-skill-level/${editingSkill.id}/`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-skill-level/`
    const method = editingSkill ? "PUT" : "POST"

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
              errorData.detail || errorData.message || errorData.error || "Failed to save skill level."
            throw new Error(errorMessage)
          }

          const result = await jsonResponse.json()
          showNotification(
            result.message || `Skill level ${editingSkill ? "updated" : "created"} successfully.`,
            "success",
          )
          await fetchSkillLevels()
          handleCancelSkillForm()
          return
        }

        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.detail || errorData.message || errorData.error || "Failed to save skill level."
        throw new Error(errorMessage)
      }

      const result = await response.json()
      showNotification(result.message || `Skill level ${editingSkill ? "updated" : "created"} successfully.`, "success")
      await fetchSkillLevels()
      handleCancelSkillForm()
    } catch (error) {
      showNotification(`Operation failed: ${error.message}`, "error")
      console.error("Skill submit error:", error)
    } finally {
      setFormLoading(false)
    }
  }

  // Handles deleting a skill level
  const handleDeleteSkill = async (skillId) => {
    if (!skillId) {
      showNotification("Cannot delete skill level: ID is missing.", "error")
      return
    }

    if (!window.confirm("Are you sure you want to delete this skill level? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete-skill-level/${skillId}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.detail || errorData.message || errorData.error || "Failed to delete skill level."
        throw new Error(errorMessage)
      }

      const result = response.status === 204 ? { message: "Skill level deleted successfully." } : await response.json()
      showNotification(result.message || "Skill level deleted successfully.", "success")
      await fetchSkillLevels()
    } catch (error) {
      showNotification(`Delete failed: ${error.message}`, "error")
      console.error("Delete skill error:", error)
    }
  }

  // Handles viewing skill level details
  const handleViewSkill = async (skillId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/skill-level/${skillId}/`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to fetch skill level details.")
      }

      const skillDetail = await response.json()
      showNotification(`Viewing skill level: ${skillDetail.name} (${skillDetail.status})`, "info")
      console.log("Full skill details:", skillDetail)
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
    fetchSkillLevels()
  }, [fetchSkillLevels])

  // --- Form/UI Handlers ---
  const resetSkillForm = () => {
    setSkillFormData({
      name: "",
      description: "",
      status: "Available",
    })
    setEditingSkill(null)
  }

  const handleEditSkill = (skill) => {
    setEditingSkill(skill)
    setSkillFormData({
      name: skill.name || "",
      description: skill.description || "",
      status: skill.status || "Available",
    })
    setShowSkillForm(true)
  }

  const handleCancelSkillForm = () => {
    setShowSkillForm(false)
    resetSkillForm()
  }

  const handleExportSkills = () => {
    if (!skillLevels.length) {
      showNotification("No skill levels to export.", "info")
      return
    }

    const csvContent = [
      ["ID", "Name", "Description", "Status"],
      ...skillLevels.map((skill) => [skill.id || "", skill.name || "", skill.description || "", skill.status || ""]),
    ]
      .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `skill-levels-export-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showNotification("Skill levels exported successfully.", "success")
  }

  // Client-side filtered list of skill levels for display
  const filteredSkills = useMemo(() => {
    if (!searchTerm) {
      return skillLevels
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase()
    return skillLevels.filter(
      (skill) =>
        (skill.name?.toLowerCase() || "").includes(lowercasedSearchTerm) ||
        (skill.description?.toLowerCase() || "").includes(lowercasedSearchTerm) ||
        (skill.status?.toLowerCase() || "").includes(lowercasedSearchTerm),
    )
  }, [skillLevels, searchTerm])

  // --- Render Logic ---
  if (loading && skillLevels.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-700">Loading skill levels...</div>
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
        <h1 className="page-title">🎯 Skill Level Management</h1>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Button className="btn-secondary" onClick={fetchSkillLevels} title="Refresh Data">
            🔄 Refresh
          </Button>
          <Button className="btn-secondary" onClick={handleExportSkills} disabled={!skillLevels.length}>
            <Download size={16} /> Export CSV
          </Button>
          <Button
            className="btn-primary"
            onClick={() => {
              setShowSkillForm(true)
              resetSkillForm()
            }}
          >
            <Plus size={16} /> Add Skill Level
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{skillLevels.length}</div>
          <div className="stat-label">Total Levels</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{skillLevels.filter((s) => s.status === "Available").length}</div>
          <div className="stat-label">Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{skillLevels.filter((s) => s.status === "Unavailable").length}</div>
          <div className="stat-label">Unavailable</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{skillLevels.filter((s) => s.description).length}</div>
          <div className="stat-label">With Description</div>
        </div>
      </div>

      {/* Add/Edit Skill Form */}
      {showSkillForm && (
        <div className="form-container" style={{ marginBottom: "2rem" }}>
          <div className="form-header">
            <h3>{editingSkill ? "Edit Skill Level" : "Add New Skill Level"}</h3>
            <Button className="btn-secondary" onClick={handleCancelSkillForm} style={{ padding: "0.5rem" }}>
              <X size={16} />
            </Button>
          </div>
          <form onSubmit={handleSkillSubmit} className="user-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Skill Level Name *
                </label>
                <Input
                  id="name"
                  className="form-input"
                  value={skillFormData.name}
                  onChange={(e) => setSkillFormData({ ...skillFormData, name: e.target.value })}
                  placeholder="e.g., Beginner, Intermediate, Advanced"
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
                  value={skillFormData.status}
                  onChange={(e) => setSkillFormData({ ...skillFormData, status: e.target.value })}
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
                value={skillFormData.description}
                onChange={(e) => setSkillFormData({ ...skillFormData, description: e.target.value })}
                placeholder="Enter skill level description"
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
                    <Target size={16} /> {editingSkill ? "Update Skill Level" : "Add Skill Level"}
                  </>
                )}
              </Button>
              <Button type="button" className="btn-secondary" onClick={handleCancelSkillForm} disabled={formLoading}>
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
            placeholder="Search skill levels by name, description, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "40px" }}
            className="form-input"
          />
        </div>
      </div>

      {/* Skill Levels Data Table */}
      <div className="data-table">
        <div className="table-header">
          <h3>All Skill Levels ({filteredSkills.length})</h3>
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
          {!loading && filteredSkills.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {skillLevels.length === 0
                ? "No skill levels found. Add some skill levels to get started."
                : "No skill levels match your search criteria."}
            </div>
          ) : (
            filteredSkills.map((skill, index) => (
              <div
                key={skill.id ? `${skill.id}-${index}` : index}
                className="table-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.5fr 2fr 3fr 1fr 2fr",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: "600" }}>{skill.id}</div>
                <div style={{ fontWeight: "600" }}>{skill.name}</div>
                <div style={{ color: "#718096", fontSize: "0.875rem" }}>{skill.description || "No description"}</div>
                <div>
                  <span
                    className={`status-badge ${skill.status === "Available" ? "status-active" : "status-inactive"}`}
                  >
                    {skill.status}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <Button
                    size="sm"
                    className="btn-secondary"
                    onClick={() => handleViewSkill(skill.id)}
                    title="View Skill Details"
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    <Eye size={14} />
                  </Button>
                  <Button
                    size="sm"
                    className="btn-secondary"
                    onClick={() => handleEditSkill(skill)}
                    title="Edit Skill Level"
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDeleteSkill(skill.id)}
                    title="Delete Skill Level"
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
