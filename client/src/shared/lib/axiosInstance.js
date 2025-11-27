import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true, // для передачи cookies с refresh token
});

// переменная для хранения access token
let accessToken = '';

// функция для установки access token
export function setAccessToken(token) {
    accessToken = token;
}

// перехватчик запросов - добавляет Authorization заголовок
axiosInstance.interceptors.request.use((config) => {
    if (accessToken && !config.headers.authorization) {
        config.headers.authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// перехватчик ответов - автоматическое обновление токенов
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const prevRequest = error.config;

        // если токен истек и это первый запрос на обновление
        if (error.response?.status === 403 && !prevRequest.sent) {
            try {
                // запрос на обновление токенов
                const response = await axiosInstance.get('/auth/refreshTokens');
                const newAccessToken = response.data.data.accessToken;

                // обновляем токен
                setAccessToken(newAccessToken);

                // помечаем запрос как повторный
                prevRequest.sent = true;
                prevRequest.headers.authorization = `Bearer ${newAccessToken}`;

                // повторяем оригинальный запрос
                return axiosInstance(prevRequest);
            } catch (refreshError) {
                // если обновление не удалось, перенаправляем на авторизацию
                setAccessToken('');
                window.location.href = '/signIn';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);