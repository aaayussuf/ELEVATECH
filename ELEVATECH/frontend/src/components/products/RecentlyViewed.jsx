import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RecentlyViewed() {

    const [products, setProducts] = useState([]);

    useEffect(() => {

        const viewed =
            JSON.parse(localStorage.getItem("recentProducts")) || [];

        setProducts(viewed);

    }, []);

    if (products.length === 0) return null;

    return (

        <section className="mt-24">

            <h2 className="text-4xl font-black mb-8">

                Recently Viewed

            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                {products.map(product => (

                    <div
                        key={product.id}
                        className="bg-white rounded-3xl shadow overflow-hidden"
                    >

                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-52 object-contain bg-gray-100"
                        />

                        <div className="p-5">

                            <h3 className="font-bold">

                                {product.name}

                            </h3>

                            <p className="text-blue-600 font-black mt-2">

                                KSh {product.price}

                            </p>

                            <Link to={`/product/${product.slug}`}>

                                <button className="mt-5 w-full bg-blue-600 text-white py-3 rounded-xl">

                                    View Again

                                </button>

                            </Link>

                        </div>

                    </div>

                ))}

            </div>

        </section>

    );

}

