"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { mutate } from "swr"
import Cookies from "js-cookie"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Calendar, GraduationCap, Mail, Lock, BrainCircuit } from "lucide-react"
import "@/app/style.css"

export default function ChildRegistrationForm() {
  const router = useRouter()
  // 1. Added 'gender' to the initial student state
  const [students, setStudents] = useState([{ fullName: "", dob: "", grade: "", learningStyle: "", gender: "", email: "", password: "" }])
  const [errors, setErrors] = useState([{}])
  const [touched, setTouched] = useState([{}])

  const grades = [
    "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", 
    "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", 
    "10th Grade", "11th Grade", "12th Grade",
  ]
  const learningStyles = ["Visual", "Auditory", "Kinesthetic", "Reading/Writing"]
  const genders = ["Male", "Female"] // Genders array for the dropdown

  const validateStudent = (student) => {
    const newErrors = {}
    if (!student.fullName?.trim()) newErrors.fullName = "Full name is required"
    if (!student.dob) newErrors.dob = "Date of birth is required"
    if (!student.grade) newErrors.grade = "Grade selection is required"
    if (!student.learningStyle) newErrors.learningStyle = "Learning style is required"
    // 2. Added validation for gender
    if (!student.gender) newErrors.gender = "Gender is required"
    if (student.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    return newErrors
  }

  const handleInputChange = (index, field, value) => {
    const updatedStudents = [...students]
    updatedStudents[index] = { ...updatedStudents[index], [field]: value }
    setStudents(updatedStudents)

    if (errors[index]?.[field]) {
      const updatedErrors = [...errors]
      updatedErrors[index] = { ...updatedErrors[index] }
      delete updatedErrors[index][field]
      setErrors(updatedErrors)
    }
  }

  const handleBlur = (index, field) => {
    const updatedTouched = [...touched]
    updatedTouched[index] = { ...updatedTouched[index], [field]: true }
    setTouched(updatedTouched)

    const studentErrors = validateStudent(students[index])
    const updatedErrors = [...errors]
    updatedErrors[index] = { ...updatedErrors[index] }

    if (studentErrors[field]) {
      updatedErrors[index][field] = studentErrors[field]
    } else {
      delete updatedErrors[index][field]
    }
    setErrors(updatedErrors)
  }

  const handleSave = async (index) => {
    const student = students[index]
    const studentErrors = validateStudent(student)

    if (Object.keys(studentErrors).length > 0) {
      setErrors(prev => ({ ...prev, [index]: studentErrors }))
      return
    }

    const token = Cookies.get("accessToken")
    const userData = JSON.parse(Cookies.get("userData") || "{}")
    const parentId = userData?.id

    if (!token || !parentId) {
      alert("Authentication error. Please log in again.")
      return
    }

    // 3. Added 'gender' to the payload sent to the backend
    const payload = {
      full_name: student.fullName,
      date_of_birth: student.dob,
      grade: student.grade,
      learning_style: student.learningStyle,
      gender: student.gender,
      email: student.email,
      password: student.password,
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-student/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to save student")
      }

      alert("Student saved successfully!")
      
      const studentListKey = [`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/view-students-parent/`, token]
      mutate(studentListKey)
      
      router.push("/parent/profile") 

    } catch (error) {
      console.error("Error saving student:", error)
      alert(`Error saving student: ${error.message}`)
    }
  }

  const addAnotherStudent = () => {
    setStudents([...students, { fullName: "", dob: "", grade: "", learningStyle: "", gender: "", email: "", password: "" }])
    setErrors([...errors, {}])
    setTouched([...touched, {}])
  }

  return (
    <div className="registration-container">
      <div className="forms-container">
        {students.map((student, index) => (
          <Card key={index} className="student-card">
            <CardHeader className="card-header">
              <div className="header-overlay"></div>
              <CardTitle className="card-title">
                <GraduationCap className="icon-large" />
                {`Student ${index + 1}`}
              </CardTitle>
            </CardHeader>

            <CardContent className="card-content">
              <div className="form-fields">
                <div className="form-grid">
                  {/* Full Name */}
                  <div className="field-full-width">
                    <Label htmlFor={`fullName-${index}`} className="field-label"><User className="field-icon" />Full Name<span className="required-mark">*</span></Label>
                    <Input id={`fullName-${index}`} placeholder="Enter student's full name" value={student.fullName || ""} onChange={(e) => handleInputChange(index, "fullName", e.target.value)} onBlur={() => handleBlur(index, "fullName")} className={`form-input ${errors[index]?.fullName && touched[index]?.fullName ? "input-error" : ""}`}/>
                    {errors[index]?.fullName && touched[index]?.fullName && (<p className="error-message">{errors[index].fullName}</p>)}
                  </div>

                  {/* Date of Birth */}
                  <div className="field-half-width">
                    <Label htmlFor={`dob-${index}`} className="field-label"><Calendar className="field-icon" />Date of Birth<span className="required-mark">*</span></Label>
                    <Input id={`dob-${index}`} type="date" value={student.dob || ""} onChange={(e) => handleInputChange(index, "dob", e.target.value)} onBlur={() => handleBlur(index, "dob")} className={`form-input ${errors[index]?.dob && touched[index]?.dob ? "input-error" : ""}`}/>
                    {errors[index]?.dob && touched[index]?.dob && <p className="error-message">{errors[index].dob}</p>}
                  </div>
                  
                  {/* 4. Added Gender Select to the form */}
                  <div className="field-half-width">
                    <Label htmlFor={`gender-${index}`} className="field-label"><User className="field-icon" />Gender<span className="required-mark">*</span></Label>
                    <Select value={student.gender || ""} onValueChange={(value) => handleInputChange(index, "gender", value)}>
                      <SelectTrigger className={`form-select ${errors[index]?.gender && touched[index]?.gender ? "input-error" : ""}`} onBlur={() => handleBlur(index, "gender")}><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent className="select-content">{genders.map((gender) => (<SelectItem key={gender} value={gender} className="select-item">{gender}</SelectItem>))}</SelectContent>
                    </Select>
                    {errors[index]?.gender && touched[index]?.gender && (<p className="error-message">{errors[index].gender}</p>)}
                  </div>

                  {/* Grade */}
                  <div className="field-half-width">
                    <Label htmlFor={`grade-${index}`} className="field-label"><GraduationCap className="field-icon" />Grade<span className="required-mark">*</span></Label>
                    <Select value={student.grade || ""} onValueChange={(value) => handleInputChange(index, "grade", value)}>
                      <SelectTrigger className={`form-select ${errors[index]?.grade && touched[index]?.grade ? "input-error" : ""}`} onBlur={() => handleBlur(index, "grade")}><SelectValue placeholder="Select grade" /></SelectTrigger>
                      <SelectContent className="select-content">{grades.map((grade) => (<SelectItem key={grade} value={grade} className="select-item">{grade}</SelectItem>))}</SelectContent>
                    </Select>
                    {errors[index]?.grade && touched[index]?.grade && (<p className="error-message">{errors[index].grade}</p>)}
                  </div>
                  
                  {/* Learning Style */}
                  <div className="field-half-width">
                    <Label htmlFor={`learningStyle-${index}`} className="field-label"><BrainCircuit className="field-icon" />Learning Style<span className="required-mark">*</span></Label>
                    <Select value={student.learningStyle || ""} onValueChange={(value) => handleInputChange(index, "learningStyle", value)}>
                      <SelectTrigger className={`form-select ${errors[index]?.learningStyle && touched[index]?.learningStyle ? "input-error" : ""}`} onBlur={() => handleBlur(index, "learningStyle")}><SelectValue placeholder="Select learning style" /></SelectTrigger>
                      <SelectContent className="select-content">{learningStyles.map((style) => (<SelectItem key={style} value={style} className="select-item">{style}</SelectItem>))}</SelectContent>
                    </Select>
                    {errors[index]?.learningStyle && touched[index]?.learningStyle && (<p className="error-message">{errors[index].learningStyle}</p>)}
                  </div>

                  {/* Email */}
                  <div className="field-half-width">
                    <Label htmlFor={`email-${index}`} className="field-label"><Mail className="field-icon" />Email<span className="optional-text">(optional)</span></Label>
                    <Input id={`email-${index}`} type="email" placeholder="Enter student's email" value={student.email || ""} onChange={(e) => handleInputChange(index, "email", e.target.value)} onBlur={() => handleBlur(index, "email")} className={`form-input ${errors[index]?.email && touched[index]?.email ? "input-error" : ""}`}/>
                    {errors[index]?.email && touched[index]?.email && (<p className="error-message">{errors[index].email}</p>)}
                  </div>

                  {/* Password */}
                  <div className="field-half-width">
                    <Label htmlFor={`password-${index}`} className="field-label"><Lock className="field-icon" />Password<span className="optional-text">(optional)</span></Label>
                    <Input id={`password-${index}`} type="password" placeholder="Create password" value={student.password || ""} onChange={(e) => handleInputChange(index, "password", e.target.value)} onBlur={() => handleBlur(index, "password")} className="form-input"/>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="card-footer">
              <div className="footer-buttons">
                <Button type="button" variant="outline" className="cancel-button">Cancel</Button>
                <Button type="button" className="save-button" onClick={() => handleSave(index)}>Save Student</Button>
              </div>
            </CardFooter>
          </Card>
        ))}

        <div className="add-student-container">
          <Button onClick={addAnotherStudent} className="add-student-button"><GraduationCap className="add-icon" />Add Another Student</Button>
        </div>
      </div>

      <div className="back-button-container">
        <button onClick={() => router.push('/parent/profile')} className="back-button"><ArrowLeft className="back-icon" />Back to Parent Profile</button>
      </div>
    </div>
  )
}