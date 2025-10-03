"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Filter, Users, Star, Clock, MessageCircle, Eye, TrendingUp, Award } from "lucide-react"
import "./students.css"

export default function StudentManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("all")

  const courses = [
    { id: 1, name: "Math League", students: 15, color: "#3b82f6" },
    { id: 2, name: "Science Adventures", students: 12, color: "#10b981" },
    { id: 3, name: "Reading Champions", students: 18, color: "#f59e0b" },
  ]

  const students = [
    {
      id: 1,
      name: "Emma Wilson",
      avatar: "E",
      course: "Math League",
      progress: 85,
      rating: 4.8,
      attendance: 95,
      lastActive: "2 hours ago",
      status: "active",
      assignments: { completed: 12, total: 15 },
      joinDate: "Jan 2024",
    },
    {
      id: 2,
      name: "Liam Johnson",
      avatar: "L",
      course: "Science Adventures",
      progress: 72,
      rating: 4.5,
      attendance: 88,
      lastActive: "1 day ago",
      status: "active",
      assignments: { completed: 8, total: 12 },
      joinDate: "Feb 2024",
    },
    {
      id: 3,
      name: "Olivia Davis",
      avatar: "O",
      course: "Reading Champions",
      progress: 91,
      rating: 4.9,
      attendance: 98,
      lastActive: "30 minutes ago",
      status: "active",
      assignments: { completed: 18, total: 20 },
      joinDate: "Dec 2023",
    },
    {
      id: 4,
      name: "Noah Brown",
      avatar: "N",
      course: "Math League",
      progress: 65,
      rating: 4.2,
      attendance: 82,
      lastActive: "3 days ago",
      status: "inactive",
      assignments: { completed: 9, total: 15 },
      joinDate: "Mar 2024",
    },
    {
      id: 5,
      name: "Sophia Williams",
      avatar: "S",
      course: "Science Adventures",
      progress: 78,
      rating: 4.6,
      attendance: 90,
      lastActive: "5 hours ago",
      status: "active",
      assignments: { completed: 10, total: 12 },
      joinDate: "Jan 2024",
    },
    {
      id: 6,
      name: "Mason Garcia",
      avatar: "M",
      course: "Reading Champions",
      progress: 88,
      rating: 4.7,
      attendance: 94,
      lastActive: "1 hour ago",
      status: "active",
      assignments: { completed: 17, total: 20 },
      joinDate: "Feb 2024",
    },
  ]

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = selectedCourse === "all" || student.course === selectedCourse
    return matchesSearch && matchesCourse
  })

  return (
    <div className="students-container">
      <div className="students-content">
        <h1 className="students-title">Student Management</h1>

        <div className="students-layout">
          <div className="students-main">
            {/* Course Overview Cards */}
            <div className="courses-overview">
              {courses.map((course) => (
                <Card key={course.id} className="course-overview-card">
                  <CardContent className="course-overview-content">
                    <div className="course-overview-info">
                      <div className="course-color-indicator" style={{ backgroundColor: course.color }}></div>
                      <div>
                        <h3 className="course-overview-name">{course.name}</h3>
                        <p className="course-overview-students">{course.students} students</p>
                      </div>
                    </div>
                    <div className="course-overview-stats">
                      <Users className="course-overview-icon" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Filters and Search */}
            <Card className="filters-card">
              <CardContent className="filters-content">
                <div className="search-filter-container">
                  <div className="search-container">
                    <Search className="search-icon" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  <div className="filter-container">
                    <Filter className="filter-icon" />
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger className="filter-select">
                        <SelectValue placeholder="All Courses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        <SelectItem value="Math League">Math League</SelectItem>
                        <SelectItem value="Science Adventures">Science Adventures</SelectItem>
                        <SelectItem value="Reading Champions">Reading Champions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Students List */}
            <Tabs defaultValue="grid" className="students-tabs">
              <TabsList className="students-tabs-list">
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>

              <TabsContent value="grid">
                <div className="students-grid">
                  {filteredStudents.map((student) => (
                    <Card key={student.id} className="student-card">
                      <CardHeader className="student-card-header">
                        <div className="student-header-info">
                          <Avatar className="student-avatar">
                            <AvatarImage src={`/placeholder.svg?height=60&width=60`} alt={student.name} />
                            <AvatarFallback>{student.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="student-basic-info">
                            <h3 className="student-name">{student.name}</h3>
                            <p className="student-course">{student.course}</p>
                            <Badge className={`student-status ${student.status}`}>{student.status}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="student-card-content">
                        <div className="student-stats">
                          <div className="student-stat">
                            <div className="stat-header">
                              <TrendingUp className="stat-icon" />
                              <span className="stat-label">Progress</span>
                            </div>
                            <Progress value={student.progress} className="progress-bar" />
                            <span className="stat-value">{student.progress}%</span>
                          </div>

                          <div className="student-metrics">
                            <div className="metric-item">
                              <Star className="metric-icon" />
                              <span className="metric-value">{student.rating}</span>
                              <span className="metric-label">Rating</span>
                            </div>
                            <div className="metric-item">
                              <Clock className="metric-icon" />
                              <span className="metric-value">{student.attendance}%</span>
                              <span className="metric-label">Attendance</span>
                            </div>
                            <div className="metric-item">
                              <Award className="metric-icon" />
                              <span className="metric-value">
                                {student.assignments.completed}/{student.assignments.total}
                              </span>
                              <span className="metric-label">Assignments</span>
                            </div>
                          </div>

                          <div className="student-activity">
                            <p className="last-active">Last active: {student.lastActive}</p>
                            <p className="join-date">Joined: {student.joinDate}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="student-card-footer">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="view-profile-btn">
                              <Eye className="button-icon" />
                              View Profile
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="student-dialog">
                            <DialogHeader>
                              <DialogTitle>{student.name} - Profile</DialogTitle>
                              <DialogDescription>Detailed information about the student</DialogDescription>
                            </DialogHeader>
                            <div className="student-profile-details">
                              <div className="profile-section">
                                <h4 className="profile-section-title">Course Information</h4>
                                <p>
                                  <strong>Course:</strong> {student.course}
                                </p>
                                <p>
                                  <strong>Join Date:</strong> {student.joinDate}
                                </p>
                                <p>
                                  <strong>Status:</strong> {student.status}
                                </p>
                              </div>
                              <div className="profile-section">
                                <h4 className="profile-section-title">Performance</h4>
                                <p>
                                  <strong>Progress:</strong> {student.progress}%
                                </p>
                                <p>
                                  <strong>Rating:</strong> {student.rating}/5.0
                                </p>
                                <p>
                                  <strong>Attendance:</strong> {student.attendance}%
                                </p>
                                <p>
                                  <strong>Assignments:</strong> {student.assignments.completed}/
                                  {student.assignments.total} completed
                                </p>
                              </div>
                              <div className="profile-section">
                                <h4 className="profile-section-title">Activity</h4>
                                <p>
                                  <strong>Last Active:</strong> {student.lastActive}
                                </p>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline">Send Message</Button>
                              <Button>View Full Report</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" className="message-btn">
                          <MessageCircle className="button-icon" />
                          Message
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="list">
                <Card className="students-list-card">
                  <CardContent className="students-list-content">
                    <div className="students-table">
                      <div className="table-header">
                        <div className="table-cell">Student</div>
                        <div className="table-cell">Course</div>
                        <div className="table-cell">Progress</div>
                        <div className="table-cell">Rating</div>
                        <div className="table-cell">Attendance</div>
                        <div className="table-cell">Status</div>
                        <div className="table-cell">Actions</div>
                      </div>
                      {filteredStudents.map((student) => (
                        <div key={student.id} className="table-row">
                          <div className="table-cell student-cell">
                            <Avatar className="table-avatar">
                              <AvatarFallback>{student.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="table-student-name">{student.name}</p>
                              <p className="table-student-activity">{student.lastActive}</p>
                            </div>
                          </div>
                          <div className="table-cell">{student.course}</div>
                          <div className="table-cell">
                            <div className="table-progress">
                              <Progress value={student.progress} className="table-progress-bar" />
                              <span className="table-progress-text">{student.progress}%</span>
                            </div>
                          </div>
                          <div className="table-cell">
                            <div className="table-rating">
                              <Star className="table-star" />
                              {student.rating}
                            </div>
                          </div>
                          <div className="table-cell">{student.attendance}%</div>
                          <div className="table-cell">
                            <Badge className={`table-status ${student.status}`}>{student.status}</Badge>
                          </div>
                          <div className="table-cell table-actions">
                            <Button variant="ghost" size="sm">
                              <Eye className="action-icon" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="action-icon" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="students-sidebar">
            <Card className="summary-card">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>Overview of all students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="summary-stats">
                  <div className="summary-stat">
                    <div className="summary-stat-value">45</div>
                    <div className="summary-stat-label">Total Students</div>
                  </div>
                  <div className="summary-stat">
                    <div className="summary-stat-value">38</div>
                    <div className="summary-stat-label">Active Students</div>
                  </div>
                  <div className="summary-stat">
                    <div className="summary-stat-value">4.7</div>
                    <div className="summary-stat-label">Avg Rating</div>
                  </div>
                  <div className="summary-stat">
                    <div className="summary-stat-value">91%</div>
                    <div className="summary-stat-label">Avg Attendance</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="recent-activity-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest student activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-avatar">
                      <Avatar className="activity-student-avatar">
                        <AvatarFallback>E</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="activity-info">
                      <p className="activity-text">Emma completed Math Assignment #12</p>
                      <p className="activity-time">2 hours ago</p>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-avatar">
                      <Avatar className="activity-student-avatar">
                        <AvatarFallback>L</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="activity-info">
                      <p className="activity-text">Liam joined Science class</p>
                      <p className="activity-time">4 hours ago</p>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-avatar">
                      <Avatar className="activity-student-avatar">
                        <AvatarFallback>O</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="activity-info">
                      <p className="activity-text">Olivia submitted Reading essay</p>
                      <p className="activity-time">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="view-all-activity">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
