import dynamic from 'next/dynamic'

const LoginButton = dynamic(() => import('@/components/login/Login'), {
  ssr: false, // This ensures the component is not included in SSR
})

export default function Login() {
  return (
    <main className="justify-cente flex h-screen items-center">
      <div className="flex flex-col items-center gap-10">
        <LoginButton />
      </div>
    </main>
  )
}
