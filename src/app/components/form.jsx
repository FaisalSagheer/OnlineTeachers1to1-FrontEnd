"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getUserData } from "../../lib/auth";
import "../style.css";
import { BsGoogle } from "react-icons/bs";
import { FaApple } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Added Alert imports
import { Terminal } from "lucide-react"; // Added Terminal icon import

export default function LoginForm() {
    const router = useRouter();
    const [user, setUser] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "Parent",
    });

    // --- STATE FOR ALERT ---
    const [alert, setAlert] = useState(null);

    // If already logged in (via cookies), redirect immediately
    useEffect(() => {
        const token = Cookies.get("accessToken");
        const userData = getUserData();

        if (token && userData) {
            setUser(userData);
            switch (userData.role?.toLowerCase()) {
                case "parent":
                    router.push("/parent/dashboard");
                    break;
                case "teacher":
                    router.push("/teacher/dashboard");
                    break;
                case "student":
                    router.push("/student/dashboard");
                    break;
                case "admin":
                    router.push("/admin");
                    break;
                default:
                    break;
            }
        }
    }, [router]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlert(null); // Clear previous alerts
        const { username, password, role } = formData;

        if (!username || !password) {
            // --- SET ALERT STATE ON ERROR ---
            setAlert({
                variant: "destructive",
                title: "Missing Information",
                description: "Please enter both username and password.",
            });
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ username, password, role }),
            });

            const data = await res.json();
            console.log("Login response:", res.status, data);

            if (res.ok) {
                // --- SET ALERT STATE ON SUCCESS ---
                 setAlert({
                    variant: "default",
                    title: "Login Successful!",
                    description: "Redirecting to your dashboard...",
                });

                Cookies.set("accessToken", data.accessToken);
                Cookies.set("refreshToken", data.refreshToken);
                Cookies.set("userData", JSON.stringify(data.user));

                // Redirect after a short delay
                setTimeout(() => {
                    switch (data.user.role?.toLowerCase()) {
                        case "parent":
                            router.push("/parent/dashboard");
                            break;
                        case "teacher":
                            router.push("/teacher/dashboard");
                            break;
                        case "student":
                            router.push("/student/dashboard");
                            break;
                        case "admin":
                            router.push("/admin");
                            break;
                        default:
                           setAlert({
                                variant: "destructive",
                                title: "Unknown Role",
                                description: `Role "${data.user.role}" is not recognized.`,
                            });
                    }
                }, 1500);

            } else {
                // --- SET ALERT STATE ON API ERROR ---
                setAlert({
                    variant: "destructive",
                    title: "Login Failed",
                    description: data.message || "Invalid credentials. Please try again.",
                });
                console.log("Login failed:", data.message || "Unknown error");
            }
        } catch (error) {
            console.error("Login error:", error);
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
        <section className="login-section">
            <div className="login-container">
                <div className="login-wrapper">
                    <div className="login-form-container">
                        <div className="welcome-header">
                            <h1 className="welcome-title">Welcome back!</h1>
                            <p className="welcome-subtitle">
                                Continue your personalized learning journey <br />
                                with <span className="brand-text">Teacher 1To1</span>. Lessons
                                designed just for you.
                            </p>
                        </div>

                        {/* --- CONDITIONAL RENDERING OF THE ALERT --- */}
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
                            {/* Username */}
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Username"
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

                            {/* Role Dropdown */}
                            <div className="input-group">
                                <select
                                    id="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="Parent">parent</option>
                                    <option value="Admin">admin</option>
                                </select>
                            </div>

                            <div className="forgot-password-link">
                                <Link href="/forgot-password">Forgot Password?</Link>
                            </div>

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
                                        Logging in...
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </button>

                            <div className="divider">
                                <span>or continue with</span>
                            </div>

                            <div className="social-login">
                                <button type="button" className="social-button google">
                                    <BsGoogle />
                                </button>
                                <button type="button" className="social-button apple">
                                    <FaApple />
                                </button>
                                <button type="button" className="social-button facebook">
                                    <FaFacebook />
                                </button>
                            </div>

                            <div className="register-link">
                                <span>Not a member? </span>
                                <Link href="/registration/parent">Register now</Link>
                            </div>
                        </form>
                    </div>

                    {/* Illustration Side */}
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
    );
}
