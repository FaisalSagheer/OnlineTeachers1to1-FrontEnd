import Cookies from "js-cookie"

// Generic fetcher for unauthenticated metadata
export const metaFetcher = async (url) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch metadata from ${url}: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

// Generic fetcher for authenticated backend calls with local API fallback
export const authenticatedFetcher = async (url) => {
  const token = Cookies.get("accessToken")
  let backendUrl = url

  // If the URL is for the local API, don't prepend backend URL
  if (!url.startsWith("/api/")) {
    backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`
  }

  try {
    const res = await fetch(backendUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      // Attempt to parse error message from backend
      let errorMessage = `Backend fetch failed with status: ${res.status} ${res.statusText}`
      try {
        const errorData = await res.json()
        errorMessage = errorData.error || errorData.message || errorMessage
      } catch (jsonError) {
        console.warn("Could not parse backend error response JSON.", jsonError)
      }
      throw new Error(errorMessage)
    }

    const data = await res.json()
    // Adapt data structure based on endpoint (user-home vs search)
    return data.courses || data.results || data // Return raw data, adaptation happens in component
  } catch (backendError) {
    console.warn("Backend fetch failed, falling back to local API.", backendError.message)

    // Determine local fallback URL
    let localFallbackUrl = url
    if (url.startsWith(process.env.NEXT_PUBLIC_BACKEND_URL)) {
      localFallbackUrl = url.replace(process.env.NEXT_PUBLIC_BACKEND_URL, "")
    }

    try {
      const localRes = await fetch(localFallbackUrl)
      if (!localRes.ok) {
        throw new Error(`Local API fetch also failed: ${localRes.status} ${localRes.statusText}`)
      }
      const localData = await localRes.json()
      return localData // Return raw local data
    } catch (localError) {
      console.error("Get Data Error (Both Backend and Local): ", localError)
      throw localError // Re-throw to let SWR handle the error state
    }
  }
}

// Fetcher for autocomplete suggestions (can be unauthenticated or authenticated based on API)
export const autocompleteFetcher = async (url) => {
  const res = await fetch(url) // Assuming autocomplete is unauthenticated
  if (!res.ok) {
    throw new Error(`Autocomplete fetch failed from ${url}: ${res.status} ${res.statusText}`)
  }
  const data = await res.json()
  return data.suggestions || []
}
