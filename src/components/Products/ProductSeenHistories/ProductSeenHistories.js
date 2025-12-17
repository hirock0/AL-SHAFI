"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
const ProductSeenHistories = () => {

  const { activeFlag } = useSelector((state) => state?.slice);
  const [products, setProducts] = useState([]);


  useEffect(() => {
    const fetchViewedProducts = async () => {
      const slugsRes = localStorage.getItem("p_slug");
      if (!slugsRes) return setProducts([]);
      let slugs = [];
      try {
        slugs = JSON.parse(slugsRes);
        if (!Array.isArray(slugs) || slugs.length === 0) return setProducts([]);
      } catch (err) {
        console.error("Failed to parse slugs", err);
        return setProducts([]);
      }

      try {
        const responses = await Promise.all(
          slugs.map((slug) =>
            axios.get(`/pages/api/products/product/findProducts/${slug}`, {
              headers: { "x-request-source": "12Hirock@" },
            })
          )
        );

        if (!responses) {
          return;
        } else {
          const productsData = responses
            .map((res) => res.data?.product)
            .filter(Boolean);
          setProducts(productsData);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
        setProducts([]);
      }
    };

    fetchViewedProducts();
  }, [activeFlag]);

  if (!products.length) {
    return (
      <div className="text-gray-500 text-sm">
        You haven't viewed any products yet.
      </div>
    );
  }

  return (
    <section className="my-10">
      <h3 className="text-xl font-semibold mb-4 border-b border-border pb-2">
        Recently Viewed Products
      </h3>

      <Swiper
        spaceBetween={16}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
        navigation
        modules={[Navigation]}
      >
        {products.map((prod) => (
          <SwiperSlide key={prod._id}>
            <div className="bg-white shadow rounded md:rounded-md p-2 hover:shadow-xl transition cursor-pointer">
              <Link href={`/product/product-details/${prod?.slug}`}>
                <Image
                  src={prod.thumbnail.secure_url}
                  alt={prod.productName}
                  width={500}
                  height={500}
                  className="w-full h-40 object-cover rounded "
                />
              </Link>
              <p className="text-sm font-medium mt-2 line-clamp-1">
                {prod.productName}
              </p>
              <p className="text-sm text-text mt-1">৳{prod.offerPrice}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default ProductSeenHistories;
