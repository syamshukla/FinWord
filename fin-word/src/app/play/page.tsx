'use client'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
const PlayLayout = dynamic(() => import('@/components/play/layout'), {
  ssr: false,
})

// Page component
export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <PlayLayout />
    </div>
  )
}
