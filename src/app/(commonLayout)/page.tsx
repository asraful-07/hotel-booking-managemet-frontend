import Banner from "@/components/modules/Home/Banner";
import HotelFacilities from "@/components/modules/Home/useCounter";
import About from "@/components/modules/Home/About";
import RoomsCard from "@/components/modules/Home/RoomsCard";
import Gallery from "@/components/modules/Home/Gallery";

export default function HomePage() {
  return (
    <div className="bg-[#f5f5f5]">
      <Banner />
      <RoomsCard />
      <About />
      <HotelFacilities />
      <Gallery />
    </div>
  );
}
