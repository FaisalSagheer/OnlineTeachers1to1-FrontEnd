'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupParentForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    nationalId: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    occupation: '',
    profilePic: null,
  });

  

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFromData({ ...formData, [id]: value })
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profilePic: e.target.files[0] || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = formData;

    if (!username || !password) {
      alert("Pleae fill all fields");
      return;
    }

    try {
 
      const res = await fetch('https://192.168.100.22:8000/api/signup/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Signup successful!');
        router.push('/login');
      } else {
        alert(data.message || 'Signup failed! ');
      }

    } catch (error) {
      console.error('Signup error:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <section className="py-18 bg-[#fcf7ee]">
      <div className="container mx-auto py-5 h-full">
        <div className="flex flex-wrap items-center justify-center h-full">

          {/* Image Section */}
          <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 mb-10 md:mb-0">
            <img
              src="https://dtthemes.kinsta.cloud/a-for-apple/wp-content/uploads/sites/2/2024/02/filler-gitar.png"
              className="w-full"
              alt="Illustration"
            />
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 lg:w-2/5 xl:ml-10">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-black mb-1">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>

              {/* National ID */}
              <div>
                <label htmlFor="nationalId" className="block text-sm font-medium text-black mb-1">National ID</label>
                <input
                  type="text"
                  id="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-black mb-1">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-black mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-black mb-1">Address</label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>

              {/* Occupation */}
              <div>
                <label htmlFor="occupation" className="block text-sm font-medium text-black mb-1">Occupation</label>
                <input
                  type="text"
                  id="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>

              {/* Profile Picture */}
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
