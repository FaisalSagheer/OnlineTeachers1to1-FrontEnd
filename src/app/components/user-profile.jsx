"use client"

import { useState } from "react"
import { User, ChevronDown, Settings, LogOut, HelpCircle } from "lucide-react"

export function UserProfile() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          borderRadius: "8px",
          transition: "background 0.2s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "#fef5e7")}
        onMouseOut={(e) => !isOpen && (e.currentTarget.style.background = "transparent")}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "#fc800a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <User size={18} />
        </div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontWeight: "600", fontSize: "0.875rem" }}>Admin User</div>
          <div style={{ fontSize: "0.75rem", color: "#718096" }}>admin@edu.com</div>
        </div>
        <ChevronDown
          size={16}
          style={{ transition: "transform 0.2s ease", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 0.5rem)",
            right: 0,
            width: "200px",
            background: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "2px solid #fc800a",
            zIndex: 10,
          }}
        >
          <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e2e8f0" }}>
            <div style={{ fontWeight: "600" }}>Admin User</div>
            <div style={{ fontSize: "0.75rem", color: "#718096" }}>admin@edu.com</div>
          </div>

          <div>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                width: "100%",
                textAlign: "left",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#fef5e7")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Settings size={16} color="#718096" />
              <span>Settings</span>
            </button>

            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                width: "100%",
                textAlign: "left",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#fef5e7")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <HelpCircle size={16} color="#718096" />
              <span>Help & Support</span>
            </button>

            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                width: "100%",
                textAlign: "left",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                borderTop: "1px solid #e2e8f0",
                color: "#f56565",
                transition: "background 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#fef5e7")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <LogOut size={16} color="#f56565" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
