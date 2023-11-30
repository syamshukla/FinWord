'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { handleSignIn } from './helper'
import { Button } from '../ui/button'

const LoginButton: React.FC = () => {
  const router = useRouter()
  return (
    <div className="justify-cente flex h-screen items-center">
      <Button
        className="border-black-rounded rounded-md border-2 p-4"
        onClick={() => handleSignIn(router)}
      >
        Sign In With Google
      </Button>
    </div>
  )
}

export default LoginButton
