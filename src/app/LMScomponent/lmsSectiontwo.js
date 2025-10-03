"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Search, BookOpen } from "lucide-react";
import "../style.css";
import "@/app/LMScourses/all-courses/all-courses.css";
import PenImg from "../image/pen-image.png";
import FlowerSvg from "../image/flower.svg";
import FlowerSvg1 from "../images/flowerSvg.svg";
import BtnArrow from "../image/btnarrow.svg";
import AboutMask from "../image/aboutMask.png";

const getAccessTokenFromCookies = () => {
    if (typeof document !== "undefined") {
        const cookies = document.cookie.split(";");
        const accessTokenCookie = cookies.find(
            (cookie) =>
                cookie.trim().startsWith("accessToken=") ||
                cookie.trim().startsWith("access_token="),
        );
        return accessTokenCookie ? accessTokenCookie.split("=")[1] : null;
    }
    return null;
};

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

export default function SectionTwoLMS() {
    const [selectedCurriculum, setSelectedCurriculum] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [curriculumOptions, setCurriculumOptions] = useState([]);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
                if (!baseUrl) {
                    throw new Error(
                        "Backend URL is not configured. Please set NEXT_PUBLIC_BACKEND_URL environment variable.",
                    );
                }

                const token = getAccessTokenFromCookies();
                const isAuthenticated = !!token;

                let apiUrl;
                const headers = {};

                if (isAuthenticated) {
                    // Authenticated user - fetch from user-home API
                    apiUrl = `${baseUrl}/api/user-home/`;
                    headers.Authorization = `Bearer ${token}`;
                } else {
                    // Public user - fetch from home API
                    apiUrl = `${baseUrl}/api/home/`;
                }

                const response = await fetch(apiUrl, { headers });
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err);
                console.error("Error fetching data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const allCourses = data?.courses || [];
    const filteredCourses = allCourses.filter((course) => {
        const matchesSearch =
            !searchQuery ||
            course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCurriculum =
            !selectedCurriculum ||
            selectedCurriculum === "all" ||
            course.curriculum?.toLowerCase() === selectedCurriculum.toLowerCase();

        return matchesSearch && matchesCurriculum;
    });

    const totalCourseCount = filteredCourses.length;
    const displayedCourses = filteredCourses.slice(0, 6);

    useEffect(() => {
        if (data && !getAccessTokenFromCookies()) {
            const curriculums = (data.curriculums || []).map((c) => ({
                value: c.name?.toLowerCase() || c.toLowerCase(),
                label: c.name || c,
            }));
            setCurriculumOptions(curriculums);
        }
    }, [data]);

    const fetchAutocompleteSuggestions = useCallback(
        debounce(async (query) => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }

            // Generate suggestions from current course data
            const courseSuggestions = allCourses
                .filter(
                    (course) =>
                        course.name?.toLowerCase().includes(query.toLowerCase()) ||
                        course.description?.toLowerCase().includes(query.toLowerCase()),
                )
                .map((course) => course.name)
                .slice(0, 5);

            setSuggestions(courseSuggestions);
        }, 300),
        [allCourses],
    );

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        setSuggestions([]);
    };

    const handleClearFilters = () => {
        setSelectedCurriculum("");
        setSearchQuery("");
        setSuggestions([]);
    };

    return (
        <>
            <section className="SectionSixLMS">
                <div className="mb-12 flex flex-col justify-evenly lg:flex-row">
                    <div className="flowerPenDiv relative flex justify-between">
                        <Image
                            src={PenImg}
                            alt="Pen Img"
                            width={100}
                            height={100}
                            className="penimg"
                        />
                        <Image
                            src={FlowerSvg1}
                            alt="Flower Svg"
                            width={80}
                            height={80}
                            className="flowerSvg"
                        />
                    </div>
                    <div className="sixSectxtDiv text-center lg:text-left">
                        <h2>TAILORED CLASSES</h2>
                        <h1>Unique Approaches To Teaching Combined Technology & Learning.</h1>
                    </div>
                    <div className="flowerPenDiv hidden lg:block">
                        <Image
                            src={FlowerSvg}
                            alt="Flower Svg"
                            width={80}
                            height={80}
                            className="flowerSvg1"
                        />
                    </div>
                </div>

                {!getAccessTokenFromCookies() && (
                    <div className="filter-section">
                        <div className="filter-controls">
                            <div className="search-container">
                                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                                {suggestions.length > 0 && (
                                    <ul className="suggestions-list">
                                        {suggestions.map((suggestion, index) => (
                                            <li
                                                key={index}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="suggestion-item"
                                            >
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="dropdown-container">
                                <select
                                    value={selectedCurriculum}
                                    onChange={(e) => setSelectedCurriculum(e.target.value)}
                                    className="dropdown-trigger" 
                                >
                                    {/* Default "placeholder" option */}
                                    <option value="" disabled>
                                        Select Category
                                    </option>

                                    {/* Option for all categories */}
                                    <option value="all">All Categories</option>

                                    {/* Map through your curriculum options */}
                                    {curriculumOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>

                                {(selectedCurriculum || searchQuery) && (
                                    <Button
                                        variant="outline"
                                        onClick={handleClearFilters}
                                        className="h-16 rounded-full border-2 border-orange-500 bg-orange-500 text-white hover:bg-orange-600"
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Courses Grid */}
                <div className="coursesContainer">
                    {isLoading && !data ? (
                        <div className="spinner-container col-span-full">
                            <div className="spinner"></div>
                        </div>
                    ) : error ? (
                        <div className="col-span-full py-16 text-center text-red-600">
                            <h3 className="mb-2 text-xl font-medium">Error loading courses</h3>
                            <p className="mt-2 text-gray-600">{error.message}</p>
                        </div>
                    ) : displayedCourses.length > 0 ? (
                        displayedCourses.map((course) => (
                            <Link href={`/LMScourses/${course.id}`} key={course.id}>
                                <div className="courseDiv">
                                    <div className="courseImg1div relative">
                                        <Image
                                            src={
                                                course.course_pic ||
                                                "/placeholder.svg?height=200&width=300&query=course"
                                            }
                                            fill
                                            alt={course.name}
                                            className="object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "/placeholder.svg?height=200&width=300";
                                            }}
                                        />
                                    </div>
                                    <h2 className="mt-4 mb-2 text-xl font-semibold">
                                        {course.name}
                                    </h2>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="inline-block rounded-md bg-blue-100 px-2 py-1 text-xs">
                                            {course.category}
                                        </span>
                                    </div>
                                    <p className="my-4 line-clamp-3 text-gray-600">
                                        {course.description}
                                    </p>
                                    <div className="mt-6 flex items-center justify-center">
                                        <button className="coursebtn mt-8 flex items-center gap-2">
                                            View Details
                                            <Image
                                                className="coubtnArrow"
                                                src={BtnArrow}
                                                alt="Btn Arrow"
                                                width={16}
                                                height={16}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full flex min-h-[60vh] w-full items-center justify-center">
                            <div className="text-center">
                                <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                <h3 className="text-xl font-semibold text-gray-700">
                                    No courses found.
                                </h3>
                                <p className="mt-2 text-gray-500">
                                    Try adjusting your search or filter selections.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* View All Button */}
                <div className="seeall flex justify-center">
                    <Link href="/LMScourses/all-courses">
                        <button className="coursebtn2 mt-8 flex items-center gap-2">
                            VIEW ALL COURSES {totalCourseCount > 6 && `(${totalCourseCount} TOTAL)`}
                            <Image
                                className="coubtnArrow"
                                src={BtnArrow}
                                alt="Btn Arrow"
                                width={16}
                                height={16}
                            />
                        </button>
                    </Link>
                </div>

                {/* About Mask */}
                <div className="mt-12">
                    <Image
                        src={AboutMask}
                        alt="aboutMask"
                        width={1200}
                        height={200}
                        className="w-full"
                    />
                </div>
            </section>
        </>
    );
}
