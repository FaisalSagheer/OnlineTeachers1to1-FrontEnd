"use client"

import { useState, useEffect, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Loader2, ArrowLeft, Search } from "lucide-react"
import { format } from "date-fns"
import useSWR from "swr"
import Cookies from "js-cookie"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import "@/app/parent/applyCourse/courseApp.css"
const fetcher = async (url) => {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` } })
  if (!res.ok) throw new Error("Failed to fetch data")
  return res.json()
}

const getAuthHeader = () => ({
  Authorization: `Bearer ${Cookies.get("accessToken")}`,
  "Content-Type": "application/json",
})

const formSchema = z.object({
  studentId: z.string().min(1, { message: "Please select a child." }),
  preferredDate: z.date({ required_error: "Please select a preferred date." }),
  additionalNotes: z.string().optional(),
})

export default function ApplyCourse() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const COURSES_PER_PAGE = 9 // Increased from 6 to 9 for better grid layout

  const { data: studentsData, error: studentsError } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students/`,
    fetcher,
  )
  const { data: userHomeData, error: coursesError } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-home/`,
    fetcher,
  )
  const { data: teachersData, error: teachersError } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teachers/`,
    fetcher,
  )

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { studentId: "", additionalNotes: "" },
  })

  const allCourses = useMemo(() => userHomeData?.courses || [], [userHomeData])
  const filteredCourses = useMemo(
    () => allCourses.filter((course) => course.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [allCourses, searchTerm],
  )

  const filteredTeachers = useMemo(() => {
    if (!selectedCourse || !teachersData || !Array.isArray(teachersData.teachers)) return []
    return teachersData.teachers.filter((teacher) =>
      teacher.subjects.some((subject) => selectedCourse.name.includes(subject.name)),
    )
  }, [selectedCourse, teachersData])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  async function onSubmit(data) {
    if (!selectedCourse || !selectedTeacher) {
      toast.error("Course or Teacher not selected. Please go back.")
      return
    }
    setIsSubmitting(true)
    const payload = {
      student_id: Number.parseInt(data.studentId, 10),
      course_id: selectedCourse.id,
      teacher_id: selectedTeacher.id,
      start_date: format(data.preferredDate, "yyyy-MM-dd"),
      note: data.additionalNotes || "",
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application/create/`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit application.")
      }

      toast.success("Application Submitted!", {
        description: `Your application for ${selectedCourse.name} has been received.`,
      })

      setTimeout(() => {
        router.push("/parent/dashboard")
      }, 1500)

      form.reset()
      setSelectedCourse(null)
      setSelectedTeacher(null)
    } catch (error) {
      toast.error("Submission Failed", { description: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- UI RENDERING ---

  // View 1: Course Selection Grid
  if (!selectedCourse) {
    const totalPages = Math.ceil(filteredCourses.length / COURSES_PER_PAGE)
    const currentCourses = filteredCourses.slice((currentPage - 1) * COURSES_PER_PAGE, currentPage * COURSES_PER_PAGE)

    return (
      <div className="course-application-wrapper">
        <div className="course-application-content">
          <div className="form-header">
            <h2 className="form-title">Step 1: Choose a Course</h2>
            <p className="form-subtitle">Select a course to begin the application.</p>
          </div>

          <div className="filter-bar">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <Input
                placeholder="Search for a course..."
                className="search-input form-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="course-grid">
            {currentCourses.map((course) => (
              <Card key={course.id} className="course-card" onClick={() => setSelectedCourse(course)}>
                <div className="course-image-container">
                  <Image
                    src={course.course_pic || "/placeholder.svg?height=300&width=400&query=educational course"}
                    alt={course.name}
                    width={400}
                    height={300}
                    className="course-image"
                  />
                </div>
                <CardHeader className="course-card-header">
                  <CardTitle className="course-card-title">{course.name}</CardTitle>
                  <CardDescription className="course-card-description">
                    {course.description || "A wonderful learning experience awaits your child."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="course-card-footer">
                  <Button className="select-button w-full">Select Course</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && userHomeData && (
            <div className="empty-message">
              <p>No courses match your search criteria.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination-controls">
              <Button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="lg"
              >
                Previous
              </Button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                size="lg"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // View 2: Teacher Selection Grid
  if (selectedCourse && !selectedTeacher) {
    return (
      <div className="course-application-wrapper">
        <div className="course-application-content">
          <div className="form-header">
            <button className="back-button" onClick={() => setSelectedCourse(null)}>
              <ArrowLeft size={18} /> Back to Courses
            </button>
            <h2 className="form-title">Step 2: Choose a Teacher for {selectedCourse.name}</h2>
            <p className="form-subtitle">These experienced teachers are available for the selected course.</p>
          </div>

          {teachersError && <p className="form-error text-center">Could not load teachers. Please try again.</p>}
          {!teachersData && !teachersError && (
            <p className="loading-message text-center">Loading available teachers...</p>
          )}

          <div className="teacher-grid">
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <Card key={teacher.id} className="teacher-card" onClick={() => setSelectedTeacher(teacher)}>
                  <div className="teacher-card-content">
                    <Image
                      src={teacher.profile_picture || "/placeholder.svg?height=120&width=120&query=teacher profile"}
                      alt={`${teacher.first_name} ${teacher.last_name}`}
                      width={120}
                      height={120}
                      className="teacher-avatar"
                    />
                    <div className="teacher-info">
                      <h4 className="teacher-name">{`${teacher.first_name} ${teacher.last_name}`}</h4>
                      <p className="teacher-experience">{teacher.experience} of experience</p>
                      <p className="teacher-bio">{teacher.biography.substring(0, 150)}...</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="empty-message">
                <p>No teachers are currently available for this course. Please try again later.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // View 3: Application Form
  return (
    <div className="course-application-wrapper">
      <div className="course-application-content">
        <div className="form-header">
          <button className="back-button" onClick={() => setSelectedTeacher(null)}>
            <ArrowLeft size={18} /> Back to Teacher Selection
          </button>
          <h2 className="form-title">Step 3: Finalize Application</h2>
          <p className="form-subtitle">
            You are applying for <strong>{selectedCourse.name}</strong> with{" "}
            <strong>{`${selectedTeacher.first_name} ${selectedTeacher.last_name}`}</strong>.
          </p>
        </div>

        <div className="form-container">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="form-grid">
              <div className="form-section">
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-label">SELECT CHILD</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="form-input">
                            <SelectValue placeholder="Select your child" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {studentsData?.map((student) => (
                            <SelectItem key={student.id} value={student.id.toString()}>
                              {student.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="form-error" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="form-section">
                <FormField
                  control={form.control}
                  name="preferredDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="form-label">PREFERRED START DATE</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "form-input w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Select a date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="form-error" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="form-section full-width">
                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-label">ADDITIONAL NOTES (OPTIONAL)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special requirements or notes for the teacher..."
                          className="form-textarea"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="form-actions">
                <Button
                  type="button"
                  variant="outline"
                  className="cancel-button bg-transparent"
                  size="lg"
                  onClick={() => {
                    setSelectedCourse(null)
                    setSelectedTeacher(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="submit-button" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
