// src\app\parent\dashboard\layout.js
// app/dashboard/layout.tsx (if using App Router)

import { Inter } from "next/font/google";
import "./dashboard.css";
import "@/app/aboutUs/aboutStyle.css"
import Header from "@/app/components/header";
import ParentDashBanner from "@/app/components/ParentDashBanner";
import Footer from "@/app/components/footer";
import Image from "next/image";
import CloudImg from "@/app/image/cloudimg.png";
import FooterCloudImg from "@/app/image/Footer-cloud-img.png";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Parent Dashboard",
  description: "Complete parent dashboard for managing children's education",
};

export default function RootLayout({ children }) {
  return (
    // REMOVE <html> and <body> tags from here
    // These should only be in your top-level app/layout.js
    <>
      {/* The className from inter.className should ideally be applied to a div or a section if body is not here,
          or it's fine if the root layout already applies it to the body. */}
      {/* Header */}
      <Header />

      {/* Cloud Image Banner */}
      <section className="py-4">
        <Image src={CloudImg} className="cloudImgabout mx-auto" alt="Cloud Image" />
      </section>

      {/* Banner Section */}
      <ParentDashBanner />

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer Cloud Image */}
      <div className="FooterCloudImgDiv mt-20 md:mt-28">
        <Image src={FooterCloudImg} alt="Footer Cloud" className="FooterCloudImg mx-auto" />
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}