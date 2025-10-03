"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, CalendarIcon, Plus, Check, X, Users, ArrowRight } from "lucide-react"
import "./schedule.css"

export default function ScheduleManagement() {
  const [date, setDate] = useState(new Date())

  const upcomingClasses = [
    { id: 1, title: "Math League", time: "09:00 AM - 10:30 AM", date: "Mon, May 19", students: 15, type: "Regular" },
    {
      id: 2,
      title: "Science Adventures",
      time: "11:30 AM - 01:00 PM",
      date: "Tue, May 20",
      students: 12,
      type: "Regular",
    },
    {
      id: 3,
      title: "Reading Champions",
      time: "02:15 PM - 03:45 PM",
      date: "Wed, May 21",
      students: 18,
      type: "Regular",
    },
  ]

  const demoRequests = [
    {
      id: 1,
      title: "Math Fundamentals",
      time: "04:00 PM - 04:30 PM",
      date: "Thu, May 22",
      student: "Alex Johnson",
      status: "pending",
    },
    {
      id: 2,
      title: "Science Basics",
      time: "05:00 PM - 05:30 PM",
      date: "Fri, May 23",
      student: "Sophia Williams",
      status: "pending",
    },
    {
      id: 3,
      title: "Reading Essentials",
      time: "10:00 AM - 10:30 AM",
      date: "Sat, May 24",
      student: "Noah Brown",
      status: "pending",
    },
  ]

  const availabilitySlots = [
    { id: 1, day: "Monday", startTime: "08:00 AM", endTime: "04:00 PM" },
    { id: 2, day: "Tuesday", startTime: "09:00 AM", endTime: "05:00 PM" },
    { id: 3, day: "Wednesday", startTime: "08:00 AM", endTime: "04:00 PM" },
    { id: 4, day: "Thursday", startTime: "09:00 AM", endTime: "05:00 PM" },
    { id: 5, day: "Friday", startTime: "08:00 AM", endTime: "03:00 PM" },
  ]

  return (
    <div className="schedule-container">
      <div className="schedule-content">
        <h1 className="schedule-title">Schedule Management</h1>

        <div className="schedule-layout">
          <div className="schedule-main">
            <Tabs defaultValue="upcoming" className="schedule-tabs">
              <TabsList className="schedule-tabs-list">
                <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
                <TabsTrigger value="demo">Demo Requests</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                <Card className="schedule-card">
                  <CardHeader className="schedule-card-header">
                    <div className="header-with-action">
                      <div>
                        <CardTitle>Upcoming Classes</CardTitle>
                        <CardDescription>Your scheduled classes for the upcoming week</CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="add-button">
                            <Plus className="button-icon" /> Add Class
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="dialog-content">
                          <DialogHeader>
                            <DialogTitle>Add New Class</DialogTitle>
                            <DialogDescription>Create a new class in your schedule</DialogDescription>
                          </DialogHeader>
                          <div className="form-fields">
                            <div className="form-field">
                              <Label htmlFor="class-title">Class Title</Label>
                              <Input id="class-title" placeholder="Enter class title" />
                            </div>
                            <div className="form-field">
                              <Label htmlFor="class-date">Date</Label>
                              <Input id="class-date" type="date" />
                            </div>
                            <div className="form-row">
                              <div className="form-field">
                                <Label htmlFor="start-time">Start Time</Label>
                                <Input id="start-time" type="time" />
                              </div>
                              <div className="form-field">
                                <Label htmlFor="end-time">End Time</Label>
                                <Input id="end-time" type="time" />
                              </div>
                            </div>
                            <div className="form-field">
                              <Label htmlFor="class-type">Class Type</Label>
                              <Select>
                                <SelectTrigger id="class-type">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="regular">Regular Class</SelectItem>
                                  <SelectItem value="demo">Demo Class</SelectItem>
                                  <SelectItem value="interview">Interview</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button>Save Class</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="classes-list">
                      {upcomingClasses.map((cls) => (
                        <div key={cls.id} className="class-item">
                          <div className="class-info">
                            <h3 className="class-title">{cls.title}</h3>
                            <div className="class-details">
                              <div className="class-detail">
                                <CalendarIcon className="detail-icon" />
                                <span>{cls.date}</span>
                              </div>
                              <div className="class-detail">
                                <Clock className="detail-icon" />
                                <span>{cls.time}</span>
                              </div>
                              <div className="class-detail">
                                <Users className="detail-icon" />
                                <span>{cls.students} students</span>
                              </div>
                            </div>
                          </div>
                          <div className="class-actions">
                            <Badge className="class-type-badge">{cls.type}</Badge>
                            <div className="action-buttons">
                              <Button variant="outline" size="sm">
                                Reschedule
                              </Button>
                              <Button variant="outline" size="sm">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="demo">
                <Card className="schedule-card">
                  <CardHeader>
                    <CardTitle>Demo Class Requests</CardTitle>
                    <CardDescription>Pending requests for demo classes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="demo-requests-list">
                      {demoRequests.map((request) => (
                        <div key={request.id} className="demo-request-item">
                          <div className="request-info">
                            <h3 className="request-title">{request.title}</h3>
                            <p className="request-student">Requested by: {request.student}</p>
                            <div className="request-details">
                              <div className="request-detail">
                                <CalendarIcon className="detail-icon" />
                                <span>{request.date}</span>
                              </div>
                              <div className="request-detail">
                                <Clock className="detail-icon" />
                                <span>{request.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="request-actions">
                            <Button className="accept-button" size="sm">
                              <Check className="action-icon" /> Accept
                            </Button>
                            <Button variant="outline" className="reject-button" size="sm">
                              <X className="action-icon" /> Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="availability">
                <Card className="schedule-card">
                  <CardHeader className="schedule-card-header">
                    <div className="header-with-action">
                      <div>
                        <CardTitle>Weekly Availability</CardTitle>
                        <CardDescription>Set your available time slots for classes</CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="add-button">
                            <Plus className="button-icon" /> Add Time Slot
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="dialog-content">
                          <DialogHeader>
                            <DialogTitle>Add Availability</DialogTitle>
                            <DialogDescription>Add a new time slot when you're available to teach</DialogDescription>
                          </DialogHeader>
                          <div className="form-fields">
                            <div className="form-field">
                              <Label htmlFor="day">Day of Week</Label>
                              <Select>
                                <SelectTrigger id="day">
                                  <SelectValue placeholder="Select day" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="monday">Monday</SelectItem>
                                  <SelectItem value="tuesday">Tuesday</SelectItem>
                                  <SelectItem value="wednesday">Wednesday</SelectItem>
                                  <SelectItem value="thursday">Thursday</SelectItem>
                                  <SelectItem value="friday">Friday</SelectItem>
                                  <SelectItem value="saturday">Saturday</SelectItem>
                                  <SelectItem value="sunday">Sunday</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="form-row">
                              <div className="form-field">
                                <Label htmlFor="start-time">Start Time</Label>
                                <Input id="start-time" type="time" />
                              </div>
                              <div className="form-field">
                                <Label htmlFor="end-time">End Time</Label>
                                <Input id="end-time" type="time" />
                              </div>
                            </div>
                            <div className="form-field">
                              <Label htmlFor="repeat">Repeat</Label>
                              <Select>
                                <SelectTrigger id="repeat">
                                  <SelectValue placeholder="Select repeat option" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                                  <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button>Save Availability</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="availability-list">
                      {availabilitySlots.map((slot) => (
                        <div key={slot.id} className="availability-item">
                          <div className="availability-day">{slot.day}</div>
                          <div className="availability-time">
                            <Clock className="time-icon" />
                            <span>{slot.startTime}</span>
                            <ArrowRight className="arrow-icon" />
                            <span>{slot.endTime}</span>
                          </div>
                          <div className="availability-actions">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="delete-button">
                              Delete
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

          <div className="schedule-sidebar">
            <Card className="calendar-card">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>View your schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar mode="single" selected={date} onSelect={setDate} className="calendar-component" />
              </CardContent>
              <CardFooter>
                <Button className="view-button">View Full Calendar</Button>
              </CardFooter>
            </Card>

            <Card className="tips-card">
              <CardHeader>
                <CardTitle>Schedule Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="tips-list">
                  <li className="tip-item">
                    <div className="tip-icon">💡</div>
                    <div className="tip-text">Block time for preparation before classes</div>
                  </li>
                  <li className="tip-item">
                    <div className="tip-icon">⏰</div>
                    <div className="tip-text">Schedule breaks between consecutive classes</div>
                  </li>
                  <li className="tip-item">
                    <div className="tip-icon">📝</div>
                    <div className="tip-text">Set aside time for student feedback</div>
                  </li>
                  <li className="tip-item">
                    <div className="tip-icon">🔄</div>
                    <div className="tip-text">Update your availability regularly</div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
