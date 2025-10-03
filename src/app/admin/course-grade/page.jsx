"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2, Download, Plus, X, Eye, GraduationCap } from "lucide-react"
import Cookies from "js-cookie"
import "../admin.css"

function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
}

export default function CourseGradeManagement() {
  const [courseGrades, setCourseGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showGradeForm, setShowGradeForm] = useState(false)
  const [editingGrade, setEditingGrade] = useState(null)
  const [notification, setNotification] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [gradeFormData, setGradeFormData] = useState({
    name: "",
    description: "",
    status: "Available",
  })

  // --- Helper Functions ---
  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }, [])

  const getAuthHeaders = useCallback((isFormData = false) => {
    const token = Cookies.get("accessToken")
    const csrfToken = getCookie("csrftoken")
    const headers = {}

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

  const fetchCourseGrades = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/course_grades/`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.detail || errorData.message || "Failed to fetch course grades."
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setCourseGrades(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Fetch course grades error:", error)
      showNotification(`Failed to fetch course grades: ${error.message}`, "error")
      setCourseGrades([])
    } finally {
      setLoading(false)
    }
  }, [getAuthHeaders, showNotification])

  const handleGradeSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)

    const { name, description, status } = gradeFormData

    if (!name?.trim()) {
      showNotification("Grade name is required.", "error")
      setFormLoading(false)
      return
    }

    const url = editingGrade
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-course_grade/${editingGrade.id}/`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-course_grade/`
    const method = editingGrade ? "PUT" : "POST"

    const payload = {
        name: name.trim(),
        description: description.trim() || "",
        status,
    }

    try {
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(false), // Sending JSON
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.detail || errorData.message || errorData.error || "Failed to save course grade."
        throw new Error(errorMessage)
      }

      const result = await response.json()
      showNotification(result.message || `Course grade ${editingGrade ? "updated" : "created"} successfully.`, "success")
      await fetchCourseGrades()
      handleCancelGradeForm()
    } catch (error) {
      showNotification(`Operation failed: ${error.message}`, "error")
      console.error("Grade submit error:", error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteGrade = async (gradeId) => {
    if (!gradeId) {
      showNotification("Cannot delete course grade: ID is missing.", "error")
      return
    }

    if (!window.confirm("Are you sure you want to delete this course grade? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete-course_grade/${gradeId}/`, {
          method: "DELETE",
          headers: getAuthHeaders(),
          credentials: "include",
        },
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.detail || errorData.message || errorData.error || "Failed to delete course grade."
        throw new Error(errorMessage)
      }

      showNotification("Course grade deleted successfully.", "success")
      await fetchCourseGrades()
    } catch (error) {
      showNotification(`Delete failed: ${error.message}`, "error")
      console.error("Delete grade error:", error)
    }
  }

  const handleViewGrade = async (gradeId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/course_grade/${gradeId}/`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to fetch course grade details.")
      }

      const gradeDetail = await response.json()
      showNotification(`Viewing grade: ${gradeDetail.name} (${gradeDetail.status})`, "info")
      console.log("Full course grade details:", gradeDetail)
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
    fetchCourseGrades()
  }, [fetchCourseGrades])

  // --- Form/UI Handlers ---
  const resetGradeForm = () => {
    setGradeFormData({
      name: "",
      description: "",
      status: "Available",
    })
    setEditingGrade(null)
  }

  const handleEditGrade = (grade) => {
    setEditingGrade(grade)
    setGradeFormData({
      name: grade.name || "",
      description: grade.description || "",
      status: grade.status || "Available",
    })
    setShowGradeForm(true)
  }

  const handleCancelGradeForm = () => {
    setShowGradeForm(false)
    resetGradeForm()
  }

  const handleExportGrades = () => {
    if (!courseGrades.length) {
      showNotification("No course grades to export.", "info")
      return
    }

    const csvContent = [
      ["ID", "Name", "Description", "Status"],
      ...courseGrades.map((grade) => [
        grade.id || "",
        grade.name || "",
        grade.description || "",
        grade.status || "",
      ]),
    ]
      .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `course-grades-export-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showNotification("Course grades exported successfully.", "success")
  }

  const filteredGrades = useMemo(() => {
    if (!searchTerm) {
      return courseGrades
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase()
    return courseGrades.filter(
      (grade) =>
        (grade.name?.toLowerCase() || "").includes(lowercasedSearchTerm) ||
        (grade.description?.toLowerCase() || "").includes(lowercasedSearchTerm) ||
        (grade.status?.toLowerCase() || "").includes(lowercasedSearchTerm),
    )
  }, [courseGrades, searchTerm])

  // --- Render Logic ---
  if (loading && courseGrades.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-700">Loading course grades...</div>
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
        <h1 className="page-title">🎓 Course Grade Management</h1>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Button className="btn-secondary" onClick={fetchCourseGrades} title="Refresh Data">
            🔄 Refresh
          </Button>
          <Button className="btn-secondary" onClick={handleExportGrades} disabled={!courseGrades.length}>
            <Download size={16} /> Export CSV
          </Button>
          <Button
            className="btn-primary"
            onClick={() => {
              setShowGradeForm(true)
              resetGradeForm()
            }}
          >
            <Plus size={16} /> Add Course Grade
          </Button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{courseGrades.length}</div>
          <div className="stat-label">Total Grades</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{courseGrades.filter((c) => c.status === "Available").length}</div>
          <div className="stat-label">Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{courseGrades.filter((c) => c.status !== "Available").length}</div>
          <div className="stat-label">Not Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{courseGrades.filter((c) => c.description).length}</div>
          <div className="stat-label">With Description</div>
        </div>
      </div>

      {showGradeForm && (
        <div className="form-container" style={{ marginBottom: "2rem" }}>
          <div className="form-header">
            <h3>{editingGrade ? "Edit Course Grade" : "Add New Course Grade"}</h3>
            <Button className="btn-secondary" onClick={handleCancelGradeForm} style={{ padding: "0.5rem" }}>
              <X size={16} />
            </Button>
          </div>
          <form onSubmit={handleGradeSubmit} className="user-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Grade Name *</label>
                <Input
                  id="name" className="form-input" value={gradeFormData.name}
                  onChange={(e) => setGradeFormData({ ...gradeFormData, name: e.target.value })}
                  placeholder="e.g., Grade 1, A-Level, IB Year 2" required
                />
              </div>
              <div className="form-group">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  id="status" className="form-input" value={gradeFormData.status}
                  onChange={(e) => setGradeFormData({ ...gradeFormData, status: e.target.value })}
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description" className="form-input" value={gradeFormData.description}
                onChange={(e) => setGradeFormData({ ...gradeFormData, description: e.target.value })}
                placeholder="Enter a brief description for this grade" rows={3}
              />
            </div>
            <div className="form-actions">
              <Button type="submit" className="btn-primary" disabled={formLoading}>
                {formLoading ? "Saving..." : <><GraduationCap size={16} /> {editingGrade ? "Update Grade" : "Add Grade"}</>}
              </Button>
              <Button type="button" className="btn-secondary" onClick={handleCancelGradeForm} disabled={formLoading}>
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
            placeholder="Search course grades by name, description, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "40px" }}
            className="form-input"
          />
        </div>
      </div>

      <div className="data-table">
        <div className="table-header">
          <h3>All Course Grades ({filteredGrades.length})</h3>
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
          {!loading && filteredGrades.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {courseGrades.length === 0 ? "No course grades found. Add one to get started." : "No grades match your search."}
            </div>
          ) : (
            filteredGrades.map((grade) => (
              <div
                key={grade.id} className="table-row"
                style={{ display: "grid", gridTemplateColumns: "0.5fr 2fr 3fr 1fr 2fr", alignItems: "center" }}
              >
                <div style={{ fontWeight: "600" }}>{grade.id}</div>
                <div style={{ fontWeight: "600" }}>{grade.name}</div>
                <div style={{ color: "#718096", fontSize: "0.875rem" }}>{grade.description || "No description"}</div>
                <div>
                  <span className={`status-badge ${grade.status === "Available" ? "status-active" : "status-inactive"}`}>
                    {grade.status}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <Button size="sm" className="btn-secondary" onClick={() => handleViewGrade(grade.id)} title="View Details">
                    <Eye size={14} />
                  </Button>
                  <Button size="sm" className="btn-secondary" onClick={() => handleEditGrade(grade)} title="Edit Grade">
                    <Edit size={14} />
                  </Button>
                  <Button size="sm" onClick={() => handleDeleteGrade(grade.id)} title="Delete Grade" variant="destructive"
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