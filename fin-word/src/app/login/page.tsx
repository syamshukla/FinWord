import dynamic from 'next/dynamic'

const LoginButton = dynamic(() => import('@/components/login/Login'), {
  ssr: false, // This ensures the component is not included in SSR
})

export default function Login() {
  return (
    // <main className="justify-cente flex h-screen items-center">
    //   <div className="flex flex-col items-center gap-10">
    //     <LoginButton />
    //   </div>
    // </main>
    <div className="mt-36 flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-foreground">
          Welcome to BULL-ISH
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div>
          {/* <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Sign in
          </button> */}
          <LoginButton />
        </div>

        <p className="mt-10 text-center text-sm text-gray-400">
          Want to learn more about BULL-ISH?{' '}
          <a
            href="#"
            className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
          >
            Read more &rarr;
          </a>
        </p>
      </div>
    </div>
  )
}
