"use client"
import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import "@/app/aboutUs/aboutStyle.css"
import "./view.css" // Import the custom CSS file
import Footer from "@/app/components/footer"
import Header from "@/app/components/header"
import CloudImg from "@/app/image/cloudimg.png"
import FooterCloudImg from "@/app/image/Footer-cloud-img.png"
import TeacherBanner from "./teachersBanner"

const TeacherModal = ({ teacher, isOpen, onClose }) => {
  if (!isOpen || !teacher) return null

  const uniqueSubjects =
    teacher.subjects && Array.isArray(teacher.subjects)
      ? [...new Set(teacher.subjects.map((subject) => subject.name))]
      : []

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <Image
            src={teacher.profile_picture || "/placeholder.svg?height=200&width=200&query=teacher profile"}
            alt={`Profile of ${teacher.first_name}`}
            width={200}
            height={200}
            className="modal-teacher-photo"
          />
          <div className="modal-teacher-info">
            <h2 className="modal-teacher-name">
              {teacher.first_name || "N/A"} {teacher.last_name || ""}
            </h2>
            <div className="modal-teacher-status">
              <span className={`status-badge ${teacher.status?.toLowerCase()}`}>{teacher.status || "N/A"}</span>
              <div className="rating">
                <span className="rating-value">★ {teacher.rating || "0.00"}</span>
                <span className="feedback-count">({teacher.feedback_count || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h3>Experience</h3>
            <p>{teacher.experience || "N/A"}</p>
          </div>

          <div className="detail-section">
            <h3>Subjects</h3>
            <div className="subjects-list">
              {uniqueSubjects.length > 0 ? (
                uniqueSubjects.map((subject, index) => (
                  <span key={index} className="subject-tag">
                    {subject}
                  </span>
                ))
              ) : (
                <p>No subjects listed</p>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h3>Biography</h3>
            <p>{teacher.biography || "No biography available"}</p>
          </div>

          <div className="detail-section">
            <h3>Qualifications</h3>
            <p>{teacher.qualifications || "No qualifications listed"}</p>
          </div>

          <div className="detail-section">
            <h3>Availability</h3>
            <p>
              {teacher.availability && teacher.availability !== "nan"
                ? teacher.availability
                : "Contact for availability"}
            </p>
          </div>

          {teacher.skills && teacher.skills.length > 0 && (
            <div className="detail-section">
              <h3>Skills</h3>
              <div className="skills-list">
                {teacher.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <Button  className="contact-btn" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

const TeacherCard = ({ teacher, onViewProfile }) => (
  <div className="teacher-card">
    <Image
      src={teacher.profile_picture || "/placeholder.svg?height=280&width=300&query=teacher profile"}
      alt={`Profile of ${teacher.first_name}`}
      width={300}
      height={280}
      className="teacher-photo"
    />
    <div className="teacher-card-header">
      <h3 className="teacher-name">
        {teacher.first_name || "N/A"} {teacher.last_name || ""}
      </h3>
      <div className="teacher-details">
        <div>
          <strong>Subject:</strong>{" "}
          {teacher.subjects && Array.isArray(teacher.subjects) && teacher.subjects.length > 0
            ? [...new Set(teacher.subjects.map((subject) => subject.name))].join(", ")
            : "N/A"}
        </div>
        <div>
          <strong>Experience:</strong> {teacher.experience || "N/A"}
        </div>
      </div>
    </div>
    <div className="teacher-card-content">
      <Button className="view-profile-btn" onClick={() => onViewProfile(teacher)}>
        View Profile
      </Button>
    </div>
  </div>
)

const fetcher = (url) => {
  console.log("Fetching from URL:", url) // Debug log
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    return res.json()
  })
}

export default function TeachersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [teachersPerPage] = useState(6) 
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://onlineteachers1to1.com"
  const apiUrl = `${backendUrl}/api/teachers/`

  const { data: allTeachers, error, isLoading } = useSWR(apiUrl, fetcher)

  const handleViewProfile = (teacher) => {
    setSelectedTeacher(teacher)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTeacher(null)
  }

  const teachersToDisplay = (() => {
    if (!allTeachers) return []

    // If allTeachers is already an array, use it
    if (Array.isArray(allTeachers)) return allTeachers

    // If allTeachers has a teachers property that's an array, use that
    if (allTeachers.teachers && Array.isArray(allTeachers.teachers)) return allTeachers.teachers

    // If allTeachers has a data property that's an array, use that
    if (allTeachers.data && Array.isArray(allTeachers.data)) return allTeachers.data

    // Fallback to empty array
    return []
  })()

  // Get current teachers for the page
  const indexOfLastTeacher = currentPage * teachersPerPage
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage
  const currentTeachers = teachersToDisplay.slice(indexOfFirstTeacher, indexOfLastTeacher)

  // Calculate total pages
  const totalPages = Math.ceil(teachersToDisplay.length / teachersPerPage)

  // Change page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <>
      <Header />
      <section>
        <Image
          src={CloudImg || "/placeholder.svg?height=100&width=100&query=cloud image"}
          className="cloudImgabout"
          alt="Cloud Img"
        />
      </section>
      <TeacherBanner />
      <div className="teachers-page-container">
        {isLoading && <div className="info-message">Loading Tutors...</div>}
        {error && <div className="error-message">Error: {error.message} (Please check your API route)</div>}
        {!isLoading && teachersToDisplay.length === 0 && !error && (
          <div className="info-message">No teachers found.</div>
        )}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7 lg:mb-5">
          {currentTeachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} onViewProfile={handleViewProfile} />
          ))}
        </main>
        {/* Pagination Controls */}
        {!isLoading && teachersToDisplay.length > teachersPerPage && (
          <div className="pagination-container">
            <button onClick={goToPreviousPage} disabled={currentPage === 1} className="pagination-button">
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={goToNextPage} disabled={currentPage === totalPages} className="pagination-button">
              Next
            </button>
          </div>
        )}
      </div>
      <div className="FooterCloudImgDiv">
        <Image
          src={FooterCloudImg || "/placeholder.svg?height=100&width=100&query=footer cloud image"}
          alt="FooterCloudImg"
          className="FooterCloudImg"
        />
      </div>
      <Footer />

      <TeacherModal teacher={selectedTeacher} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}
