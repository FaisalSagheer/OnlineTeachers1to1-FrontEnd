import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/app/components/admin-sidebar"
import "@/app/admin/admin.css"

export default function AdminLayout({ children }) { // Renamed for clarity
  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar />
      <SidebarInset>
        <header
          style={{
            display: "flex",
            height: "60px",
            alignItems: "center",
            gap: "1rem",
            padding: "0 1rem",
            borderBottom: "2px solid #fc800a",
            backgroundColor: "white",
          }}
        >
          <SidebarTrigger />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#2d3748" }}>Admin Dashboard</h1>
          </div>
        </header>
        <main style={{ padding: "2rem", backgroundColor: "#fcf7ee", minHeight: "calc(100vh - 60px)" }}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}