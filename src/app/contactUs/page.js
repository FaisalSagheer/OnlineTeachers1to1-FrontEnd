"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Suspense } from "react";

import "../style.css";
import "../aboutUs/aboutStyle.css";
import "./contactusStyle.css";

import CloudImg from "../image/cloudimg.png";
import FooterCloudImg from "../image/Footer-cloud-img.png";

// ⏳ Lazy-load heavy components
const Header = dynamic(() => import("../components/header"), { ssr: false });
const Footer = dynamic(() => import("../components/footer"), { ssr: false });
const ContactBanner = dynamic(() => import("../contactComponents/contactBanner"), { ssr: false });
const ContactSection = dynamic(() => import("../contactComponents/contactSection"), { ssr: false });

export default function ContactUS() {
    return (
        <>
            <Suspense fallback={<div className="py-10 text-center">Loading Header...</div>}>
                <Header />
            </Suspense>

            <section>
                <Image
                    src={CloudImg}
                    className="cloudImgabout"
                    alt="Cloud Img"
                    priority // 🧠 Ensure this loads fast
                />
            </section>

            <Suspense fallback={<div className="py-10 text-center">Loading Banner...</div>}>
                <ContactBanner />
            </Suspense>

            <Suspense
                fallback={<div className="py-10 text-center">Loading Contact Section...</div>}
            >
                <ContactSection />
            </Suspense>

            {/* 🌍 Move Google Map to dynamic import to avoid blocking main thread */}
            <div className="w-full">
                <Suspense fallback={<div className="py-10 text-center">Loading Map...</div>}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.06452598853!2d67.06752127520006!3d24.861645677928507!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f59a5d96795%3A0xee27703cdd2dd368!2sPark%20avenue!5e0!3m2!1sen!2s!4v1755236603117!5m2!1sen!2s"
                        width="100%"
                        height="600"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </Suspense>
            </div>

            <Suspense fallback={<div className="py-10 text-center">Loading Footer...</div>}>
                <div className="FooterCloudImgDiv -mt-24 max-lg:-m-4">
                    <Image
                        src={FooterCloudImg}
                        alt="FooterCloudImg"
                        className="contactfootercloud"
                        loading="lazy"
                    />
                </div>
                <Footer />
            </Suspense>
        </>
    );
}
