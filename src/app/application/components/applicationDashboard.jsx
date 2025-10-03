"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import Cookies from "js-cookie"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar, User, Clock, CheckCircle, BookOpen, DollarSign } from "lucide-react"
import "../application-manager.css"

// --- SWR Fetcher ---
const fetcher = async (url) => {
    const token = Cookies.get("accessToken");
    if (!token) throw new Error("Authentication token not found.");
    
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        const error = new Error("An API error occurred while fetching data.");
        error.status = res.status;
        throw error;
    }
    return res.json();
};

export default function ApplicationDash() {
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [courseFilter, setCourseFilter] = useState("all");

    // --- Data Fetching ---
    const { data: applicationsData, error: applicationsError } = useSWR(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application/detail/`,
        fetcher
    );

    // --- Derived Data ---
    const applications = useMemo(() => applicationsData?.application || [], [applicationsData]);

    const filteredApplications = useMemo(() => {
        // ✅ FIX: Added checks to prevent errors if app or its properties are null/undefined.
        return applications.filter((app) => {
            if (!app) return false; // Skip if the application object itself is invalid

            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                !searchTerm ||
                app.student?.toLowerCase().includes(searchLower) ||
                app.course?.toLowerCase().includes(searchLower) ||
                app.parent?.toLowerCase().includes(searchLower);

            const matchesStatus = statusFilter === "all" || app.status === statusFilter;
            const matchesCourse = courseFilter === "all" || app.course === courseFilter;

            return matchesSearch && matchesStatus && matchesCourse;
        });
    }, [applications, searchTerm, statusFilter, courseFilter]);

    const scheduledInterviews = useMemo(
        () => applications.filter((app) => app?.status === "Interview Scheduled" || app?.status === "Rescheduled"),
        [applications]
    );

    const approvedApplications = useMemo(
        () => applications.filter((app) => app?.status === "Demo Approved"),
        [applications]
    );

    const uniqueCourses = useMemo(() => [...new Set(applications.map((app) => app?.course).filter(Boolean))], [applications]);

    // --- Guard Clauses for Loading and Error States ---
    if (applicationsError) {
        return <div className="error-state">Failed to load dashboard data. Please refresh.</div>;
    }
    if (!applicationsData) {
        return <div className="loading-state">Loading Application Manager...</div>;
    }

    // --- JSX Render ---
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2 className="dashboard-title">Application Manager</h2>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="tabs">
                        <TabsTrigger value="all">All Applications</TabsTrigger>
                        <TabsTrigger value="scheduled">Scheduled Interviews</TabsTrigger>
                        <TabsTrigger value="assignment">Teacher Assignment</TabsTrigger>
                    </TabsList>

                    {/* All Applications Tab */}
                    <TabsContent value="all">
                        <div className="filters-and-stats">
                            <div className="filters-container">
                                <div className="search-container">
                                    <Search className="search-icon" />
                                    <Input
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="filter-select">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Approved">Approved</SelectItem>
                                        <SelectItem value="Rejected">Rejected</SelectItem>
                                        <SelectItem value="Interview Scheduled">Interview</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={courseFilter} onValueChange={setCourseFilter}>
                                    <SelectTrigger className="filter-select">
                                        <SelectValue placeholder="Filter by course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Courses</SelectItem>
                                        {uniqueCourses.map((course) => (
                                            <SelectItem key={course} value={course}>{course}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="applications-list">
                            {filteredApplications.length > 0 ? (
                                filteredApplications.map((app, index) => (
                                    <Card key={app?.application_date || index} className="application-card">
                                        <CardContent className="application-card-content">
                                            <div className="application-info">
                                                <div className="application-header">
                                                    <h3 className="application-student-name">{app?.student || 'No Name'}</h3>
                                                    {/* ✅ FIX: Added optional chaining to prevent crash */}
                                                    <Badge className={`status-badge status-${app?.status?.toLowerCase().replace(/ /g, "-")}`}>
                                                        {app?.status || 'No Status'}
                                                    </Badge>
                                                </div>
                                                <div className="application-details">
                                                    <div className="detail-item"><BookOpen className="detail-icon" /><span>{app?.course}</span></div>
                                                    <div className="detail-item"><User className="detail-icon" /><span>{app?.teacher || "N/A"}</span></div>
                                                    <div className="detail-item"><Calendar className="detail-icon" /><span>{app?.application_date ? new Date(app.application_date).toLocaleDateString() : 'N/A'}</span></div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="empty-state">No applications match your filters.</div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Other Tabs Content... */}
                    <TabsContent value="scheduled">
                        {/* You can add similar robust checks to this tab's content */}
                        <div className="empty-state">Scheduled interviews view.</div>
                    </TabsContent>
                    <TabsContent value="assignment">
                        {/* You can add similar robust checks to this tab's content */}
                        <div className="empty-state">Teacher assignment view.</div>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    );
}