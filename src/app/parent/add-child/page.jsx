"use client"

import ChildRegistrationForm from "@/app/components/childrenRegistrationForm"


export default function AddChildPage() {
  return (
    <div className="min-h-screen bg-[#fcf7ee] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center">
          <p className="text-orange-100">Add your child's information to register them in the system</p>
        </div>
        
        <ChildRegistrationForm/>
      
      </div>
    </div>
  )
}