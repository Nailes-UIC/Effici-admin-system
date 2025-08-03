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

  const togglePasswordVisibility = () => setShowPassword(prev => !prev)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev)

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
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 text-white [font-family:'Poppins',sans-serif]">

      {/* ✅ Background */}
      <div className="absolute inset-0 bg-[url('/images/uic-bg.png')] bg-cover bg-center z-0">
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* ✅ Solid Form Container */}
      <div className="relative z-10 flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* 📝 Register Form */}
        <div className="flex flex-col justify-center p-10 w-96 text-black">
          <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Register</h2>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="flex gap-2">
              <div className="w-1/2">
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:ring-2 focus:ring-red-400 transition"
                  placeholder="Juan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:ring-2 focus:ring-red-400 transition"
                  placeholder="Dela Cruz"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:ring-2 focus:ring-red-400 transition"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:ring-2 focus:ring-red-400 transition"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:ring-2 focus:ring-red-400 transition"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 active:scale-95 transition-transform duration-150 shadow-md"
            >
              Register
            </button>

            <div className="text-center text-sm text-gray-700 mt-2">
              Already have an account?{' '}
              <a href="/login" className="text-red-500 font-medium hover:underline">Login</a>
            </div>
          </form>
        </div>

        {/* 🎯 Branding Side */}
        <div className="hidden md:flex flex-col items-center justify-center p-10 bg-red-600 text-white w-80 rounded-b-3xl md:rounded-l-none md:rounded-r-3xl">
          <div className="text-4xl font-serif font-semibold mb-4 tracking-wide drop-shadow-md">EFFICIADMIN</div>
          <img src="/images/logo.png" alt="EFFICIADMIN Logo" className="w-32 h-auto mt-4 drop-shadow-lg" />
        </div>
      </div>
    </div>
  )
}
