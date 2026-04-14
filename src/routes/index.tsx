import { lazy, type ComponentType } from 'react'

// 독립 페이지 (RootLayout 밖)
export const LoginPage = lazy(() => import('@/pages/LoginPage.tsx'))

// RootLayout 내부 페이지
export interface AppRoute {
  path: string
  element: ComponentType
  index?: boolean
}

const HomePage = lazy(() => import('@/pages/HomePage.tsx'))
const TablePage = lazy(() => import('@/pages/TablePage.tsx'))

export const routes: AppRoute[] = [
  { path: '/', element: HomePage, index: true },
  { path: '/table', element: TablePage },
]
