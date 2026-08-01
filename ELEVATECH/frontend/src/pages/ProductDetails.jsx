import { useEffect, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useParams } from "react-router-dom";
import productService from "../services/productService";
import ProductGallery from "../components/products/ProductGallery";
import ProductActions from "../components/products/ProductActions";
import RecentlyViewed from "../components/products/RecentlyViewed";
import ReviewSection from "../components/products/ReviewSection";

export default function ProductDetails() {

    const { slug } = useParams();

    const [product, setProduct] = useState(null);

    const [quantity, setQuantity] = useState(1);

    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState("description");

    useEffect(() => {

        loadProduct();

    }, [slug]);

    useEffect(() => {

        if (!product) return;

        let viewed =
            JSON.parse(localStorage.getItem("recentProducts")) || [];

        viewed = viewed.filter(p => p.id !== product.id);

        viewed.unshift(product);

        viewed = viewed.slice(0,8);

        localStorage.setItem(
            "recentProducts",
            JSON.stringify(viewed)
        );

    }, [product]);

    async function loadProduct() {

        try {

            const data = await productService.getProduct(slug);

            setProduct(data);

        }

        catch(err){

            console.log(err);

        }

        finally{

            setLoading(false);

        }

    }

    if(loading){

        return <h2 className="p-10">Loading...</h2>;

    }

    if(!product){

        return <h2 className="p-10">Product not found.</h2>;

    }

    return (

        <div className="bg-slate-100 min-h-screen">

            <div className="max-w-7xl mx-auto px-6 py-16">

                <div className="grid lg:grid-cols-2 gap-16">

                    {/* IMAGE */}

                    <div>

                        <ProductGallery product={product} />

                    </div>

                    {/* INFO */}

                    <div>

                        <p className="text-blue-600 font-semibold">

                            {product.brand}

                        </p>

                        <h1 className="text-5xl font-black mt-2">

                            {product.name}

                        </h1>

                        <div className="flex items-center gap-3 mt-3">

                            <div className="text-yellow-500 text-xl">

                                ⭐⭐⭐⭐⭐

                            </div>

                            <span className="font-semibold">

                                {product.rating || "4.8"}

                            </span>

                            <span className="text-gray-500">

                                ({product.reviews || 125} Reviews)

                            </span>

                        </div>

                        {product.has_discount && (

                            <div className="inline-flex bg-red-600 text-white px-4 py-2 rounded-full font-bold mt-6">

                                SAVE {product.discount_percent}%

                            </div>

                        )}

                        <div className="mt-6">

                            {product.has_discount ? (

                                <>

                                    <div className="flex items-center gap-5">

                                        <h2 className="text-5xl font-black text-blue-600">

                                            KSh {product.discount_price}

                                        </h2>

                                        <span className="line-through text-2xl text-gray-400">

                                            KSh {product.price}

                                        </span>

                                    </div>

                                    <p className="text-green-600 mt-2 font-semibold">

                                        You save KSh {(product.price - product.discount_price).toFixed(2)}

                                    </p>

                                </>

                            ) : (

                                <h2 className="text-5xl font-black text-blue-600">

                                    KSh {product.price}

                                </h2>

                            )}

                        </div>

                        <div className="mt-6">

                            {product.quantity > 10 ? (

                                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">

                                    ✔ In Stock

                                </span>

                            ) : (

                                <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold">

                                    Only {product.quantity} left

                                </span>

                            )}

                        </div>

                        <div className="mt-8 bg-blue-50 rounded-xl p-5">

                            <h4 className="font-bold text-lg">

                                Delivery

                            </h4>

                            <p className="text-gray-600 mt-2">

                                Nairobi: 1-2 Days

                            </p>

                            <p className="text-gray-600">

                                Other Counties: 2-4 Days

                            </p>

                        </div>

                        <div className="mt-8">

                            <h4 className="font-bold mb-4">

                                Secure Payments

                            </h4>

                            <div className="flex gap-4 flex-wrap">

                                <span className="px-5 py-3 rounded-xl bg-green-100 font-semibold">

                                    M-Pesa

                                </span>

                                <span className="px-5 py-3 rounded-xl bg-blue-100 font-semibold">

                                    Visa

                                </span>

                                <span className="px-5 py-3 rounded-xl bg-purple-100 font-semibold">

                                    MasterCard

                                </span>

                                <span className="px-5 py-3 rounded-xl bg-gray-100 font-semibold">

                                    Stripe

                                </span>

                            </div>

                        </div>

                        <p className="mt-8 text-gray-600 leading-8">

                            {product.description}

                        </p>

                        <div className="mt-10 space-y-3">

                            <p>

                                <strong>Category:</strong> {product.category}

                            </p>

                            <p>

                                <strong>Brand:</strong> {product.brand}

                            </p>

                            <p>

                                <strong>SKU:</strong> {product.sku}

                            </p>

                        </div>

                        <div className="mt-10">

                            <label className="font-semibold">

                                Quantity

                            </label>

                            <div className="flex items-center gap-4 mt-3">

                                <button
                                    onClick={() =>
                                        quantity > 1 && setQuantity(quantity - 1)
                                    }
                                    className="w-10 h-10 rounded-lg border"
                                >
                                    -
                                </button>

                                <span className="text-xl font-bold">

                                    {quantity}

                                </span>

                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded-lg border"
                                >
                                    +
                                </button>

                            </div>

                        </div>

                        <div className="flex gap-4 mt-8">

                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl flex items-center gap-3">

                                <ShoppingCart size={20} />

                                Add To Cart

                            </button>

                            <button className="border px-8 py-4 rounded-xl">

                                Buy Now

                            </button>

                            <button className="border p-4 rounded-xl">

                                <Heart />

                            </button>

                        </div>

                        <ProductActions product={product} />

                        <div className="grid grid-cols-2 gap-4 mt-10">

                            <div className="bg-gray-100 rounded-xl p-5 text-center">

                                🚚

                                <h4 className="font-bold mt-2">

                                    Free Delivery

                                </h4>

                            </div>

                            <div className="bg-gray-100 rounded-xl p-5 text-center">

                                🔒

                                <h4 className="font-bold mt-2">

                                    Secure Checkout

                                </h4>

                            </div>

                            <div className="bg-gray-100 rounded-xl p-5 text-center">

                                ↩

                                <h4 className="font-bold mt-2">

                                    Easy Returns

                                </h4>

                            </div>

                            <div className="bg-gray-100 rounded-xl p-5 text-center">

                                ✔

                                <h4 className="font-bold mt-2">

                                    Genuine Products

                                </h4>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <section className="max-w-7xl mx-auto mt-20">

                <div className="border-b flex gap-10">

                    <button
                        onClick={() => setActiveTab("description")}
                        className={`pb-4 font-semibold ${
                            activeTab === "description"
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "text-gray-500"
                        }`}
                    >
                        Description
                    </button>

                    <button
                        onClick={() => setActiveTab("specifications")}
                        className={`pb-4 font-semibold ${
                            activeTab === "specifications"
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "text-gray-500"
                        }`}
                    >
                        Specifications
                    </button>

                    <button
                        onClick={() => setActiveTab("reviews")}
                        className={`pb-4 font-semibold ${
                            activeTab === "reviews"
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "text-gray-500"
                        }`}
                    >
                        Reviews
                    </button>

                </div>

                <div className="bg-white rounded-b-2xl shadow p-8">

                    {activeTab === "description" && (

                        <div>

                            <h3 className="text-2xl font-bold mb-4">
                                Product Description
                            </h3>

                            <p className="text-gray-600 leading-8">
                                {product.description || "No description available."}
                            </p>

                        </div>

                    )}

                    {activeTab === "specifications" && (

                        <table className="w-full">

                            <tbody>

                                <tr className="border-b">

                                    <td className="py-4 font-semibold">
                                        Brand
                                    </td>

                                    <td>
                                        {product.brand}
                                    </td>

                                </tr>

                                <tr className="border-b">

                                    <td className="py-4 font-semibold">
                                        Category
                                    </td>

                                    <td>
                                        {product.category}
                                    </td>

                                </tr>

                                <tr className="border-b">

                                    <td className="py-4 font-semibold">
                                        Warranty
                                    </td>

                                    <td>
                                        {product.warranty || "1 Year"}
                                    </td>

                                </tr>

                                <tr className="border-b">

                                    <td className="py-4 font-semibold">
                                        SKU
                                    </td>

                                    <td>
                                        {product.sku}
                                    </td>

                                </tr>

                            </tbody>

                        </table>

                    )}

                    {activeTab === "reviews" && (

                        <ReviewSection
                            productId={product.id}
                        />

                    )}

                </div>

            </section>

            <div className="max-w-7xl mx-auto">

                <RecentlyViewed />

            </div>

        </div>

    );

}

