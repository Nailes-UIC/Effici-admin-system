import { useState } from 'react'
import { router } from '@inertiajs/react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export default function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)


  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Passwords don't match")
      return
    }

    router.post('/register', {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      password_confirmation: confirmPassword,
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex bg-white rounded-[20px] shadow-lg overflow-hidden">
        {/* Register Form */}
        <div className="flex flex-col justify-center p-8 w-96">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Register</h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="flex gap-2">
              <div className="w-1/2">
                <label htmlFor="firstName" className="block text-sm text-gray-700 mb-1">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                  placeholder="Juan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="lastName" className="block text-sm text-gray-700 mb-1">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                  placeholder="Dela Cruz"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <div>
  <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-1">Confirm Password</label>
  <div className="relative">
    <input
      id="confirmPassword"
      type={showConfirmPassword ? 'text' : 'password'}
      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
      placeholder="Confirm password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
    />
    <button
      type="button"
      onClick={() => setShowConfirmPassword(prev => !prev)}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
    >
      {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
    </button>
  </div>
</div>

            <button
              type="submit"
              className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Register
            </button>

            <div className="text-center text-sm text-gray-600 mt-2">
              Already have an account?{' '}
              <a href="/login" className="text-red-500 font-medium hover:underline">Login</a>
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
