import { useQuery } from '@tanstack/react-query'
import { fetchCustomerList, type CustomerListParams } from '../api'

export function useCustomerList(params: CustomerListParams = {}) {
  return useQuery({
    queryKey: ['customers', 'list', params],
    queryFn: () => fetchCustomerList(params),
  })
}
