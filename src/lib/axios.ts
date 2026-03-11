import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터 — 추후 인증 토큰 자동 첨부
api.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token')
  // if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 응답 인터셉터 — 에러 일괄 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 → 로그인 페이지 리다이렉트 등 추후 처리
    return Promise.reject(error)
  },
)

export default api
