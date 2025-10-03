"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BookOpenIcon, PencilIcon, PlusCircleIcon } from "lucide-react"
import Link from "next/link"

export default function ChildList() {
    const [hoveredIndices, setHoveredIndices] = useState({});
    
    const children = [
        { name: "John Doe", grade: "5th Grade" },
        { name: "Jane Doe", grade: "3rd Grade" }
    ]

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('');
    }

    const handleMouseEnter = (index) => {
        setHoveredIndices(prev => ({...prev, [index]: true}));
    }

    const handleMouseLeave = (index) => {
        setHoveredIndices(prev => ({...prev, [index]: false}));
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Children</h2>
              <Link
  href="/parent/add-child"
  className="rounded-full flex items-center gap-1 px-4 py-2 transition-colors duration-200"
  style={{
    backgroundColor: "#fcf7ee",
    color: "#fc800a",
    border: "2px solid #fc800a"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "#fc800a";
    e.currentTarget.style.color = "white";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = "#fcf7ee";
    e.currentTarget.style.color = "#fc800a";
  }}
>
  <PlusCircleIcon size={18} />
  <span>Add Child</span>
</Link>

            </div>
            
            {children.map((child, idx) => (
                <Card key={idx} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-12 w-12 border-2 border-orange-200">
                                    <AvatarFallback className="bg-orange-100 text-orange-600 font-medium">
                                        {getInitials(child.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-lg">{child.name}</p>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <BookOpenIcon size={14} className="mr-1" />
                                        <span>{child.grade}</span>
                                    </div>
                                </div>
                            </div>
                            <Button
                                className="rounded-full h-10 px-5 font-medium transition-colors flex items-center gap-1"
                                style={{ 
                                    backgroundColor: hoveredIndices[idx] ? "#fc800a" : "#fcf7ee", 
                                    color: hoveredIndices[idx] ? "white" : "#fc800a",
                                    border: "2px solid #fc800a"
                                }}
                                onMouseEnter={() => handleMouseEnter(idx)}
                                onMouseLeave={() => handleMouseLeave(idx)}
                            >
                                <PencilIcon size={16} />
                                <span>Manage</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
            
            {children.length === 0 && (
                <Card className="p-8 text-center border-dashed border-2 border-gray-200">
                    <p className="text-gray-500">No children added yet</p>
                </Card>
            )}
        </div>
    )
}