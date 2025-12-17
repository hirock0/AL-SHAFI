export const dynamic = "force-dynamic";
// import Categories from "@/components/Categories/Categories";
import Banner from "@/components/Home/Banner/Banner";
import Products from "@/components/Home/Products/Products";
export default function Home() {
  return (
    <div>
      {/* <Categories/> */}
      <Banner />
      <div>
        <Products />
      </div>
    </div>
  );
}
