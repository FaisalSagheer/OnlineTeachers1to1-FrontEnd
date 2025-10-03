'use client'
import { useState } from "react"
import "../style.css"
import "@/app/contactUs/contactusStyle.css"
import Image from "next/image"
import Contact24hr from "../image/contact24hr.svg"
import ContImg1 from "../image/contImg1.webp"
import { CiInstagram } from "react-icons/ci"
import { FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa"
import { FaLocationDot, FaPhone } from "react-icons/fa6"
import { IoMdMail } from "react-icons/io"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [responseMsg, setResponseMsg] = useState("")
  const [loading, setLoading] = useState(false)

  // GSAP animation
  gsap.registerPlugin(ScrollTrigger)
  useGSAP(() => {
    gsap.from(".SectionTwoContact .contact24hrDiv", { x: -300, opacity: 0 })
    gsap.from(".SectionTwoContact .contactparaDiv", { x: 300, opacity: 0 })
    gsap.from(".contfromAmin .contactFromDiv", {
      y: 300,
      opacity: 0,
      scrollTrigger: {
        trigger: ".contfromAmin",
        scroller: "body",
        start: "top 80%",
        end: "top 70%",
        scrub: 1,
      },
    })
    gsap.from(".contfromAmin .sayHolleDiv", {
      y: 300,
      opacity: 0,
      scrollTrigger: {
        trigger: ".contfromAmin",
        scroller: "body",
        start: "top 80%",
        end: "top 70%",
        scrub: 1,
      },
    })
    gsap.from(".contlocAmin .contactlocationDiv1", {
      x: 300,
      opacity: 0,
      scrollTrigger: {
        trigger: ".contlocAmin",
        scroller: "body",
        start: "top 80%",
        end: "top 70%",
        scrub: 1,
      },
    })
    gsap.from(".contlocAmin .contactlocationDiv2", {
      scale: 0,
      opacity: 0,
      scrollTrigger: {
        trigger: ".contlocAmin",
        scroller: "body",
        start: "top 80%",
        end: "top 70%",
        scrub: 1,
      },
    })
    gsap.from(".contlocAmin .contactlocationDiv3", {
      x: -300,
      opacity: 0,
      scrollTrigger: {
        trigger: ".contlocAmin",
        scroller: "body",
        start: "top 80%",
        end: "top 70%",
        scrub: 1,
      },
    })
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResponseMsg("")

    try {
      const res = await fetch("/api/contactUs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (res.ok) {
        setResponseMsg(data.message)
        setFormData({ name: "", email: "", phone: "", message: "" })
      } else {
        setResponseMsg(data.error || "Something went wrong")
      }
    } catch (err) {
      setResponseMsg("Network error. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="SectionTwoContact min-h-screen flex flex-col items-center justify-center gap-16 px-4 md:px-20 py-20 text-center bg-white">
      {/* Intro Section */}
      <div className="contact2 flex flex-col mt-9 md:flex-row justify-center items-center gap-6 text-center">
        <div className="contact24hrDiv flex gap-3 justify-center items-center">
          <Image src={Contact24hr} alt="contact24hr" className="contact24hr w-12 h-12" />
          <h2 className="text-xl md:text-2xl font-semibold">We're Here to Support Your Learning 24/7</h2>
        </div>
        <div className="contactparaDiv max-w-2xl text-sm md:text-base">
          <p>
            Get in touch anytime with your questions or doubts. Our dedicated team is here around the clock to assist
            with your personalized 1-to-1 online classes.
          </p>
        </div>
      </div>

      {/* Form + Info */}
      <div className="contfromAmin flex flex-col md:flex-row justify-center items-center gap-12 w-full">
        <form onSubmit={handleSubmit} className="contactFromDiv flex flex-col gap-4 w-full max-w-md">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Full Name"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border p-2 rounded"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us what subject you're interested in..."
            className="w-full border p-2 rounded h-24"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="LMScontactbtn bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Sending..." : "Request a Call"}
          </button>
          {responseMsg && <p className="text-sm text-green-600 mt-2">{responseMsg}</p>}
        </form>

        <div className="sayHolleDiv flex flex-col items-center text-center gap-4 max-w-md">
          <h2 className="text-2xl font-semibold">Say Hello!</h2>
          <p>
            Have questions about our classes, schedule, or curriculum? Reach out and our team will guide you personally.
          </p>
          <Image src={ContImg1} alt="Student Support" className="contImg1 w-full rounded-lg" />
          <div>
            <h3 className="font-semibold">General Inquiries</h3>
            <p className="text-sm">info@onlineteachers1to1, help@onlineteachers1to1.com</p>
          </div>
          <div className="flex justify-center gap-4 mt-2 text-xl text-blue-600">
            <FaLinkedinIn className="hover:text-blue-800 transition" />
            <FaFacebookF className="hover:text-blue-800 transition" />
            <CiInstagram className="hover:text-pink-600 transition" />
          </div>
        </div>
      </div>

      {/* Office Locations */}
      <div className="contlocAmin grid md:grid-cols-2 gap-6 w-full">
        {[
          {
            title: "Pakistan Office",
            address: "Park Avenue Main Shahrah e Faisal Karachi",
            phone: "(+92) 21-34547878",
            whatsapp: "(+92) 316 1054943",
            email: "info@onlineteachers1to1.com",
          },
          {
            title: "Oman Office",
            address: "Office B-50 1st Floor Oman Avenues Mall, Baushar, Muscat, Sultanate of Oman.",
            phone: "(+968) 2114 2250",
            whatsapp: "(+968) 9428 2781",
            email: "oman@onlineteachers1to1.com",
          },
        ].map((loc, i) => (
          <div
            key={i}
            className={`contactlocationDiv contactlocationDiv${i + 1} flex flex-col items-center gap-4 text-center p-4 border rounded-lg shadow-sm`}
          >
            <h3 className="text-lg font-semibold">{loc.title}</h3>
            <div className="flex items-center gap-2">
              <FaLocationDot className="text-blue-600" />
              <p>{loc.address}</p>
            </div>
            <div className="flex mt-2 items-center gap-2">
              <FaPhone className="text-blue-600" />
              <p>{loc.phone}</p>
            </div>
            {loc.whatsapp && (
              <div className="flex items-center gap-2">
                <FaWhatsapp className="text-green-950" />
                <p>{loc.whatsapp}</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <IoMdMail className="text-blue-600" />
              <p>{loc.email}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
