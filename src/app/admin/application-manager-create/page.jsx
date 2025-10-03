"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2, Download, Plus, X, Eye, User } from "lucide-react"
import Cookies from "js-cookie"
import "../admin.css"

function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
}

export default function ApplicationManagerManagement() {
  const [managers, setManagers] = useState([])
  const [users, setUsers] = useState([])
  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])
  const [loading, setLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showManagerForm, setShowManagerForm] = useState(false)
  const [editingManager, setEditingManager] = useState(null)
  const [notification, setNotification] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [profilePictureFile, setProfilePictureFile] = useState(null)
  const [managerFormData, setManagerFormData] = useState({
    user_id: "",
    username: "",
    full_name: "",
    employee_number: "",
    department_id: "",
    designation_id: "",
    contact_number: "",
    email: "",
    address: "",
    status: "Active",
    profile_picture: "",
  })

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }, [])

  // const getAuthHeaders = useCallback((isFormData = false) => {
  //   const token = Cookies.get("accessToken")
  //   const csrfToken = getCookie("csrftoken")
  //   const headers = {}

  //   if (!isFormData) {
  //     headers["Content-Type"] = "application/json"
  //   }

  //   if (token) {
  //     headers["Authorization"] = `Bearer ${token}`
  //   }

  //   if (csrfToken) {
  //     headers["X-CSRFToken"] = csrfToken
  //   }

  //   return headers
  // }, [])

  // --- API Calls ---
  // const fetchUsers = useCallback(async () => {
  //   setUsersLoading(true)
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin-view-users/`, {
  //       method: "GET",
  //       headers: getAuthHeaders(),
  //       credentials: "include",
  //     })

  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => ({}))
  //       throw new Error(errorData.detail || "Failed to fetch users.")
  //     }

  //     const data = await response.json()
  //     setUsers(data)
  //   } catch (error) {
  //     showNotification(`Error fetching users: ${error.message}`, "error")
  //   } finally {
  //     setUsersLoading(false)
  //   }
  // }, [getAuthHeaders, showNotification])

  // const fetchManagers = useCallback(async () => {
  //   setLoading(true)
  //   try {
  //     const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  //     const primaryUrl = searchTerm
  //       ? `${baseUrl}/api/manager/?search=${encodeURIComponent(searchTerm)}`
  //       : `${baseUrl}/api/view-managers/`

  //     const response = await fetch(primaryUrl, {
  //       method: "GET",
  //       headers: getAuthHeaders(),
  //       credentials: "include",
  //     })

  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => ({}))
  //       throw new Error(errorData.detail || "Failed to fetch managers.")
  //     }

  //     const fetchedData = await response.json()
  //     setManagers(fetchedData)
  //   } catch (error) {
  //     showNotification(`API Error: ${error.message}`, "error")
  //     setManagers([])
  //   } finally {
  //     setLoading(false)
  //   }
  // }, [getAuthHeaders, showNotification, searchTerm])

  // const fetchDepartments = useCallback(async () => {
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/departments/`, {
  //       method: "GET",
  //       headers: getAuthHeaders(),
  //       credentials: "include",
  //     })

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch departments")
  //     }

  //     const data = await response.json()
  //     setDepartments(Array.isArray(data) ? data : [])
  //   } catch (error) {
  //     console.error("Error fetching departments:", error)
  //     showNotification(`Error fetching departments: ${error.message}`, "error")
  //     setDepartments([])
  //   }
  // }, [getAuthHeaders, showNotification])

  // const fetchDesignations = useCallback(async () => {
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/designations/`, {
  //       method: "GET",
  //       headers: getAuthHeaders(),
  //       credentials: "include",
  //     })

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch designations")
  //     }

  //     const data = await response.json()
  //     setDesignations(Array.isArray(data) ? data : [])
  //   } catch (error) {
  //     console.error("Error fetching designations:", error)
  //     showNotification(`Error fetching designations: ${error.message}`, "error")
  //     setDesignations([])
  //   }
  // }, [getAuthHeaders, showNotification])

  // Filter users that are not already managers
  // const availableUsers = useMemo(() => {
  //   const managerUserIds = new Set(managers.map((m) => m.user))
  //   return users.filter((user) => !managerUserIds.has(user.id))
  // }, [users, managers])

  // const handleCreateManager = async () => {
  //   setFormLoading(true)
  //   try {
  //     // Find the selected user to get the user_id
  //     const selectedUser = users.find((user) => user.username === managerFormData.username)
  //     if (!selectedUser) {
  //       throw new Error("Selected user not found")
  //     }

  //     // let body
  //     // let headers

  //     if (profilePictureFile) {
  //       // Use FormData when there's a file
  //       const formData = new FormData()
  //       formData.append("user_id", selectedUser.id.toString())
  //       formData.append("username", managerFormData.username)
  //       formData.append("full_name", managerFormData.full_name)
  //       formData.append("employee_number", managerFormData.employee_number)
  //       formData.append("department_id", managerFormData.department_id)
  //       formData.append("designation_id", managerFormData.designation_id)
  //       formData.append("contact_number", managerFormData.contact_number)
  //       formData.append("email", managerFormData.email)
  //       formData.append("address", managerFormData.address)
  //       formData.append("status", managerFormData.status)
  //       formData.append("profile_picture", profilePictureFile)

  //       body = formData
  //       headers = getAuthHeaders(true) // true for FormData
  //     } else {
  //       // Use JSON when there's no file
  //       const jsonData = {
  //         user_id: selectedUser.id,
  //         username: managerFormData.username,
  //         full_name: managerFormData.full_name,
  //         employee_number: managerFormData.employee_number,
  //         department_id: Number.parseInt(managerFormData.department_id),
  //         designation_id: Number.parseInt(managerFormData.designation_id),
  //         contact_number: managerFormData.contact_number,
  //         email: managerFormData.email,
  //         address: managerFormData.address,
  //         status: managerFormData.status,
  //       }
  //       body = JSON.stringify(jsonData)
  //       headers = getAuthHeaders(false) // false for JSON
  //     }

  //     const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-manager/`
  //     console.log("Creating manager with:", profilePictureFile ? "FormData" : "JSON")

  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: headers,
  //       credentials: "include",
  //       body: body,
  //     })

  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => ({}))
  //       console.error("Create manager error:", errorData)
  //       throw new Error(errorData.detail || errorData.message || "Failed to create manager.")
  //     }

  //     const result = await response.json()
  //     console.log("Create manager success:", result)
  //     showNotification("Manager created successfully.", "success")
  //     await fetchManagers()
  //     handleCancelManagerForm()
  //   } catch (error) {
  //     console.error("Create manager error:", error)
  //     showNotification(`Creation failed: ${error.message}`, "error")
  //   } finally {
  //     setFormLoading(false)
  //   }
  // }

  const handleUpdateManager = async () => {
    setFormLoading(true)
    try {
      // let body
      // let headers

      if (profilePictureFile) {
        // Use FormData when there's a new file
        const formData = new FormData()
        formData.append("full_name", managerFormData.full_name)
        formData.append("employee_number", managerFormData.employee_number)
        formData.append("department_id", managerFormData.department_id)
        formData.append("designation_id", managerFormData.designation_id)
        formData.append("contact_number", managerFormData.contact_number)
        formData.append("email", managerFormData.email)
        formData.append("address", managerFormData.address)
        formData.append("status", managerFormData.status)
        formData.append("profile_picture", profilePictureFile)

        body = formData
        headers = getAuthHeaders(true) // true for FormData
      } else {
        // Use JSON when there's no new file
        const jsonData = {
          full_name: managerFormData.full_name,
          employee_number: managerFormData.employee_number,
          department_id: Number.parseInt(managerFormData.department_id),
          designation_id: Number.parseInt(managerFormData.designation_id),
          contact_number: managerFormData.contact_number,
          email: managerFormData.email,
          address: managerFormData.address,
          status: managerFormData.status,
        }
        body = JSON.stringify(jsonData)
        headers = getAuthHeaders(false) // false for JSON
      }

      // const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-manager/${editingManager.id}/`
      // console.log("Updating manager with:", profilePictureFile ? "FormData" : "JSON")

      const response = await fetch(url, {
        method: "PUT",
        headers: headers,
        credentials: "include",
        body: body,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Update manager error:", errorData)
        throw new Error(errorData.detail || errorData.message || "Failed to update manager.")
      }

      const result = await response.json()
      console.log("Update manager success:", result)
      showNotification("Manager updated successfully.", "success")
      await fetchManagers()
      handleCancelManagerForm()
    } catch (error) {
      console.error("Update manager error:", error)
      showNotification(`Update failed: ${error.message}`, "error")
    } finally {
      setFormLoading(false)
    }
  }

  const handleManagerSubmit = async (e) => {
    e.preventDefault()
    const { username, full_name, employee_number, department_id, designation_id } = managerFormData

    if (!full_name || !employee_number || !department_id || !designation_id) {
      showNotification("Full name, employee number, department, and designation are required.", "error")
      return
    }

    if (!editingManager && !username) {
      showNotification("You must select a user before creating a manager.", "error")
      return
    }

    if (editingManager) {
      await handleUpdateManager()
    } else {
      await handleCreateManager()
    }
  }

  const handleDeleteManager = async (managerId) => {
    if (!window.confirm("Are you sure you want to delete this manager?")) return

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete-manager/${managerId}/`
      const response = await fetch(url, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to delete manager.")
      }

      showNotification("Manager deleted successfully.", "success")
      await fetchManagers()
    } catch (error) {
      showNotification(`Delete failed: ${error.message}`, "error")
    }
  }

  // const handleViewManager = async (managerId) => {
  //   setLoading(true)
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-manager/${managerId}/`, {
  //       method: "GET",
  //       headers: getAuthHeaders(),
  //       credentials: "include",
  //     })

  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => ({}))
  //       throw new Error(errorData.detail || "Failed to fetch manager details.")
  //     }

  //     const managerDetail = await response.json()
  //     showNotification(`Viewing manager: ${managerDetail.full_name} (${managerDetail.email})`, "info")
  //     console.log("Full manager details:", managerDetail)
  //   } catch (error) {
  //     showNotification(`View failed: ${error.message}`, "error")
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // --- Effect Hooks ---
  // This effect runs once on mount to "prime" the CSRF cookie from the backend
  // useEffect(() => {
  //   const getCsrfToken = async () => {
  //     try {
  //       await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-csrf/`, {
  //         credentials: "include",
  //       })
  //     } catch (error) {
  //       console.error("Could not fetch CSRF token:", error)
  //     }
  //   }
  //   getCsrfToken()
  // }, [])

  // useEffect(() => {
  //   fetchManagers()
  //   fetchUsers()
  //   fetchDepartments()
  //   fetchDesignations()
  // }, [fetchManagers, fetchUsers, fetchDepartments, fetchDesignations])

  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     fetchManagers()
  //   }, 300)
  //   return () => clearTimeout(handler)
  // }, [searchTerm, fetchManagers])

  const resetManagerForm = () => {
    setManagerFormData({
      user_id: "",
      username: "",
      full_name: "",
      employee_number: "",
      department_id: "",
      designation_id: "",
      contact_number: "",
      email: "",
      address: "",
      status: "Active",
      profile_picture: "",
    })
    setEditingManager(null)
    setProfilePictureFile(null)
  }

  const handleEditManager = (manager) => {
    setEditingManager(manager)
    const userObject = users.find((u) => u.id === manager.user)
    setManagerFormData({
      user_id: manager.user || "",
      username: userObject ? userObject.username : "",
      full_name: manager.full_name || "",
      employee_number: manager.employee_number || "",
      department_id: manager.department?.id || manager.department_id || "",
      designation_id: manager.designation?.id || manager.designation_id || "",
      contact_number: manager.contact_number || "",
      email: manager.email || "",
      address: manager.address || "",
      status: manager.status || "Active",
      profile_picture: manager.profile_picture
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${manager.profile_picture}`
        : "",
    })
    setProfilePictureFile(null)
    setShowManagerForm(true)
  }

  const handleCancelManagerForm = () => {
    setShowManagerForm(false)
    resetManagerForm()
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePictureFile(file)
      setManagerFormData({ ...managerFormData, profile_picture: URL.createObjectURL(file) })
    }
  }

  const handleExportManagers = () => {
    if (!managers.length) {
      showNotification("No managers to export.", "info")
      return
    }

    const csvContent = [
      [
        "ID",
        "User ID",
        "Full Name",
        "Employee Number",
        "Department",
        "Designation",
        "Contact Number",
        "Email",
        "Status",
      ],
      ...managers.map((manager) => [
        manager.id || "",
        manager.user || "",
        manager.full_name || "",
        manager.employee_number || "",
        manager.department?.name || "",
        manager.designation?.name || "",
        manager.contact_number || "",
        manager.email || "",
        manager.status || "",
      ]),
    ]
      .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `managers-export-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showNotification("Managers exported successfully.", "success")
  }

  const filteredManagers = useMemo(() => {
    if (!searchTerm) return managers
    const lowercasedSearchTerm = searchTerm.toLowerCase()
    return managers.filter(
      (manager) =>
        (manager.full_name?.toLowerCase() || "").includes(lowercasedSearchTerm) ||
        (manager.employee_number?.toLowerCase() || "").includes(lowercasedSearchTerm) ||
        (manager.department?.name?.toLowerCase() || "").includes(lowercasedSearchTerm) ||
        (manager.designation?.name?.toLowerCase() || "").includes(lowercasedSearchTerm) ||
        (manager.status?.toLowerCase() || "").includes(lowercasedSearchTerm),
    )
  }, [managers, searchTerm])

  if (loading && managers.length === 0 && !searchTerm) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-700">Loading managers...</div>
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
        <h1 className="page-title">👔 Application Manager Management</h1>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Button
            className="btn-secondary"
            onClick={() => {
              fetchUsers()
              fetchManagers()
              fetchDepartments()
              fetchDesignations()
            }}
            title="Refresh Data"
          >
            🔄 Refresh
          </Button>
          <Button className="btn-secondary" onClick={handleExportManagers}>
            <Download size={16} /> Export CSV
          </Button>
          <Button
            className="btn-primary"
            onClick={() => {
              resetManagerForm()
              setShowManagerForm(true)
            }}
          >
            <Plus size={16} /> Add Manager
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{managers.length}</div>
          <div className="stat-label">Total Managers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{managers.filter((m) => m.status === "Active").length}</div>
          <div className="stat-label">Active Managers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{new Set(managers.map((m) => m.department?.name)).size}</div>
          <div className="stat-label">Departments</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{availableUsers.length}</div>
          <div className="stat-label">Available Users</div>
        </div>
      </div>

      {/* Add/Edit Manager Form */}
      {showManagerForm && (
        <div className="form-container" style={{ marginBottom: "2rem" }}>
          <div className="form-header">
            <h3>{editingManager ? "Edit Manager" : "Add New Manager"}</h3>
            <Button className="btn-secondary" onClick={handleCancelManagerForm} style={{ padding: "0.5rem" }}>
              <X size={16} />
            </Button>
          </div>
          <form onSubmit={handleManagerSubmit} className="user-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="user" className="form-label">
                  User * ({availableUsers.length} available)
                </label>
                <select
                  id="user"
                  className="form-input"
                  value={managerFormData.username}
                  onChange={(e) => setManagerFormData({ ...managerFormData, username: e.target.value })}
                  required
                  disabled={!!editingManager || usersLoading}
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
                <label htmlFor="profile_picture" className="form-label">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border">
                    {managerFormData.profile_picture ? (
                      <img
                        src={managerFormData.profile_picture || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <Input
                    id="profile_picture"
                    type="file"
                    className="form-input"
                    onChange={handleProfilePictureChange}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="full_name" className="form-label">
                  Full Name *
                </label>
                <Input
                  id="full_name"
                  className="form-input"
                  value={managerFormData.full_name}
                  onChange={(e) => setManagerFormData({ ...managerFormData, full_name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="employee_number" className="form-label">
                  Employee Number *
                </label>
                <Input
                  id="employee_number"
                  className="form-input"
                  value={managerFormData.employee_number}
                  onChange={(e) => setManagerFormData({ ...managerFormData, employee_number: e.target.value })}
                  placeholder="Enter employee number"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="department" className="form-label">
                  Department *
                </label>
                <select
                  id="department"
                  className="form-input"
                  value={managerFormData.department_id}
                  onChange={(e) => setManagerFormData({ ...managerFormData, department_id: e.target.value })}
                  required
                >
                  <option value="">Select Department...</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="designation" className="form-label">
                  Designation *
                </label>
                <select
                  id="designation"
                  className="form-input"
                  value={managerFormData.designation_id}
                  onChange={(e) => setManagerFormData({ ...managerFormData, designation_id: e.target.value })}
                  required
                >
                  <option value="">Select Designation...</option>
                  {designations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
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
                  value={managerFormData.contact_number}
                  onChange={(e) => setManagerFormData({ ...managerFormData, contact_number: e.target.value })}
                  placeholder="Enter contact number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  className="form-input"
                  value={managerFormData.email}
                  onChange={(e) => setManagerFormData({ ...managerFormData, email: e.target.value })}
                  placeholder="Enter email"
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
                  value={managerFormData.address}
                  onChange={(e) => setManagerFormData({ ...managerFormData, address: e.target.value })}
                  placeholder="Enter address"
                />
              </div>
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  className="form-input"
                  value={managerFormData.status}
                  onChange={(e) => setManagerFormData({ ...managerFormData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
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
                    <Plus size={16} /> {editingManager ? "Update Manager" : "Add Manager"}
                  </>
                )}
              </Button>
              <Button type="button" className="btn-secondary" onClick={handleCancelManagerForm} disabled={formLoading}>
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
            placeholder="Search managers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "40px" }}
            className="form-input"
          />
        </div>
      </div>

      {/* Managers Data Table */}
      <div className="data-table">
        <div className="table-header">
          <h3>All Managers ({filteredManagers.length})</h3>
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
              gridTemplateColumns: "0.5fr 2fr 1.5fr 1.5fr 1.5fr 1fr 1.5fr",
              alignItems: "center",
            }}
          >
            <div>ID</div>
            <div>Full Name</div>
            <div>Employee #</div>
            <div>Department</div>
            <div>Designation</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          {/* Table Body */}
          {!loading && filteredManagers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No managers found.</div>
          ) : (
            filteredManagers.map((manager, index) => (
              <div
                key={manager.id ? `${manager.id}-${index}` : index}
                className="table-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.5fr 2fr 1.5fr 1.5fr 1.5fr 1fr 1.5fr",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: "600" }}>{manager.id}</div>
                <div style={{ fontWeight: "600" }} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border flex-shrink-0">
                    {manager.profile_picture ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${manager.profile_picture}`}
                        alt={manager.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-full h-full text-gray-400 p-1" />
                    )}
                  </div>
                  {manager.full_name}
                </div>
                <div style={{ color: "#718096" }}>{manager.employee_number}</div>
                <div style={{ color: "#718096" }}>{manager.department?.name || "N/A"}</div>
                <div style={{ color: "#718096" }}>{manager.designation?.name || "N/A"}</div>
                <div>
                  <span className={`status-badge ${manager.status === "Active" ? "status-active" : "status-inactive"}`}>
                    {manager.status}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <Button
                    size="sm"
                    className="btn-secondary"
                    onClick={() => handleViewManager(manager.id)}
                    title="View Manager Details"
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    <Eye size={14} />
                  </Button>
                  <Button
                    size="sm"
                    className="btn-secondary"
                    onClick={() => handleEditManager(manager)}
                    title="Edit Manager"
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDeleteManager(manager.id)}
                    title="Delete Manager"
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
