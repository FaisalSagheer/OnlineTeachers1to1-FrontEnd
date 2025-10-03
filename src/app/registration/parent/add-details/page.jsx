"use client"

import Footer from "@/app/components/footer"
import Header from "@/app/components/header"
import LoginBanner from "@/app/components/loginBanner"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Cookies from "js-cookie"

export default function PostSignUpForm() {
  const router = useRouter()

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    fullname: "",
    phoneNumber: "",
    address: "",
    imageFile: null,
    imagePreview: "",
  })

  // State for values that depend on browser
  const [userId, setUserId] = useState(null)
  const [token, setToken] = useState(null)

  // Fetch query param & token after mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      setUserId(params.get("id"))
      setToken(Cookies.get("accessToken") || null)
    }
  }, [])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image file size must be less than 5MB.")
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.")
        return
      }

      const previewURL = URL.createObjectURL(file)
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: previewURL,
      }))

      // Clear error if file is valid
      if (error) setError("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const { fullname, phoneNumber, imageFile } = formData

    // Validation
    if (!fullname.trim()) {
      setError("Please enter your full name.")
      return
    }

    if (!phoneNumber.trim()) {
      setError("Please enter your phone number.")
      return
    }

    if (phoneNumber.length < 10) {
      setError("Please enter a valid phone number (at least 10 digits).")
      return
    }

    if (!imageFile) {
      setError("Please upload a profile picture.")
      return
    }

    if (!token) {
      setError("Your session has expired. Please log in again to continue.")
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login")
      }, 2000)
      return
    }

    if (!userId) {
      setError("Unable to identify user. Please try logging in again.")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
      return
    }

    setSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("fullname", formData.fullname.trim())
      formDataToSend.append("phoneNumber", formData.phoneNumber.trim())
      formDataToSend.append("address", formData.address.trim())
      formDataToSend.append("profile_pic", formData.imageFile)

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-info/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)

        // Handle specific error cases
        if (res.status === 401) {
          throw new Error("Your session has expired. Please log in again.")
        } else if (res.status === 403) {
          throw new Error("You don't have permission to perform this action.")
        } else if (res.status === 404) {
          throw new Error("User not found. Please contact support.")
        } else if (res.status === 413) {
          throw new Error("File size too large. Please choose a smaller image.")
        } else if (res.status >= 500) {
          throw new Error("Server error. Please try again later.")
        }

        throw new Error(errorData?.message || `Something went wrong. Please try again.`)
      }

      alert("Profile updated successfully! Redirecting to next step...")
      router.push("/parent/add-child")
    } catch (err) {
      console.error("Profile update error:", err)

      // Handle network errors
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError("Network error. Please check your connection and try again.")
      } else if (err.message.includes("session has expired") || err.message.includes("401")) {
        setError("Your session has expired. Redirecting to login...")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError(err.message || "An unexpected error occurred. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-yellow-50">
      <Header />

      {/* Cloud decoration */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 h-32"></div>
      </div>

      <LoginBanner />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Add Your Personal Data</h1>
                <p className="text-gray-600">
                  Join <span className="text-orange-600 font-semibold">Teacher 1To1</span> and start your personalized
                  learning journey today.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                <div>
                  <input
                    type="text"
                    id="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Full Name *"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number *"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address (Optional)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    disabled={submitting}
                  />
                  <p className="text-xs text-gray-500">Maximum file size: 5MB. Supported formats: JPG, PNG, GIF</p>

                  {formData.imagePreview && (
                    <div className="flex justify-center mt-4">
                      <img
                        src={formData.imagePreview || "/placeholder.svg"}
                        alt="Profile Preview"
                        className="h-24 w-24 rounded-full border-2 border-gray-200 object-cover shadow-sm"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors ${
                    submitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
            </div>

            {/* Right Side - Illustration */}
            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl p-8 text-center">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  className="w-full max-w-md mx-auto rounded-lg"
                  alt="Child learning with guitar"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer cloud decoration */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 h-32"></div>
      </div>

      <Footer />
    </div>
  )
}
