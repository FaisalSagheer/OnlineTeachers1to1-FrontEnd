"use client"

import { HamburgerButton } from "./hamburger-button"
import { UserProfile } from "./user-profile"
import { Bell, Search } from "lucide-react"
import { useState } from "react"

export function Header({ title, subtitle }) {
  const [notifications, setNotifications] = useState(5)

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        borderBottom: "2px solid #fc800a",
        background: "white",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <HamburgerButton />
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#2d3748" }}>{title}</h1>
          {subtitle && <p style={{ color: "#718096" }}>{subtitle}</p>}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search..."
            style={{
              padding: "0.5rem 0.75rem 0.5rem 2.5rem",
              borderRadius: "8px",
              border: "2px solid #e2e8f0",
              outline: "none",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#fc800a")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#718096",
            }}
          />
        </div>

        <div style={{ position: "relative" }}>
          <button
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.5rem",
              borderRadius: "50%",
              transition: "background 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#fef5e7")}
            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Bell size={20} color="#718096" />
            {notifications > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "0",
                  right: "0",
                  background: "#f56565",
                  color: "white",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {notifications}
              </span>
            )}
          </button>
        </div>

        <UserProfile />
      </div>
    </header>
  )
}
