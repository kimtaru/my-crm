import { useQuery } from '@tanstack/react-query'
import { fetchCustomerList, type CustomerListParams } from '../api'

export function useCustomerList(params: CustomerListParams = {}) {
  return useQuery({
    queryKey: ['customers', 'list', params],
    // mock: false → 실제 API 호출 (mock 전환 시 { mock: true } 또는 두 번째 인자 제거)
    queryFn: () => fetchCustomerList(params, { mock: false }),
  })
}
