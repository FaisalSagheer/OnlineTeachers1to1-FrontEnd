// components/auth/ResetPasswordPage.jsx or pages/reset-password.jsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa'; // For loading spinner and password toggle
import ResetPasswordIllustration from '@/app/image/kids-slider-bg-01.png'; // Using an existing image, replace if you have a specific one

// Import necessary global and custom CSS
import '@/app/style.css';
import '@/app/login/loginStyle.css'; // General login styles
import './forgotPassword.css'; // Custom styles for this page

export default function ResetPasswordPage  ()  {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const uid = searchParams.get('uid'); // User ID from the link
    const token = searchParams.get('token'); // Reset token from the link

    useEffect(() => {
        if (!uid || !token) {
            setIsError(true);
            setMessage('Invalid or missing password reset link. Please request a new one.');
            // Optionally redirect to forgot password page if link is invalid
            // setTimeout(() => router.push('/forgot-password'), 5000);
        }
    }, [uid, token, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setIsError(false);

        if (password !== confirmPassword) {
            setIsError(true);
            setMessage('Passwords do not match.');
            setLoading(false);
            return;
        }

        if (password.length < 8) { // Example password policy
            setIsError(true);
            setMessage('Password must be at least 8 characters long.');
            setLoading(false);
            return;
        }

        try {
            // Replace with your actual API endpoint for confirming password reset
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reset-password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid, token, new_password: password, re_new_password: confirmPassword }),
            });

            if (response.ok) {
                setMessage('Your password has been successfully reset. You can now log in.');
                // Redirect to login page after successful password reset
                setTimeout(() => router.push('/login'), 3000);
            } else {
                const errorData = await response.json();
                setIsError(true);
                // The API might return errors like "Invalid token" or "Token expired"
                setMessage(errorData.detail || errorData.new_password?.[0] || 'Failed to reset password. The link might be expired or invalid.');
            }
        } catch (error) {
            console.error('Password reset confirmation error:', error);
            setIsError(true);
            setMessage('An unexpected error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="login-section reset-password-page">
            <div className="login-container">
                <div className="login-wrapper">
                    <div className="login-form-container">
                        <div className="welcome-header">
                            <h1 className="welcome-title">Set New Password</h1>
                            <p className="welcome-subtitle">
                                Choose a strong new password for your account. This link is valid for a limited time.
                            </p>
                        </div>
                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    className="form-input"
                                    placeholder="New Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <div className="input-group">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    className="form-input"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            {message && (
                                <p className={`form-message ${isError ? 'error-message' : 'success-message'}`}>
                                    {message}
                                </p>
                            )}

                            <button
                                type="submit"
                                className={`login-button ${loading ? 'loading' : ''}`}
                                disabled={loading || !uid || !token}
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="loading-icon" />
                                        Resetting...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </form>
                        <div className="register-link mt-4">
                            <Link href="/login" className="brand-text">Back to Log In</Link>
                        </div>
                    </div>

                    <div className="illustration-container">
                        <div className="illustration-content">
                            <div className="image-wrapper">
                                <Image
                                    src={ResetPasswordIllustration || '/placeholder.svg'}
                                    alt="Reset Password Illustration"
                                    className="main-illustration"
                                />
                            </div>
                            <div className="bottom-text">
                                <h2>Your Security Matters</h2>
                                <p>Create a strong and unique password to keep your account safe.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};