import { axiosInstance } from '../shared/lib/axiosInstance';

export class UserApi {
  static async getAll() {
    const { data } = await axiosInstance.get('/users');
    return data;
  }

  static async getById(id) {
    const { data } = await axiosInstance.get(`/users/${id}`);
    return data;
  }

  static async updateProfile(id, updateData) {
    const { data } = await axiosInstance.put(`/users/${id}`, updateData);
    return data;
  }

  static async uploadAvatar(id, formData) {
    const { data } = await axiosInstance.put(`/users/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }

  static async deleteById(id) {
    const { data } = await axiosInstance.delete(`/users/${id}`);
    return data;
  }
}

