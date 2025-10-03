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

export default function StudentManagement() {
  const [students, setStudents] = useState([])
  const [parents, setParents] = useState([])
  const [profilePictureFile, setProfilePictureFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [parentsLoading, setParentsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showStudentForm, setShowStudentForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [notification, setNotification] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [studentFormData, setStudentFormData] = useState({
    parent_id: "",
    full_name: "",
    date_of_birth: "",
    gender: "",
    contact_number: "",
    address: "",
    learning_style: "",
    special_needs: "",
    profile_picture: "",
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
  const fetchParents = useCallback(async () => {
    setParentsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/view-parents/`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to fetch parents.")
      }

      const data = await response.json()
      setParents(data)
    } catch (error) {
      showNotification(`Error fetching parents: ${error.message}`, "error")
    } finally {
      setParentsLoading(false)
    }
  }, [getAuthHeaders, showNotification])

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      const primaryUrl = searchTerm
        ? `${baseUrl}/api/search-students/?q=${encodeURIComponent(searchTerm)}`
        : `${baseUrl}/api/admin-view-students/`

      const response = await fetch(primaryUrl, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to fetch students.")
      }

      const fetchedData = await response.json()
      setStudents(fetchedData)
    } catch (error) {
      showNotification(`API Error: ${error.message}`, "error")
      setStudents([])
    } finally {
      setLoading(false)
    }
  }, [getAuthHeaders, showNotification, searchTerm])

  const handleCreateStudent = async () => {
    setFormLoading(true)
    try {
      let body
      let headers

      // This is the key part: if profilePictureFile exists, use FormData
      if (profilePictureFile) {
        const formData = new FormData()
        formData.append("parent_id", studentFormData.parent_id)
        formData.append("full_name", studentFormData.full_name)
        formData.append("date_of_birth", studentFormData.date_of_birth)
        formData.append("gender", studentFormData.gender)
        formData.append("contact_number", studentFormData.contact_number)
        formData.append("address", studentFormData.address)
        formData.append("learning_style", studentFormData.learning_style)
        formData.append("special_needs", studentFormData.special_needs)
        formData.append("profile_picture", profilePictureFile) // Append the actual file

        body = formData
        headers = getAuthHeaders(true) // Pass true to indicate FormData, so Content-Type is NOT set
      } else {
        // Otherwise, use JSON
        const jsonData = {
          parent_id: Number.parseInt(studentFormData.parent_id),
          full_name: studentFormData.full_name,
          date_of_birth: studentFormData.date_of_birth,
          gender: studentFormData.gender,
          contact_number: studentFormData.contact_number,
          address: studentFormData.address,
          learning_style: studentFormData.learning_style,
          special_needs: studentFormData.special_needs,
        }
        body = JSON.stringify(jsonData)
        headers = getAuthHeaders(false) // Pass false to indicate JSON, so Content-Type is set to application/json
      }

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-student-admin/`
      console.log("Creating student with:", profilePictureFile ? "FormData" : "JSON", body)

      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        credentials: "include",
        body: body,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Create student error:", errorData)
        throw new Error(errorData.detail || errorData.message || "Failed to create student.")
      }

      const result = await response.json()
      console.log("Create student success:", result)
      showNotification("Student created successfully.", "success")
      await fetchStudents()
      handleCancelStudentForm()
    } catch (error) {
      console.error("Create student error:", error)
      showNotification(`Creation failed: ${error.message}`, "error")
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateStudent = async () => {
    setFormLoading(true)
    try {
      let body
      let headers

      // This is the key part: if profilePictureFile exists, use FormData
      if (profilePictureFile) {
        const formData = new FormData()
        formData.append("full_name", studentFormData.full_name)
        formData.append("date_of_birth", studentFormData.date_of_birth)
        formData.append("gender", studentFormData.gender)
        formData.append("contact_number", studentFormData.contact_number)
        formData.append("address", studentFormData.address)
        formData.append("learning_style", studentFormData.learning_style)
        formData.append("special_needs", studentFormData.special_needs)
        formData.append("profile_picture", profilePictureFile) // Append the actual file
        formData.append("parent_id", studentFormData.parent_id)

        body = formData
        headers = getAuthHeaders(true) // Pass true to indicate FormData, so Content-Type is NOT set
      } else {
        // Otherwise, use JSON
        const jsonData = {
          full_name: studentFormData.full_name,
          date_of_birth: studentFormData.date_of_birth,
          gender: studentFormData.gender,
          contact_number: studentFormData.contact_number,
          address: studentFormData.address,
          learning_style: studentFormData.learning_style,
          special_needs: studentFormData.special_needs,
          parent_id: studentFormData.parent_id,
        }
        body = JSON.stringify(jsonData)
        headers = getAuthHeaders(false) // Pass false to indicate JSON, so Content-Type is set to application/json
      }

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-students/${editingStudent.id}/`
      console.log("Updating student with:", profilePictureFile ? "FormData" : "JSON", body)

      const response = await fetch(url, {
        method: "PUT",
        headers: headers,
        credentials: "include",
        body: body,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Update student error:", errorData)
        throw new Error(errorData.detail || errorData.message || "Failed to update student.")
      }

      const result = await response.json()
      console.log("Update student success:", result)
      showNotification("Student updated successfully.", "success")
      await fetchStudents()
      handleCancelStudentForm()
    } catch (error) {
      console.error("Update student error:", error)
      showNotification(`Update failed: ${error.message}`, "error")
    } finally {
      setFormLoading(false)
    }
  }

  const handleStudentSubmit = async (e) => {
    e.preventDefault()
    const { parent_id, full_name, date_of_birth, gender } = studentFormData

    if (!full_name || !date_of_birth || !gender) {
      showNotification("Full name, date of birth, and gender are required.", "error")
      return
    }

    if (!editingStudent && !parent_id) {
      showNotification("You must select a parent before creating a student.", "error")
      return
    }

    if (editingStudent) {
      await handleUpdateStudent()
    } else {
      await handleCreateStudent()
    }
  }

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete-students/${studentId}/`
      const response = await fetch(url, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to delete student.")
      }

      showNotification("Student deleted successfully.", "success")
      await fetchStudents()
    } catch (error) {
      showNotification(`Delete failed: ${error.message}`, "error")
    }
  }

  const handleViewStudent = async (studentId) => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students/${studentId}/`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to fetch student details.")
      }

      const studentDetail = await response.json()
      showNotification(`Viewing student: ${studentDetail.full_name} (${studentDetail.gender})`, "info")
      console.log("Full student details:", studentDetail)
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
    fetchStudents()
    fetchParents()
  }, [fetchStudents, fetchParents])

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchStudents()
    }, 300)
    return () => clearTimeout(handler)
  }, [searchTerm, fetchStudents])

  const resetStudentForm = () => {
    setStudentFormData({
      parent_id: "",
      full_name: "",
      date_of_birth: "",
      gender: "",
      contact_number: "",
      address: "",
      learning_style: "",
      special_needs: "",
      profile_picture: "",
    })
    setEditingStudent(null)
    setProfilePictureFile(null)
  }

  const handleEditStudent = (student) => {
    setEditingStudent(student)
    setStudentFormData({
      parent_id: student.parent || "",
      full_name: student.full_name || "",
      date_of_birth: student.date_of_birth || "",
      gender: student.gender || "",
      contact_number: student.contact_number || "",
      address: student.address || "",
      learning_style: student.learning_style || "",
      special_needs: student.special_needs || "",
      profile_picture: student.profile_picture || "",
    })
    setProfilePictureFile(null)
    setShowStudentForm(true)
  }

  const handleCancelStudentForm = () => {
    setShowStudentForm(false)
    resetStudentForm()
  }

  const handleExportStudents = () => {
    if (!students.length) {
      showNotification("No students to export.", "info")
      return
    }

    const csvContent = [
      [
        "ID",
        "Parent ID",
        "Full Name",
        "Date of Birth",
        "Gender",
        "Contact",
        "Address",
        "Learning Style",
        "Special Needs",
      ],
      ...students.map((s) => [
        s.id,
        s.parent,
        s.full_name,
        s.date_of_birth,
        s.gender,
        s.contact_number,
        s.address,
        s.learning_style,
        s.special_needs,
      ]),
    ]
      .map((row) => row.map((field) => `"${String(field || "").replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `students-export-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showNotification("Students exported successfully.", "success")
  }

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students
    const lowercasedSearchTerm = searchTerm.toLowerCase()
    return students.filter(
      (s) =>
        s.full_name?.toLowerCase().includes(lowercasedSearchTerm) ||
        s.gender?.toLowerCase().includes(lowercasedSearchTerm) ||
        s.contact_number?.toLowerCase().includes(lowercasedSearchTerm) ||
        s.learning_style?.toLowerCase().includes(lowercasedSearchTerm),
    )
  }, [students, searchTerm])

  if (loading && students.length === 0 && !searchTerm) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-700">Loading students...</div>
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
        <h1 className="page-title">🎓 Student Management</h1>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Button className="btn-secondary" onClick={handleExportStudents}>
            <Download size={16} /> Export CSV
          </Button>
          <Button
            className="btn-primary"
            onClick={() => {
              resetStudentForm()
              setShowStudentForm(true)
            }}
          >
            <UserPlus size={16} /> Add Student
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{students.length}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{students.filter((s) => s.gender === "Male").length}</div>
          <div className="stat-label">Male Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{students.filter((s) => s.gender === "Female").length}</div>
          <div className="stat-label">Female Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{students.filter((s) => s.learning_style).length}</div>
          <div className="stat-label">With Learning Style</div>
        </div>
      </div>

      {/* Add/Edit Student Form */}
      {showStudentForm && (
        <div className="form-container" style={{ marginBottom: "2rem" }}>
          <div className="form-header">
            <h3>{editingStudent ? "Edit Student" : "Add New Student"}</h3>
            <Button className="btn-secondary" onClick={handleCancelStudentForm} style={{ padding: "0.5rem" }}>
              <X size={16} />
            </Button>
          </div>
          <form onSubmit={handleStudentSubmit} className="user-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="parent" className="form-label">
                  Parent *
                </label>
                <select
                  id="parent"
                  className="form-input"
                  value={studentFormData.parent_id}
                  onChange={(e) => setStudentFormData({ ...studentFormData, parent_id: e.target.value })}
                  required
                  disabled={!!editingStudent || parentsLoading}
                >
                  <option value="" disabled>
                    {parentsLoading ? "Loading parents..." : "Select a parent"}
                  </option>
                  {!parentsLoading && parents.length === 0 && (
                    <option value="" disabled>
                      No parents available
                    </option>
                  )}
                  {parents.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.full_name} ({parent.email})
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
                  value={studentFormData.full_name}
                  onChange={(e) => setStudentFormData({ ...studentFormData, full_name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date_of_birth" className="form-label">
                  Date of Birth *
                </label>
                <Input
                  id="date_of_birth"
                  type="date"
                  className="form-input"
                  value={studentFormData.date_of_birth}
                  onChange={(e) => setStudentFormData({ ...studentFormData, date_of_birth: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender" className="form-label">
                  Gender *
                </label>
                <select
                  id="gender"
                  className="form-input"
                  value={studentFormData.gender}
                  onChange={(e) => setStudentFormData({ ...studentFormData, gender: e.target.value })}
                  required
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact_number" className="form-label">
                  Contact Number
                </label>
                <Input
                  id="contact_number"
                  className="form-input"
                  value={studentFormData.contact_number}
                  onChange={(e) => setStudentFormData({ ...studentFormData, contact_number: e.target.value })}
                  placeholder="Enter contact number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="learning_style" className="form-label">
                  Learning Style
                </label>
                <select
                  id="learning_style"
                  className="form-input"
                  value={studentFormData.learning_style}
                  onChange={(e) => setStudentFormData({ ...studentFormData, learning_style: e.target.value })}
                >
                  <option value="">Select learning style</option>
                  <option value="Visual">Visual</option>
                  <option value="Auditory">Auditory</option>
                  <option value="Kinesthetic">Kinesthetic</option>
                  <option value="Reading/Writing">Reading/Writing</option>
                </select>
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
                  value={studentFormData.address}
                  onChange={(e) => setStudentFormData({ ...studentFormData, address: e.target.value })}
                  placeholder="Enter address"
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
                      setStudentFormData({ ...studentFormData, profile_picture: URL.createObjectURL(file) })
                    }
                  }}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="special_needs" className="form-label">
                  Special Needs
                </label>
                <textarea
                  id="special_needs"
                  className="form-input"
                  value={studentFormData.special_needs}
                  onChange={(e) => setStudentFormData({ ...studentFormData, special_needs: e.target.value })}
                  placeholder="Enter any special needs or requirements"
                  rows={3}
                />
              </div>
            </div>
            {studentFormData.profile_picture && (
              <div className="form-row">
                <div className="form-group">
                  <div className="mt-2">
                    <img
                      src={studentFormData.profile_picture || "/placeholder.svg"}
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
                    <Plus size={16} /> {editingStudent ? "Update Student" : "Add Student"}
                  </>
                )}
              </Button>
              <Button type="button" className="btn-secondary" onClick={handleCancelStudentForm} disabled={formLoading}>
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
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "40px" }}
            className="form-input"
          />
        </div>
      </div>

      {/* Students Data Table */}
      <div className="data-table">
        <div className="table-header">
          <h3>Students ({filteredStudents.length})</h3>
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
              gridTemplateColumns: "0.5fr 2fr 1fr 1fr 1.5fr 1.5fr 2fr",
              alignItems: "center",
            }}
          >
            <div>ID</div>
            <div>Full Name</div>
            <div>Gender</div>
            <div>Age</div>
            <div>Contact</div>
            <div>Learning Style</div>
            <div>Actions</div>
          </div>
          {/* Table Body */}
          {!loading && filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No students found.</div>
          ) : (
            filteredStudents.map((student, index) => (
              <div
                key={student.id ? `${student.id}-${index}` : index}
                className="table-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.5fr 2fr 1fr 1fr 1.5fr 1.5fr 2fr",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: "600" }}>{student.id}</div>
                <div style={{ fontWeight: "600" }}>{student.full_name}</div>
                <div style={{ color: "#718096" }}>{student.gender}</div>
                <div style={{ color: "#718096" }}>
                  {student.date_of_birth
                    ? new Date().getFullYear() - new Date(student.date_of_birth).getFullYear()
                    : "N/A"}
                </div>
                <div style={{ color: "#718096" }}>{student.contact_number || "N/A"}</div>
                <div style={{ color: "#718096" }}>{student.learning_style || "N/A"}</div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <Button
                    size="sm"
                    className="btn-secondary"
                    onClick={() => handleViewStudent(student.id)}
                    title="View Student Details"
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    <Eye size={14} />
                  </Button>
                  <Button
                    size="sm"
                    className="btn-secondary"
                    onClick={() => handleEditStudent(student)}
                    title="Edit Student"
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDeleteStudent(student.id)}
                    title="Delete Student"
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
