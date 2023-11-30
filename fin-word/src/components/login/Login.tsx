'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { handleSignIn } from './helper'
import { Button } from '../ui/button'

const LoginButton: React.FC = () => {
  const router = useRouter()
  return (
    <Button
      className="w-full rounded-md p-4"
      onClick={async () => {
        // @ts-ignore
        await handleSignIn()
        router.push('/play')
      }}
    >
      Sign In With Google
    </Button>
  )
}

export default LoginButton
