"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, Edit, Trash2, Download, Plus, X } from "lucide-react";
import Cookies from "js-cookie";
import "../admin.css";

// Helper function to read a cookie from the browser
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

export default function CourseAssignment() {
    const [assignments, setAssignments] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [teachersLoading, setTeachersLoading] = useState(true);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAssignmentForm, setShowAssignmentForm] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [notification, setNotification] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [assignmentFormData, setAssignmentFormData] = useState({
        teacher_id: "",
        course_id: "",
    });

    // --- Helper Functions ---
    const showNotification = useCallback((message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    // Gets authentication headers with both Bearer token and CSRF token
    const getAuthHeaders = useCallback((isFormData = false) => {
        const token = getCookie("accessToken") || localStorage.getItem("accessToken");
        const csrfToken = Cookies.get("csrftoken");

        const headers = {};

        if (!isFormData) {
            headers["Content-Type"] = "application/json";
        }

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        if (csrfToken) {
            headers["X-CSRFToken"] = csrfToken;
        }

        return headers;
    }, []);

    const fetchAssignments = useCallback(async () => {
        setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            console.log(" Base URL:", baseUrl);

            if (!baseUrl) {
                console.error(" NEXT_PUBLIC_BACKEND_URL is not set");
                showNotification(
                    "Backend URL not configured. Please set NEXT_PUBLIC_BACKEND_URL environment variable.",
                    "error",
                );
                return;
            }

            const url = `${baseUrl}/api/course-assignment/`;
            console.log(" Fetching assignments from:", url);

            const response = await fetch(url, {
                method: "GET",
                headers: getAuthHeaders(),
                credentials: "include",
            });

            console.log(" Assignments response status:", response.status);
            console.log(
                " Assignments response headers:",
                Object.fromEntries(response.headers.entries()),
            );

            if (response.ok) {
                const data = await response.json();
                console.log(" Assignments data:", data);
                setAssignments(data);
            } else {
                const errorText = await response.text();
                console.error("Assignments error response:", errorText);
                showNotification(
                    `Failed to fetch course assignments (${response.status})`,
                    "error",
                );
            }
        } catch (error) {
            console.error("Error fetching assignments:", error);
            showNotification("Error fetching course assignments: " + error.message, "error");
        } finally {
            setLoading(false);
        }
    }, [getAuthHeaders, showNotification]);

    const fetchTeachers = useCallback(async () => {
        setTeachersLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            console.log(" Base URL:", baseUrl);

            if (!baseUrl) {
                console.error("NEXT_PUBLIC_BACKEND_URL is not set");
                showNotification(
                    "Backend URL not configured. Please set NEXT_PUBLIC_BACKEND_URL environment variable.",
                    "error",
                );
                return;
            }

            const url = `${baseUrl}/api/view-teachers/`;
            console.log(" Fetching teachers from:", url);

            const response = await fetch(url, {
                method: "GET",
                headers: getAuthHeaders(),
                credentials: "include",
            });

            console.log(" Teachers response status:", response.status);

            if (response.ok) {
                const data = await response.json();
                console.log("Teachers data:", data);
                setTeachers(data);
            } else {
                const errorText = await response.text();
                console.error(" Teachers error response:", errorText);
                showNotification(`Failed to fetch teachers (${response.status})`, "error");
            }
        } catch (error) {
            console.error("Error fetching teachers:", error);
            showNotification("Error fetching teachers: " + error.message, "error");
        } finally {
            setTeachersLoading(false);
        }
    }, [getAuthHeaders, showNotification]);

    const fetchCourses = useCallback(async () => {
        setCoursesLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            console.log(" Base URL:", baseUrl);

            if (!baseUrl) {
                console.error(" NEXT_PUBLIC_BACKEND_URL is not set");
                showNotification(
                    "Backend URL not configured. Please set NEXT_PUBLIC_BACKEND_URL environment variable.",
                    "error",
                );
                return;
            }

            const url = `${baseUrl}/api/courses/`;
            console.log("Fetching courses from:", url);

            const response = await fetch(url, {
                method: "GET",
                headers: getAuthHeaders(),
                credentials: "include",
            });

            console.log("Courses response status:", response.status);

            if (response.ok) {
                const data = await response.json();
                console.log("Courses data:", data);
                setCourses(data);
            } else {
                const errorText = await response.text();
                console.error("Courses error response:", errorText);
                showNotification(`Failed to fetch courses (${response.status})`, "error");
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            showNotification("Error fetching courses: " + error.message, "error");
        } finally {
            setCoursesLoading(false);
        }
    }, [getAuthHeaders, showNotification]);

    // Load data on component mount
    useEffect(() => {
        fetchAssignments();
        fetchTeachers();
        fetchCourses();
    }, [fetchAssignments, fetchTeachers, fetchCourses]);

    const handleAssignmentSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            if (!baseUrl) {
                showNotification(
                    "Backend URL not configured. Please set NEXT_PUBLIC_BACKEND_URL environment variable.",
                    "error",
                );
                return;
            }

            const url = editingAssignment
                ? `${baseUrl}/api/update-course-assignment/${editingAssignment.id}/`
                : `${baseUrl}/api/create-course-assignment/`;

            const method = editingAssignment ? "PUT" : "POST";

            console.log(" Submitting assignment to:", url);
            console.log(" Assignment data:", assignmentFormData);

            const formData = new FormData();
            formData.append("teacher_id", assignmentFormData.teacher_id);
            formData.append("course_id", assignmentFormData.course_id);

            console.log(" FormData entries:");
            for (const [key, value] of formData.entries()) {
                console.log(` ${key}: ${value}`);
            }

            const response = await fetch(url, {
                method,
                headers: getAuthHeaders(true), // Pass true to indicate FormData
                credentials: "include",
                body: formData, // Use FormData instead of JSON.stringify
            });

            console.log("Assignment submit response status:", response.status);

            if (response.ok) {
                const result = await response.json();
                console.log("Assignment submit result:", result);
                showNotification(result.message || "Assignment saved successfully", "success");
                fetchAssignments();
                handleCancelAssignmentForm();
            } else {
                const errorText = await response.text();
                console.error("Assignment submit error:", errorText);
                try {
                    const errorData = JSON.parse(errorText);
                    showNotification(errorData.message || "Failed to save assignment", "error");
                } catch {
                    showNotification(`Failed to save assignment (${response.status})`, "error");
                }
            }
        } catch (error) {
            console.error("Error saving assignment:", error);
            showNotification("Error saving assignment: " + error.message, "error");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        if (!window.confirm("Are you sure you want to delete this assignment?")) return;

        try {
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            const response = await fetch(
                `${baseUrl}/api/delete-course-assignment/${assignmentId}/`,
                {
                    method: "DELETE",
                    headers: getAuthHeaders(),
                    credentials: "include",
                },
            );

            if (response.ok) {
                const result = await response.json();
                showNotification(result.message || "Assignment deleted successfully", "success");
                fetchAssignments();
            } else {
                showNotification("Failed to delete assignment", "error");
            }
        } catch (error) {
            console.error("Error deleting assignment:", error);
            showNotification("Error deleting assignment", "error");
        }
    };

    const handleEditAssignment = (assignment) => {
        setEditingAssignment(assignment);
        setAssignmentFormData({
            teacher_id: assignment.teacher,
            course_id: assignment.course,
        });
        setShowAssignmentForm(true);
    };

    // Reset form
    const resetAssignmentForm = () => {
        setAssignmentFormData({
            teacher_id: "",
            course_id: "",
        });
        setEditingAssignment(null);
    };

    // Cancel form
    const handleCancelAssignmentForm = () => {
        setShowAssignmentForm(false);
        resetAssignmentForm();
    };

    const handleExportAssignments = () => {
        if (assignments.length === 0) {
            showNotification("No assignments to export", "error");
            return;
        }

        const csvContent = [
            ["ID", "Teacher ID", "Course ID", "Assigned At"].join(","),
            ...assignments.map((assignment) =>
                [assignment.id, assignment.teacher, assignment.course, assignment.assigned_at].join(
                    ",",
                ),
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "course_assignments.csv";
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const filteredAssignments = useMemo(() => {
        if (!searchTerm) return assignments;

        return assignments.filter((assignment) => {
            const teacher = teachers.find((t) => t.id === assignment.teacher);
            const course = courses.find((c) => c.id === assignment.course);

            return (
                assignment.id.toString().includes(searchTerm.toLowerCase()) ||
                (teacher &&
                    (teacher.first_name + " " + teacher.last_name)
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                (course &&
                    course.name &&
                    course.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        });
    }, [assignments, teachers, courses, searchTerm]);

    // Get teacher name by ID
    const getTeacherName = (teacherId) => {
        if (!teachers || !Array.isArray(teachers)) {
            return `Teacher ID: ${teacherId}`;
        }
        const teacher = teachers.find((t) => t.id === teacherId);
        return teacher ? `${teacher.first_name} ${teacher.last_name}` : `Teacher ID: ${teacherId}`;
    };

    // Get course name by ID
    const getCourseName = (courseId) => {
        if (!courses || !Array.isArray(courses)) {
            return `Course ID: ${courseId}`;
        }
        const course = courses.find((c) => c.id === courseId);
        return course ? course.name : `Course ID: ${courseId}`;
    };

    return (
        <div className="admin-dashboard-container">
            {/* Notification */}
            {notification && (
                <div
                    className={`notification ${notification.type === "error" ? "notification-error" : "notification-success"}`}
                >
                    {notification.message}
                </div>
            )}

            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">📚 Course Assignment Management</h1>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <Button
                        className="btn-secondary"
                        onClick={() => {
                            fetchAssignments();
                            fetchTeachers();
                            fetchCourses();
                        }}
                        title="Refresh Data"
                    >
                        🔄 Refresh
                    </Button>
                    <Button
                        className="btn-secondary"
                        onClick={handleExportAssignments}
                        disabled={!assignments.length}
                    >
                        <Download size={16} /> Export CSV
                    </Button>
                    <Button
                        className="btn-primary"
                        onClick={() => {
                            console.log(" Add Assignment button clicked");
                            console.log(" Teachers length:", teachers.length);
                            console.log("Courses length:", courses.length);
                            console.log("Teachers loading:", teachersLoading);
                            console.log("Courses loading:", coursesLoading);

                            setShowAssignmentForm(true);
                            resetAssignmentForm();

                            if (teachers.length === 0 || courses.length === 0) {
                                showNotification("Loading teachers and courses data...", "info");
                            }
                        }}
                        disabled={false}
                    >
                        <UserPlus size={16} /> Add Assignment
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{assignments.length}</div>
                    <div className="stat-label">Total Assignments</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{teachers.length}</div>
                    <div className="stat-label">Available Teachers</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{courses.length}</div>
                    <div className="stat-label">Available Courses</div>
                </div>
            </div>

            {/* Loading Status */}
            {(teachersLoading || coursesLoading) && (
                <div className="form-container" style={{ marginBottom: "2rem" }}>
                    <div className="form-header">
                        <h3>Loading Data...</h3>
                    </div>
                    <div className="user-form">
                        <div className="py-4 text-center">
                            <div className="text-gray-600">Fetching teachers and courses...</div>
                        </div>
                    </div>
                </div>
            )}

            {/* No Data Warning */}
            {!teachersLoading &&
                !coursesLoading &&
                (teachers.length === 0 || courses.length === 0) && (
                    <div className="form-container" style={{ marginBottom: "2rem" }}>
                        <div className="form-header">
                            <h3>⚠️ Missing Data</h3>
                        </div>
                        <div className="user-form">
                            <div className="py-4 text-center">
                                <div className="mb-2 text-gray-600">
                                    {teachers.length === 0 && "No teachers found in the system."}
                                    {courses.length === 0 && "No courses found in the system."}
                                </div>
                                <div className="text-gray-500">
                                    Please add teachers and courses before creating assignments.
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {/* Add/Edit Assignment Form */}
            {showAssignmentForm && (
                <div className="form-container" style={{ marginBottom: "2rem" }}>
                    <div className="form-header">
                        <h3>{editingAssignment ? "Edit Assignment" : "Add New Assignment"}</h3>
                        <Button
                            className="btn-secondary"
                            onClick={handleCancelAssignmentForm}
                            style={{ padding: "0.5rem" }}
                        >
                            <X size={16} />
                        </Button>
                    </div>
                    <form onSubmit={handleAssignmentSubmit} className="user-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="teacher_id" className="form-label">
                                    Teacher * ({teachers.length} available)
                                </label>
                                {teachersLoading ? (
                                    <div
                                        className="form-input"
                                        style={{ padding: "0.75rem", color: "#718096" }}
                                    >
                                        Loading teachers...
                                    </div>
                                ) : teachers.length === 0 ? (
                                    <div
                                        className="form-input"
                                        style={{ padding: "0.75rem", color: "#e53e3e" }}
                                    >
                                        No teachers available. Please check your backend connection.
                                    </div>
                                ) : (
                                    <select
                                        id="teacher_id"
                                        className="form-input"
                                        value={assignmentFormData.teacher_id}
                                        onChange={(e) =>
                                            setAssignmentFormData({
                                                ...assignmentFormData,
                                                teacher_id: e.target.value,
                                            })
                                        }
                                        required
                                    >
                                        <option value="">-- Select a teacher --</option>
                                        {Array.isArray(teachers) &&
                                            teachers.map((teacher) => (
                                                <option key={teacher.id} value={teacher.id}>
                                                    {teacher.first_name} {teacher.last_name} - ID:{" "}
                                                    {teacher.id}
                                                </option>
                                            ))}
                                    </select>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="course_id" className="form-label">
                                    Course * ({courses.length} available)
                                </label>
                                {coursesLoading ? (
                                    <div
                                        className="form-input"
                                        style={{ padding: "0.75rem", color: "#718096" }}
                                    >
                                        Loading courses...
                                    </div>
                                ) : courses.length === 0 ? (
                                    <div
                                        className="form-input"
                                        style={{ padding: "0.75rem", color: "#e53e3e" }}
                                    >
                                        No courses available. Please check your backend connection.
                                    </div>
                                ) : (
                                    <select
                                        id="course_id"
                                        className="form-input"
                                        value={assignmentFormData.course_id}
                                        onChange={(e) =>
                                            setAssignmentFormData({
                                                ...assignmentFormData,
                                                course_id: e.target.value,
                                            })
                                        }
                                        required
                                    >
                                        <option value="">-- Select a course --</option>
                                        {Array.isArray(courses) &&
                                            courses.map((course) => (
                                                <option key={course.id} value={course.id}>
                                                    {course.name} - ID: {course.id}
                                                </option>
                                            ))}
                                    </select>
                                )}
                            </div>
                        </div>
                        <div className="form-actions">
                            <Button
                                type="submit"
                                className="btn-primary"
                                disabled={
                                    formLoading || teachers.length === 0 || courses.length === 0
                                }
                            >
                                {formLoading ? (
                                    <>
                                        <span className="mr-2 animate-spin">⚙️</span> Saving...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={16} />{" "}
                                        {editingAssignment ? "Update Assignment" : "Add Assignment"}
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                className="btn-secondary"
                                onClick={handleCancelAssignmentForm}
                                disabled={formLoading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search Bar */}
            <div
                style={{
                    display: "flex",
                    gap: "1rem",
                    marginBottom: "2rem",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
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
                        placeholder="Search assignments by ID, teacher name, course name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: "40px" }}
                        className="form-input"
                    />
                </div>
            </div>

            {/* Assignments Data Table */}
            <div className="data-table">
                <div className="table-header">
                    <h3>All Assignments ({filteredAssignments.length})</h3>
                    {loading && (
                        <span style={{ marginLeft: "1rem", color: "#718096" }}>Loading...</span>
                    )}
                </div>
                <div className="table-content">
                    {/* Table Header */}
                    <div
                        className="table-header-row table-row"
                        style={{
                            fontWeight: "bold",
                            backgroundColor: "#f0f9ff",
                            display: "grid",
                            gridTemplateColumns: "0.5fr 2fr 2fr 1.5fr 2fr",
                            alignItems: "center",
                        }}
                    >
                        <div>ID</div>
                        <div>Teacher</div>
                        <div>Course</div>
                        <div>Assigned At</div>
                        <div>Actions</div>
                    </div>
                    {/* Table Body */}
                    {!loading && filteredAssignments.length === 0 ? (
                        <div className="py-8 text-center text-gray-500">
                            {assignments.length === 0
                                ? "No assignments found. Add some assignments to get started."
                                : "No assignments match your search criteria."}
                        </div>
                    ) : (
                        filteredAssignments.map((assignment, index) => (
                            <div
                                key={assignment.id ? `${assignment.id}-${index}` : index}
                                className="table-row"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "0.5fr 2fr 2fr 1.5fr 2fr",
                                    alignItems: "center",
                                }}
                            >
                                <div style={{ fontWeight: "600" }}>{assignment.id}</div>
                                <div style={{ fontWeight: "600" }}>
                                    {getTeacherName(assignment.teacher)}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {getCourseName(assignment.course)}
                                </div>
                                <div style={{ color: "#718096", fontSize: "0.875rem" }}>
                                    {new Date(assignment.assigned_at).toLocaleDateString()}
                                </div>
                                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                    <Button
                                        size="sm"
                                        className="btn-secondary"
                                        onClick={() => {
                                            console.log(
                                                " Edit button clicked for assignment:",
                                                assignment,
                                            );
                                            handleEditAssignment(assignment);
                                        }}
                                        title="Edit Assignment"
                                        style={{ padding: "0.25rem 0.5rem" }}
                                    >
                                        <Edit size={14} />
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => handleDeleteAssignment(assignment.id)}
                                        title="Delete Assignment"
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
    );
}
