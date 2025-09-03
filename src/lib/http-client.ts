import ky from "ky"

import { getAuthToken, clearAuthData } from "./auth-storage"

export const httpClient = ky.create({
  prefixUrl: "/", // MSW  mocks
  hooks: {
    beforeRequest: [
      (request) => {
        const authToken = getAuthToken()
        if (authToken) {
          request.headers.set("Authorization", `Bearer ${authToken}`)
        }
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        // Handle 401 responses by clearing all auth data
        if (response.status === 401) {
          clearAuthData()
          // Trigger auth state update by dispatching custom event
          window.dispatchEvent(new CustomEvent("auth:logout"))
        }
        return response
      },
    ],
  },
})
