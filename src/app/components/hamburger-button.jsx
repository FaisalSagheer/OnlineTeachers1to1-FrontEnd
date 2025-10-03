"use client"

import { useSidebar } from "@/components/ui/sidebar"
import { Menu, X } from "lucide-react"

export function HamburgerButton({ className }) {
  const { state, toggleSidebar } = useSidebar()

  return (
    <button
      onClick={toggleSidebar}
      className={className}
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
      aria-label={state === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
    >
      {state === "expanded" ? <X size={20} color="#fc800a" /> : <Menu size={20} color="#fc800a" />}
    </button>
  )
}
