"use client"
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BtnArrow from "../image/btnarrow.svg";
import CourseImg1 from "../image/course-img1.jpg"

export function Course() {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllCourses = async () => {
            try {
                const token = Cookies.get("accessToken");
                if (!token) {
                    console.log("No token available");
                    router.push("/");
                    return;
                }
                
                const response = await fetch("http://192.168.100.22:8080/api/user-home/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);
                    console.log(data);
                } else {
                    console.log(`Error: ${response.status} - ${response.statusText}`);
                    // Display placeholder courses if API fails
                    setPlaceholderCourses();
                }
            } catch (err) {
                console.log("Error fetching courses: ", err);
                // Display placeholder courses if API fails
                setPlaceholderCourses();
            } finally {
                setLoading(false);
            }
        };
        
        fetchAllCourses();
    }, [router]);

    // Function to set placeholder courses if API fails
    const setPlaceholderCourses = () => {
        const placeholderCourses = [
            {
                id: 1,
                title: "Math League",
                description: "Gravida cum sociis natoque penatibus. Enim nec dui nunc mattis enim ut.",
                originalPrice: 69,
                currentPrice: 69,
                image: CourseImg1
            },
            {
                id: 2,
                title: "Science Adventures",
                description: "Gravida cum sociis natoque penatibus. Enim nec dui nunc mattis enim ut.",
                originalPrice: 69,
                currentPrice: 69,
                image: CourseImg1
            },
            {
                id: 3,
                title: "History Explorers",
                description: "Gravida cum sociis natoque penatibus. Enim nec dui nunc mattis enim ut.",
                originalPrice: 69,
                currentPrice: 69,
                image: CourseImg1
            },
            {
                id: 4,
                title: "Language Arts",
                description: "Gravida cum sociis natoque penatibus. Enim nec dui nunc mattis enim ut.",
                originalPrice: 69,
                currentPrice: 69,
                image: CourseImg1
            },
            {
                id: 5,
                title: "Coding Basics",
                description: "Gravida cum sociis natoque penatibus. Enim nec dui nunc mattis enim ut.",
                originalPrice: 69,
                currentPrice: 69,
                image: CourseImg1
            },
            {
                id: 6,
                title: "Art Workshop",
                description: "Gravida cum sociis natoque penatibus. Enim nec dui nunc mattis enim ut.",
                originalPrice: 69,
                currentPrice: 69,
                image: CourseImg1
            }
        ];
        
        setCourses(placeholderCourses);
    };

    // If API doesn't return proper format, use placeholder data
    useEffect(() => {
        if (!loading && (!courses || !Array.isArray(courses) || courses.length === 0)) {
            setPlaceholderCourses();
        }
    }, [courses, loading]);

    // Render a single course card
    const renderCourseCard = (course) => (
        <Link href="/LMScourses/courseSingal" key={course.id}>
            <div className="courseDiv">
                <div className="courseImg1div overflow-hidden">
                    <Image 
                        src={course.image || CourseImg1} 
                        alt={course.title || "Course Image"} 
                        className="courseImg1" 
                    />
                </div>
                <h2 className="mt-6">{course.title || "Course Title"}</h2>
                <p className="mt-3">{course.description || "Course description not available."}</p>
                <div className="flex justify-between items-center pt-8">
                    <h3>
                        {course.originalPrice !== course.currentPrice && (
                            <span>${course.originalPrice || 0}</span>
                        )} 
                        ${course.currentPrice || 0}
                    </h3>
                    <button className="coursebtn flex items-center gap-2">
                        JOIN CLASS
                        <Image className="coubtnArrow" src={BtnArrow} alt="Btn Arrow" />
                    </button>
                </div>
            </div>
        </Link>
    );

    return (
        <section className="py-12">
            <div className="coureAnimeDiv flex flex-wrap justify-center pt-20 pb-20">
                {loading ? (
                    <p>Loading courses...</p>
                ) : (
                    courses && Array.isArray(courses) && courses.map(renderCourseCard)
                )}
            </div>
        </section>
    );
}