import axios, { type InternalAxiosRequestConfig } from 'axios'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

let accessToken = ''

export function setAccessToken(token: string): void {
  accessToken = token
}

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken && !config.headers.authorization) {
    config.headers.authorization = `Bearer ${accessToken}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error.config

    if (error.response?.status === 403 && !prevRequest.sent) {
      try {
        const response = await axiosInstance.get('/auth/refreshTokens')
        const newAccessToken: string = response.data.data.accessToken

        setAccessToken(newAccessToken)
        prevRequest.sent = true
        prevRequest.headers.authorization = `Bearer ${newAccessToken}`

        return axiosInstance(prevRequest)
      } catch (refreshError) {
        setAccessToken('')
        window.location.href = '/signIn'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
