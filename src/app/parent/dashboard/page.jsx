"use client";

import { lazy, Suspense, useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import Cookies from "js-cookie";

import {
    Info, Bell, User, BookOpen, Clock, CheckCircle, DollarSign,
    Search, FileText, Users, ChevronRight, Settings, CreditCard,
    GraduationCap, ClipboardList, UserPlus, Home, Award,
} from "lucide-react";
import "./dashboard.css";

const ParentProfile = lazy(() => import("@/app/components/profile"));
const ApplyCourse = lazy(() => import("../applyCourse/page"));
const FeePayment = lazy(() => import("@/app/components/FeePayment"));
const ChildRegistrationForm = lazy(() => import("@/app/components/childrenRegistrationForm"));

// Helper function for SWR to fetch data
const fetcher = async (url, token) => {
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const error = new Error("An error occurred while fetching the data.");
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }
    return res.json();
};


export default function ParentDashboard() {
    const [activeSection, setActiveSection] = useState("dashboard");
    const [fullName, setFullName] = useState("");
    const [enrollmentSelection, setEnrollmentSelection] = useState({});
    const token = Cookies.get("accessToken");

    // --- API Data Fetching using SWR ---
    const { data: profileData } = useSWR(token ? [`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/`, token] : null, ([url, token]) => fetcher(url, token));
    const { data: studentsData, error: studentsError, mutate: mutateStudents } = useSWR(token ? [`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students/`, token] : null, ([url, token]) => fetcher(url, token));
    // The activities API fetch has been removed.
    const { data: userHomeData, error: coursesError } = useSWR(token ? [`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-home/`, token] : null, ([url, token]) => fetcher(url, token));
    const { data: applicationsData, error: applicationsError } = useSWR(token ? [`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application/detail/`, token] : null, ([url, token]) => fetcher(url, token));

    useEffect(() => {
        if (profileData) {
            const name = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
            setFullName(name || profileData.username);
        }
    }, [profileData]);

    const handleEnrollStudent = async (studentId) => {
        const courseId = enrollmentSelection[studentId];
        if (!courseId) {
            alert("Please select a course to enroll.");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/student/enroll/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ student_id: studentId, course_id: courseId }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Enrollment failed");
            }
            
            alert("Student enrolled successfully!");
            mutateStudents();
        } catch (error) {
            console.error("Enrollment error:", error);
            alert(`An error occurred during enrollment: ${error.message}`);
        }
    };

    const dashboardStats = {
        activeApplications: 2,
        enrolledCourses: 5,
        pendingPayments: 1,
    };
    
    // Re-introduced the static recentActivities array
    const recentActivities = [
        { id: 1, type: "payment", message: "Payment of $2,500 received for Emma's enrollment", time: "2 hours ago", icon: DollarSign },
        { id: 2, type: "application", message: "Alex's application for Science course submitted", time: "1 day ago", icon: FileText },
        { id: 3, type: "enrollment", message: "Sophie enrolled in Music fundamentals course", time: "2 days ago", icon: BookOpen },
        { id: 4, type: "reminder", message: "Fee payment due for Sophie in 3 days", time: "3 days ago", icon: Clock },
    ];

    const quickActions = [
        { id: 1, title: "Register New Child", description: "Add a new child", icon: UserPlus, color: "#fc800a", action: () => setActiveSection("children-registration") },
        { id: 2, title: "Apply for Course", description: "Submit application", icon: ClipboardList, color: "#10b981", action: () => setActiveSection("course-application") },
        { id: 3, title: "Make Payment", description: "Pay pending fees", icon: CreditCard, color: "#f59e0b", action: () => setActiveSection("fee-payment") },
        { id: 4, title: "View Courses", description: "Manage enrollments", icon: GraduationCap, color: "#8b5cf6", action: () => setActiveSection("enrolled-courses") },
    ];

    const navigationItems = [
        { id: "dashboard", label: "Dashboard", icon: Home },
        { id: "parent-profile", label: "Parent Profile", icon: User },
        { id: "children-registration", label: "Children Registration", icon: UserPlus },
        { id: "course-application", label: "Course Application", icon: ClipboardList },
        { id: "application-status", label: "Application Status", icon: FileText },
        { id: "enrolled-courses", label: "Enrolled Courses", icon: GraduationCap },
        { id: "fee-payment", label: "Fee Payment", icon: CreditCard },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    const renderDashboardContent = () => {
        switch (activeSection) {
            case "dashboard":
                return (
                    <div className="dashboard-content">
                        {/* Stats, Quick Actions, Children Overview are unchanged */}
                        <div className="stats-grid">
                            <div className="stat-card primary">
                                <div className="stat-icon"><Users size={24} /></div>
                                <div className="stat-info">
                                    <h3>{studentsData ? studentsData.length : "..."}</h3>
                                    <p>Total Children</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon"><ClipboardList size={24} /></div>
                                <div className="stat-info"><h3>{dashboardStats.activeApplications}</h3><p>Active Applications</p></div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon"><BookOpen size={24} /></div>
                                <div className="stat-info"><h3>{dashboardStats.enrolledCourses}</h3><p>Enrolled Courses</p></div>
                            </div>
                            <div className="stat-card warning">
                                <div className="stat-icon"><DollarSign size={24} /></div>
                                <div className="stat-info"><h3>{dashboardStats.pendingPayments}</h3><p>Pending Payments</p></div>
                            </div>
                        </div>

                        <div className="section">
                            <h2 className="section-title">Quick Actions</h2>
                            <div className="quick-actions-grid">
                                {quickActions.map((action) => {
                                    const ActionIcon = action.icon;
                                    return (
                                        <div key={action.id} className="quick-action-card" onClick={action.action}>
                                            <div className="action-icon" style={{ backgroundColor: action.color }}><ActionIcon size={24} /></div>
                                            <div className="action-content"><h3>{action.title}</h3><p>{action.description}</p></div>
                                            <ChevronRight size={20} className="action-arrow" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="content-grid">
                            <div className="section">
                                <h2 className="section-title">Children Overview</h2>
                                <div className="children-cards">
                                    {studentsError && <div className="error-message">Failed to load children.</div>}
                                    {!studentsData && !studentsError && <div>Loading children...</div>}
                                    {studentsData && studentsData.map((child) => (
                                        <div key={child.id} className="child-summary-card">
                                            <img src={child.avatar || 'https://www.gravatar.com/avatar/?d=mp'} alt={child.full_name} className="child-avatar"/>
                                            <div className="child-info">
                                                <h4>{child.full_name}</h4>
                                                <p>{child.gender} - {child.grade}</p>
                                                <div className={`status-badge ${child.status || 'default'}`}>{child.status ? child.status.replace("_", " ") : 'Status N/A'}</div>
                                            </div>
                                            <div className="child-courses">
                                                <p>{child.enrolled_courses?.length || 0} courses</p>
                                                <small>Next payment: {child.next_payment_due || 'N/A'}</small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="section">
                                <h2 className="section-title">Recent Activities</h2>
                                <div className="activities-list">
                                    {/* Reverted to mapping over the static recentActivities array */}
                                    {recentActivities.map((activity) => {
                                        const ActivityIcon = activity.icon;
                                        return (
                                            <div key={activity.id} className="activity-item">
                                                <div className={`activity-icon ${activity.type}`}><ActivityIcon size={16} /></div>
                                                <div className="activity-content"><p>{activity.message}</p><small>{activity.time}</small></div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "parent-profile":
                return (<Suspense fallback={<div>Loading...</div>}><ParentProfile /></Suspense>);
            
            case "children-registration":
                return (<Suspense fallback={<div>Loading...</div>}><ChildRegistrationForm /></Suspense>);

            case "course-application":
                return (<Suspense fallback={<div>Loading...</div>}><ApplyCourse /></Suspense>);
            
            case "application-status":
                return (
                    <div className="page-content">
                        <h2 className="page-title">Application Status</h2>
                        <div className="status-list">
                            {applicationsError && <div className="error-message">Failed to load application statuses.</div>}
                            {!applicationsData && !applicationsError && <div>Loading...</div>}
                            {applicationsData && applicationsData?.application?.map((app) => (
                                <div key={app.id} className="status-card">
                                    <div className="status-header">
                                        <img src={app.child_avatar || 'https://www.gravatar.com/avatar/?d=mp'} alt={app.child_name} className="child-avatar"/>
                                        <div className="child-info">
                                            <h4>{app.student}</h4>
                                            <p>Course: {app.course}</p>
                                        </div>
                                        <div className={`status-badge ${app.status}`}>{app.status.replace("_", " ")}</div>
                                    </div>
                                    <div className="status-timeline">
                                        <div className="timeline-item completed"><CheckCircle size={16} /><span>Application Submitted</span></div>
                                        <div className={`timeline-item ${app.status === 'approved' || app.status === 'enrolled' ? "completed" : "pending"}`}><Clock size={16} /><span>Under Review</span></div>
                                        <div className={`timeline-item ${app.status === 'enrolled' ? "completed" : "pending"}`}><Award size={16} /><span>Enrolled</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case "enrolled-courses":
                return (
                    <div className="page-content">
                        <h2 className="page-title">Manage Enrolled Courses</h2>
                        {studentsError && <div className="error-message">Failed to load student data.</div>}
                        {!studentsData && !studentsError && <div>Loading...</div>}
                        {studentsData && studentsData.map(student => (
                            <div key={student.id} className="section course-management-section">
                                <h3 className="section-title">{student.full_name}'s Courses</h3>
                                {student.enrolled_courses?.length > 0 ? (
                                    <ul className="enrolled-list">
                                        {student.enrolled_courses.map(course => (
                                            <li key={course.id}>{course.name} - <span>{course.status}</span></li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>{student.full_name} is not enrolled in any courses yet.</p>
                                )}
                                <div className="enroll-action-area">
                                    <select 
                                        className="course-select"
                                        onChange={(e) => setEnrollmentSelection({...enrollmentSelection, [student.id]: e.target.value})}
                                        value={enrollmentSelection[student.id] || ""}
                                    >
                                        <option value="" disabled>Select a new course to enroll</option>
                                        {coursesError && <option disabled>Could not load courses</option>}
                                        {userHomeData && userHomeData.courses && userHomeData.courses.map(course => (
                                            <option key={course.id} value={course.id}>{course.name}</option>
                                        ))}
                                    </select>
                                    <button className="btn primary" onClick={() => handleEnrollStudent(student.id)}>Enroll</button>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case "fee-payment":
                 return (<Suspense fallback={<div>Loading...</div>}><div><h2 className="page-title">Fee Payment</h2><FeePayment /></div></Suspense>);
            
            default:
                return (
                    <div className="page-content">
                        <h2 className="page-title">{activeSection.replace(/-/g, " ")}</h2>
                        <p>This section is under construction.</p>
                    </div>
                );
        }
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-header"><h2>Parent Dashboard</h2></div>
                <nav className="sidebar-nav">
                    {navigationItems.map((item) => {
                        const ItemIcon = item.icon;
                        return (
                            <button
                                key={item.id}
                                className={`nav-item ${activeSection === item.id ? "active" : ""}`}
                                onClick={() => setActiveSection(item.id)}
                            >
                                <ItemIcon size={20} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>
            <main className="main-content">
                <header className="main-header">
                    <div className="header-content">
                        <h1 className="welcome-title">Welcome back, {fullName || '...'}!</h1>
                        <p className="welcome-subtitle">Here's your summary for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.</p>
                    </div>
                    <div className="header-actions">
                        <button className="icon-button"><Search size={20} /></button>
                        <button className="icon-button"><Bell size={20} /></button>
                    </div>
                </header>
                <div className="content">{renderDashboardContent()}</div>
            </main>
        </div>
    );
}