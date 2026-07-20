import { axiosInstance } from '@/shared/lib'
import type { ApiResponse, Task } from '@/shared/types'

interface CreateTaskData {
  title: string
  status: boolean
  user_id: number
}

interface UpdateTaskData {
  title?: string
  status?: boolean
}

export class TaskApi {
  static async getAll(): Promise<ApiResponse<Task[]>> {
    const { data } = await axiosInstance.get<ApiResponse<Task[]>>('/tasks')
    return data
  }

  static async getById(id: number): Promise<ApiResponse<Task>> {
    const { data } = await axiosInstance.get<ApiResponse<Task>>(`/tasks/${id}`)
    return data
  }

  static async getByUserId(userId: number): Promise<ApiResponse<Task[]>> {
    const { data } = await axiosInstance.get<ApiResponse<Task[]>>(`/tasks/user/${userId}`)
    return data
  }

  static async create(newTaskData: CreateTaskData): Promise<ApiResponse<Task>> {
    const { data } = await axiosInstance.post<ApiResponse<Task>>('/tasks', newTaskData)
    return data
  }

  static async updateById(id: number, updateData: UpdateTaskData): Promise<ApiResponse<Task>> {
    const { data } = await axiosInstance.put<ApiResponse<Task>>(`/tasks/${id}`, updateData)
    return data
  }

  static async deleteById(id: number): Promise<ApiResponse<null>> {
    const { data } = await axiosInstance.delete<ApiResponse<null>>(`/tasks/${id}`)
    return data
  }
}
