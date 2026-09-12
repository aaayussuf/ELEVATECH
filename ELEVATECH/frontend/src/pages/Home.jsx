import Hero from "../components/home/Hero";
import PromoStrip from "../components/home/PromoStrip";
import TrustStats from "../components/home/TrustStats";
import ShopWithConfidence from "../components/home/ShopWithConfidence";
import FaqTrust from "../components/home/FaqTrust";
import FinalCta from "../components/home/FinalCta";
import FeatureCards from "../components/home/FeatureCards";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import FlashDeals from "../components/home/FlashDeals";
import Testimonials from "../components/home/Testimonials";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050B14] text-white">

      <main>

        <Hero />

        <PromoStrip />

        <TrustStats />

        <FeatureCards />

        <CategoriesSection />

        <FeaturedProducts />

        <FlashDeals />

        <ShopWithConfidence />

        <Testimonials />

        <FaqTrust />

        <FinalCta />

      </main>

    </div>
  );
}