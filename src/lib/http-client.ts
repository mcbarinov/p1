import ky from "ky"

import { authStorage } from "./auth-storage"

export const httpClient = ky.create({
  prefixUrl: "/", // MSW  mocks
  hooks: {
    beforeRequest: [
      (request) => {
        const authToken = authStorage.getAuthToken()
        if (authToken) {
          request.headers.set("Authorization", `Bearer ${authToken}`)
        }
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        if (response.status === 401) {
          const isLoginPage = window.location.pathname === "/login"

          if (!isLoginPage) {
            authStorage.clearAuthData()
            window.location.href = "/login"
          }
        }
        return response
      },
    ],
  },
})
