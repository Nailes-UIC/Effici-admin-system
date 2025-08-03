import { useState } from 'react'
import { router } from '@inertiajs/react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    router.post('/login', { email, password, remember })
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 text-white [font-family:'Poppins',sans-serif] transition-opacity duration-500 opacity-100">

      {/* Background image with dark overlay */}
      <div className="absolute inset-0 bg-[url('/images/uic-bg.png')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/60" />

      {/* Login container */}
      <div className="relative z-10 flex flex-col md:flex-row bg-white text-black rounded-3xl shadow-xl overflow-hidden transition-all duration-500">

        {/* Login Form Section */}
        <div className="flex flex-col justify-center p-8 md:p-12 w-96">
          <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Login</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

             {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label htmlFor="remember" className="flex items-center gap-2 text-gray-700">
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-red-600"
                />
                Remember me
              </label>
              <a href="/forgot-password" className="text-red-500 hover:underline">Forgot password?</a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2 rounded-md bg-red-500 text-white font-medium hover:bg-red-600 transition duration-150"
            >
              Login
            </button>

            {/* Link to Register */}
            <div className="text-center text-sm text-gray-700 mt-2">
              Don't have an account?{' '}
              <a href="/register" className="text-red-500 font-medium hover:underline">Register</a>
            </div>
          </form>
        </div>

        {/* Right Panel with Logo */}
        <div className="hidden md:flex flex-col items-center justify-center bg-red-600 text-white p-10 w-80">
          <div className="text-3xl font-serif font-bold tracking-wide mb-4">EFFICIADMIN</div>
          <img src="/images/logo.png" alt="Logo" className="w-28 h-auto" />
        </div>
      </div>
    </div>
  )
}
