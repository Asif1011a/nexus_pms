// In-memory OTP store (use Redis in production)
const otpStore = {}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function storeOTP(email, otp) {
  otpStore[email.toLowerCase()] = {
    otp,
    expires: Date.now() + 10 * 60 * 1000, // 10 minutes
  }
}

function verifyOTP(email, otp) {
  const entry = otpStore[email.toLowerCase()]
  if (!entry) return { success: false, error: 'No OTP request found. Please start again.' }
  if (Date.now() > entry.expires) return { success: false, error: 'OTP expired. Please request a new one.' }
  if (entry.otp !== otp.trim()) return { success: false, error: 'Incorrect OTP. Please try again.' }
  return { success: true }
}

function clearOTP(email) {
  delete otpStore[email.toLowerCase()]
}

module.exports = { generateOTP, storeOTP, verifyOTP, clearOTP }
