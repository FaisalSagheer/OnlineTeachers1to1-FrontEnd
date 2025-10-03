"use client";

import Image from "next/image";
import dynamic from "next/dynamic";

// --- Dynamically import EVERY custom component with SSR turned off ---

const Header = dynamic(() => import('../components/header'), { ssr: false });
const Footer = dynamic(() => import('../components/footer'), { ssr: false });
const Toaster = dynamic(() => import('@/components/ui/sonner').then(mod => mod.Toaster), { ssr: false });

const ApplicationDash = dynamic(() => import('./components/applicationDashboard'), { 
    ssr: false, 
    loading: () => <p className="text-center p-8 font-semibold">Loading Dashboard...</p>
});

const ApplicationManagerBanner = dynamic(() => import('./application-manager-banner'), { 
    ssr: false 
});

// --- Static, safe assets ---
import CloudImg from "../image/cloudimg.png";
import FooterCloudImg from "@/app/image/Footer-cloud-img.png";
import "@/app/aboutUs/aboutStyle.css";


export default function ApplicationManager() {
    return (
        <div className="app-container">
            <div className="app-wrapper">
                <Header />
                
                <section>
                    <Image src={CloudImg} className="cloudImgabout" alt="Cloud Img" />
                </section>
                
                <ApplicationManagerBanner />
                <div className="main-content-wrapper">
                    <ApplicationDash /> 
                </div>
                
                <Toaster />
            </div>

            <div className="FooterCloudImgDiv mt-20 md:mt-28">
                <Image src={FooterCloudImg} alt="Footer Cloud" className="FooterCloudImg mx-auto" />
            </div>
            
            <Footer />
        </div>
    );
}