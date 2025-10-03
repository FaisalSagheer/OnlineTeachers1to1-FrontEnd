"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Clock, MessageCircle, CalendarIcon } from "lucide-react"
import "./dashboard.css"
import Link from "next/link"
import TeacherDashBanner from "@/app/teacherComponents/teacherBanner"

export default function TeacherDashboard() {
  const [date, setDate] = useState(new Date())

  const upcomingClasses = [
    { id: 1, title: "Math League", time: "09:00 AM", date: "Mon, May 19", students: 15 },
    { id: 2, title: "Science Adventures", time: "11:30 AM", date: "Tue, May 20", students: 12 },
    { id: 3, title: "Reading Champions", time: "02:15 PM", date: "Wed, May 21", students: 18 },
  ]

  const pendingFeedback = [
    { id: 1, student: "Emma Wilson", course: "Math League", avatar: "E" },
    { id: 2, student: "Liam Johnson", course: "Science Adventures", avatar: "L" },
    { id: 3, student: "Olivia Davis", course: "Reading Champions", avatar: "O" },
  ]

  const classesThisWeek = 12
  const totalStudents = 45
  const averageRating = 4.8

  return (
    <div className="dashboard-container">
      
      <div className="dashboard-content">
        <h1 className="dashboard-title">Teacher Dashboard</h1>
        <div className="stats-grid">
          <Card className="stats-card">
            <CardHeader className="stats-card-header">
              <CardTitle className="stats-card-title">Classes This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="stats-content">
                <Clock className="stats-icon" />
                <div>
                  <p className="stats-value">{classesThisWeek}</p>
                  <p className="stats-label">Scheduled sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="stats-card-header">
              <CardTitle className="stats-card-title">Enrolled Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="stats-content">
                <Users className="stats-icon" />
                <div>
                  <p className="stats-value">{totalStudents}</p>
                  <p className="stats-label">Total students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="stats-card-header">
              <CardTitle className="stats-card-title">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="stats-content">
                <Star className="stats-icon" />
                <div>
                  <p className="stats-value">{averageRating}</p>
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`rating-star ${i < Math.floor(averageRating) ? "rating-star-filled" : "rating-star-empty"}`}
                        fill={i < Math.floor(averageRating) ? "currentColor" : "none"}
                      />
                    ))}
                    <span className="rating-count">(124 reviews)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="main-content">
          <div className="content-section">
            <Tabs defaultValue="schedule" className="dashboard-tabs">
              <TabsList className="dashboard-tabs-list">
                <TabsTrigger value="schedule">Upcoming Schedule</TabsTrigger>
                <TabsTrigger value="feedback">Pending Feedback</TabsTrigger>
              </TabsList>

              <TabsContent value="schedule">
                <Card className="schedule-card">
                  <CardHeader>
                    <CardTitle className="font-bold text-2xl">Upcoming Classes</CardTitle>
                    <CardDescription>Your schedule for the upcoming week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="schedule-list">
                      {upcomingClasses.map((cls) => (
                        <div key={cls.id} className="schedule-item">
                          <div className="schedule-info">
                            <h3 className="schedule-title">{cls.title}</h3>
                            <div className="schedule-time">
                              <Clock className="schedule-icon" />
                              {cls.time} | {cls.date}
                            </div>
                          </div>
                          <div className="schedule-actions">
                            <Badge variant="outline" className="students-badge">
                              <Users className="badge-icon" />
                              {cls.students}
                            </Badge>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="view-all-button">View Full Schedule</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="feedback">
                <Card className="feedback-card">
                  <CardHeader>
                    <CardTitle>Pending Feedback</CardTitle>
                    <CardDescription>Students awaiting your feedback</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="feedback-list">
                      {pendingFeedback.map((item) => (
                        <div key={item.id} className="feedback-item">
                          <div className="feedback-student">
                            <Avatar className="feedback-avatar">
                              <AvatarFallback>{item.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="feedback-student-info">
                              <p className="feedback-student-name">{item.student}</p>
                              <p className="feedback-student-course">{item.course}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="feedback-button">
                            <MessageCircle className="feedback-icon" />
                            Review
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="view-all-button">View All Feedback</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="sidebar">
            <Card className="calendar-card">
              <CardHeader>
                <CardTitle className="font-bold text-2xl">Calendar</CardTitle>
                <CardDescription>Plan your teaching schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar  mode="single" selected={date} onSelect={setDate} className="calendar-component " />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="calendar-button">
                  <CalendarIcon className="button-icon" />
                  Schedule Class
                </Button>
              </CardFooter>
            </Card>

            <Card className="quick-links-card">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="quick-links space-y-2">
  <Link href="/teacher/profile">
    <Button variant="outline" className="quick-link-button w-full">
      Profile Links
    </Button>
  </Link>

  <Link href="/teacher/students">
    <Button variant="outline" className="quick-link-button w-full">
      Student Management
    </Button>
  </Link>

  <Link href="/teacher/schedule">
    <Button variant="outline" className="quick-link-button w-full">
      Schedule Management
    </Button>
  </Link>
</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
