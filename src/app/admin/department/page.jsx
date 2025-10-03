"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2, Plus, X, Building } from "lucide-react"
import Cookies from "js-cookie"
import "../admin.css"

function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
}

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [notification, setNotification] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Available",
  })

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }, [])

  const getAuthHeaders = useCallback(() => {
    const token = Cookies.get("accessToken")
    const csrfToken = getCookie("csrftoken")
    const headers = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    if (csrfToken) headers["X-CSRFToken"] = csrfToken
    return headers
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/departments/`, {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error("Failed to fetch departments.")
      const data = await response.json()
      setDepartments(Array.isArray(data) ? data : [])
    } catch (error) {
      showNotification(error.message, "error")
    } finally {
      setLoading(false)
    }
  }, [getAuthHeaders, showNotification])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    if (!formData.name?.trim()) {
      showNotification("Department name is required.", "error")
      setFormLoading(false)
      return
    }

    const url = editingItem
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-department/${editingItem.id}/`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-department/`
    const method = editingItem ? "PUT" : "POST"

    try {
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to save department.")
      }
      showNotification(`Department ${editingItem ? "updated" : "created"} successfully.`, "success")
      setShowForm(false)
      fetchData()
    } catch (error) {
      showNotification(error.message, "error")
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete-department/${id}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error("Failed to delete department.")
      showNotification("Department deleted successfully.", "success")
      fetchData()
    } catch (error) {
      showNotification(error.message, "error")
    }
  }

  useEffect(() => { fetchData() }, [fetchData])

  const resetForm = () => {
    setFormData({ name: "", description: "", status: "Available" })
    setEditingItem(null)
  }
  const openEditForm = (item) => {
    setEditingItem(item)
    setFormData({ name: item.name || "", description: item.description || "", status: item.status || "Available" })
    setShowForm(true)
  }
  const openNewForm = () => {
    resetForm()
    setShowForm(true)
  }

  const filteredItems = useMemo(() => {
    return departments.filter(item =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [departments, searchTerm])

  return (
    <div className="admin-dashboard-container">
      {notification && <div className={`notification ${notification.type === "error" ? "notification-error" : "notification-success"}`}>{notification.message}</div>}
      <div className="page-header">
        <h1 className="page-title">🏢 Department Management</h1>
        <div className="flex gap-4"><Button className="btn-primary" onClick={openNewForm}><Plus size={16} /> Add Department</Button></div>
      </div>

      {showForm && (
        <div className="form-container mb-8">
          <div className="form-header"><h3>{editingItem ? "Edit Department" : "Add New Department"}</h3><Button className="btn-secondary p-2" onClick={() => setShowForm(false)}><X size={16} /></Button></div>
          <form onSubmit={handleSubmit} className="user-form">
            <div className="form-row"><div className="form-group"><label>Department Name *</label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div><div className="form-group"><label>Status</label><select className="form-input" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}><option value="Available">Available</option><option value="Not Available">Not Available</option></select></div></div>
            <div className="form-group"><label>Description</label><textarea className="form-input" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
            <div className="form-actions"><Button type="submit" className="btn-primary" disabled={formLoading}>{formLoading ? "Saving..." : "Save Department"}</Button></div>
          </form>
        </div>
      )}

      <div className="flex gap-4 mb-8 items-center flex-wrap">
        <div className="relative flex-1 min-w-[250px]"><Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><Input placeholder="Search by name or description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 form-input" /></div>
      </div>

      <div className="data-table">
        <div className="table-header"><h3>All Departments ({filteredItems.length})</h3></div>
        <div className="table-content">
          <div className="table-row table-header-row" style={{ gridTemplateColumns: "0.5fr 2fr 3fr 1fr 1.5fr" }}>
            <div>ID</div><div>Name</div><div>Description</div><div>Status</div><div>Actions</div>
          </div>
          {loading ? <div className="text-center py-8 text-gray-500">Loading...</div> : filteredItems.length === 0 ? (<div className="text-center py-8 text-gray-500">No departments found.</div>) : (
            filteredItems.map(item => (
              <div key={item.id} className="table-row" style={{ gridTemplateColumns: "0.5fr 2fr 3fr 1fr 1.5fr" }}>
                <div className="font-semibold">{item.id}</div>
                <div>{item.name}</div>
                <div className="text-gray-600 text-sm">{item.description || "N/A"}</div>
                <div><span className={`status-badge ${item.status === "Available" ? "status-active" : "status-inactive"}`}>{item.status}</span></div>
                <div className="flex gap-2"><Button size="sm" className="btn-secondary p-2" onClick={() => openEditForm(item)}><Edit size={14} /></Button><Button size="sm" variant="destructive" className="p-2" onClick={() => handleDelete(item.id)}><Trash2 size={14} /></Button></div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}