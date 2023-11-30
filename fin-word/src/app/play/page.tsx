'use client'
import dynamic from 'next/dynamic'
const PlayLayout = dynamic(() => import('@/components/play/layout'), {
  ssr: false,
})
import React, { useEffect, useState } from 'react'

export default function Page() {
  return (
    <div>
      <PlayLayout />
    </div>
  )
}
