import type { Customer, CustomerListParams, CustomerListResponse } from '../api'
import _mockData from './customers.json'

const mockData = _mockData as Customer[]

const PAGE_SIZE = 20

export async function fetchCustomerListMock(params: CustomerListParams = {}): Promise<CustomerListResponse> {
  const { page = 1 } = params

  // 인위적 지연 (로딩 UI 테스트용)
  await new Promise((resolve) => setTimeout(resolve, 300))

  const start = (page - 1) * PAGE_SIZE
  const customers = mockData.slice(start, start + PAGE_SIZE)

  return {
    prod: false,
    page,
    page_size: PAGE_SIZE,
    total: mockData.length,
    count: customers.length,
    customers,
  }
}
