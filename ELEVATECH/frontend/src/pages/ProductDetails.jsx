import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Star } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/product-details.css";

import productService from "../services/productService";

import ProductBreadcrumb from "../components/products/ProductBreadcrumb";
import ProductGallery from "../components/products/ProductGallery";
import BuyBox from "../components/products/BuyBox";
import TrustSidebar from "../components/products/TrustSidebar";
import ProductHighlights from "../components/products/ProductHighlights";
import ProductInfoTable from "../components/products/ProductInfoTable";
import ProductActions from "../components/products/ProductActions";
import ReviewSection from "../components/products/ReviewSection";
import ProductFaq from "../components/products/ProductFaq";
import RelatedProducts from "../components/products/RelatedProducts";
import RecentlyViewed from "../components/products/RecentlyViewed";
import StickyBuyBar from "../components/products/StickyBuyBar";

import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function scrollTop() {
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    0
  );
}

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [justAdded, setJustAdded] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    rating: 0,
    count: 0,
  });

  async function loadProduct() {
    try {
      setLoading(true);

      const data = await productService.getProduct(slug);

      setProduct(data);
      setQuantity(1);
    } catch (err) {
      console.error("Product details error:", err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProduct();
  }, [slug]);

  useEffect(() => {
    if (!product) {
      return;
    }

    let viewed =
      JSON.parse(localStorage.getItem("recentProducts")) || [];

    viewed = viewed.filter((item) => item.id !== product.id);
    viewed.unshift(product);
    viewed = viewed.slice(0, 8);

    localStorage.setItem("recentProducts", JSON.stringify(viewed));
  }, [product]);

  // Show the sticky mobile buy bar once the customer
  // scrolls past the main buy box.
  useEffect(() => {
    const onScroll = () => setShowSticky(scrollTop() > 900);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stock = Number(product?.quantity || 0);
  const saved = wishlist?.some(
    (item) => item.product?.id === product?.id
  );

  function handleAddToCart() {
    if (!product) {
      return;
    }

    if (stock <= 0) {
      toast.error("This product is currently out of stock.");
      return;
    }

    if (quantity > stock) {
      toast.error(`Only ${stock} units are available.`);
      return;
    }

    addToCart(product, quantity);

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);

    toast.success(`${quantity} × ${product.name} added to cart`);
  }

  function handleBuyNow() {
    if (!product || stock <= 0) {
      return;
    }

    addToCart(product, quantity);
    navigate("/checkout");
  }

  function handleWishlist() {
    if (!product) {
      return;
    }

    const wasSaved = saved;
    toggleWishlist(product);

    toast.success(wasSaved ? "Removed from wishlist" : "Added to wishlist");
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(current + 1, stock));
  }

  function decreaseQuantity() {
    setQuantity((current) => Math.max(current - 1, 1));
  }

  if (loading) {
    return (
      <div className="pdp-shell min-h-screen" aria-busy="true">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-5">
          <div className="pdp-skeleton h-4 w-1/3 rounded" />

          <div className="grid lg:grid-cols-12 gap-8 mt-8">
            <div className="lg:col-span-5 pdp-skeleton h-[420px] rounded-xl" />
            <div className="lg:col-span-4 pdp-skeleton h-[420px] rounded-xl" />
            <div className="lg:col-span-3 pdp-skeleton h-[420px] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pdp-shell min-h-screen">
        <div className="max-w-3xl mx-auto pdp-card px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-[#0F1111]">
            Product not found
          </h2>

          <p className="mt-3 text-[#565959]">
            The product may have been removed or is temporarily unavailable.
          </p>

          <Link to="/products" className="mt-8 pdp-btn-add inline-block px-8 py-3">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  const titleRating =
    reviewStats.count > 0
      ? reviewStats.rating.toFixed(1)
      : Number(product.rating || 0) > 0
        ? Number(product.rating).toFixed(1)
        : "New";

  const titleReviewCount =
    reviewStats.count > 0 ? reviewStats.count : Number(product.reviews || 0);

  return (
    <div className="pdp-shell min-h-screen">
      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5">
        <ProductBreadcrumb category={product.category} name={product.name} />

        {/* TITLE + RATING + SOCIAL PROOF */}
        <div className="mt-4">
          <h1 className="text-2xl md:text-[28px] font-medium text-[#0F1111] leading-snug">
            {product.name}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-bold text-[#0F1111]">{titleRating}</span>

            <span className="flex gap-0.5" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  fill={
                    star <= Math.round(Number(titleRating === "New" ? 0 : titleRating))
                      ? "#FACC15"
                      : "none"
                  }
                  color="#FACC15"
                />
              ))}
            </span>

            <a href="#reviews" className="pdp-link underline">
              {titleReviewCount} {titleReviewCount === 1 ? "rating" : "ratings"}
            </a>

            {Number(product.sold || 0) > 0 && (
              <span className="text-[#565959]">
                · {Number(product.sold).toLocaleString()}+ sold
              </span>
            )}
          </div>

          {product.short_description && (
            <p className="mt-2 text-sm text-[#565959] leading-6">
              {product.short_description}
            </p>
          )}
        </div>

        {/* MAIN GRID: GALLERY | BUY BOX | TRUST SIDEBAR */}
        <div className="pdp-main-grid grid grid-cols-1 gap-5 mt-5 sm:gap-6 md:gap-7 lg:grid-cols-12 lg:gap-8 lg:mt-6">
          {/* PRODUCT GALLERY */}
          <div className="min-w-0 lg:col-span-5">
            <ProductGallery product={product} />
          </div>

          {/* BUY BOX + ACTIONS */}
          <div className="min-w-0 lg:col-span-4">
            <BuyBox
              product={product}
              quantity={quantity}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onToggleWishlist={handleWishlist}
              saved={saved}
              justAdded={justAdded}
            />

            <div className="mt-4">
              <ProductActions product={product} />
            </div>
          </div>

          {/* TRUST SIDEBAR */}
          <div className="min-w-0 lg:col-span-3">
            <TrustSidebar product={product} />
          </div>
        </div>

        {/* PRODUCT SUMMARY + SPECIFICATIONS */}
        <div className="pdp-detail-band mt-12">
          <ProductHighlights product={product} />
          <ProductInfoTable product={product} />
        </div>

        {/* SUGGESTED PRODUCTS */}
        <RelatedProducts productId={product.id} />

        {/* REVIEWS */}
        <section id="reviews" className="mt-16 scroll-mt-24">
          <h2 className="text-xl md:text-2xl font-bold text-[#0F1111]">
            Customer reviews
          </h2>

          <div className="mt-6">
            <ReviewSection
              productId={product.id}
              onReviewsChange={(reviews) => {
                const count = reviews.length;

                const rating = count
                  ? reviews.reduce(
                      (sum, review) => sum + Number(review.rating || 0),
                      0
                    ) / count
                  : 0;

                setReviewStats({
                  rating: Number(rating.toFixed(1)),
                  count,
                });
              }}
            />
          </div>
        </section>

        {/* FAQ */}
        <ProductFaq />

        {/* RECENTLY VIEWED */}
        <RecentlyViewed />

        {/* MOBILE STICKY BUY BAR */}
        <StickyBuyBar
          product={product}
          quantity={quantity}
          visible={showSticky}
          onIncrease={increaseQuantity}
          onDecrease={decreaseQuantity}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />

        <ToastContainer
          position="bottom-center"
          autoClose={2200}
          newestOnTop
          hideProgressBar
          closeOnClick
          theme="light"
          limit={4}
        />
      </div>
    </div>
  );
}

