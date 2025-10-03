import { CardCarousel } from "@/components/ui/card-carousel";

export default function SubjectCarousal() {
  const images = [
    { src: "/image/slider-images/1.png", alt: "Image 1", },
    { src: "/image/slider-images/2.png", alt: "Image 2",  },
    { src: "/image/slider-images/3.png", alt: "Image 3", },
    { src: "/image/slider-images/4.png", alt: "Image 4",  },
    { src: "/image/slider-images/5.png", alt: "Image 5",  },
    { src: "/image/slider-images/6.png", alt: "Image 6", },
    { src: "/image/slider-images/7.png", alt: "Image 7",  },
    { src: "/image/slider-images/9.png", alt: "Image 9", },

  ];

  return (
     <section className="w-full bg-[#fcf7ee] ">
      <CardCarousel
        images={images}
        autoplayDelay={2500}
        showPagination={true}
        showNavigation={true}
      />
    </section>
  );
}