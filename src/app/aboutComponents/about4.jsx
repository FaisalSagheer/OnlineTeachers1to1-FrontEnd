"use client";
import "../ourServices/services.css";
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

gsap.registerPlugin(ScrollTrigger);
export default function About4() {
    const sectionRef = useRef(null);

//  useEffect(() => {
//     // A single, more performant animation for all service cards
//     gsap.from(".service-card", {
//         opacity: 0,
//         y: 100,
//         // --- FASTER ---
//         duration: 0.5, // Reduced from 0.8
//         stagger: 0.15,  // Reduced from 0.2, makes cards appear in quicker succession
//         // ---
//         ease: "power3.out",
//         scrollTrigger: {
//             // Use a single trigger for the container of all cards
//             trigger: ".service-card-container", // Add this class to your cards' parent div
//             start: "top 85%",
//             toggleActions: "play none none reverse",
//         },
//     });

//     // Animation for the header
//     gsap.from(".services-header h2", {
//         y: 50,
//         opacity: 0,
//         // --- FASTER ---
//         duration: 0.7, // Reduced from 1
//         // ---
//         ease: "power3.out",
//         scrollTrigger: {
//             trigger: ".services-header",
//             start: "top 90%",
//         },
//     });
// }, []);

    return (
            <section className="services-section" ref={sectionRef}>
                   <div className="services-header">
        <h2>Our Services</h2>
        <p>Check the services we provide</p>
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
    );
}

const services = [
    {
        title: "Tailored Tutoring",
        description:
            "We offer personalized 1-to-1 tutoring services tailored to meet each student’s unique learning needs, pace, and academic goals. Our expert tutors design customized lesson plans, provide focused support in core subjects, and use interactive tools to enhance understanding and engagement. Whether it’s exam preparation, homework help, concept clarification, or skill development, our sessions are flexible, goal-oriented, and student-centered to ensure effective learning outcomes.",
        icon: <FaChalkboardTeacher />,
    },
    {
        title: "Preparatory Classes",
        description:
            "We offer comprehensive preparatory online classes for all levels, tailored to meet the academic needs of students from early years to higher grades. Our programs are designed to strengthen foundational concepts, enhance subject knowledge, and build exam confidence through interactive one-on-one or small group sessions. With expert educators, flexible scheduling, and engaging digital tools, we ensure personalized attention and measurable progress, making learning effective and enjoyable for every student.",
        icon: <FaSchool />,
    },
    {
        title: "Virtual School",
        description:
            "Our virtual school provides a complete online learning experience with structured classes, qualified teachers, and interactive digital resources. We offer a full academic curriculum aligned with educational standards, including regular assessments, progress tracking, and parent-teacher communication. Students learn from the comfort of home through live sessions, recorded lessons, and engaging activities that promote independent thinking, collaboration, and academic growth in a safe, tech-friendly environment.",
        icon: <FaLaptopHouse />,
    },
    {
        title: "Specialized Support",
        description:
            "We provide specialized learning support for children with ADHD and Autism through structured, compassionate, and individualized online sessions. Our trained educators use evidence-based strategies, visual aids, sensory-friendly tools, and flexible routines to create a calm, engaging, and supportive environment. Each lesson is tailored to the child’s strengths, needs, and pace, focusing on building attention, communication, academic skills, and confidence. We work closely with parents to ensure consistency, progress, and positive learning experiences.",
        icon: <FaPuzzlePiece />,
    },
    {
        title: "Skill Development",
        description:
            "We offer comprehensive skill development services in sports, music, arts, and fine motor activities to support holistic growth in children and young learners. Our programs include structured training in painting, crafting, instrument playing, singing, and basic sports, all designed to boost creativity, coordination, and confidence. Fine motor skill sessions focus on activities like cutting, drawing, beading, and writing to enhance hand-eye coordination and precision. Led by experienced instructors, each session is tailored to individual abilities, fostering talent and developmental progress in a fun, engaging environment.",
        icon: <FaPaintBrush />,
    },
    {
        title: "Sports & Motor Skills",
        description:
            "Physical training and fine motor development activities like writing, beading, and sports for holistic growth .",
        icon: <MdSportsHandball />,
    },
];
