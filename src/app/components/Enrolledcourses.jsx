"use client"
import { useEffect, useRef, useState } from "react"
import { BookOpen, Clock, User, ExternalLink, MessageSquare, TrendingUp } from "lucide-react"
import "@/app/style.css"

export default function EnrolledCourses() {
  const headingRef = useRef(null)
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.style.transform = "translateY(-10px)"
      headingRef.current.style.opacity = "0.4"
      
      const animation = headingRef.current.animate([
        { transform: "translateY(-10px)", opacity: "0.4" },
        { transform: "translateY(0)", opacity: "1" }
      ], {
        duration: 1000,
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        fill: "forwards"
      })
    }
  }, [])

  const courses = [
    {
      name: "Mathematics",
      grade: "Grade 10",
      teacher: "Mr. Ahmed Khan",
      schedule: "Mon & Wed, 10:00 AM",
      attendance: 95,
      theme: "blue",
      link: "https://zoom.us/class1",
    },
    {
      name: "Physics",
      grade: "Grade 11", 
      teacher: "Ms. Sara Ali",
      schedule: "Tue & Thu, 12:00 PM",
      attendance: 88,
      theme: "purple",
      link: "https://zoom.us/class2",
    },
  ]

  return (
    <div className="enrolled-courses">
      <div ref={headingRef} className="section-header">
        <div className="header-icon">
          <BookOpen size={20} />
        </div>
        <h2 className="section-title">Enrolled Courses</h2>
      </div>

      <div className="courses-grid">
        {courses.map((course, idx) => (
          <div
            key={idx}
            className={`course-card ${course.theme} ${hoveredCard === idx ? "hovered" : ""}`}
            onMouseEnter={() => setHoveredCard(idx)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="card-accent"></div>

            <div className="card-header">
              <div className="course-title-section">
                <h3 className="course-title">{course.name}</h3>
                <span className="course-grade">{course.grade}</span>
              </div>
              <div className="status-badge">Active</div>
            </div>

            <div className="course-details">
              <div className="detail-item">
                <User size={16} />
                <span>{course.teacher}</span>
              </div>
              <div className="detail-item">
                <Clock size={16} />
                <span>{course.schedule}</span>
              </div>
            </div>

            <div className="attendance-section">
              <div className="attendance-label">
                <TrendingUp size={16} />
                <span>Attendance</span>
              </div>
              <span className={`attendance-value ${course.attendance >= 90 ? 'high' : 'medium'}`}>
                {course.attendance}%
              </span>
            </div>

            <div className="card-actions">
              <a
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                className="join-button"
              >
                <ExternalLink size={16} />
                Join Class
              </a>
              <button className="feedback-button">
                <MessageSquare size={16} />
                <span className="feedback-text">Feedback</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="progress-footer">
        <div className="progress-info">
          <p className="progress-label">Overall Progress</p>
          <p className="progress-value">92% Average Attendance</p>
        </div>
        <button className="view-all-button">View All Courses</button>
      </div>
    </div>
  )
}