import api from '@/lib/axios'

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

export async function fetchCustomerList(params: CustomerListParams = {}): Promise<CustomerListResponse> {
  const { data } = await api.get<CustomerListResponse>('/customers/list', { params })
  return data
}
