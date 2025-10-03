"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa'; // For loading spinner
import ForgotPasswordIllustration from '@/app/image/main-illustration.png';

// Import necessary global and custom CSS
import '@/app/style.css';
import '@/app/login/loginStyle.css'; // General login styles
import './forgotPassword.css'; // Custom styles for this page

export default function ForgotPasswordPage ()  {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setIsError(false);

        try {
            // UPDATED API ENDPOINT HERE
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/forgot-password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage('A password reset link has been sent to your email address.');
                // Optionally redirect after a short delay or show a success message permanently
                // setTimeout(() => router.push('/login'), 3000);
            } else {
                const errorData = await response.json();
                setIsError(true);
                // Check for common error messages from backend, assuming 'email' or 'detail' fields
                setMessage(errorData.email?.[0] || errorData.detail || 'Failed to send password reset link. Please check your email and try again.');
            }
        } catch (error) {
            console.error('Password reset request error:', error);
            setIsError(true);
            setMessage('An unexpected error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-[#fcf7ee] login-section forgot-password-page">
            <div className="login-container">
                <div className="login-wrapper">
                    <div className="login-form-container">
                        <div className="welcome-header">
                            <h1 className="welcome-title">Forgot Your Password?</h1>
                            <p className="welcome-subtitle">
                                Enter your email to receive a password reset link.
                            </p>
                        </div>
                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <input
                                    type="email"
                                    id="email"
                                    className="form-input"
                                    placeholder="Your Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {message && (
                                <p className={`form-message ${isError ? 'error-message' : 'success-message'}`}>
                                    {message}
                                </p>
                            )}

                            <button
                                type="submit"
                                className={`login-button ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="loading-icon" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </form>
                        <div className="register-link mt-4">
                            Remembered your password? <Link href="/login" className="brand-text">Log In</Link>
                        </div>
                    </div>

                    <div className="illustration-container">
                        <div className="illustration-content">
                            <div className="image-wrapper">
                                <Image
                                    src={ForgotPasswordIllustration || '/placeholder.svg'}
                                    alt="Forgot Password Illustration"
                                    className="main-illustration"
                                />
                            </div>
                            <div className="bottom-text">
                                <h2>Secure Your Account</h2>
                                <p>We'll help you get back into your account quickly and securely.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};