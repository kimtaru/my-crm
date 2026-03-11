import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5분간 캐시 유지
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
