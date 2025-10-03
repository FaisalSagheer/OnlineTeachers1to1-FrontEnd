"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MdPhone } from "react-icons/md";
import { RiMenuFill, RiCloseFill } from "react-icons/ri";
import { User, LogOut, Settings } from "lucide-react";
import Logo from "../image/Online Teachers 1 to 1 transparent.png";
import { IoLocationSharp, IoMail } from "react-icons/io5";
import HeartIcon from "../image/hearticon.svg";
import ProfileIcon from "../image/profile-icon.png";
import Spinner from "./spinner";
import { usePathname, useRouter } from "next/navigation";
import "../style.css";
import Cookies from "js-cookie";
import { Button } from "../../components/ui/button";
import { FaWhatsapp } from "react-icons/fa";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/aboutUs", label: "About" },
    { href: "/LMScourses", label: "Courses" },
    { href: "/teacher/viewTeachers", label: "Teachers" },
    { href: "/ourTeam", label: "Team" },
    { href: "/ourServices", label: "Services" },
    { href: "/contactUs", label: "Contact" },
];

const ProfileDropdown = ({ userInfo, handleLogout, loggingOut, onItemClick, avatarSize = 32 }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const handleClick = (path) => {
    router.push(path);
    if (onItemClick) onItemClick();
    setOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
   <Button
    onClick={() => setOpen((prev) => !prev)}
  variant="ghost"
  className="focus-visible:ring-ring relative rounded-full p-0 focus-visible:ring-2 focus-visible:ring-offset-2"
  style={{ height: `${avatarSize}px`, width: `${avatarSize}px` }}
>
  <Image
    src={userInfo?.avatar || ProfileIcon}
    alt="Profile"
    className="profile-icon rounded-full object-cover"
    fill
    sizes={`${avatarSize}px`}
  />
</Button>


      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          {/* User Info */}
          <div className="px-2 py-1.5 text-sm font-semibold">
            <div className="flex flex-col space-y-1">
              <p className="truncate text-sm font-medium leading-none">
                {userInfo?.user?.username || "User"}
              </p>
              <p className="truncate text-xs leading-none text-muted-foreground">
                {userInfo?.user?.email || "user@example.com"}
              </p>
            </div>
          </div>

          {/* Separator */}
          <div className="-mx-1 my-1 h-px bg-muted" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-red-600 outline-none transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            <span>{loggingOut ? "Logging out..." : "Log out"}</span>
          </button>
        </div>
      )}
    </div>
  );
};


export default function Header() {
    const [query, setQuery] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [loggingOut, setLoggingOut] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    const container = useRef();
    const tl = useRef(null);

    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timeout);
    }, [pathname]);

    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = Cookies.get("accessToken");
            if (!accessToken) {
                setIsLoggedIn(false);
                setUserInfo(null);
                setAuthLoading(false);
                return;
            }
            const cached = localStorage.getItem("userInfo");
            if (cached) {
                setUserInfo(JSON.parse(cached));
                setIsLoggedIn(true);
                setAuthLoading(false);
                return;
            }
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-info/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setUserInfo(data);
                    setIsLoggedIn(true);
                    localStorage.setItem("userInfo", JSON.stringify(data));
                } else {
                    setIsLoggedIn(false);
                    setUserInfo(null);
                    localStorage.removeItem("userInfo");
                    Cookies.remove("accessToken");
                }
            } catch (error) {
                console.error("Failed to fetch user info:", error);
                setIsLoggedIn(false);
                setUserInfo(null);
            } finally {
                setAuthLoading(false);
            }
        };
        checkAuth();
    }, []);

    useGSAP(
        () => {
            tl.current = gsap
                .timeline({ paused: true })
                .to(".mobile-sidebar", { x: 0, duration: 0.4, ease: "power2.out" })
                .to(".mobile-menu-overlay", { opacity: 1, duration: 0.3, ease: "power2.out" }, 0)
                .from(
                    ".mobile-menu-item",
                    {
                        x: 50,
                        opacity: 0,
                        duration: 0.3,
                        stagger: 0.05,
                        ease: "power2.out",
                    },
                    0.2,
                );
        },
        { scope: container },
    );

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logout/`, {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.warn("Backend logout failed or not implemented:", err.message);
        } finally {
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            localStorage.removeItem("userInfo");
            setIsLoggedIn(false);
            setUserInfo(null);
            router.push("/login");
            setLoggingOut(false);
            if (isMobileMenuOpen) closeMobileMenu();
        }
    };

    const openMobileMenu = () => {
        setIsMobileMenuOpen(true);
        tl.current?.play();
        document.body.style.overflow = "hidden";
    };

    const closeMobileMenu = () => {
        tl.current?.reverse().then(() => {
            setIsMobileMenuOpen(false); // Set state after animation reverses
        });
        document.body.style.overflow = "unset";
    };

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isMobileMenuOpen) {
                closeMobileMenu();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isMobileMenuOpen]);

    const handleInputChange = (e) => setQuery(e.target.value);
    

    return (
        <>
            {loading && <Spinner />}
            <div className="headerclass" ref={container}>
                <header className="header-top-section">
                    {/* LEFT SIDE: All contact details are now inside the orange box */}
                    <div className="location-div">
                        <div className="location-item">
                            <IoLocationSharp className="location-icon" />
                            <span>WorldWide</span>
                        </div>
                        <div className="header-phone">
                            <FaWhatsapp className="phone-icon" />
                            <Link href="tel:(+968) 9428 2781">
                                <span>(+968) 9428 2781</span>
                            </Link>
                        </div>
                        <div className="header-email">
                            <IoMail className="email-icon" />
                            <Link href="mailto:info@onlineteachers1to1.com">
                                <span>info@onlineteachers1to1.com</span>
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Project Attribution in a single line */}
                    <div className="contact-info">
                        <div className="project-by-container">
                            <span className="project-by-text">Produced by</span>
                            <a
                                href="https://masfirms.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image
                                    src="/image/masfirms-logo.png"
                                    alt="MAS Group"
                                    width={80}
                                    height={30}
                                    className="company-logo"
                                />
                            </a>
                            <span className="produced-by-text">A Project by</span>
                            <a
                                href="https://mastechz.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image
                                    src="/image/mastech-logo.png"
                                    alt="Mastech"
                                    width={90}
                                    height={30}
                                    className="company-logo"
                                />
                            </a>
                        </div>
                    </div>
                </header>

                <section className="menu-section">
                    <div className="logo-container">
                        <Link href="/">
                            <Image
                                src={Logo}
                                alt="Online Teachers 1 to 1 Logo"
                                width={250}
                                height={60}
                                priority
                            />
                        </Link>
                    </div>
                    <nav className="desktop-menu">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="menu-link">
                                <h2>
                                    <span>{link.label}</span>
                                    <Image src={HeartIcon} alt="" className="heart-icon" />
                                </h2>
                            </Link>
                        ))}
                    </nav>
                    <div className="header-icons">
                        {authLoading ? (
                            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
                        ) : isLoggedIn ? (
                            <ProfileDropdown
                                userInfo={userInfo}
                                handleLogout={handleLogout}
                                loggingOut={loggingOut}
                            />
                        ) : (
                            <Link
                                    href="/login"
                                    onClick={closeMobileMenu}
                                    className="menu-link font-semibold"
                                >
                                    <div className="mobile-menu-link">
                                        <span>Login</span>
                                        <Image
                                            src={HeartIcon}
                                            alt=""
                                            className="mobile-heart-icon"
                                        />
                                    </div>
                                </Link>
                        )}
                    </div>
                    <button
                        className="hamburger-button"
                        onClick={openMobileMenu}
                        aria-label="Open mobile menu"
                    >
                        <RiMenuFill className="hamburger-icon" />
                    </button>
                </section>
                <div
                    className={`mobile-menu-overlay ${isMobileMenuOpen ? "active" : ""}`}
                    onClick={closeMobileMenu}
                />
                <div className={`mobile-sidebar ${isMobileMenuOpen ? "active" : ""}`}>
                    <div className="mobile-menu-header">
                        <Image src={Logo} alt="logo" width={150} height={40} />
                        <button
                            className="close-button"
                            onClick={closeMobileMenu}
                            aria-label="Close mobile menu"
                        >
                            <RiCloseFill />
                        </button>
                    </div>
                    <nav className="mobile-menu-nav">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="mobile-menu-item"
                                onClick={closeMobileMenu}
                            >
                                <div className="mobile-menu-link">
                                    <span>{link.label}</span>
                                    <Image src={HeartIcon} alt="" className="mobile-heart-icon" />
                                </div>
                            </Link>
                        ))}
                        <div className="mobile-menu-footer">
                            {authLoading ? (
                                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
                            ) : isLoggedIn ? (
                                <ProfileDropdown
                                    userInfo={userInfo}
                                    handleLogout={handleLogout}
                                    loggingOut={loggingOut}
                                    onItemClick={closeMobileMenu}
                                    avatarSize={30}
                                />
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={closeMobileMenu}
                                    className="menu-link font-semibold"
                                >
                                    <div className="mobile-menu-link">
                                        <span>Login</span>
                                        <Image
                                            src={HeartIcon}
                                            alt=""
                                            className="mobile-heart-icon"
                                        />
                                    </div>
                                </Link>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
}
