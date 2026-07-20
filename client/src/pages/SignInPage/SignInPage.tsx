import { SignInForm } from '@/features'
import type { User } from '@/shared/types'

interface Props {
  setUser: (user: User) => void
}

export default function SignInPage({ setUser }: Props) {
  return <SignInForm setUser={setUser} />
}
