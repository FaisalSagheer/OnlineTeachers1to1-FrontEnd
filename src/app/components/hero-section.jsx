"use client";
import "../style.css";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import HomeKidPic from "../image/home.png";
import SliderImg2 from "../images/graduationcap.png";
import SliderImg1 from "../images/home-slider-img-01.png";
import Sliderblob from "../images/hslider-blob.png";
import BtnArrow from "../images/btnarrow.svg";
import Scissorsimg from "../images/Scissors.png";
import BackPack from "../images/Back-Pack.png";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ✅ Import js-cookie
import Cookies from "js-cookie";

export default function HeroSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // ✅ Check for Django access token in cookies
    const token = Cookies.get("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    // ✅ Remove token cookie
    Cookies.remove("accessToken");

    setIsLoggedIn(false);
    router.push("/login"); // redirect to login after logout
  };

  return (
    <section className="firstbanner">
      <div className="firstbannerinnerSec flex justify-between">
        {/* Left Image Section */}
        <div className="firstbannerimg">
          <motion.div
            className="firstbannerimg2"
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 1.5 }}
          >
            <Image className="sliderImg2" src={SliderImg2} alt="Slider Img2" />
          </motion.div>

          <motion.div
            className="firstbannerimg1"
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 1.8 }}
          >
            <Image className="sliderImg1" src={HomeKidPic} alt="Slider Img1" />
          </motion.div>

          <motion.div
            className="firstbannerimg3"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src={Sliderblob} className="sliderblob" alt="Slider blob" />
          </motion.div>

          <motion.div>
            <Image src={BackPack} alt="BackPack" className="BackPack" />
          </motion.div>
        </div>

        {/* Right Text Section */}
        <motion.div
          className="firstbannertxtSec pt-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          <div className="scissorsDiv flex items-center justify-between">
            <Image src={Scissorsimg} className="scissorsimg" alt="Scissors img" />
            <svg className="starSvg" x="0px" y="0px" viewBox="0 0 212 210">
              <path d="M162.3,190.5c-11.1-25.6-22.1-51.2-33.2-76.8..."></path>
            </svg>
          </div>

          <div className="firstbannertxtContent py-2 pb-3">
            <motion.h2
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Where Knowledge meets confidence
            </motion.h2>

            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              Welcome to Teacher 1to1 🌟
            </motion.h1>

            <motion.p
              initial={{ y: 90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2 }}
            >
              We measure success not just in grades, but in how students grow in
              confidence, curiosity, and problem-solving.
            </motion.p>

            {/* 🔄 Conditional Button */}
            {!isLoggedIn ? (
              <Link href="/login" className="firstbannerbtnLink">
                <motion.button
                  className="firstbannerbtn flex items-center gap-2"
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.4 }}
                >
                  Apply Now
                  <Image className="btnArrow" src={BtnArrow} alt="Btn Arrow" />
                </motion.button>
              </Link>
            ) : (
              <motion.button
                className="firstbannerbtn flex items-center gap-2 bg-red-500 text-white"
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.4 }}
                onClick={handleLogout}
              >
                Logout
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
