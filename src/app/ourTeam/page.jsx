"use client";

import "@/app/aboutUs/aboutStyle.css";
import "./team.css";

import { useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// 🔁 Dynamic components
const Header = dynamic(() => import("../components/header"), { ssr: false });
const Footer = dynamic(() => import("../components/footer"), { ssr: false });
const BannerTeam = dynamic(() => import("./teambanner"), { ssr: false });

import FooterCloudImg from "../image/Footer-cloud-img.png";
import CloudImg from "../image/cloudimg.png";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const teamMembers = [
    {
        id: 1,
        name: "Muhammad Adnan Siddiqui",
        role: "Founder & Chairman",
        image: "/image/team/CEO.jpg",
        description:
            "Founder & Chairman of Online Teachers 1to1, Adnan is a visionary leader using technology to deliver accessible, personalized online education globally. With expertise in finance and digital innovation, he drives data-powered strategies for learner success.",
        social: { facebook: "#", twitter: "#", instagram: "#" },
    },
     {
        id: 2,
        name: "Rabbia Adnan",
        role: "Co-Founder & CEO",
        image: "/image/team/rabbia.jpeg",
        description:
            "A passionate Educator and Trainer with over a decade of experience, dedicated to inspiring learners of all ages. Combining strong academic expertise with hands-on classroom experience, I craft engaging and transformative learning journeys that leave a lasting impact.",
        social: { facebook: "#", twitter: "#", instagram: "#" },
    },
     {
        id: 3,
        name: "Muhammad Salman Siddiqui",
        role: "CFO",
        image: "/image/team/salman.jpg",
        description:
            "Muhammad Salman Siddiqui, CFO of MAS Tech, brings 15+ years of expertise in financial management, governance, and compliance. An associate member of PIPFA, he ensures fiscal transparency, risk control, and sustainable growth, aligning financial strategy with MAS Tech's vision for AI-driven business solutions.",
        social: { facebook: "#", twitter: "#", instagram: "#" },
    },
    {
        id: 4,
        name: "Alina Baber",
        role: "CTO, Sr. AI & Robotics Scientist",
        image: "/image/team/alina.png",
        description:
            "CTO of MAS Tech and expert in AI, ML, and Robotics, Alina drives innovation in automation and cloud-based AI systems while advising on national AI strategies and delivering cutting-edge tech to global clients.",
        social: { facebook: "#", twitter: "#", instagram: "#" },
    },
     {
        id: 5,
        name: "Rabia Akhtar",
        role: "Curriculum Head",
        image: "/image/team/rabia.jpeg",
        description:
            "Rabia oversees academic quality and curriculum development at Online Teachers 1to1. A seasoned educator, she ensures personalized, high-standard learning experiences across subjects and grade levels.",
        social: { facebook: "#", twitter: "#", instagram: "#" },
    },
      {
        id: 6,
        name: "Muhammad Anas Ahmed",
        role: "Digital Marketer and brand strategist",
        image: "/image/team/anas.png",
        description:
            "Anas is a skilled professional in digital marketing, brand identity, marketing strategy, and operations. He creates impactful solutions that boost growth, enhance brand presence, and improve efficiency. Known for his innovation and strategic execution, he delivers results aligned with organizational goals.",
        social: { facebook: "#", twitter: "#", instagram: "#" },
    },
    {
        id: 7,
        name: "Zenobia Wasif",
        role: "Sports Curriculum Head",
        image: "/image/team/zenobia.jpeg",
        description:
            "National Master and pioneer of women's chess in Pakistan, Zenobia leads sports education with over 22 years of experience. Founder of FIDE Chess Academy, she mentors future talent in a structured, inclusive environment.",
        social: { facebook: "#", twitter: "#", instagram: "#" },
    },
    {
        id: 8,
        name: "Aziz Baber Hussain",
        role: "Music Head",
        image: "/image/team/azizbaber.jpeg",
        description:
            "Musician and multimedia artist, Aziz brings creativity to Online Teachers 1to1's music curriculum. A NAPA graduate, he blends performance, composition, and digital media to foster student expression and innovation.",
        social: { facebook: "#", twitter: "#", instagram: "#" },
    },
   
];

export default function OurTeam() {
    const headerRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        cardsRef.current = [];

        if (headerRef.current) {
            gsap.fromTo(
                headerRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
            );
        }

        setTimeout(() => {
            if (cardsRef.current.length > 0) {
                gsap.fromTo(
                    cardsRef.current,
                    { opacity: 0, y: 100, scale: 0.9 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        stagger: 0.2,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: cardsRef.current[0],
                            start: "top 90%",
                            toggleActions: "play none none reverse",
                        },
                    },
                );
            }
        }, 300); // Delay animations slightly for smoother UX

        cardsRef.current.forEach((card) => {
            if (card) {
                const enter = () => gsap.to(card, { y: -10, scale: 1.05, duration: 0.3 });
                const leave = () => gsap.to(card, { y: 0, scale: 1, duration: 0.3 });
                card.addEventListener("mouseenter", enter);
                card.addEventListener("mouseleave", leave);
                card._gsapHandlers = { enter, leave };
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            cardsRef.current.forEach((card) => {
                if (card && card._gsapHandlers) {
                    card.removeEventListener("mouseenter", card._gsapHandlers.enter);
                    card.removeEventListener("mouseleave", card._gsapHandlers.leave);
                }
            });
        };
    }, []);

    const addToRefs = (el) => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };

    return (
        <>
            <section className="hero-section">
                <Header />

                <section className="py-4">
                    <Image
                        src={CloudImg}
                        className="cloudImgabout mx-auto"
                        alt="Cloud Img"
                        priority
                    />
                </section>

                <BannerTeam />

                <div className="team-container">
                    <div className="teamGrid">
                        {teamMembers.map((member) => (
                            <div key={member.id} className="teamCard" ref={addToRefs}>
                                <div className="imageContainer">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        width={300}
                                        height={300}
                                        className="memberImage"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="cardContent">
                                    <p className="role">{member.role}</p>
                                    <h3 className="name">{member.name}</h3>
                                    <p className="description">{member.description}</p>
                                       <div className="socialLinks">
                                        <a href={member.social.facebook} className="socialLink">
                                            <svg
                                                width="20"
                                                height="20"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                        </a>
                                        <a href={member.social.twitter} className="socialLink">
                                            <svg
                                                width="20"
                                                height="20"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M23.954 4.569c-.885.392-1.83.656-2.825.775a4.932 4.932 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.918 4.918 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096A4.904 4.904 0 01.964 9.12v.06a4.926 4.926 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417A9.867 9.867 0 010 19.54a13.94 13.94 0 007.548 2.212c9.058 0 14.01-7.504 14.01-14.01 0-.213-.005-.426-.014-.637A9.936 9.936 0 0024 4.59z" />
                                            </svg>
                                        </a>
                                        <a href={member.social.instagram} className="socialLink">
                                            <svg
                                                width="20"
                                                height="20"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92C2.174 15.395 2.163 15.016 2.163 12c0-3.204.013-3.583.07-4.849C2.382 3.924 3.897 2.38 7.152 2.232 8.418 2.174 8.796 2.163 12 2.163zm0 1.837c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="FooterCloudImgDiv mt-20 md:mt-28">
                    <Image
                        src={FooterCloudImg}
                        alt="Footer Cloud"
                        className="FooterCloudImg mx-auto"
                        loading="lazy"
                    />
                </div>

                <Footer />
            </section>
        </>
    );
}
