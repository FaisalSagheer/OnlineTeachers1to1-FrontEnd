"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserIcon, PhoneIcon, MailIcon, HomeIcon, CameraIcon } from "lucide-react"

export default function ParentForm() {
  const [hovered, setHovered] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
  
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="flex items-center justify-center mb-4">
        </div>
        <CardTitle className="text-2xl font-bold text-center">Parent Information</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <form className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
              <div className="relative">
                
                <Input 
                  id="fullName"
                  placeholder="Enter your full name" 
                  className="pl-10 h-12 rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Contact Number</Label>
              <div className="relative">
                <Input 
                  id="phone"
                  placeholder="Enter your phone number" 
                  className="pl-10 h-12 rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
            
                <Input 
                  id="email"
                  type="email"
                  placeholder="Enter your email address" 
                  className="pl-10 h-12 rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">Home Address</Label>
              <div className="relative">
                <Input 
                  id="address"
                  placeholder="Enter your full address" 
                  className="pl-10 h-12 rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profilePic" className="text-sm font-medium">Profile Picture</Label>
              <div className="flex items-center space-x-3">
                <label htmlFor="profilePic" className="cursor-pointer flex items-center justify-center h-12 px-4 py-2 rounded-lg text-orange-600 bg-orange-50 hover:bg-orange-100 border-2 border-dashed border-orange-300 transition-colors">
                  <CameraIcon className="mr-2 h-5 w-5" />
                  <span>Choose Image</span>
                  <Input 
                    id="profilePic"
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <span className="text-sm text-gray-500">
                  {previewUrl ? "Image selected" : "No file chosen"}
                </span>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="px-6 pb-6">
        <Button 
          type="submit" 
          className="w-full h-12 rounded-full font-medium text-lg transition-all"
          style={{ 
            backgroundColor: hovered ? "#fc800a" : "#fcf7ee", 
            color: hovered ? "white" : "#fc800a",
            border: "2px solid #fc800a"
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          Update Profile
        </Button>
      </CardFooter>
    </Card>
  )
}