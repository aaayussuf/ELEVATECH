import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import MobileBottomNav from "../components/layout/MobileBottomNav";

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#07101D] text-white overflow-x-clip has-mobile-bottom-nav">

            <Navbar />

            <main className="min-w-0 w-full">

                {children}

            </main>

            <Footer />

            <MobileBottomNav />

        </div>
    );
}

