"use client";
import "@/app/aboutUs/aboutStyle.css";
import "./services.css";
import {
    FaChalkboardTeacher,
    FaSchool,
    FaLaptopHouse,
    FaPuzzlePiece,
    FaPaintBrush,
} from "react-icons/fa";
import { MdSportsHandball } from "react-icons/md";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useRef, useEffect } from "react";

import Header from "../components/header";
import FooterCloudImg from "../image/Footer-cloud-img.png";
import CloudImg from "../image/cloudimg.png";
import Footer from "../components/footer";
import BannerService from "./servcieBanner";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        // It's a good practice to use a context for GSAP to scope the selectors
        // and make cleanup easier.
        let ctx = gsap.context(() => {
            // Set the initial state of the cards to be invisible
            gsap.set(".service-card", { opacity: 0, y: 100 });
            gsap.set(".services-header h2", { opacity: 0, y: 50 });

            // Animate the header
            gsap.to(".services-header h2", {
                opacity: 1,
                y: 0,
                duration: 0.8, // Slightly faster duration
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".services-header",
                    start: "top 90%",
                },
            });

            // Animate the service cards with a stagger
            gsap.to(".service-card", {
                opacity: 1,
                y: 0,
                duration: 0.6, // Faster duration for each card
                ease: "power3.out",
                stagger: 0.15, // Reduced stagger for a quicker sequence
                scrollTrigger: {
                    trigger: ".services-grid", // Trigger based on the grid container
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            });
        }, sectionRef); // Scope the context to the sectionRef

        // Cleanup function to revert animations
        return () => ctx.revert();
    }, []);

    return (
        <div>
            <Header />

            <section className="py-4">
                <Image src={CloudImg} className="cloudImgabout mx-auto" alt="Cloud Img" />
            </section>

            <BannerService />
            {/* The ref is attached to the main section to scope our GSAP selectors */}
            <section className="services-section" ref={sectionRef}>
                <div className="services-header text-center">
                    <p className="services-header-subtitle">CHECK THE SERVICES WE PROVIDE</p>
                </div>
                <div className="services-grid">
                    {services.map((service, index) => (
                        <div className="service-card" key={index}>
                            <div className="service-icon">{service.icon}</div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-description">{service.description} </p>
                        </div>
                    ))}
                </div>
            </section>
            <div className="FooterCloudImgDiv mt-20 md:mt-28">
                <Image src={FooterCloudImg} alt="Footer Cloud" className="FooterCloudImg mx-auto" />
            </div>

            <Footer />
        </div>
    );
}

const services = [
    {
        title: "Tailored Tutoring",
        description:
            "We provide highly personalized 1-to-1 tutoring services designed to match each student’s unique learning style, pace, and academic goals. Our qualified tutors create customized lesson plans, offer targeted support in core subjects, and use interactive tools to simplify complex concepts. Whether it’s exam preparation, homework assistance, skill enhancement, or concept mastery, our sessions remain flexible, goal-driven, and student-centered — ensuring effective learning outcomes with measurable progress.",
        icon: <FaChalkboardTeacher size={48} className="text-blue-600" />,
    },
    {
        title: "Preparatory Classes",
        description:
            "Our preparatory classes are structured to meet the academic needs of students across all grade levels. These online sessions focus on strengthening core foundations, boosting subject understanding, and building exam confidence through interactive one-on-one and small group formats. With experienced educators, flexible scheduling, and engaging digital resources, we provide a comprehensive program that ensures every student learns effectively, grows academically, and develops the confidence to succeed.",
        icon: <FaSchool size={48} className="text-blue-600" />,
    },
    {
        title: "Virtual School",
        description:
            "Our virtual school offers a complete online education experience supported by a structured curriculum, skilled teachers, and interactive resources. Students benefit from live classes, recorded lessons, and digital activities designed to encourage independent thinking and collaboration. Regular assessments, progress tracking, and open communication with parents ensure transparency and consistent growth. Learning from the comfort of home becomes engaging, safe, and academically enriching.",
        icon: <FaLaptopHouse size={48} className="text-blue-600" />,
    },
    {
        title: "Specialized Support",
        description:
            "We offer specialized programs for children with ADHD and Autism, designed to create a calm, structured, and supportive online environment. Our trained educators use evidence-based strategies, sensory-friendly tools, and personalized lesson plans that match each child’s strengths and needs. These sessions focus on enhancing focus, communication, academics, and confidence while maintaining flexible routines. Close collaboration with parents ensures steady progress, consistency, and positive learning experiences.",
        icon: <FaPuzzlePiece size={48} className="text-blue-600" />,
    },
    {
        title: "IT Ignite",
        description:
         "IT Ignite is a dynamic platform that equips learners with essential technology skills, innovative thinking, and hands-on knowledge. Our program blends interactive sessions, practical training, and expert guidance to help participants master digital tools, explore emerging tech trends, and apply solutions in real-world contexts. Each session is designed to strengthen problem-solving, creativity, and confidence, ensuring learners stay future-ready in a fast-paced digital world. With engaging, structured, and skill-focused activities, IT Ignite bridges the gap between learning and implementation, empowering individuals to thrive in information technology.",
        icon: <FaPaintBrush size={48} className="text-blue-600" />,
    },
    {
        title: "Sports & Motor Skills",
        description:
            "Our sports and motor skills program combines physical training with fine motor development to support overall growth. Activities include structured sports practice, fitness routines, and precision-based exercises such as writing, beading, and drawing. These sessions are designed to enhance physical strength, coordination, and motor control, while building confidence and discipline. Through guided, age-appropriate activities, we ensure children develop both physical fitness and essential movement skills in a safe, fun, and encouraging environment.",
        icon: <MdSportsHandball size={48} className="text-blue-600" />,
    },
];
