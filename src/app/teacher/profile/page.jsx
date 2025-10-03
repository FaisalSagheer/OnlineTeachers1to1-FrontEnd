"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card , CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs , TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar , AvatarFallback, AvatarImage, } from "@/components/ui/avatar"
import {
  Facebook, Instagram, Linkedin, Twitter, Upload, Plus, X
} from "lucide-react"
import "./profile.css"

export default function ProfileManagement() {
  const [skills, setSkills] = useState(["Mathematics", "Science", "Reading", "Writing", "Critical Thinking"])
  const [newSkill, setNewSkill] = useState("")
  const [firstName, setFirstName] = useState("John")
  const [lastName, setLastName] = useState("Doe")
  const [role, setRole] = useState("Mathematics Teacher")
  const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg?height=200&width=200")

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill])
      setNewSkill("")
    }
  }

   const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setAvatarUrl(imageUrl)
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <h1 className="profile-title">Profile Management</h1>

        <div className="profile-layout">
          <div className="profile-sidebar">
            <Card className="profile-card">
              <CardContent className="profile-preview">
                <div className="avatar-container">
                  <Avatar className="profile-avatar">
                    <AvatarImage src={avatarUrl} alt="Profile" />
                    <AvatarFallback>{(firstName[0] ?? "") + (lastName[0] ?? "")}</AvatarFallback>
                  </Avatar>
                  <label className="upload-button">
                    <Upload className="button-icon" />
                    Change
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      hidden
                    />
                  </label>
                </div>
                <div className="profile-info">
                  <h2 className="profile-name">{firstName} {lastName}</h2>
                  <p className="profile-role">{role}</p>
                  <div className="profile-stats">
                    <div className="stat-item">
                      <span className="stat-value">4.9</span>
                      <span className="stat-label">Rating</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">3</span>
                      <span className="stat-label">Courses</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">45</span>
                      <span className="stat-label">Students</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="social-card">
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Connect your social profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="social-links">
                  {[
                    { icon: Facebook, name: "Facebook", connected: false },
                    { icon: Twitter, name: "Twitter", connected: true },
                    { icon: Instagram, name: "Instagram", connected: false },
                    { icon: Linkedin, name: "Linkedin", connected: true },
                  ].map(({ icon: Icon, name, connected }) => (
                    <div className="social-link" key={name}>
                      <div className={`social-icon ${name.toLowerCase()}`}>
                        <Icon size={18} />
                      </div>
                      <span className="social-name">{name}</span>
                      <Button variant="ghost" size="sm" className={`social-connect-btn ${connected ? "connected" : ""}`}>
                        {connected ? "Connected" : "Connect"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="profile-main">
            <Tabs defaultValue="personal" className="profile-tabs">
              <TabsList className="profile-tabs-list">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="experience">Experience & Skills</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card className="form-card">
                  <CardHeader>
                    <CardTitle className="font-bold text-2xl">Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="form-grid">
                      <div className="form-field">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" />
                      </div>
                      <div className="form-field">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" defaultValue="+1 (555) 123-4567" />
                      </div>
                      <div className="form-field full-width">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          rows={5}
                          defaultValue="Experienced mathematics teacher with over 10 years of teaching experience. Specialized in making complex concepts easy to understand for students of all ages."
                        />
                      </div>
                      <div className="form-field">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" defaultValue="New York, NY" />
                      </div>
                      <div className="form-field">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" defaultValue="https://johndoe-teacher.com" />
                      </div>
                      <div className="form-field full-width">
                        <Label htmlFor="role">Role</Label>
                        <Input
                          id="role"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
                 
                  <TabsContent value="experience">
                <Card className="form-card">
                  <CardHeader>
                    <CardTitle>Experience & Skills</CardTitle>
                    <CardDescription>Add your teaching experience and skills</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="form-section">
                      <h3 className="section-title">Education</h3>
                      <div className="form-grid">
                        <div className="form-field">
                          <Label htmlFor="degree">Degree</Label>
                          <Input id="degree" defaultValue="Master of Education" />
                        </div>
                        <div className="form-field">
                          <Label htmlFor="institution">Institution</Label>
                          <Input id="institution" defaultValue="Columbia University" />
                        </div>
                        <div className="form-field">
                          <Label htmlFor="year">Year</Label>
                          <Input id="year" defaultValue="2015" />
                        </div>
                        <div className="form-field">
                          <Label htmlFor="field">Field of Study</Label>
                          <Input id="field" defaultValue="Mathematics Education" />
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h3 className="section-title">Work Experience</h3>
                      <div className="form-grid">
                        <div className="form-field">
                          <Label htmlFor="position">Position</Label>
                          <Input id="position" defaultValue="Senior Mathematics Teacher" />
                        </div>
                        <div className="form-field">
                          <Label htmlFor="company">School/Institution</Label>
                          <Input id="company" defaultValue="Westfield High School" />
                        </div>
                        <div className="form-field">
                          <Label htmlFor="start-date">Start Date</Label>
                          <Input id="start-date" type="date" defaultValue="2018-09-01" />
                        </div>
                        <div className="form-field">
                          <Label htmlFor="end-date">End Date</Label>
                          <Input id="end-date" type="date" defaultValue="2023-06-30" />
                        </div>
                        <div className="form-field full-width">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            rows={3}
                            defaultValue="Taught advanced mathematics to high school students. Developed curriculum and assessment materials. Mentored new teachers."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h3 className="section-title">Skills</h3>
                      <div className="skills-container">
                        <div className="skills-input">
                          <Input
                            placeholder="Add a skill"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addSkill()}
                          />
                          <Button type="button" onClick={addSkill} className="add-skill-button">
                            <Plus size={16} />
                          </Button>
                        </div>
                        <div className="skills-list">
                          {skills.map((skill) => (
                            <Badge key={skill} className="skill-badge">
                              {skill}
                              <button
                                className="remove-skill"
                                onClick={() => removeSkill(skill)}
                                aria-label={`Remove ${skill} skill`}
                              >
                                <X size={14} />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="preferences">
                <Card className="form-card">
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="form-section">
                      <h3 className="section-title">Availability</h3>
                      <div className="availability-settings">
                        <div className="availability-item">
                          <div>
                            <h4 className="availability-day">Monday</h4>
                            <p className="availability-time">9:00 AM - 5:00 PM</p>
                          </div>
                          <div className="availability-toggle">
                            <Switch id="monday" defaultChecked />
                          </div>
                        </div>
                        <div className="availability-item">
                          <div>
                            <h4 className="availability-day">Tuesday</h4>
                            <p className="availability-time">9:00 AM - 5:00 PM</p>
                          </div>
                          <div className="availability-toggle">
                            <Switch id="tuesday" defaultChecked />
                          </div>
                        </div>
                        <div className="availability-item">
                          <div>
                            <h4 className="availability-day">Wednesday</h4>
                            <p className="availability-time">9:00 AM - 5:00 PM</p>
                          </div>
                          <div className="availability-toggle">
                            <Switch id="wednesday" defaultChecked />
                          </div>
                        </div>
                        <div className="availability-item">
                          <div>
                            <h4 className="availability-day">Thursday</h4>
                            <p className="availability-time">9:00 AM - 5:00 PM</p>
                          </div>
                          <div className="availability-toggle">
                            <Switch id="thursday" defaultChecked />
                          </div>
                        </div>
                        <div className="availability-item">
                          <div>
                            <h4 className="availability-day">Friday</h4>
                            <p className="availability-time">9:00 AM - 3:00 PM</p>
                          </div>
                          <div className="availability-toggle">
                            <Switch id="friday" defaultChecked />
                          </div>
                        </div>
                        <div className="availability-item">
                          <div>
                            <h4 className="availability-day">Saturday</h4>
                            <p className="availability-time">Not Available</p>
                          </div>
                          <div className="availability-toggle">
                            <Switch id="saturday" />
                          </div>
                        </div>
                        <div className="availability-item">
                          <div>
                            <h4 className="availability-day">Sunday</h4>
                            <p className="availability-time">Not Available</p>
                          </div>
                          <div className="availability-toggle">
                            <Switch id="sunday" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h3 className="section-title">Notification Preferences</h3>
                      <div className="notification-settings">
                        <div className="notification-item">
                          <div>
                            <h4 className="notification-type">Email Notifications</h4>
                            <p className="notification-desc">Receive email notifications for new bookings</p>
                          </div>
                          <div className="notification-toggle">
                            <Switch id="email-notifications" defaultChecked />
                          </div>
                        </div>
                        <div className="notification-item">
                          <div>
                            <h4 className="notification-type">SMS Notifications</h4>
                            <p className="notification-desc">Receive SMS alerts for upcoming classes</p>
                          </div>
                          <div className="notification-toggle">
                            <Switch id="sms-notifications" defaultChecked />
                          </div>
                        </div>
                        <div className="notification-item">
                          <div>
                            <h4 className="notification-type">Marketing Emails</h4>
                            <p className="notification-desc">Receive promotional emails and updates</p>
                          </div>
                          <div className="notification-toggle">
                            <Switch id="marketing-emails" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
