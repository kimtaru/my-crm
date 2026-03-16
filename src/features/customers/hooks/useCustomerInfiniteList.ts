import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchCustomerList, type CustomerListParams } from '../api'

export function useCustomerInfiniteList(params: Omit<CustomerListParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: ['customers', 'infinite', params],
    queryFn: ({ pageParam }) => fetchCustomerList({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.page_size)
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined
    },
  })
}
