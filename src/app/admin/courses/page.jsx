"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, X, Eye } from "lucide-react"
import Cookies from "js-cookie"
import "../admin.css"

// Helper function to get CSRF token from cookies
function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
}

export default function CourseManagement() {
  // --- State Variables ---
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [subjects, setSubjects] = useState([])
  const [curriculumTypes, setCurriculumTypes] = useState([])
  const [skillLevels, setSkillLevels] = useState([])
  const [courseGrades, setCourseGrades] = useState([])
  const [learningTypes, setLearningTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [notification, setNotification] = useState(null)

  // Form and Modal Visibility
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)

  // Editing State
  const [editingCourse, setEditingCourse] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)

  // Course form state to match the new API structure
  const [courseFormData, setCourseFormData] = useState({
    name: "",
    description: "",
    duration: "",
    start_date: "",
    end_date: "",
    syllabus: "",
    prerequisites: "",
    subject_id: "",
    category_id: "",
    grade_id: "",
    curriculum_type_id: "",
    skill_level_id: "",
    learning_type_id: "",
    available_slots: "",
    price: "",
    target_audience: "",
  })

  // Category form state
  const [categoryFormData, setCategoryFormData] = useState({
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

    if (token) headers["Authorization"] = `Bearer ${token}`
    if (csrfToken) headers["X-CSRFToken"] = csrfToken
    return headers
  }, [])

  // --- Generic API Fetcher ---
  const fetchData = useCallback(
    async (endpoint, setter) => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`
        const response = await fetch(url, {
          headers: getAuthHeaders(),
          credentials: "include",
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.detail || `Failed to fetch data from ${endpoint}`)
        }

        const data = await response.json()
        setter(Array.isArray(data) ? data : [])
        return data
      } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error)
        showNotification(`Error fetching data: ${error.message}`, "error")
        setter([])
      }
    },
    [getAuthHeaders, showNotification],
  )

  // --- API Calls ---
  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      const primaryUrl = searchTerm
        ? `${baseUrl}/api/course/?search=${encodeURIComponent(searchTerm)}`
        : `${baseUrl}/api/courses/`

      const response = await fetch(primaryUrl, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to fetch courses.")
      }

      const fetchedData = await response.json()
      setCourses(fetchedData)
    } catch (error) {
      showNotification(`API Error: ${error.message}`, "error")
      setCourses([])
    } finally {
      setLoading(false)
    }
  }, [getAuthHeaders, showNotification, searchTerm])

  const fetchCategories = useCallback(() => fetchData("/api/course-categories/", setCategories), [fetchData])
  const fetchSubjects = useCallback(() => fetchData("/api/subjects/", setSubjects), [fetchData])
  const fetchCurriculumTypes = useCallback(() => fetchData("/api/curriculum-types/", setCurriculumTypes), [fetchData])
  const fetchSkillLevels = useCallback(() => fetchData("/api/skill-levels/", setSkillLevels), [fetchData])
  const fetchCourseGrades = useCallback(() => fetchData("/api/course_grades/", setCourseGrades), [fetchData])
  const fetchLearningTypes = useCallback(() => fetchData("/api/learning-types/", setLearningTypes), [fetchData])

  // --- Form Submission Handlers ---
  const handleCourseSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)

    const { name, subject_id, category_id, price } = courseFormData
    if (!name || !subject_id || !category_id || !price) {
      showNotification("Please fill in all required fields (Name, Subject, Category, Price).", "error")
      setFormLoading(false)
      return
    }

    try {
      const url = editingCourse
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-course/${editingCourse.id}/`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-course/`
      const method = editingCourse ? "PUT" : "POST"

      // Always use FormData for course creation/update
      const formData = new FormData()
      formData.append("name", courseFormData.name)
      formData.append("description", courseFormData.description || "")
      formData.append("duration", courseFormData.duration || "")
      formData.append("start_date", courseFormData.start_date || "")
      formData.append("end_date", courseFormData.end_date || "")
      formData.append("syllabus", courseFormData.syllabus || "")
      formData.append("prerequisites", courseFormData.prerequisites || "")
      formData.append("subject_id", courseFormData.subject_id)
      formData.append("category_id", courseFormData.category_id)
      formData.append("price", courseFormData.price)
      formData.append("available_slots", courseFormData.available_slots || "0")
      formData.append("target_audience", courseFormData.target_audience || "")

      // Add optional fields only if they have values
      if (courseFormData.grade_id) {
        formData.append("grade_id", courseFormData.grade_id)
      }
      if (courseFormData.curriculum_type_id) {
        formData.append("curriculum_type_id", courseFormData.curriculum_type_id)
      }
      if (courseFormData.skill_level_id) {
        formData.append("skill_level_id", courseFormData.skill_level_id)
      }
      if (courseFormData.learning_type_id) {
        formData.append("learning_type_id", courseFormData.learning_type_id)
      }
      // Removed manager_id from FormData append
      // if (courseFormData.manager_id) {
      //   formData.append("manager_id", Number(courseFormData.manager_id).toString())
      // }

      console.log("Submitting course with FormData")

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(true), // true for FormData
        credentials: "include",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Course submission error:", errorData)
        throw new Error(errorData.detail || Object.values(errorData)[0] || "Failed to save course.")
      }

      const result = await response.json()
      console.log("Course submission success:", result)
      showNotification(result.message || `Course ${editingCourse ? "updated" : "created"} successfully.`, "success")
      setShowCourseForm(false)
      resetCourseForm()
      await fetchCourses()
    } catch (error) {
      console.error("Course submission error:", error)
      showNotification(`Failed to save course: ${error.message}`, "error")
    } finally {
      setFormLoading(false)
    }
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)

    if (!categoryFormData.name) {
      showNotification("Category name is required.", "error")
      setFormLoading(false)
      return
    }

    try {
      const url = editingCategory
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-course-category/${editingCategory.id}/`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-course-category/`
      const method = editingCategory ? "PUT" : "POST"

      // Use FormData for category creation/update
      const formData = new FormData()
      formData.append("name", categoryFormData.name)
      formData.append("description", categoryFormData.description || "")
      formData.append("status", categoryFormData.status)

      console.log("Submitting category with FormData")

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(true), // true for FormData
        credentials: "include",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Category submission error:", errorData)
        throw new Error(errorData.detail || Object.values(errorData)[0] || "Failed to save category.")
      }

      const result = await response.json()
      console.log("Category submission success:", result)
      showNotification(result.message || `Category ${editingCategory ? "updated" : "created"} successfully.`, "success")
      setShowCategoryForm(false)
      resetCategoryForm()
      await fetchCategories()
    } catch (error) {
      console.error("Category submission error:", error)
      showNotification(`Failed to save category: ${error.message}`, "error")
    } finally {
      setFormLoading(false)
    }
  }

  // --- Delete Handlers ---
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete-course/${courseId}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to delete course.")
      }

      const result = await response.json()
      showNotification(result.message || "Course deleted successfully.", "success")
      await fetchCourses()
    } catch (error) {
      showNotification(`Delete failed: ${error.message}`, "error")
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete-course-category/${categoryId}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to delete category.")
      }

      const result = await response.json()
      showNotification(result.message || "Category deleted successfully.", "success")
      await fetchCategories()
    } catch (error) {
      showNotification(`Delete failed: ${error.message}`, "error")
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

  // --- Initial Data Load ---
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      await Promise.all([
        fetchCourses(),
        fetchCategories(),
        fetchSubjects(),
        fetchCurriculumTypes(),
        fetchSkillLevels(),
        fetchCourseGrades(),
        fetchLearningTypes(),
        // fetchManagers(), // Removed fetchManagers from initial load
      ])
      setLoading(false)
    }
    loadInitialData()
  }, [
    fetchCourses,
    fetchCategories,
    fetchSubjects,
    fetchCurriculumTypes,
    fetchSkillLevels,
    fetchCourseGrades,
    fetchLearningTypes,
    // fetchManagers, // Removed fetchManagers from dependency array
  ])

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCourses()
    }, 300)
    return () => clearTimeout(handler)
  }, [searchTerm, fetchCourses])

  // --- Form Reset and Edit Handlers ---
  const resetCourseForm = () => {
    setCourseFormData({
      name: "",
      description: "",
      duration: "",
      start_date: "",
      end_date: "",
      syllabus: "",
      prerequisites: "",
      subject_id: "",
      category_id: "",
      grade_id: "",
      curriculum_type_id: "",
      skill_level_id: "",
      learning_type_id: "",
      // manager_id: "", // Removed manager_id
      available_slots: "",
      price: "",
      target_audience: "",
    })
    setEditingCourse(null)
  }

  const resetCategoryForm = () => {
    setCategoryFormData({ name: "", description: "", status: "Available" })
    setEditingCategory(null)
  }

  const openNewCourseForm = () => {
    resetCourseForm()
    setShowCourseForm(true)
  }

  const openEditCourseForm = (course) => {
    setEditingCourse(course)
    setCourseFormData({
      name: course.name || "",
      description: course.description || "",
      duration: course.duration || "",
      start_date: course.start_date || "",
      end_date: course.end_date || "",
      syllabus: course.syllabus || "",
      prerequisites: course.prerequisites || "",
      subject_id: course.subject?.id || "",
      category_id: course.category?.id || "",
      grade_id: course.grade?.id || "",
      curriculum_type_id: course.curriculum_type?.id || "",
      skill_level_id: course.skill_level?.id || "",
      learning_type_id: course.learning_type?.id || "",
      // manager_id: course.manager?.id || "", // Removed manager_id
      available_slots: course.available_slots || "",
      price: course.price || "",
      target_audience: course.target_audience || "",
    })
    setShowCourseForm(true)
  }

  const openNewCategoryForm = () => {
    resetCategoryForm()
    setShowCategoryForm(true)
  }

  const openEditCategoryForm = (category) => {
    setEditingCategory(category)
    setCategoryFormData({
      name: category.name,
      description: category.description,
      status: category.status,
    })
    setShowCategoryForm(true)
  }

  const handleViewCourse = async (courseId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/${courseId}/`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to fetch course details.")
      }

      const courseDetail = await response.json()
      showNotification(`Viewing course: ${courseDetail.name} - $${courseDetail.price}`, "info")
      console.log("Full course details:", courseDetail)
    } catch (error) {
      showNotification(`View failed: ${error.message}`, "error")
    }
  }

  // --- Filtering Logic ---
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        course.name?.toLowerCase().includes(searchLower) || course.subject?.name?.toLowerCase().includes(searchLower)
      const matchesCategory = selectedCategory === "All" || course.category?.name === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [courses, searchTerm, selectedCategory])

  if (loading && courses.length === 0 && !searchTerm) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-700">Loading courses...</div>
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
        <h1 className="page-title">📚 Course Management</h1>
        <div className="flex gap-4 flex-wrap">
          <Button className="btn-secondary" onClick={openNewCategoryForm}>
            <Plus size={16} /> Add Category
          </Button>
          <Button className="btn-primary" onClick={openNewCourseForm}>
            <Plus size={16} /> Add Course
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid mb-8">
        <div className="stat-card">
          <div className="stat-value">{courses.length}</div>
          <div className="stat-label">📖 Total Courses</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{categories.length}</div>
          <div className="stat-label">📂 Categories</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{subjects.length}</div>
          <div className="stat-label">📚 Subjects</div>
        </div>
        {/* Removed Managers stat card */}
        {/* <div className="stat-card">
          <div className="stat-value">{managers.length}</div>
          <div className="stat-label">👔 Managers</div>
        </div> */}
      </div>

      {/* --- COURSE FORM --- */}
      {showCourseForm && (
        <div className="form-container mb-8">
          <div className="form-header">
            <h3>{editingCourse ? "Edit Course" : "Add New Course"}</h3>
            <Button className="btn-secondary p-2" onClick={() => setShowCourseForm(false)}>
              <X size={16} />
            </Button>
          </div>
          <form onSubmit={handleCourseSubmit} className="user-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="course_name" className="form-label">
                  Course Name *
                </label>
                <Input
                  id="course_name"
                  className="form-input"
                  value={courseFormData.name}
                  onChange={(e) => setCourseFormData({ ...courseFormData, name: e.target.value })}
                  placeholder="Enter course name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price" className="form-label">
                  Price *
                </label>
                <Input
                  id="price"
                  className="form-input"
                  type="number"
                  step="0.01"
                  value={courseFormData.price}
                  onChange={(e) => setCourseFormData({ ...courseFormData, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  Category *
                </label>
                <select
                  id="category"
                  className="form-input"
                  value={courseFormData.category_id}
                  onChange={(e) => setCourseFormData({ ...courseFormData, category_id: e.target.value })}
                  required
                >
                  <option value="">Select Category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="subject" className="form-label">
                  Subject *
                </label>
                <select
                  id="subject"
                  className="form-input"
                  value={courseFormData.subject_id}
                  onChange={(e) => setCourseFormData({ ...courseFormData, subject_id: e.target.value })}
                  required
                >
                  <option value="">Select Subject...</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="grade" className="form-label">
                  Course Grade
                </label>
                <select
                  id="grade"
                  className="form-input"
                  value={courseFormData.grade_id}
                  onChange={(e) => setCourseFormData({ ...courseFormData, grade_id: e.target.value })}
                >
                  <option value="">Select Grade...</option>
                  {courseGrades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="learning_type" className="form-label">
                  Learning Type
                </label>
                <select
                  id="learning_type"
                  className="form-input"
                  value={courseFormData.learning_type_id}
                  onChange={(e) => setCourseFormData({ ...courseFormData, learning_type_id: e.target.value })}
                >
                  <option value="">Select Learning Type...</option>
                  {learningTypes.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="curriculum_type" className="form-label">
                  Curriculum Type
                </label>
                <select
                  id="curriculum_type"
                  className="form-input"
                  value={courseFormData.curriculum_type_id}
                  onChange={(e) => setCourseFormData({ ...courseFormData, curriculum_type_id: e.target.value })}
                >
                  <option value="">Select Curriculum Type...</option>
                  {curriculumTypes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="skill_level" className="form-label">
                  Skill Level
                </label>
                <select
                  id="skill_level"
                  className="form-input"
                  value={courseFormData.skill_level_id}
                  onChange={(e) => setCourseFormData({ ...courseFormData, skill_level_id: e.target.value })}
                >
                  <option value="">Select Skill Level...</option>
                  {skillLevels.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Removed Manager dropdown */}
            {/* <div className="form-row">
              <div className="form-group">
                <label htmlFor="manager" className="form-label">
                  Manager
                </label>
                <select
                  id="manager"
                  className="form-input"
                  value={courseFormData.manager_id}
                  onChange={(e) => setCourseFormData({ ...courseFormData, manager_id: e.target.value })}
                >
                  <option value="">Select Manager...</option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="available_slots" className="form-label">
                  Available Slots
                </label>
                <Input
                  id="available_slots"
                  className="form-input"
                  type="number"
                  value={courseFormData.available_slots}
                  onChange={(e) => setCourseFormData({ ...courseFormData, available_slots: e.target.value })}
                  placeholder="Enter available slots"
                />
              </div>
            </div> */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="available_slots" className="form-label">
                  Available Slots
                </label>
                <Input
                  id="available_slots"
                  className="form-input"
                  type="number"
                  value={courseFormData.available_slots}
                  onChange={(e) => setCourseFormData({ ...courseFormData, available_slots: e.target.value })}
                  placeholder="Enter available slots"
                />
              </div>
              <div className="form-group">
                <label htmlFor="duration" className="form-label">
                  Duration
                </label>
                <Input
                  id="duration"
                  className="form-input"
                  value={courseFormData.duration}
                  onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
                  placeholder="e.g., 3 months"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="target_audience" className="form-label">
                  Target Audience
                </label>
                <Input
                  id="target_audience"
                  className="form-input"
                  value={courseFormData.target_audience}
                  onChange={(e) => setCourseFormData({ ...courseFormData, target_audience: e.target.value })}
                  placeholder="e.g., Teens, Adults"
                />
              </div>
              <div className="form-group">
                <label htmlFor="start_date" className="form-label">
                  Start Date
                </label>
                <Input
                  id="start_date"
                  className="form-input"
                  type="date"
                  value={courseFormData.start_date}
                  onChange={(e) => setCourseFormData({ ...courseFormData, start_date: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="end_date" className="form-label">
                  End Date
                </label>
                <Input
                  id="end_date"
                  className="form-input"
                  type="date"
                  value={courseFormData.end_date}
                  onChange={(e) => setCourseFormData({ ...courseFormData, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                className="form-input"
                value={courseFormData.description}
                onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                rows={3}
                placeholder="Enter course description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="prerequisites" className="form-label">
                Prerequisites
              </label>
              <textarea
                id="prerequisites"
                className="form-input"
                value={courseFormData.prerequisites}
                onChange={(e) => setCourseFormData({ ...courseFormData, prerequisites: e.target.value })}
                rows={2}
                placeholder="Enter course prerequisites"
              />
            </div>

            <div className="form-group">
              <label htmlFor="syllabus" className="form-label">
                Syllabus
              </label>
              <textarea
                id="syllabus"
                className="form-input"
                value={courseFormData.syllabus}
                onChange={(e) => setCourseFormData({ ...courseFormData, syllabus: e.target.value })}
                rows={4}
                placeholder="Enter course syllabus"
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
                    <Plus size={16} /> {editingCourse ? "Update Course" : "Add Course"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                className="btn-secondary"
                onClick={() => setShowCourseForm(false)}
                disabled={formLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* --- CATEGORY FORM --- */}
      {showCategoryForm && (
        <div className="form-container mb-8">
          <div className="form-header">
            <h3>{editingCategory ? "Edit Category" : "Add New Category"}</h3>
            <Button className="btn-secondary p-2" onClick={() => setShowCategoryForm(false)}>
              <X size={16} />
            </Button>
          </div>
          <form onSubmit={handleCategorySubmit} className="user-form">
            <div className="form-group">
              <label htmlFor="category_name" className="form-label">
                Category Name *
              </label>
              <Input
                id="category_name"
                className="form-input"
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                placeholder="Enter category name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category_description" className="form-label">
                Description
              </label>
              <textarea
                id="category_description"
                className="form-input"
                value={categoryFormData.description}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                rows={3}
                placeholder="Enter category description"
              />
            </div>
            <div className="form-group">
              <label htmlFor="category_status" className="form-label">
                Status
              </label>
              <select
                id="category_status"
                className="form-input"
                value={categoryFormData.status}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, status: e.target.value })}
              >
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>
            <div className="form-actions">
              <Button type="submit" className="btn-primary" disabled={formLoading}>
                {formLoading ? (
                  <>
                    <span className="animate-spin mr-2">⚙️</span> Saving...
                  </>
                ) : (
                  <>
                    <Plus size={16} /> {editingCategory ? "Update Category" : "Add Category"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                className="btn-secondary"
                onClick={() => setShowCategoryForm(false)}
                disabled={formLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4 mb-8 items-center flex-wrap">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search by course name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 form-input"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="form-input w-full md:w-auto"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Courses Table */}
      <div className="data-table">
        <div className="table-header">
          <h3>Courses ({filteredCourses.length})</h3>
          {loading && searchTerm && <span style={{ marginLeft: "1rem", color: "#718096" }}>Searching...</span>}
        </div>
        <div className="table-content">
          <div
            className="table-row table-header-row"
            style={{
              fontWeight: "bold",
              backgroundColor: "#f0f9ff",
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1.5fr", // Adjusted grid columns
              alignItems: "center",
            }}
          >
            <div>Course Name</div>
            <div>Category</div>
            <div>Subject</div>
            <div>Grade</div>
            {/* Removed Manager column */}
            {/* <div>Manager</div> */}
            <div>Price</div>
            <div>Actions</div>
          </div>
          {!loading && filteredCourses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No courses found.</div>
          ) : (
            filteredCourses.map((course, index) => (
              <div
                key={course.id ? `${course.id}-${index}` : index}
                className="table-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1.5fr", // Adjusted grid columns
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: "600" }}>{course.name}</div>
                <div>
                  <span className="status-badge status-active">{course.category?.name || "N/A"}</span>
                </div>
                <div style={{ color: "#718096" }}>{course.subject?.name || "N/A"}</div>
                <div style={{ color: "#718096" }}>{course.grade?.name || "N/A"}</div>
                {/* Removed Manager display */}
                {/* <div style={{ color: "#718096" }}>{course.manager?.full_name || "N/A"}</div> */}
                <div style={{ fontWeight: "600", color: "#f97316" }}>${course.price || "0.00"}</div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <Button
                    size="sm"
                    className="btn-secondary"
                    onClick={() => handleViewCourse(course.id)}
                    title="View Course Details"
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    <Eye size={14} />
                  </Button>
                  <Button
                    size="sm"
                    className="btn-secondary"
                    onClick={() => openEditCourseForm(course)}
                    title="Edit Course"
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDeleteCourse(course.id)}
                    title="Delete Course"
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

      {/* Categories Management Section */}
      <div className="data-table mt-8">
        <div className="table-header">
          <h3>Categories ({categories.length})</h3>
        </div>
        <div className="table-content">
          <div
            className="table-row table-header-row"
            style={{
              fontWeight: "bold",
              backgroundColor: "#f0f9ff",
              display: "grid",
              gridTemplateColumns: "2fr 3fr 1fr 1.5fr",
              alignItems: "center",
            }}
          >
            <div>Name</div>
            <div>Description</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No categories found.</div>
          ) : (
            categories.map((category, index) => (
              <div
                key={category.id ? `${category.id}-${index}` : index}
                className="table-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 3fr 1fr 1.5fr",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: "600" }}>{category.name}</div>
                <div style={{ color: "#718096", fontSize: "0.875rem" }}>
                  {category.description
                    ? category.description.length > 50
                      ? `${category.description.substring(0, 50)}...`
                      : category.description
                    : "No description"}
                </div>
                <div>
                  <span
                    className={`status-badge ${category.status === "Available" ? "status-active" : "status-inactive"}`}
                  >
                    {category.status}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <Button
                    size="sm"
                    className="btn-secondary"
                    onClick={() => openEditCategoryForm(category)}
                    title="Edit Category"
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    title="Delete Category"
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
