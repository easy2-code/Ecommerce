// 📁 Pages/shopping-view/ShoppingAccount.jsx
import React, { useEffect, useState, useRef } from "react";
import img1 from "@/assets/Home-Page-Images/1.jpg";
import img2 from "@/assets/Home-Page-Images/2.jpg";
import img3 from "@/assets/Home-Page-Images/3.jpg";
import img4 from "@/assets/Home-Page-Images/4.jpg";
import img5 from "@/assets/Home-Page-Images/5.jpg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ✅ Import components
import Orders from "@/components/shopping-view/Orders";
import Address from "@/components/shopping-view/Address";

export default function ShoppingAccount() {
  const images = [img1, img2, img3, img4, img5];
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  // ✅ Auto slideshow
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [images.length]);

  return (
    <div className="flex flex-col">
      {/* ✅ Image Slider */}
      <div className="w-full h-screen overflow-hidden relative mb-20">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* ✅ Dots Indicator */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentIndex ? "bg-white scale-110" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ✅ Tabs Section */}
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow">
          <Tabs defaultValue="orders">
            <TabsList className="mb-4">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
            </TabsList>

            {/* ✅ Render Components */}
            <TabsContent value="orders">
              <Orders />
            </TabsContent>

            <TabsContent value="address">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
