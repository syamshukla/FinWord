import dynamic from 'next/dynamic'
const Results = dynamic(() => import('@/components/results/layout'), {
  ssr: false,
})
import React from 'react'

export default function Page() {
  return (
    <div>
      <Results />
    </div>
  )
}
