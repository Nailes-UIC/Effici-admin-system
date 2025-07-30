import { useState, useEffect } from 'react'
import { router, usePage } from '@inertiajs/react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // ✅ Access flash message
  const { props } = usePage()
  const flash = props.flash as { success?: string }

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.post('/login', { email, password })
  }

  const [showFlash, setShowFlash] = useState(true)

  useEffect(() => {
    if (flash?.success) {
      const timeout = setTimeout(() => setShowFlash(false), 3000)
      return () => clearTimeout(timeout)
    }
  }, [flash])

  return (
    <div className="relative min-h-screen flex items-center justify-center">

      {/* ✅ Background Image with Blur */}
      <div className="absolute inset-0 bg-[url('/images/uic-bg.png')] bg-cover bg-center z-0">
        <div className="absolute inset-0 backdrop-blur-[8px] bg-black/20"></div>
      </div>

      {/* ✅ Main Login Container */}
      <div className="relative z-10 flex bg-white rounded-[20px] shadow-lg overflow-hidden">
        {/* Login Form */}
        <div className="flex flex-col justify-center p-8 w-80">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login</h2>

          {flash?.success && (
            <div
              className={`fixed top-10 left-1/2 transform -translate-x-1/2 bg-white border border-green-500 text-green-700 shadow-lg rounded-xl px-6 py-4 z-50 transition-opacity duration-500 ease-in-out ${
                showFlash ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="text-base font-semibold">{flash.success}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-1">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-red-500 hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Login
            </button>

            <div className="text-center text-sm text-gray-600 mt-2">
              Don’t have an account?{' '}
              <a href="/register" className="text-red-500 font-medium hover:underline">Register</a>
            </div>
          </form>
        </div>

        {/* Branding Side */}
        <div className="flex flex-col items-center justify-center p-8 bg-red-500 text-white w-80 rounded-r-[20px]">
          <div className="text-3xl font-serif font-semibold mb-4">EFFICIADMIN</div>
          <img src="/images/logo.png" alt="EFFICIADMIN Logo" className="mt-6 w-32 h-auto" />
        </div>
      </div>
    </div>
  )
}
