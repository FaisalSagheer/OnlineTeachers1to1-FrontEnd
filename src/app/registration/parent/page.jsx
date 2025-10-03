"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import "@/app/style.css";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import CloudImg from "@/app/image/cloudimg.png";
import Image from "next/image";
import LoginBanner from "@/app/components/loginBanner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react"; // Added missing import for the icon
import FooterCloudImg from "@/app/image/Footer-cloud-img.png";
import "@/app/aboutUs/aboutStyle.css";

export default function RegisterForm() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Parent",
    });

    // --- STATE FOR ALERT ---
    // We'll store the alert's details here. null means no alert.
    const [alert, setAlert] = useState(null);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Clear any previous alerts
        setAlert(null);

        const { username, email, password, confirmPassword, role } = formData;

        if (!username || !email || !password || !confirmPassword || !role) {
            // --- SET ALERT STATE ON ERROR ---
            setAlert({
                variant: "destructive",
                title: "Missing Information",
                description: "Please fill in all fields.",
            });
            return;
        }

        if (password !== confirmPassword) {
            // --- SET ALERT STATE ON ERROR ---
            setAlert({
                variant: "destructive",
                title: "Password Mismatch",
                description: "The passwords you entered do not match.",
            });
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/signup/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password, role }),
            });

            const data = await res.json();

            if (res.ok) {
                // --- SET ALERT STATE ON SUCCESS ---
                setAlert({
                    variant: "default",
                    title: "Signed Up Successfully!",
                    description: "Your account has been created. Redirecting...",
                });
                // Redirect after a short delay to allow user to see the message
                setTimeout(() => {
                    router.push(`/login`);
                }, 2000);
            } else {
                // --- SET ALERT STATE ON API ERROR ---
                setAlert({
                    variant: "destructive",
                    title: "Registration Failed",
                    description: data.error || "An unknown error occurred.",
                });
            }
        } catch (error) {
            console.error("Registration error:", error);
            // --- SET ALERT STATE ON CATCH ---
            setAlert({
                variant: "destructive",
                title: "Error!",
                description: "Something went wrong. Please check your connection and try again.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col bg-[#fcf7ee] text-gray-800">
            <Header />
            <section>
                <Image src={CloudImg} className="cloudImgabout" alt="Cloud Img" />
            </section>
            {/* Banner */}
            <LoginBanner />
            <section className="login-section">
                <div className="login-container">
                    <div className="login-wrapper">
                        {/* Left Side - Form */}
                        <div className="login-form-container">
                            <div className="welcome-header">
                                <h1 className="welcome-title">Create Your Account</h1>
                                <p className="welcome-subtitle">
                                    Join <span className="brand-text">Teacher 1To1</span> and start
                                    your personalized learning journey today.
                                </p>
                            </div>

                            {/* --- CONDITIONAL RENDERING OF THE ALERT --- */}
                            {/* The Alert component will only render if the 'alert' state is not null */}
                            {alert && (
                                <div className="mb-4">
                                    <Alert variant={alert.variant}>
                                        <Terminal className="h-4 w-4" />
                                        <AlertTitle>{alert.title}</AlertTitle>
                                        <AlertDescription>{alert.description}</AlertDescription>
                                    </Alert>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="login-form">
                                {/* User Name */}
                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="User Name"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div className="input-group">
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        className="form-input"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Confirm Password */}
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm Password"
                                        className="form-input"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    </button>
                                </div>
                                {/* Role Selection */}
                                <div className="input-group">
                                    <select
                                        id="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    >
                                        <option value="parent">Parent</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`login-button ${submitting ? "loading" : ""}`}
                                >
                                    {submitting ? (
                                        <>
                                            <svg className="loading-icon" viewBox="0 0 24 24">
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                    opacity="0.25"
                                                />
                                                <path
                                                    fill="currentColor"
                                                    opacity="0.75"
                                                    d="M4 12a8 8 0 018-8v8z"
                                                />
                                            </svg>
                                            Signing In...
                                        </>
                                    ) : (
                                        "SignUp"
                                    )}
                                </button>

                                {/* Already have an account */}
                                <div className="register-link">
                                    <span>Already have an account? </span>
                                    <Link href="/login">Log In</Link>
                                </div>
                            </form>
                        </div>

                        {/* Right Side - Illustration */}
                        <div className="illustration-container">
                            <div className="illustration-content">
                                <div className="image-wrapper">
                                    <img
                                        src="https://dtthemes.kinsta.cloud/a-for-apple/wp-content/uploads/sites/2/2024/02/filler-gitar.png"
                                        className="main-illustration"
                                        alt="Illustration"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="FooterCloudImgDiv mt-20 md:mt-28">
                <Image src={FooterCloudImg} alt="Footer Cloud" className="FooterCloudImg mx-auto" />
            </div>
            <Footer />
        </div>
    );
}
