import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Toaster } from "sonner"; // or "react-hot-toast"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from 'lucide-react'

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            // Fix 1: Corrected axios.post syntax and headers object
            const res = await axios.post("http://localhost:3000/api/v1/user/register", formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if(res.date.success){
                navigate('/verify')
                toast.success(res.data.message)
                
            }
            console.log("Registration successful:", res.data)
            
            navigate("/login")
        } catch (error) {
            console.error("Registration failed:", error)
        } finally {
            setLoading(false)
        }
    } // Fix 2: Removed extra brace below this line

    return (
        <div className='flex justify-center items-center min-h-screen bg-pink-100 p-4'>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                        Enter your details below to create your account
                    </CardDescription>
                </CardHeader>

                <form onSubmit={submitHandler}>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div className='grid gap-2'>
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input 
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className='grid gap-2'>
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input 
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                            </div>

                            <div className='grid gap-2'>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <div className='relative flex items-center'>
                                    <Input 
                                        id="password" 
                                        name='password'
                                        placeholder='Create a password'
                                        type={showPassword ? 'text' : 'password'} 
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="pr-10"
                                        required 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex-col gap-3">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                        
                        <p className="text-xs text-center text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="text-pink-600 font-medium hover:underline">
                                Log in
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default Signup