'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignupTeacherForm() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        cityCountry: '',
        qualifications: '',
        experience: '',
        skills: [],
        subjects: [],
        availability: '',
        linkedin: '',
        profilePic: null,
    });

    const skillsList = ['Communication', 'Patience', 'Creativity', 'Tech-savvy'];
    const subjectsList = ['Math', 'Science', 'English', 'History', 'Arts'];

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleMultiSelect = (field, value) => {
        setFormData((prev) => {
            const list = prev[field];
            return {
                ...prev,
                [field]: list.includes(value)
                    ? list.filter((item) => item !== value)
                    : [...list, value],
            };
        });
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            profilePic: e.target.files[0] || null,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const form = new FormData();
            for (const key in formData) {
                if (Array.isArray(formData[key])) {
                    form.append(key, JSON.stringify(formData[key]));
                } else if (formData[key]) {
                    form.append(key, formData[key]);
                }
            }

            const res = await fetch('/api/signup/teacher', {
                method: 'POST',
                body: form,
            });

            const data = await res.json();

            if (res.ok) {
                alert('Signup successful!');
                router.push('/teacher/dashboard');
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
                        <Image />
                    </div>

                    {/* Form */}
                    <div className="w-full md:w-1/2 lg:w-2/5 xl:ml-10">
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                            {/* Text Inputs */}
                            {[
                                { id: 'firstName', label: 'First Name', type: 'text' },
                                { id: 'lastName', label: 'Last Name', type: 'text' },
                                { id: 'email', label: 'Email', type: 'email' },
                                { id: 'phone', label: 'Phone', type: 'tel' },
                                { id: 'password', label: 'Password', type: 'password' },
                                { id: 'cityCountry', label: 'City & Country', type: 'text' },
                                { id: 'qualifications', label: 'Qualifications', type: 'text' },
                                { id: 'experience', label: 'Experience (in years)', type: 'text' },
                                { id: 'availability', label: 'Availability', type: 'text' },
                                { id: 'linkedin', label: 'LinkedIn / Website / Socials', type: 'text' },
                            ].map(({ id, label, type }) => (
                                <div key={id}>
                                    <label htmlFor={id} className="block text-sm font-medium text-black mb-1">{label}</label>
                                    <input
                                        type={type}
                                        id={id}
                                        value={formData[id]}
                                        onChange={handleChange}
                                        required={id !== 'linkedin'}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                                    />
                                </div>
                            ))}

                            {/* Skills */}
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">Skills</label>
                                <div className="flex flex-wrap gap-2">
                                    {skillsList.map((skill) => (
                                        <label key={skill} className="text-sm text-black">
                                            <input
                                                type="checkbox"
                                                checked={formData.skills.includes(skill)}
                                                onChange={() => handleMultiSelect('skills', skill)}
                                                className="mr-1"
                                            />
                                            {skill}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Subjects */}
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">Subjects</label>
                                <div className="flex flex-wrap gap-2">
                                    {subjectsList.map((subject) => (
                                        <label key={subject} className="text-sm text-black">
                                            <input
                                                type="checkbox"
                                                checked={formData.subjects.includes(subject)}
                                                onChange={() => handleMultiSelect('subjects', subject)}
                                                className="mr-1"
                                            />
                                            {subject}
                                        </label>
                                    ))}
                                </div>
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
