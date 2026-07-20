import { axiosInstance } from '@/shared/lib'
import type { ApiResponse, AuthData, User } from '@/shared/types'

export class UserApi {
  static async getAll(): Promise<User[]> {
    const { data } = await axiosInstance.get<ApiResponse<User[]>>('/users')
    return data.data
  }

  static async getById(id: string | number): Promise<ApiResponse<User>> {
    const { data } = await axiosInstance.get<ApiResponse<User>>(`/users/${id}`)
    return data
  }

  static async updateProfile(id: number, updateData: { name: string; email: string }): Promise<ApiResponse<AuthData>> {
    const { data } = await axiosInstance.put<ApiResponse<AuthData>>(`/users/${id}`, updateData)
    return data
  }

  static async uploadAvatar(id: number, formData: FormData): Promise<ApiResponse<AuthData>> {
    const { data } = await axiosInstance.put<ApiResponse<AuthData>>(`/users/${id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  }

  static async deleteById(id: number): Promise<ApiResponse<null>> {
    const { data } = await axiosInstance.delete<ApiResponse<null>>(`/users/${id}`)
    return data
  }
}
