import React from 'react'
import dynamic from 'next/dynamic'
const Stats = dynamic(() => import('@/components/stats/layout'), {
  ssr: false,
})

export default function Page() {
  return (
    <div>
      <Stats />
    </div>
  )
}
