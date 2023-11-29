import dynamic from 'next/dynamic'
const PlayLayout = dynamic(() => import('@/components/play/layout'), {
  ssr: false,
})
import React from 'react'

export default function Page() {
  return (
    <div>
      <PlayLayout />
    </div>
  )
}
