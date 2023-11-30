'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { handleSignIn } from './helper'
import { Button } from '../ui/button'

const LoginButton: React.FC = () => {
  const router = useRouter()
  return (
    <Button
      className="border-black-rounded rounded-md border-2 p-4 hover:bg-gray-100"
      onClick={() => handleSignIn(router)}
    >
      Sign In With Google
    </Button>
  )
}

export default LoginButton
