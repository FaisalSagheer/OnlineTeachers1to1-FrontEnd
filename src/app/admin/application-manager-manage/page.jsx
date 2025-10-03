"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, X, Eye, Calendar, User, BookOpen } from "lucide-react";
import Cookies from "js-cookie";
import "../admin.css";

// Helper function to get CSRF token from cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

export default function ApplicationManager() {
    // --- State Variables ---
    const [applications, setApplications] = useState([]);
    const [parents, setParents] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [managers, setManagers] = useState([]);
    const [formLoading, setFormLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [notification, setNotification] = useState(null);

    // Form and Modal Visibility
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [showApplicationDetails, setShowApplicationDetails] = useState(false);

    // Editing State
    const [editingApplication, setEditingApplication] = useState(null);
    const [viewingApplication, setViewingApplication] = useState(null);

    // Application form state
    const [applicationFormData, setApplicationFormData] = useState({
        parent_id: "",
        student_id: "",
        course_id: "",
        teacher_id: "",
        manager_id: "",
        note: "",
        interview_status: "Pending",
        firstdemo_status: "Pending",
        seconddemo_status: "Pending",
        thirddemo_status: "Pending",
        status: "Pending",
        interview_date: "",
    });
    // --- Helper Functions ---
    const showNotification = useCallback((message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    const getAuthHeaders = useCallback((isFormData = false) => {
        const token = Cookies.get("accessToken");
        const csrfToken = getCookie("csrftoken");
        const headers = {};

        if (!isFormData) {
            headers["Content-Type"] = "application/json";
        }

        if (token) headers["Authorization"] = `Bearer ${token}`;
        if (csrfToken) headers["X-CSRFToken"] = csrfToken;
        return headers;
    }, []);

    // --- Generic API Fetcher ---
    const fetchData = useCallback(
        async (endpoint, setter) => {
            try {
                const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`;
                const response = await fetch(url, {
                    headers: getAuthHeaders(),
                    credentials: "include",
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || `Failed to fetch data from ${endpoint}`);
                }
                const data = await response.json();
                setter(Array.isArray(data) ? data : []);
                return data;
            } catch (error) {
                console.error(`Error fetching from ${endpoint}:`, error);
                showNotification(error.message, "error");
                setter([]);
            }
        },
        [getAuthHeaders, showNotification],
    );
    // --- API Calls ---
    const fetchApplications = useCallback(
        () => fetchData("/api/applications/", setApplications),
        [fetchData],
    );
    const fetchParents = useCallback(
        () => fetchData("/api/view-parents/", setParents),
        [fetchData],
    );
    const fetchStudents = useCallback(
        () => fetchData("/api/view-students/", setStudents),
        [fetchData],
    );
    const fetchCourses = useCallback(() => fetchData("/api/courses/", setCourses), [fetchData]);
    const fetchTeachers = useCallback(
        () => fetchData("/api/view-teachers/", setTeachers),
        [fetchData],
    );
    const fetchManagers = useCallback(
        () => fetchData("/api/view-managers/", setManagers),
        [fetchData],
    );
    // --- Form Submission Handler ---
    const handleApplicationSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        const { parent_id, student_id, course_id, teacher_id } = applicationFormData;
        if (!parent_id || !student_id || !course_id || !teacher_id) {
            showNotification(
                "Please fill in all required fields (Parent, Student, Course, Teacher).",
                "error",
            );
            setFormLoading(false);
            return;
        }

        const url = editingApplication
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-application/${editingApplication.id}/`
            : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-application/`;
        const method = editingApplication ? "PUT" : "POST";

        // Always use FormData for application creation/update
        const formData = new FormData();
        // Append all fields, converting numbers to strings as FormData expects strings
        Object.keys(applicationFormData).forEach((key) => {
            const value = applicationFormData[key];
            if (value !== null && value !== undefined && value !== "") {
                // Convert numeric IDs to string for FormData
                if (
                    ["parent_id", "student_id", "manager_id", "course_id", "teacher_id"].includes(
                        key,
                    )
                ) {
                    formData.append(key, String(value));
                } else {
                    formData.append(key, value);
                }
            }
        });

        try {
            const response = await fetch(url, {
                method,
                headers: getAuthHeaders(true), // Pass true to indicate FormData, so Content-Type is NOT set
                credentials: "include",
                body: formData, // Send FormData object
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.detail ||
                        Object.values(errorData)[0] ||
                        "Failed to save application.",
                );
            }
            const result = await response.json();
            showNotification(
                result.message ||
                    `Application ${editingApplication ? "updated" : "created"} successfully.`,
                "success",
            );
            setShowApplicationForm(false);
            fetchApplications();
        } catch (error) {
            showNotification(error.message, "error");
        } finally {
            setFormLoading(false);
        }
    };
    // --- Delete Handler ---
    const handleDeleteApplication = async (applicationId) => {
        if (!window.confirm("Are you sure you want to delete this application?")) return;

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete-application/${applicationId}/`,
                {
                    method: "DELETE",
                    headers: getAuthHeaders(),
                    credentials: "include",
                },
            );

            if (!response.ok) throw new Error("Failed to delete application.");

            const result = await response.json();
            showNotification(result.message || "Application deleted successfully.", "success");
            fetchApplications();
        } catch (error) {
            showNotification(error.message, "error");
        }
    };
    // --- Initial Data Load ---
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            await Promise.all([
                fetchApplications(),
                fetchParents(),
                fetchManagers(),
                fetchStudents(),
                fetchCourses(),
                fetchTeachers(),
            ]);
            setLoading(false);
        };
        loadInitialData();
    }, [
        fetchApplications,
        fetchParents,
        fetchStudents,
        fetchManagers,
        fetchCourses,
        fetchTeachers,
    ]);
    // --- Form Reset and Edit Handlers ---
    const openNewApplicationForm = () => {
        setEditingApplication(null);
        setApplicationFormData({
            parent_id: "",
            student_id: "",
            course_id: "",
            manager_id: "",
            teacher_id: "",
            note: "",
            interview_status: "Pending",
            firstdemo_status: "Pending",
            seconddemo_status: "Pending",
            thirddemo_status: "Pending",
            status: "Pending",
            interview_date: "",
        });
        setShowApplicationForm(true);
    };
    const openEditApplicationForm = (application) => {
        setEditingApplication(application);
        setApplicationFormData({
            parent_id: application.parent?.id || "",
            student_id: application.student?.id || "",
            course_id: application.course?.id || "",
            teacher_id: application.teacher?.id || "",
            manager_id: application.manager?.id || "",

            note: application.note || "",
            interview_status: application.interview_status || "Pending",
            firstdemo_status: application.firstdemo_status || "Pending",
            seconddemo_status: application.seconddemo_status || "Pending",
            thirddemo_status: application.thirddemo_status || "Pending",
            status: application.status || "Pending",
            interview_date: application.interview_date || "",
        });
        setShowApplicationForm(true);
    };
    const openApplicationDetails = (application) => {
        setViewingApplication(application);
        setShowApplicationDetails(true);
    };
    // --- Filtering Logic ---
    const hydratedApplications = useMemo(() => {
        // Create lookup maps for efficient access. This is much faster than using .find() in a loop.
        const parentMap = new Map(parents.map((p) => [p.id, p]));
        const studentMap = new Map(students.map((s) => [s.id, s]));
        const courseMap = new Map(courses.map((c) => [c.id, c]));
        const teacherMap = new Map(teachers.map((t) => [t.id, t]));
        const managerMap = new Map(managers.map((m) => [m.id, m]));

        // Map over the original applications and replace IDs with full objects
        return applications.map((app) => ({
            ...app,
            parent: parentMap.get(app.parent),
            student: studentMap.get(app.student),
            course: courseMap.get(app.course),
            teacher: teacherMap.get(app.teacher),
            manager: managerMap.get(app.manager),
        }));
    }, [applications, parents, students, courses, teachers, managers]);

    // AFTER (REPLACE WITH THIS)
    const filteredApplications = useMemo(() => {
        // Use the new hydrated data as the source
        return hydratedApplications.filter((application) => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                application.student?.full_name?.toLowerCase().includes(searchLower) ||
                application.parent?.full_name?.toLowerCase().includes(searchLower) ||
                application.course?.name?.toLowerCase().includes(searchLower) ||
                application.teacher?.full_name?.toLowerCase().includes(searchLower) ||
                application.manager?.full_name?.toLowerCase().includes(searchLower); // Manager added to search

            // More robust status check for empty statuses
            const appStatus = application.status || "Pending";
            const matchesStatus = statusFilter === "All" || appStatus === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [hydratedApplications, searchTerm, statusFilter]); // Update dependencies here
    // Status options
    const statusOptions = [
        "Pending",
        "Interview Scheduled",
        "Interview Completed",
        "Demo Scheduled",
        "Demo Completed",
        "Approved",
        "Rejected",
        "Cancelled",
    ];
    if (loading) {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
    }
    return (
        <div className="admin-dashboard-container">
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
            <div className="page-header">
                <h1 className="page-title">📋 Application Management</h1>
                <div className="flex flex-wrap gap-4">
                    <Button
                        className="btn-secondary"
                        onClick={() => {
                            fetchApplications();
                            fetchParents();
                            fetchStudents();
                            fetchCourses();
                            fetchTeachers();
                            fetchManagers();
                        }}
                    >
                        🔄 Refresh
                    </Button>
                    <Button className="btn-primary" onClick={openNewApplicationForm}>
                        <Plus size={16} /> New Application
                    </Button>
                </div>
            </div>
            {/* Stats */}
            <div className="stats-grid mb-8">
                <div className="stat-card">
                    <div className="stat-value">{applications.length}</div>
                    <div className="stat-label">📋 Total Applications</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {applications.filter((a) => a.status === "Pending").length}
                    </div>
                    <div className="stat-label">⏳ Pending</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {applications.filter((a) => a.status === "Approved").length}
                    </div>
                    <div className="stat-label">✅ Approved</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {applications.filter((a) => a.status === "Interview Scheduled").length}
                    </div>
                    <div className="stat-label">📅 Interviews</div>
                </div>
            </div>
            {/* --- APPLICATION FORM --- */}
            {showApplicationForm && (
                <div className="form-container mb-8">
                    <div className="form-header">
                        <h3>{editingApplication ? "Edit Application" : "New Application"}</h3>
                        <Button
                            className="btn-secondary p-2"
                            onClick={() => setShowApplicationForm(false)}
                        >
                            <X size={16} />
                        </Button>
                    </div>
                    <form onSubmit={handleApplicationSubmit} className="user-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Parent *</label>
                                <select
                                    className="form-input"
                                    value={applicationFormData.parent_id}
                                    onChange={(e) =>
                                        setApplicationFormData({
                                            ...applicationFormData,
                                            parent_id: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value="">Select Parent...</option>
                                    {parents.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.full_name} ({p.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Student *</label>
                                <select
                                    className="form-input"
                                    value={applicationFormData.student_id}
                                    onChange={(e) =>
                                        setApplicationFormData({
                                            ...applicationFormData,
                                            student_id: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value="">Select Student...</option>
                                    {students.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.full_name} (Age: {s.age})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Course *</label>
                                <select
                                    className="form-input"
                                    value={applicationFormData.course_id}
                                    onChange={(e) =>
                                        setApplicationFormData({
                                            ...applicationFormData,
                                            course_id: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value="">Select Course...</option>
                                    {courses.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name} - ${c.price}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Teacher *</label>
                                <select
                                    className="form-input"
                                    value={applicationFormData.teacher_id}
                                    onChange={(e) =>
                                        setApplicationFormData({
                                            ...applicationFormData,
                                            teacher_id: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value="">Select Teacher...</option>
                                    {teachers.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.first_name} ({t.subject?.name})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="manager_id">Manager</label>
                                <select
                                    id="manager_id"
                                    className="form-input"
                                    value={applicationFormData.manager_id}
                                    onChange={(e) =>
                                        setApplicationFormData({
                                            ...applicationFormData,
                                            manager_id: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">Select Manager...</option>
                                    {managers.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.full_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Application Status</label>
                                <select
                                    className="form-input"
                                    value={applicationFormData.status}
                                    onChange={(e) =>
                                        setApplicationFormData({
                                            ...applicationFormData,
                                            status: e.target.value,
                                        })
                                    }
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Interview Date</label>
                                <Input
                                    type="datetime-local"
                                    value={applicationFormData.interview_date}
                                    onChange={(e) =>
                                        setApplicationFormData({
                                            ...applicationFormData,
                                            interview_date: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Interview Status</label>
                                <select
                                    className="form-input"
                                    value={applicationFormData.interview_status}
                                    onChange={(e) =>
                                        setApplicationFormData({
                                            ...applicationFormData,
                                            interview_status: e.target.value,
                                        })
                                    }
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>First Demo Status</label>
                                <select
                                    className="form-input"
                                    value={applicationFormData.firstdemo_status}
                                    onChange={(e) =>
                                        setApplicationFormData({
                                            ...applicationFormData,
                                            firstdemo_status: e.target.value,
                                        })
                                    }
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Second Demo Status</label>
                                <select
                                    className="form-input"
                                    value={applicationFormData.seconddemo_status}
                                    onChange={(e) =>
                                        setApplicationFormData({
                                            ...applicationFormData,
                                            seconddemo_status: e.target.value,
                                        })
                                    }
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Third Demo Status</label>
                                <select
                                    className="form-input"
                                    value={applicationFormData.thirddemo_status}
                                    onChange={(e) =>
                                        setApplicationFormData({
                                            ...applicationFormData,
                                            thirddemo_status: e.target.value,
                                        })
                                    }
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Notes</label>
                            <textarea
                                className="form-input"
                                value={applicationFormData.note}
                                onChange={(e) =>
                                    setApplicationFormData({
                                        ...applicationFormData,
                                        note: e.target.value,
                                    })
                                }
                                rows={4}
                                placeholder="Any additional notes or comments..."
                            />
                        </div>
                        <div className="form-actions">
                            <Button type="submit" className="btn-primary" disabled={formLoading}>
                                {formLoading ? "Saving..." : "Save Application"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}
            {/* --- APPLICATION DETAILS MODAL --- */}
            {showApplicationDetails && viewingApplication && (
                <div className="form-container mb-8">
                    <div className="form-header">
                        <h3>Application Details - #{viewingApplication.id}</h3>
                        <Button
                            className="btn-secondary p-2"
                            onClick={() => setShowApplicationDetails(false)}
                        >
                            <X size={16} />
                        </Button>
                    </div>
                    <div className="space-y-4 p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <h4 className="flex items-center gap-2 font-semibold">
                                    <User size={16} /> Parent Information
                                </h4>
                                <p>
                                    <strong>Name:</strong> {viewingApplication.parent?.full_name}
                                </p>
                                <p>
                                    <strong>Email:</strong> {viewingApplication.parent?.email}
                                </p>
                                <p>
                                    <strong>Phone:</strong>{" "}
                                    {viewingApplication.parent?.contact_number}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="flex items-center gap-2 font-semibold">
                                    <User size={16} /> Student Information
                                </h4>
                                <p>
                                    <strong>Name:</strong> {viewingApplication.student?.full_name}
                                </p>
                                <p>
                                    <strong>Age:</strong> {viewingApplication.student?.age}
                                </p>
                                <p>
                                    <strong>Grade:</strong> {viewingApplication.student?.grade}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <h4 className="flex items-center gap-2 font-semibold">
                                    <BookOpen size={16} /> Course Information
                                </h4>
                                <p>
                                    <strong>Course:</strong> {viewingApplication.course?.name}
                                </p>
                                <p>
                                    <strong>Price:</strong> ${viewingApplication.course?.price}
                                </p>
                                <p>
                                    <strong>Subject:</strong>{" "}
                                    {viewingApplication.course?.subject?.name}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="flex items-center gap-2 font-semibold">
                                    <User size={16} /> Teacher Information
                                </h4>
                                <p>
                                    <strong>Name:</strong> {viewingApplication.teacher?.full_name}
                                </p>
                                <p>
                                    <strong>Subject:</strong>{" "}
                                    {viewingApplication.teacher?.subject?.name}
                                </p>
                                <p>
                                    <strong>Email:</strong> {viewingApplication.teacher?.email}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="flex items-center gap-2 font-semibold">
                                <User size={16} /> Manager Information
                            </h4>
                            <p>
                                <strong>Name:</strong>{" "}
                                {viewingApplication.manager?.full_name || "N/A"}
                            </p>
                            <p>
                                <strong>Email:</strong> {viewingApplication.manager?.email || "N/A"}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="flex items-center gap-2 font-semibold">
                                <Calendar size={16} /> Status Information
                            </h4>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                <div>
                                    <p>
                                        <strong>Application Status:</strong>
                                    </p>
                                    <span
                                        className={`status-badge ${viewingApplication.status === "Approved" ? "status-active" : "status-inactive"}`}
                                    >
                                        {viewingApplication.status}
                                    </span>
                                </div>
                                <div>
                                    <p>
                                        <strong>Interview:</strong>
                                    </p>
                                    <span className="status-badge status-inactive">
                                        {viewingApplication.interview_status}
                                    </span>
                                </div>
                                <div>
                                    <p>
                                        <strong>Demo 1:</strong>
                                    </p>
                                    <span className="status-badge status-inactive">
                                        {viewingApplication.firstdemo_status}
                                    </span>
                                </div>
                                <div>
                                    <p>
                                        <strong>Demo 2:</strong>
                                    </p>
                                    <span className="status-badge status-inactive">
                                        {viewingApplication.seconddemo_status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {viewingApplication.note && (
                            <div className="space-y-2">
                                <h4 className="font-semibold">Notes</h4>
                                <p className="rounded bg-gray-50 p-3">{viewingApplication.note}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Search and Filter */}
            <div className="mb-8 flex flex-wrap items-center gap-4">
                <div className="relative min-w-[250px] flex-1">
                    <Search
                        size={20}
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
                    />
                    <Input
                        placeholder="Search by student, parent, course, or teacher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input pl-10"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="form-input w-full md:w-auto"
                >
                    <option value="All">All Statuses</option>
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>
            {/* Applications Table */}
            <div className="data-table">
                <div className="table-header">
                    <h3>Applications ({filteredApplications.length})</h3>
                </div>
                <div className="table-content">
                    <div
                        className="table-header-row table-row"
                        style={{ gridTemplateColumns: "0.5fr 1.5fr 1.5fr 1.5fr 1fr 1fr 1fr 1.5fr" }}
                    >
                        <div>ID</div>
                        <div>Student</div>
                        <div>Parent</div>
                        <div>Course</div>
                        <div>Teacher</div>
                        <div>Manager</div>
                        <div>Status</div>
                        <div>Actions</div>
                    </div>
                    {filteredApplications.length === 0 ? (
                        <div className="py-8 text-center text-gray-500">No applications found.</div>
                    ) : (
                        filteredApplications.map((application) => (
                            <div
                                key={application.id}
                                className="table-row"
                                style={{
                                    gridTemplateColumns:
                                        "0.5fr 1.5fr 1.5fr 1.5fr 1fr 1fr 1fr 1.5fr",
                                }}
                            >
                                <div className="font-semibold">#{application.id}</div>
                                <div>{application.student?.full_name || "N/A"}</div>
                                <div>{application.parent?.full_name || "N/A"}</div>
                                <div>{application.course?.name || "N/A"}</div>
                                <div>{application.teacher?.first_name || "N/A"}</div>
                                <div>{application.manager?.full_name || "N/A"}</div>
                                <div>
                                    <span
                                        className={`status-badge ${application.status === "Approved" ? "status-active" : "status-inactive"}`}
                                    >
                                        {application.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        size="sm"
                                        className="btn-secondary p-2"
                                        onClick={() => openApplicationDetails(application)}
                                    >
                                        <Eye size={14} />
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="btn-secondary p-2"
                                        onClick={() => openEditApplicationForm(application)}
                                    >
                                        <Edit size={14} />
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="btn-[#fc800a] p-2"
                                        onClick={() => handleDeleteApplication(application.id)}
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
