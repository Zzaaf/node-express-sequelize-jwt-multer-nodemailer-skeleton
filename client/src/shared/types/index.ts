export interface User {
  id: number
  name: string
  email: string
  avatar: string | null
  isActivated: boolean
  activationToken?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface Task {
  id: number
  title: string
  status: boolean
  user_id: number
  User?: { id: number; name: string }
  createdAt?: string
  updatedAt?: string
}

export interface ApiResponse<T = null> {
  statusCode: number
  message: string
  data: T
  error: string | null
}

export interface AuthData {
  user: User
  accessToken: string
}
