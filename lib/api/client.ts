import axios, { AxiosInstance } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error)
        // 添加更详细的错误信息
        if (error.response) {
          console.error('Response Error:', error.response.status, error.response.data)
        } else if (error.request) {
          console.error('Request Error:', error.request)
        } else {
          console.error('Error:', error.message)
        }
        return Promise.reject(error)
      }
    )
  }

  async request<T>(
    method: string,
    url: string,
    data?: any
  ): Promise<T> {
    const response = await this.client.request({
      method,
      url,
      data,
    })

    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'API 请求失败')
    }

    return response.data.data
  }

  get<T>(url: string): Promise<T> {
    return this.request<T>('GET', url)
  }

  post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>('POST', url, data)
  }

  put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>('PUT', url, data)
  }

  delete<T>(url: string): Promise<T> {
    return this.request<T>('DELETE', url)
  }
}

export const apiClient = new ApiClient()





