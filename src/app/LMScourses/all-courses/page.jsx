"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { X, ChevronRight } from "lucide-react";
import "../LMScourses.css";
import "./all-courses.css";

const fetcher = async (url, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, { headers });
    if (!response.ok) throw new Error("Fetch error");
    return response.json();
};

// Debounce utility
const debounce = (func, delay) => {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
};

export default function AllCourses() {
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedCurriculum, setSelectedCurriculum] = useState("");
    const [curriculumOptions, setCurriculumOptions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [curriculums, setCurriculums] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [displayedCourses, setDisplayedCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCourses, setTotalCourses] = useState(0);

    const coursesPerPage = 6;
    const totalNumbers = 3; // number of page buttons around current page
    const totalBlocks = totalNumbers + 2; // including first and last

    const getAccessToken = () => {
        if (typeof document !== "undefined") {
            const cookies = document.cookie.split(";");
            const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("accessToken="));
            return tokenCookie ? tokenCookie.split("=")[1] : null;
        }
        return null;
    };
    const token = getAccessToken();

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const endpoint = token ? "/api/user-home/" : "/api/home/";
                const data = await fetcher(endpoint, token);

                const courses = data.courses || [];
                setAllCourses(courses);
                setDisplayedCourses(courses);
                setTotalCourses(courses.length);

                if (!token && data.curriculums) {
                    const curriculumOptions = data.curriculums.map((c) => ({
                        value: c.name?.toLowerCase() || c.toLowerCase(),
                        label: c.name || c,
                    }));
                    setCurriculumOptions(curriculumOptions);
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setAllCourses([]);
                setDisplayedCourses([]);
                setTotalCourses(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [token]);

    useEffect(() => {
        let filtered = [...allCourses];

        if (searchTerm) {
            filtered = filtered.filter(
                (course) =>
                    course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    course.description?.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        if (selectedCategory !== "all") {
            filtered = filtered.filter(
                (course) => course.category && course.category.toLowerCase() === selectedCategory,
            );
        }

        // Updated curriculum filtering logic to match section-two-lms
        if (selectedCurriculum && selectedCurriculum !== "all") {
            filtered = filtered.filter(
                (course) => course.curriculum?.toLowerCase() === selectedCurriculum.toLowerCase(),
            );
        }

        setDisplayedCourses(filtered);
        setTotalCourses(filtered.length);
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, selectedCurriculum, allCourses]);

    // Debounced autocomplete suggestions
    const fetchAutocompleteSuggestions = useCallback(
        debounce((query) => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }

            const courseSuggestions = allCourses
                .filter((course) => course.name?.toLowerCase().includes(query.toLowerCase()))
                .map((course) => course.name)
                .slice(0, 5);

            setSuggestions(courseSuggestions);
        }, 300),
        [allCourses],
    );

    useEffect(() => {
        if (searchTerm) {
            fetchAutocompleteSuggestions(searchTerm);
        } else {
            setSuggestions([]);
        }
    }, [searchTerm, fetchAutocompleteSuggestions]);

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setSuggestions([]);
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("all");
        setSelectedCurriculum("");
        setSuggestions([]);
    };

    // Pagination logic
    const totalPages = Math.ceil(totalCourses / coursesPerPage);

    const currentCourses = useMemo(() => {
        const startIndex = (currentPage - 1) * coursesPerPage;
        return displayedCourses.slice(startIndex, startIndex + coursesPerPage);
    }, [currentPage, displayedCourses]);

    const getPageNumbersWithDots = () => {
        if (totalPages <= totalBlocks) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages = [];
        const leftBound = Math.max(currentPage - 1, 2);
        const rightBound = Math.min(currentPage + 1, totalPages - 1);

        pages.push(1);

        if (leftBound > 2) pages.push("…");

        for (let i = leftBound; i <= rightBound; i++) {
            pages.push(i);
        }

        if (rightBound < totalPages - 1) pages.push("…");

        pages.push(totalPages);

        return pages;
    };

    const pageNumbers = getPageNumbersWithDots();

    return (
        <div className="coursesWrapper">
            {/* Filter Section */}
            <div className="filter-section">
                <div className="filter-controls">
                    <div className="search-container">
                        <Input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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

                    {!token && (
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

                            {(searchTerm || selectedCategory !== "all" || selectedCurriculum) && (
                                <Button
                                    variant="outline"
                                    onClick={handleClearFilters}
                                    className="clear-button bg-transparent"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Clear
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Courses Grid */}
            <div className="coureAnimeDiv coursesContainer flex flex-wrap" style={{ marginBottom: "auto"}}>
                {isLoading ? (
                    <div className="spinner-container">
                        <div className="spinner"></div>
                    </div>
                ) : currentCourses.length > 0 ? (
                    currentCourses.map((course) => (
                        <Link href={`/LMScourses/${course.id}`} key={course.id}>
                            <div className="courseDiv">
                                <div className="courseImg1div relative overflow-hidden">
                                    <Image
                                        src={course.course_pic || "/placeholder.svg"}
                                        fill
                                        alt={course.name}
                                        className="courseImg1"
                                        loading="lazy"
                                    />
                                </div>
                                <h2>{course.name}</h2>
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <span className="categoryBadge">
                                        {course.category || "Uncategorized"}
                                    </span>
                                </div>
                                <p className="my-4 line-clamp-6">{course.description}</p>
                                <div
                                    className="flex items-center justify-center"
                                    style={{ paddingTop: "20px" }}
                                >
                                    <button className="coursebtn flex items-center gap-2">
                                        View Details
                                        <ChevronRight className="coubtnArrow h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="w-full py-16 text-center">
                        <h3 className="mb-2 text-xl font-medium text-gray-700">
                            No courses found.
                        </h3>
                        <p className="mt-2 text-gray-600">
                            Try adjusting your search or filter options.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="paginationWrapper mt-4 flex justify-center gap-2">
                    <Pagination>
                        <PaginationContent>
                            {/* Previous */}
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    className={
                                        currentPage === 1
                                            ? "pointer-events-none opacity-50"
                                            : "paginationButton"
                                    }
                                />
                            </PaginationItem>

                            {/* Page Numbers */}
                            {pageNumbers.map((page, index) => (
                                <PaginationItem key={index}>
                                    {page === "…" ? (
                                        <span className="paginationDots">…</span>
                                    ) : (
                                        <PaginationLink
                                            onClick={() => setCurrentPage(page)}
                                            isActive={currentPage === page}
                                            className={
                                                currentPage === page
                                                    ? "paginationActive"
                                                    : "paginationButton"
                                            }
                                        >
                                            {page}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}

                            {/* Next */}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                    }
                                    className={
                                        currentPage === totalPages
                                            ? "pointer-events-none opacity-50"
                                            : "paginationButton"
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
