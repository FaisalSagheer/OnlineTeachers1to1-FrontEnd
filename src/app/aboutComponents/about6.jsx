"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import "../style.css"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About6() {
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
        },
      }
    );

    gsap.fromTo(
      cardsRef.current,
      {
        opacity: 0,
        y: 40,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardsRef.current[0],
          start: "top 90%",
        },
      }
    );
  }, []);

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <section className="growth-section">
      <div className="growth-header" ref={headerRef}>
        <h2>Our Growth</h2>
        <p>We are expanding globally across key regions.</p>
      </div>
      <div className="growth-countries">
        {["USA", "UK", "Middle East", "South Asia", "Australia"].map((region, index) => (
          <div className="growth-country" key={index} ref={addToRefs}>
            {region}
          </div>
        ))}
      </div>
    </section>
  );
}
