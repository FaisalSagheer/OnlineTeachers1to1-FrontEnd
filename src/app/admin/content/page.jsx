"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, ImageIcon, Save, Eye, Upload, Edit, Trash2 } from "lucide-react"

export default function ContentManagement() {
  const [content, setContent] = useState({
    homepage: {
      heroTitle: "Welcome to Our Educational Platform",
      heroSubtitle: "Discover the best learning experience with our expert teachers",
      heroImage: "/images/hero-banner.jpg",
    },
    about: {
      title: "About Our Institution",
      description: "We are dedicated to providing quality education and fostering academic excellence.",
      mission: "To empower students with knowledge and skills for a successful future.",
      vision: "To be the leading educational institution in the region.",
    },
    contact: {
      address: "123 Education Street, Learning City, LC 12345",
      phone: "+1 (555) 123-4567",
      email: "info@education.com",
      hours: "Monday - Friday: 8:00 AM - 6:00 PM",
    },
  })

  const [banners, setBanners] = useState([
    { id: 1, title: "New Course Launch", image: "/images/banner1.jpg", active: true, link: "/courses" },
    { id: 2, title: "Enrollment Open", image: "/images/banner2.jpg", active: true, link: "/enroll" },
    { id: 3, title: "Summer Program", image: "/images/banner3.jpg", active: false, link: "/summer" },
  ])

  const [activeTab, setActiveTab] = useState("homepage")
  const [isEditing, setIsEditing] = useState(false)

  // Content update handlers
  const handleContentUpdate = (section, field, value) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleSaveContent = () => {
    console.log("Saving content:", content)
    setIsEditing(false)
    // Add API call to save content
  }

  const handleImageUpload = (section, field) => {
    // Simulate file upload
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        // In real app, upload to server and get URL
        const imageUrl = URL.createObjectURL(file)
        handleContentUpdate(section, field, imageUrl)
      }
    }
    input.click()
  }

  const handleBannerToggle = (bannerId) => {
    setBanners(banners.map((banner) => (banner.id === bannerId ? { ...banner, active: !banner.active } : banner)))
  }

  const handleDeleteBanner = (bannerId) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      setBanners(banners.filter((banner) => banner.id !== bannerId))
    }
  }

  const handleAddBanner = () => {
    const title = prompt("Enter banner title:")
    if (title) {
      const newBanner = {
        id: banners.length + 1,
        title,
        image: "/images/default-banner.jpg",
        active: true,
        link: "/",
      }
      setBanners([...banners, newBanner])
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "homepage":
        return (
          <div>
            <h3 style={{ marginBottom: "1.5rem", color: "#fc800a" }}>Homepage Content</h3>

            <div className="form-group">
              <label className="form-label">Hero Title</label>
              <Input
                value={content.homepage.heroTitle}
                onChange={(e) => handleContentUpdate("homepage", "heroTitle", e.target.value)}
                disabled={!isEditing}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hero Subtitle</label>
              <textarea
                value={content.homepage.heroSubtitle}
                onChange={(e) => handleContentUpdate("homepage", "heroSubtitle", e.target.value)}
                disabled={!isEditing}
                className="form-input"
                rows={3}
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hero Image</label>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <Input
                  value={content.homepage.heroImage}
                  onChange={(e) => handleContentUpdate("homepage", "heroImage", e.target.value)}
                  disabled={!isEditing}
                  className="form-input"
                />
                {isEditing && (
                  <Button className="btn-secondary" onClick={() => handleImageUpload("homepage", "heroImage")}>
                    <Upload size={16} />
                    Upload
                  </Button>
                )}
              </div>
            </div>
          </div>
        )

      case "about":
        return (
          <div>
            <h3 style={{ marginBottom: "1.5rem", color: "#fc800a" }}>About Us Content</h3>

            <div className="form-group">
              <label className="form-label">Title</label>
              <Input
                value={content.about.title}
                onChange={(e) => handleContentUpdate("about", "title", e.target.value)}
                disabled={!isEditing}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                value={content.about.description}
                onChange={(e) => handleContentUpdate("about", "description", e.target.value)}
                disabled={!isEditing}
                className="form-input"
                rows={4}
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mission</label>
              <textarea
                value={content.about.mission}
                onChange={(e) => handleContentUpdate("about", "mission", e.target.value)}
                disabled={!isEditing}
                className="form-input"
                rows={3}
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Vision</label>
              <textarea
                value={content.about.vision}
                onChange={(e) => handleContentUpdate("about", "vision", e.target.value)}
                disabled={!isEditing}
                className="form-input"
                rows={3}
                style={{ resize: "vertical" }}
              />
            </div>
          </div>
        )

      case "contact":
        return (
          <div>
            <h3 style={{ marginBottom: "1.5rem", color: "#fc800a" }}>Contact Information</h3>

            <div className="form-group">
              <label className="form-label">Address</label>
              <Input
                value={content.contact.address}
                onChange={(e) => handleContentUpdate("contact", "address", e.target.value)}
                disabled={!isEditing}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <Input
                value={content.contact.phone}
                onChange={(e) => handleContentUpdate("contact", "phone", e.target.value)}
                disabled={!isEditing}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <Input
                value={content.contact.email}
                onChange={(e) => handleContentUpdate("contact", "email", e.target.value)}
                disabled={!isEditing}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Business Hours</label>
              <Input
                value={content.contact.hours}
                onChange={(e) => handleContentUpdate("contact", "hours", e.target.value)}
                disabled={!isEditing}
                className="form-input"
              />
            </div>
          </div>
        )

      case "banners":
        return (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ color: "#fc800a" }}>Homepage Banners</h3>
              <Button className="btn-primary" onClick={handleAddBanner}>
                <ImageIcon size={16} />
                Add Banner
              </Button>
            </div>

            <div className="data-table">
              <div className="table-header">
                <h4>Banner Management</h4>
              </div>
              <div className="table-content">
                <div
                  className="table-row"
                  style={{
                    fontWeight: "bold",
                    backgroundColor: "#fef5e7",
                    gridTemplateColumns: "2fr 2fr 1fr 1fr 2fr",
                  }}
                >
                  <div>Title</div>
                  <div>Image</div>
                  <div>Status</div>
                  <div>Link</div>
                  <div>Actions</div>
                </div>

                {banners.map((banner) => (
                  <div
                    key={banner.id}
                    className="table-row"
                    style={{
                      gridTemplateColumns: "2fr 2fr 1fr 1fr 2fr",
                    }}
                  >
                    <div style={{ fontWeight: "600" }}>{banner.title}</div>
                    <div style={{ color: "#718096", fontSize: "0.875rem" }}>{banner.image}</div>
                    <div>
                      <span className={`status-badge ${banner.active ? "status-active" : "status-pending"}`}>
                        {banner.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div style={{ color: "#718096", fontSize: "0.875rem" }}>{banner.link}</div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <Button
                        size="sm"
                        className="btn-secondary"
                        onClick={() => handleBannerToggle(banner.id)}
                        style={{ padding: "0.25rem 0.5rem" }}
                      >
                        <Eye size={14} />
                      </Button>
                      <Button size="sm" className="btn-secondary" style={{ padding: "0.25rem 0.5rem" }}>
                        <Edit size={14} />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDeleteBanner(banner.id)}
                        style={{
                          padding: "0.25rem 0.5rem",
                          backgroundColor: "#f56565",
                          color: "white",
                          border: "none",
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Content Management</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          {isEditing ? (
            <>
              <Button className="btn-secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button className="btn-primary" onClick={handleSaveContent}>
                <Save size={16} />
                Save Changes
              </Button>
            </>
          ) : (
            <Button className="btn-primary" onClick={() => setIsEditing(true)}>
              <Edit size={16} />
              Edit Content
            </Button>
          )}
        </div>
      </div>

      {/* Content Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">4</div>
          <div className="stat-label">Content Sections</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{banners.length}</div>
          <div className="stat-label">Total Banners</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{banners.filter((b) => b.active).length}</div>
          <div className="stat-label">Active Banners</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{isEditing ? "Editing" : "Published"}</div>
          <div className="stat-label">Status</div>
        </div>
      </div>

      {/* Content Tabs */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            borderBottom: "2px solid #fc800a",
            paddingBottom: "1rem",
          }}
        >
          {["homepage", "about", "contact", "banners"].map((tab) => (
            <Button
              key={tab}
              className={activeTab === tab ? "btn-primary" : "btn-secondary"}
              onClick={() => setActiveTab(tab)}
              style={{ textTransform: "capitalize" }}
            >
              <FileText size={16} />
              {tab === "banners" ? "Banners" : tab}
            </Button>
          ))}
        </div>
      </div>

      {/* Content Form */}
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "12px",
          border: "2px solid #fc800a",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {renderTabContent()}
      </div>
    </div>
  )
}
