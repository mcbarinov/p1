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
  },
})
