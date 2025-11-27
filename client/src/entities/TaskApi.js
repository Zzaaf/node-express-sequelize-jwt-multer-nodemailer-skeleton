import { axiosInstance } from '../shared/lib/axiosInstance';

export class TaskApi {
  static async getAll() {
    const { data } = await axiosInstance.get('/tasks');
    return data;
  }

  static async getById(id) {
    const { data } = await axiosInstance.get(`/tasks/${id}`);
    return data;
  }

  static async getByUserId(userId) {
    const { data } = await axiosInstance.get(`/tasks/user/${userId}`);
    return data;
  }

  static async create(newTaskData) {
    const { data } = await axiosInstance.post('/tasks', newTaskData);
    return data;
  }

  static async updateById(id, updateData) {
    const { data } = await axiosInstance.put(`/tasks/${id}`, updateData);
    return data;
  }

  static async deleteById(id) {
    const { data } = await axiosInstance.delete(`/tasks/${id}`);
    return data;
  }
}

