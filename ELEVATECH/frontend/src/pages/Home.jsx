import MainLayout from "../layouts/MainLayout";

import Hero from "../components/home/Hero";
import FeatureCards from "../components/home/FeatureCards";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import DealsBanner from "../components/home/DealsBanner";
import Brands from "../components/home/Brands";
import Newsletter from "../components/home/Newsletter";

export default function Home() {
    return (
        <MainLayout>

            <Hero />

            <FeatureCards />

            <CategoriesSection />

            <FeaturedProducts />

            <DealsBanner />

            <Brands />

            <Newsletter />

        </MainLayout>
    );
}

