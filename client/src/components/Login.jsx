import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

    const {setShowLogin, axios, setToken, navigate} = useAppContext()

    const [state, setState] = React.useState("login"); // login, register, verify, forgot, reset
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [isWaitingOtp, setIsWaitingOtp] = React.useState(false)

    const onSubmitHandler = async (event)=>{
        try {
            event.preventDefault();

            if(state === 'verify'){
                const { data } = await axios.post('/api/user/verify-otp', { email, otp })
                if(data.success){
                    toast.success(data.message)
                    const token = data.token
                    setToken(token)
                    localStorage.setItem('token', token)
                    setShowLogin(false)
                    navigate('/')
                } else {
                    toast.error(data.message)
                }
                return
            }

            if(state === 'forgot'){
                const { data } = await axios.post('/api/user/forgot-password', { email })
                if(data.success){
                    toast.success(data.message)
                    setState('reset')
                } else {
                    toast.error(data.message)
                }
                return
            }

            if(state === 'reset'){
                const { data } = await axios.post('/api/user/reset-password', { email, otp, password })
                if(data.success){
                    toast.success(data.message)
                    setState('login')
                    setOtp('')
                    setPassword('')
                } else {
                    toast.error(data.message)
                }
                return
            }

            const endpoint = state === 'register' ? 'register' : 'login'
            const { data } = await axios.post(`/api/user/${endpoint}`, { name, email, password })

            if (data.success) {
                if(state === 'register'){
                    setIsWaitingOtp(true)
                    setState('verify')
                    toast.success(data.message || 'Check your email for OTP')
                } else {
                    const token = data.token
                    setToken(token)
                    localStorage.setItem('token', token)
                    setShowLogin(false)
                    navigate('/')
                }
            } else {
                if(state === 'login' && data.message && data.message.includes('verify')){
                    setState('verify')
                    setIsWaitingOtp(true)
                    toast.error(data.message + ' OTP has been sent to your email.')
                    await axios.post('/api/user/resend-otp', {email})
                } else {
                    toast.error(data.message)
                }
            }

        } catch (error) {
            toast.error(error.message)
        }
    }


  return (
    <div onClick={()=> setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50'>

      <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">User</span> {state === 'login' ? 'Login' : state === 'register' ? 'Sign Up' : state === 'verify' ? 'Verify OTP' : state === 'forgot' ? 'Forgot Password' : 'Reset Password'}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
            )}
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="you@iitp.ac.in" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
            </div>
            {(state === 'login' || state === 'register' || state === 'reset') && (
            <div className="w-full ">
                <p>{state === 'reset' ? 'New Password' : 'Password'}</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
            </div>
            )}
            {(state === 'verify' || state === 'reset') && (
            <div className="w-full ">
                <p>OTP</p>
                <input onChange={(e) => setOtp(e.target.value)} value={otp} placeholder="6-digit code" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                <button type='button' onClick={async()=>{
                    try {
                        if (!email) {
                            toast.error('Enter email first')
                            return
                        }
                        const { data } = await axios.post('/api/user/resend-otp', { email })
                        if(data.success) toast.success(data.message)
                        else toast.error(data.message)
                    } catch(error){ toast.error(error.message) }
                }} className='text-xs text-primary mt-1'>Resend OTP</button>
            </div>
            )}
            {state === 'login' && (
                <p className="flex justify-between w-full">
                    <span>Need an account? <span onClick={() => {setState('register'); setOtp('')}} className="text-primary cursor-pointer">click here</span></span>
                    <br />
                    <span onClick={() => {setState('forgot'); setOtp(''); setPassword('')}} className="text-primary cursor-pointer">Forgot password?</span>
                </p>
            )}

            {state === 'register' && (
                <p>
                    Already have account? <span onClick={() => {setState('login'); setOtp('')}} className="text-primary cursor-pointer">click here</span>
                </p>
            )}

            {(state === 'forgot' || state === 'reset' || state === 'verify') && (
                <p>
                    Back to <span onClick={() => {setState('login'); setIsWaitingOtp(false); setOtp(''); setPassword('')}} className="text-primary cursor-pointer">Login</span>
                </p>
            )}

            <button className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === 'register' ? 'Create Account' : state === 'login' ? 'Login' : state === 'forgot' ? 'Send OTP' : state === 'reset' ? 'Reset Password' : 'Verify OTP'}
            </button>
        </form>
    </div>
  )
}

export default Login
