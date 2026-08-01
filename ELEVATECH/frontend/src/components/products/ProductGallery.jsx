import { useState } from "react";

export default function ProductGallery({ product }) {

    const images = [
        product.image,
        product.image2,
        product.image3,
        product.image4,
    ].filter(Boolean);

    const [selected, setSelected] = useState(images[0]);

    return (

        <div className="space-y-5">

            <div className="bg-white rounded-2xl shadow p-6">

                <img
                    src={selected}
                    alt={product.name}
                    className="w-full h-[500px] object-contain hover:scale-110 transition duration-300 cursor-zoom-in"
                />

            </div>

            <div className="grid grid-cols-4 gap-4">

                {images.map((image, index) => (

                    <button
                        key={index}
                        onClick={() => setSelected(image)}
                        className={`border rounded-xl overflow-hidden ${
                            selected === image
                                ? "border-blue-600"
                                : "border-gray-200"
                        }`}
                    >

                        <img
                            src={image}
                            className="w-full h-24 object-contain"
                            alt=""
                        />

                    </button>

                ))}

            </div>

        </div>

    );

}

