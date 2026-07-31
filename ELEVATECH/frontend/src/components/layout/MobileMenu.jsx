import { Link } from "react-router-dom";

export default function MobileMenu({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-[#07101D]/95 backdrop-blur-xl lg:hidden">
            <div className="flex justify-end p-6">
                <button onClick={onClose} className="text-white text-2xl">
                    ✕
                </button>
            </div>
            <nav className="flex flex-col items-center gap-8 mt-12 text-xl">
                <Link to="/" onClick={onClose}>Home</Link>
                <Link to="/shop" onClick={onClose}>Shop</Link>
                <Link to="/categories" onClick={onClose}>Categories</Link>
                <Link to="/deals" onClick={onClose}>Deals</Link>
                <Link to="/about" onClick={onClose}>About</Link>
                <Link to="/contact" onClick={onClose}>Contact</Link>
            </nav>
        </div>
    );
}

