"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import BtnArrow from "../image/btnarrow.svg";
import Link from "next/link";
import NewsletterStarSvg from "../image/newsletterStarSvg.svg";
import Logo from "../image/Online Teachers 1 to 1 transparent.png";
import { CiInstagram } from "react-icons/ci";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import PaymentIcon1 from "../image/payment-icon-1.png";
import PaymentIcon2 from "../image/payment-icon-2.png";
import PaymentIcon3 from "../image/payment-icon-3.png";
import PaymentIcon4 from "../image/payment-icon-4.png";
import PaymentIcon5 from "../image/payment-icon-5.png";
import PaymentIcon6 from "../image/payment-icon-6.png";
import PaymentIcon7 from "../image/payment-icon-7.png";
import Sunflower from "../image/sunflower.png";
import DotsImg from "../image/dots.png";
import Musroom from "../image/musroom.png";

const quickLinks = [
    { href: "/aboutUs", label: "About" },
    { href: "/LMScourses", label: "Courses" },
    { href: "/teacher/viewTeachers", label: "Teachers" },
    { href: "/ourTeam", label: "Team" },
    { href: "/ourServices", label: "Services" },
    { href: "/contactUs", label: "Contact" },
    { href: "/parent/dashboard", label: "Parent Portal" },
];

export default function Footer() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => date.toLocaleDateString();

    return (
        <>
            <section className="FooterSection">
                {/* Newsletter Section */}
                <div className="footerBgColor flex justify-center">
                    <div className="ourNewsLetter flex flex-col items-center gap-3 text-center">
                        <h3>JOIN OUR COMMUNITY</h3>
                        <h2>Start your learning journey with 25% off your first session.</h2>
                        <p>
                            Subscribe for expert study tips, progress updates, and exclusive offers.
                        </p>
                        <div className="mt-5 flex flex-wrap items-center justify-center gap-5">
                            <input
                                type="text"
                                className="newsLetterInput"
                                placeholder="Enter Your Email ID"
                            />
                            <button className="footerbtn flex items-center gap-2">
                                SUBSCRIBE
                                <Image className="footerbtnArrow" src={BtnArrow} alt="Btn Arrow" />
                            </button>
                        </div>

                        <Image
                            src={NewsletterStarSvg}
                            alt="newsletterStarSvg"
                            className="newsletterStarSvg"
                        />
                    </div>
                </div>

                {/* Footer Main Section */}
                <div className="footerBgColor pb-10">
                    <div className="mx-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:max-w-[96rem]">
                        <div className="footerLogoDiv flex flex-col">
                            <Link href="/">
                                <Image
                                    src={Logo}
                                    alt="logo"
                                    className="footerlogo"
                                    width={200}
                                    height={100}
                                />
                            </Link>
                            <p>
                                OnlineTeachers1to1 provides high-quality, personalized online
                                tutoring for students of all ages. Our mission is to empower
                                learners through interactive, flexible, and expert-led education.
                            </p>
                            <div className="socialslink mt-4 flex gap-3 pt-3 max-lg:pt-1">
                                <a
                                    href="https://www.instagram.com/onlineteachers1to1?igsh=emhxZDU1NHJ2MnVq"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <CiInstagram className="socialIcon" />
                                </a>

                                <a
                                    href="https://www.facebook.com/onlineteachers1to1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FaFacebookF className="socialIcon" />
                                </a>

                                <a
                                    href="https://www.youtube.com/@onlineteachers1to1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FaYoutube className="socialIcon" />
                                </a>

                                <a
                                    href="https://twitter.com/onlineteach1to1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <BsTwitterX className="socialIcon" />
                                </a>
                            </div>
                            <Image src={Sunflower} alt="Sunflower" className="Sunflower" />
                        </div>
                        <div className="footerUesFull">
                            <h2>Quick Links</h2>
                            <ul>
                                {quickLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href}>{link.label}</Link>
                                    </li>
                                ))}
                            </ul>
                            <Image src={DotsImg} alt="DotsImg" className="DotsImg" />
                        </div>

                        <div className="footerCustServ">
                            <h2>Services</h2>
                            <ul>
                                <li>
                                    <p>Tailored Tutoring</p>
                                </li>
                                <li>
                                    <p>Preparatory Classes</p>
                                </li>
                                <li>
                                    <p>Specialized Support</p>
                                </li>
                                <li>
                                    <p>IT Ignite</p>
                                </li>
                                <li>
                                    <p>Sports & Motor Skills</p>
                                </li>
                                <li>
                                    <p>24/7 Support</p>
                                </li>
                            </ul>
                            <Image src={Musroom} alt="Musroom" className="Musroom" />
                        </div>

                        <div className="footergetTouch max-w-md text-left">
                            <h2 className="mb-2 text-xl font-semibold">Contact Us</h2>

                            <p className="text-left text-sm leading-relaxed">
                                Office B-50, 1st Floor Oman Avenues Mall,
                                <br />
                                P.O.Box 436, P.C130,
                                <br />
                                Baushar, Muscat,
                                <br />
                                Sultanate of Oman.
                            </p>

                            <ul className="mt-4 text-sm">
                                <li className="grid grid-cols-[80px_auto] gap-2">
                                    <span className="font-semibold">Whatsapp:</span>
                                    <span>(+968) 9428 2781</span>
                                </li>
                                <li className="grid grid-cols-[80px_auto] gap-2">
                                    <span className="font-semibold">Call Us:</span>
                                    <span>(+968) 2114 2250</span>
                                </li>
                                <li className="grid grid-cols-[80px_auto] gap-2">
                                    <span className="font-semibold">E-Mail:</span>
                                    <span>info@onlineteacher1to1.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom with Date and Time */}
                <div className="footerEndDiv flex flex-wrap items-center justify-between px-5 py-3">
                    <h3>© 2025| OnlineTeacher1To1. All Rights Reserved.</h3>
                    <div className="flex items-center justify-center gap-2">
                        <Image src={PaymentIcon1} alt="PaymentIcon1" className="PaymentIcon1" />
                        <Image src={PaymentIcon2} alt="PaymentIcon2" className="PaymentIcon1" />
                        <Image src={PaymentIcon3} alt="PaymentIcon3" className="PaymentIcon1" />
                        <Image src={PaymentIcon4} alt="PaymentIcon4" className="PaymentIcon1" />
                        <Image src={PaymentIcon5} alt="PaymentIcon5" className="PaymentIcon1" />
                        <Image src={PaymentIcon6} alt="PaymentIcon6" className="PaymentIcon1" />
                        <Image src={PaymentIcon7} alt="PaymentIcon7" className="PaymentIcon1" />
                    </div>
                </div>
            </section>
        </>
    );
}
