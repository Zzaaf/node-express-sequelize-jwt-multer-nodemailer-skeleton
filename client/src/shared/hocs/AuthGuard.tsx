import { Navigate } from 'react-router'
import type { ReactNode } from 'react'
import type { User } from '@/shared/types'

interface Props {
  children: ReactNode
  user: User | null
}

export default function AuthGuard({ children, user }: Props) {
  if (!user) return <Navigate to="/signIn" replace />
  return children
}
