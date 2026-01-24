import React, { useState, useEffect } from 'react'
import { setInForm } from "@/lib/index"
import http from "@/http"
import { PasswordToggler } from "@/components/PasswordToggler";
import { SubmitBtn } from "@/components/SubmitBtn";
import Link from "next/link"
import { toast } from 'sonner'
import { useRouter } from 'next/router';


const Signup = () => {
    const [form, setForm] = useState({})
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState(true)
    const [confirmPassword, setConfirmPassword] = useState(true)
    const [validEmail, setValidEmail] = useState(false)
    const [otpForm, setOtpForm] = useState(true)
    const [randomOTP, setRandomOTP] = useState('')
    const [userOTP, setUserOTP] = useState('')
    
    const router = useRouter()

    const handleSubmit = ev => {
        const email = { email: form.email }

        ev.preventDefault()

        setLoading(true)

        if (form.password !== form.confirm_password) {
            toast.error("Passwords do not match");
            return setLoading(false);
        }
        else {
            http.post('email', email)
                .then(({ data }) => { setValidEmail(data.resp) })
                .catch(err => { })
                .finally(() => setLoading(false))
        }
    }

    const send = async ({ email, otp, name }) => {
        console.log('Calling API: /api/sendMail with data:', { email, otp, name });
        try {
            const response = await fetch('/api/sendMail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: email,
                    subject: `Please confirm your email ${name}`,
                    body: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                            }
                            .container {
                                width: 400px;
                                margin: 0 auto;
                                text-align: center;
                            }
                            h1 {
                                margin-top: 0;
                            }
                            .code {
                                background-color: #f2f2f2;
                                padding: 20px;
                                border-radius: 5px;
                                font-size: 24px;
                                font-weight: bold;
                            }
                            .footer {
                                margin-top: 20px;
                                font-size: 12px;
                                color: #777;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Confirm your email:</h1>
                            <p>Thank you for signing up at ellipserex.tech - here is your email verification code:</p>
                            <div class="code">${otp}</div>
                            <p>If you did not sign up, please let us know.</p>
                            <p>Cheers!</p>
                            <div class="footer">
                                <p>&copy; 2024 ellipserex.tech | Kathmandu - Nepal</p>
                                <p>ellipserex.tech@gmail.com</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
                }),
            });

            if (response.ok) {
                setValidEmail(false);
                setOtpForm(false);
                toast.success("OTP sent successfully.");
            } else {
                throw new Error("Unable to send OTP.");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };


    const generateRandomCode = () => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const digits = '0123456789';
        let code = '';

        for (let i = 0; i < 3; i++) {
            const randomLetterIndex = Math.floor(Math.random() * letters.length);
            code += letters[randomLetterIndex];
        }

        for (let i = 0; i < 3; i++) {
            const randomDigitIndex = Math.floor(Math.random() * digits.length);
            code += digits[randomDigitIndex];
        }

        code = code.split('').sort(() => Math.random() - 0.5).join('');

        return code;
    }

    useEffect(() => {
        if (validEmail) {
            setLoading(true);
            const randomCode = generateRandomCode();
            setRandomOTP(randomCode);
            send({ email: form.email, otp: randomCode, name: form.name });
        }
    }, [validEmail]);

    const handleOTP = ev => {
        ev.preventDefault()

        if (randomOTP !== userOTP) {
            toast.error("Invalid OTP");
        } else {
            http.post('/register', form)
            .then(() =>  router.push('/auth/login'))
            .catch(err => { })
        }
    }

    return (
        <>
            {otpForm ? (
                <div className="flex items-center justify-center h-screen mx-auto w-11/12 lg:w-1/2">

                    <form onSubmit={handleSubmit} className="w-11/12">
                        <h1 className="text-center text-4xl mb-3">Signup</h1>
                        <p className="text-center pt-2 text-lg">Get setup with in a minute</p>
                        <div className="mb-3 mt-5">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Enter Name"
                                required
                                className="w-full p-3 border border-gray-300 rounded-full"
                                onChange={ev => setInForm(ev, form, setForm)}
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Enter Email"
                                required
                                className="w-full p-3 border border-gray-300 rounded-full"
                                onChange={ev => setInForm(ev, form, setForm)}
                            />
                        </div>

                        <div className="mb-3">
                            <PasswordToggler
                                name="password"
                                id="password"
                                placeholder="Enter Password"
                                state={password}
                                setState={setPassword}
                                form={form}
                                setForm={setForm}
                            />
                        </div>

                        <div className="mb-3">
                            <PasswordToggler
                                name="confirm_password"
                                id="confirm_password"
                                placeholder="Re-enter Password"
                                state={confirmPassword}
                                setState={setConfirmPassword}
                                form={form}
                                setForm={setForm}
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="number"
                                name="phone"
                                id="phone"
                                placeholder="Enter Phone"
                                required
                                className="w-full p-3 border border-gray-300 rounded-full"
                                onChange={ev => setInForm(ev, form, setForm)}
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="text"
                                name="address"
                                id="address"
                                placeholder="Enter Address"
                                required
                                className="w-full p-3 border border-gray-300 rounded-full"
                                onChange={ev => setInForm(ev, form, setForm)}
                            />
                        </div>

                        <div className="mt-5 flex flex-wrap justify-center items-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-slate-800 text-white py-3 px-4 rounded-full w-full ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'} flex items-center justify-center dark:bg-slate-200 dark:text-slate-800`}
                            >
                                <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-user-plus'} me-2`}></i>
                                SIGNUP
                            </button>
                            <p className="mt-3 text-base">
                                <Link href="/auth/login" className="text-center hover:underline">Already have an account? Signin</Link>
                            </p>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="flex items-center justify-center h-screen mx-auto -mt-20 w-11/12 lg:w-1/2">
                    <form onSubmit={handleOTP} className="w-11/12">
                        <h1 className="text-center text-4xl mb-3">Signup</h1>
                        <p className="text-center pt-2 text-lg">Check your email inbox</p>
                        <div className="mb-3 mt-4">
                            <input
                                type="text"
                                name="OTP"
                                id="OTP"
                                placeholder="Email Verification Code"
                                maxLength="6"
                                required
                                className="w-full p-3 border border-gray-300 rounded-full"
                                onChange={ev => setUserOTP(ev.target.value)}
                            />
                        </div>

                        <div className="mb-3 flex justify-center items-center">
                        <button
                                type="submit"
                                disabled={loading}
                                className={`bg-slate-800 text-white py-3 px-4 rounded-full w-full ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'} flex items-center justify-center dark:bg-slate-200 dark:text-slate-800`}
                            >
                                <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-lock'} me-2`}></i>
                                CONFIRM
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    )
}

export default Signup;
