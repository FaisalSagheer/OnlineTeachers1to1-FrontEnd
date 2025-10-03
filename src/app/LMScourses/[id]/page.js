"use client"
import Cookies from "js-cookie"
import { useState, useEffect } from "react"
import Image from "next/image"
import { FaBook, FaPhoneAlt, FaGlobe, FaWhatsapp } from "react-icons/fa"
import { IoMdTime } from "react-icons/io"
import { MdEmail } from "react-icons/md"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import BtnArrow from "../../image/btnarrow.svg"
import AboutSvg1 from "../../image/aboutsvg1.png"
import AboutSvg2 from "../../image/aboutsvg2.png"
import AboutSvg3 from "../../image/aboutsvg3.png"
import AboutSvg4 from "../../image/aboutsvg4.png"
import TeamImg from "../../image/team-01.webp"
import CourseImg1 from "../../image/course-img1.jpg"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation" // Added useRouter import for navigation

// Import CSS files
import "../../style.css"
import "../../aboutUs/aboutStyle.css"
import "../LMScourses.css"
import "./Coursedetails.css"
import "../../contactUs/contactusStyle.css"
import "./course-tabs.css"

// Category mapping for display
const categoryLabels = {
  "Early years school": "Early Years School",
  "Primary Schooling": "Primary Schooling",
  Sports: "Sports",
  "IT Skills Training": "IT Skills Training",
  "Media & Marketing skills Training": "Media & Marketing Skills Training",
  "STEM School": "STEM School",
  "Religious Eduction": "Religious Education",
  "Upper Secondary Schooling": "Upper Secondary Schooling",
  "Creative Skill Learning": "Creative Skill Learning",
  "Lower Secondary Schoolling": "Lower Secondary Schooling",
  Uncategorized: "Uncategorized",
}

// Grade level options (not directly used for display, but kept as per original)
const gradeOptions = [
  { value: "all", label: "All Grades" },
  { value: "early years", label: "Early Years" },
  { value: "grade 1", label: "Grade 1" },
  { value: "grade 2", label: "Grade 2" },
  { value: "grade 3", label: "Grade 3" },
  { value: "grade 7", label: "Grade 7" },
  // Add other grades if your API might return them
]

export default function CourseDetails() {
  const params = useParams()
  const courseId = params.id
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [teachers, setTeachers] = useState([])
  const router = useRouter() // Added router for navigation

  const handleApplyClick = () => {
    // Added handleApplyClick function for authentication check
    const token = Cookies.get("accessToken")
    if (token) {
      router.push("/application")
    } else {
      router.push("/login")
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) {
        setError("Course ID not found.")
        setLoading(false)
        return
      }

      setLoading(true)
      const token = Cookies.get("accessToken")
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL

      if (!baseUrl) {
        setError("Backend URL not configured")
        setLoading(false)
        return
      }

      try {
        const apiEndpoint = token ? `${baseUrl}/api/user-home/` : `${baseUrl}/api/home/`
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        console.log("Fetching from:", apiEndpoint)
        const response = await fetch(apiEndpoint, {
          method: "GET",
          headers,
        })

        if (!response.ok) {
          throw new Error(`API fetch failed: ${response.status}`)
        }

        const data = await response.json()
        console.log("Fetched data from backend:", data)

        const foundCourse = data.courses?.find((c) => c.id.toString() === courseId.toString())

        if (!foundCourse) {
          setError("Course not found.")
          setLoading(false)
          return
        }

        const mappedCourse = {
          course_name: foundCourse.name || "Course Name Not Available",
          course_description: foundCourse.description || "No description available.",
          course_duration: foundCourse.duration || "N/A",
          curriculum: foundCourse.curriculum,
          category: foundCourse.category || "Uncategorized",
          course_pic: foundCourse.course_pic,
          teacher_details: {},
          grade: foundCourse.grade || "N/A",
          lessons_count: foundCourse.lessons_count || "N/A",
          quizzes_count: foundCourse.quizzes_count || "N/A",
          course_available_slots: foundCourse.course_available_slots || "N/A",
        }

        if (Array.isArray(foundCourse.teachers)) {
          foundCourse.teachers.forEach((teacher) => {
            mappedCourse.teacher_details[teacher.id] = {
              id: teacher.id,
              first_name: teacher.first_name,
              last_name: teacher.last_name,
              profile_picture: teacher.profile_picture,
              biography: teacher.biography,
              qualifications: teacher.qualifications,
              experience: teacher.experience,
              skills: teacher.skills,
              availability: teacher.availability,
              rating: teacher.rating,
              status: teacher.status,
              feedback_count: teacher.feedback_count,
            }
          })
        }

        setCourse(mappedCourse)
        setTeachers(data.teachers || [])
      } catch (error) {
        console.error("Failed to fetch course details:", error)
        setError("Failed to load course details.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId])

  if (loading) {
    return (
      <>
        <div className="flex h-screen items-center justify-center">
          <h2 className="text-2xl">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-dashed border-[#fc800a]"></div>
          </h2>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <div className="flex h-screen items-center justify-center">
          <h2 className="text-2xl text-red-600">{error}</h2>
        </div>
      </>
    )
  }

  if (!course) {
    return (
      <>
        <div className="flex h-screen items-center justify-center">
          <h2 className="text-2xl text-red-600">Course not found.</h2>
        </div>
      </>
    )
  }

  // Safely access the first teacher's details if available
  const firstTeacherId = Object.keys(course.teacher_details)[0]
  const instructor = course.teacher_details[firstTeacherId]

  return (
    <>
      <section className="SectionSixLMS flex flex-col flex-wrap gap-28 px-32 pt-32 max-md:px-4">
        <div className="flex gap-6 max-lg:flex-wrap">
          <div className="courseSingaImg1div overflow-hidden">
            <Image
              src={course.course_pic || course.course_pic || CourseImg1}
              alt={course.course_name || "Course Image"}
              className="courseSingalImg1"
              width={800}
              height={500}
              onError={(e) => (e.target.src = "/placeholder.svg")}
            />
          </div>
          <div className="courseSingalDiv flex flex-col justify-center">
            <div className="flex flex-col gap-3">
              <h2>{course.course_name}</h2>
              {course.course_description && <p>{course.course_description}</p>}
              {course.category && <p>{categoryLabels[course.category] || course.category}</p>}
            </div>
            <div className="flex items-center gap-3 pt-8 max-lg:pt-2">
              <button onClick={handleApplyClick} className="coursebtn flex items-center gap-2">
                Apply{" "}
                <Image
                  className="coubtnArrow"
                  src={BtnArrow || "/placeholder.svg"}
                  alt="Btn Arrow"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-12 flex-col lg:flex-row">
          <Tabs defaultValue="about" className="tabsabout">
            <TabsList className="tabs-list">
              <TabsTrigger value="about" className="tab-trigger">
                About
              </TabsTrigger>
              <TabsTrigger value="duration" className="tab-trigger">
                Duration
              </TabsTrigger>
              <TabsTrigger value="instructors" className="tab-trigger">
                Instructors
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about">
              <div className="aboutSingaltab flex flex-col gap-3">
                <h2>{course.course_name || "Course Name Not Available"}</h2>
                <p>{course.course_description || "No description available."}</p>
                <div className="aboutSvgContent mt-8 flex flex-col gap-14">
                  <div className="aboutContentBox1 flex flex-wrap justify-start gap-4">
                    <div className="aboutContentBox flex items-center gap-4 text-left">
                      <Image
                        src={AboutSvg1 || "/placeholder.svg"}
                        alt="Child Friendly Environment"
                        className="aboutsvg1"
                        width={50}
                        height={50}
                      />
                      <h3>Child Friendly Environment</h3>
                    </div>
                    <div className="aboutContentBox flex items-center gap-4 text-left">
                      <Image
                        src={AboutSvg2 || "/placeholder.svg"}
                        alt="Real-Time Education"
                        className="aboutsvg2"
                        width={50}
                        height={50}
                      />
                      <h3>Real-Time Education</h3>
                    </div>
                  </div>
                  <div className="aboutContentBox1 flex flex-wrap justify-start gap-4">
                    <div className="aboutContentBox flex items-center gap-4 text-left">
                      <Image
                        src={AboutSvg3 || "/placeholder.svg"}
                        alt="Well-Built Infrastructure"
                        className="aboutsvg3"
                        width={50}
                        height={50}
                      />
                      <h3>Well-Built Infrastructure</h3>
                    </div>
                    <div className="aboutContentBox flex items-center gap-4 text-left">
                      <Image
                        src={AboutSvg4 || "/placeholder.svg"}
                        alt="Professional Staff Members"
                        className="aboutsvg4"
                        width={50}
                        height={50}
                      />
                      <h3>Professional Staff Members</h3>
                    </div>
                  </div>
                  <div className="aboutContentBox1 flex flex-wrap justify-start gap-4">
                    <div className="aboutContentBox flex items-center gap-4 text-left">
                      <Image
                        src={AboutSvg4 || "/placeholder.svg"}
                        alt="Professional Staff Members"
                        className="aboutsvg5"
                        width={50}
                        height={50}
                      />
                      <h3>Professional Staff Members</h3>
                    </div>
                    <div className="aboutContentBox flex items-center gap-4 text-left">
                      <Image
                        src={AboutSvg4 || "/placeholder.svg"}
                        alt="Professional Staff Members"
                        className="aboutsvg6"
                        width={50}
                        height={50}
                      />
                      <h3>Professional Staff Members</h3>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="duration">
              <div className="flex flex-col gap-5">
                <div className="curriculumtapContent flex justify-between max-sm:flex-wrap max-sm:gap-4">
                  <div className="flex items-center gap-2">
                    <h4>Preview</h4>
                    <IoMdTime className="h-5 w-5" />
                    <h5>Duration : {course.course_duration}</h5>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="instructors">
              <div className="instructors-container">
                <div className="instructors-scroll-container">
                  <div className="instructors-list">
                    {Object.values(course.teacher_details).map((teacher) => (
                      <div key={teacher.id} className="instructor-card">
                        {/* Profile Picture */}
                        <div className="instructor-image-container">
                          <Image
                            src={teacher.profile_picture || TeamImg}
                            alt={`Profile of ${teacher.first_name} ${teacher.last_name}`}
                            className="instructor-image"
                            fill
                            sizes="128px"
                          />
                        </div>

                        {/* Instructor Info */}
                        <div className="instructor-info">
                          <h1 className="instructor-name">
                            {teacher.first_name} {teacher.last_name}
                          </h1>

                          {teacher.status && <p className="instructor-status">{teacher.status}</p>}

                          <div className="instructor-details">
                            {teacher.qualifications && (
                              <p>
                                <span className="detail-label">Qualifications:</span>{" "}
                                <span className="detail-value">{teacher.qualifications}</span>
                              </p>
                            )}

                            {teacher.experience && (
                              <p>
                                <span className="detail-label">Experience:</span>{" "}
                                <span className="detail-value">{teacher.experience}</span>
                              </p>
                            )}

                            {teacher.rating && teacher.rating !== "0.00" && (
                              <p>
                                <span className="detail-label">Rating:</span>{" "}
                                <span className="detail-value">{teacher.rating}</span>
                              </p>
                            )}

                            {teacher.feedback_count !== undefined && (
                              <p>
                                <span className="detail-label">Feedback Count:</span>{" "}
                                <span className="detail-value">{teacher.feedback_count}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {Object.keys(course.teacher_details).length === 0 && (
                  <p className="no-instructors-message">No specific instructors found for this course.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
          <div className="singaltabsideMainDiv flex flex-col gap-6">
            <h2>Course Info</h2>
            <div className="singaltabside flex flex-col flex-nowrap whitespace-nowrap">
              <div className="singaltabsideInnerDiv flex gap-3">
                <h3>Categories : </h3>
                <p>{categoryLabels[course.category] || course.category}</p>
              </div>
              <div className="singaltabsideInnerDiv flex gap-3">
                <h3>Grade Level : </h3>
                <p>{course.grade && course.grade.toLowerCase() !== "nan" ? course.grade : "N/A"}</p>
              </div>
              <div className="singaltabsideInnerDiv flex gap-3">
                <h3>Lessons : </h3>
                <p>{course.lessons_count || "N/A"}</p>
              </div>
              <div className="singaltabsideInnerDiv flex gap-3">
                <h3>Quizzes : </h3>
                <p>{course.quizzes_count || "N/A"}</p>
              </div>
              <div className="singaltabsideInnerDiv flex gap-3">
                <h3>Duration : </h3>
                <p>{course.course_duration || "N/A"}</p>
                
              </div>
              <div className="singaltabsideInnerDiv flex gap-3">
                <h3>Capacity :</h3>
                <p>{course.course_available_slots || "N/A"}</p>
              </div>
            </div>

            <div className="singaltabside2 mb-7 flex flex-col flex-nowrap whitespace-nowrap">
              <h2>Contact us</h2>
              <div className="singaltabsideInnerDiv flex gap-3">
                <MdEmail />
                <p>support@onlineteachers1to1.com</p>
              </div>  
              <div className="singaltabsideInnerDiv flex gap-3">
                <FaPhoneAlt />
                <p>Oman: (+968) 2114 2250</p>
              </div>
               <div className="singaltabsideInnerDiv flex gap-3">
                <FaWhatsapp />
                <p>Oman: (+968) 9428 2781</p>
              </div>
              <div className="singaltabsideInnerDiv flex gap-3">
                <FaGlobe />
                <p>www.onlineteachers1to1.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

