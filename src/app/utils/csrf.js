// CSRF token utility functions
export const getCSRFToken = () => {
  // Try to get CSRF token from meta tag first
  const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
  if (metaToken) return metaToken

  // Fallback to cookie
  const cookieToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1]

  return cookieToken || null
}

export const setCSRFTokenInMeta = (token) => {
  let metaTag = document.querySelector('meta[name="csrf-token"]')

  if (!metaTag) {
    metaTag = document.createElement("meta")
    metaTag.name = "csrf-token"
    document.head.appendChild(metaTag)
  }

  metaTag.content = token
}
