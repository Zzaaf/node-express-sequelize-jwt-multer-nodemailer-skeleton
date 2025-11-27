import { axiosInstance } from '../shared/lib/axiosInstance';

export class AuthApi {
  static async signUp(userData) {
    const { data } = await axiosInstance.post('/auth/signUp', userData);
    return data;
  }

  static async activateAccount(token) {
    const { data } = await axiosInstance.get(`/auth/activate/${token}`);
    return data;
  }

  static async signIn(credentials) {
    const { data } = await axiosInstance.post('/auth/signIn', credentials);
    return data;
  }

  static async signOut() {
    const { data } = await axiosInstance.delete('/auth/signOut');
    return data;
  }

  static async refreshTokens() {
    const { data } = await axiosInstance.get('/auth/refreshTokens');
    return data;
  }
}

