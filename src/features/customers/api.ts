import api from '@/lib/axios'
import { fetchCustomerListMock } from './mock/api'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export interface Customer {
  CUSTOMER_ID: string
  CUSTOMER_NAME: string
  CEO_NAME: string
  CORP_NO: string
  CUSTOMER_DOMAIN: string | null
  CUSTOMER_DOMAIN_YN: 'Y' | 'N'
  CUSTOMER_ST: string
  MAIN_CUSTOMER_ID: string | null
  REG_DT: string
  ADMIN_ID: string | null
  // 추가 컬럼
  CUSTOMER_TYPE: string | null        // 대기업 / 중견기업 / 중소기업 / 스타트업
  INDUSTRY: string | null             // 업종
  EMPLOYEE_CNT: number | null         // 직원 수
  ANNUAL_REVENUE: number | null       // 연매출 (억원)
  PHONE_NO: string | null             // 대표 전화
  EMAIL: string | null                // 대표 이메일
  ADDRESS: string | null              // 주소
  CITY: string | null                 // 도시
  CUSTOMER_GRADE: string | null       // 등급 A / B / C / D
  CONTRACT_ST: string | null          // 계약중 / 계약만료 / 협의중 / 없음
  CONTRACT_DT: string | null          // 계약 시작일 YYYYMMDD
  CONTRACT_END_DT: string | null      // 계약 종료일 YYYYMMDD
  LAST_CONTACT_DT: string | null      // 최근 접촉일 YYYYMMDD
  STOCK_YN: 'Y' | 'N'                // 상장 여부
  MEMO: string | null                 // 메모
}

export interface CustomerListResponse {
  prod: boolean
  page: number
  page_size: number
  total: number
  count: number
  customers: Customer[]
}

export interface CustomerListParams {
  page?: number
  name?: string
  prod?: boolean
}

export async function fetchCustomerList(params: CustomerListParams = {}, { mock }: { mock?: boolean } = {}): Promise<CustomerListResponse> {
  if (mock ?? USE_MOCK) return fetchCustomerListMock(params)
  const { data } = await api.get<CustomerListResponse>('/customers/list', { params })
  return data
}
