'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupStudentForm() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        gender: '',
        contact: '',
        learningStyle: '',
        address: '',
        parentEmail: '',
        city: '',
        enrolledCourse: '',
        profilePic: null,
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            profilePic: e.target.files[0] || null,
        }));
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        return month < 0 || (month === 0 && today.getDate() < birthDate.getDate())
            ? age - 1
            : age;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const age = calculateAge(formData.dob);

        if (age < 15) {
            alert('Students under 15 must be registered by a parent.');
            router.push('/registration/parent');
            return;
        }

        try {
            const form = new FormData();
            for (const key in formData) {
                if (formData[key]) {
                    form.append(key, formData[key]);
                }
            }

            const res = await fetch('/api/signup/student', {
                method: 'POST',
                body: form,
            });

            const data = await res.json();

            if (res.ok) {
                alert('Signup successful!');
                router.push('/student/dashboard');
            } else {
                alert(data.message || 'Signup failed!');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('Something went wrong!');
        }
    };

    return (
        <section className="h-screen bg-[#fcf7ee] overflow-auto">
            <div className="container mx-auto py-5">
                <div className="flex flex-wrap items-center justify-center">
                    {/* Image */}
                    <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 mb-10 md:mb-0">
                        <img
                            src="https://dtthemes.kinsta.cloud/a-for-apple/wp-content/uploads/sites/2/2024/02/filler-gitar.png"
                            className="w-full"
                            alt="Illustration"
                        />
                    </div>

                    {/* Form */}
                    <div className="w-full md:w-1/2 lg:w-2/5 xl:ml-10">
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">

                            {/* Input Fields */}
                            {[
                                { id: 'fullName', label: 'Full Name', type: 'text' },
                                { id: 'dob', label: 'Date of Birth', type: 'date' },
                                { id: 'contact', label: 'Contact (optional)', type: 'tel' },
                                { id: 'learningStyle', label: 'Learning Style', type: 'text' },
                                { id: 'address', label: 'Address', type: 'textarea' },
                                { id: 'parentEmail', label: 'Parent Email', type: 'email' },
                                { id: 'city', label: 'City', type: 'text' },
                                { id: 'enrolledCourse', label: 'Enrolled Course (optional)', type: 'text' },
                            ].map(({ id, label, type }) => (
                                <div key={id}>
                                    <label htmlFor={id} className="block text-sm font-medium text-black mb-1">{label}</label>
                                    {type === 'textarea' ? (
                                        <textarea
                                            id={id}
                                            value={formData[id]}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                                            rows={3}
                                        />
                                    ) : (
                                        <input
                                            type={type}
                                            id={id}
                                            value={formData[id]}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                                            required={id !== 'contact' && id !== 'enrolledCourse'}
                                        />
                                    )}
                                </div>
                            ))}

                            {/* Gender */}
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-black mb-1">Gender</label>
                                <select
                                    id="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Profile Pic */}
                            <div>
                                <label htmlFor="profilePic" className="block text-sm font-medium text-black mb-1">Profile Picture (optional)</label>
                                <input
                                    type="file"
                                    id="profilePic"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Sign Up
                            </button>
                            
                            {/* Divider */}
                            <div className="flex items-center my-6">
                                <div className="flex-grow border-t border-gray-300" />
                                <p className="mx-4 text-gray-500 font-semibold text-sm">OR</p>
                                <div className="flex-grow border-t border-gray-300" />
                            </div>

                            {/* Registration Links */}
                            <Link
                                href="/"
                                className="w-full bg-[#3b5998] hover:bg-[#1f4083] text-white py-2 rounded-lg mb-4 flex items-center justify-center"
                            >
                                Login
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
