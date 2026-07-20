import { axiosInstance } from '@/shared/lib'
import type { ApiResponse, AuthData } from '@/shared/types'

interface SignUpData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface SignInData {
  email: string
  password: string
}

export class AuthApi {
  static async signUp(userData: SignUpData): Promise<ApiResponse<null>> {
    const { data } = await axiosInstance.post<ApiResponse<null>>('/auth/signUp', userData)
    return data
  }

  static async activateAccount(token: string): Promise<ApiResponse<AuthData>> {
    const { data } = await axiosInstance.get<ApiResponse<AuthData>>(`/auth/activate/${token}`)
    return data
  }

  static async signIn(credentials: SignInData): Promise<ApiResponse<AuthData>> {
    const { data } = await axiosInstance.post<ApiResponse<AuthData>>('/auth/signIn', credentials)
    return data
  }

  static async signOut(): Promise<ApiResponse<null>> {
    const { data } = await axiosInstance.delete<ApiResponse<null>>('/auth/signOut')
    return data
  }

  static async refreshTokens(): Promise<ApiResponse<AuthData>> {
    const { data } = await axiosInstance.get<ApiResponse<AuthData>>('/auth/refreshTokens')
    return data
  }
}
