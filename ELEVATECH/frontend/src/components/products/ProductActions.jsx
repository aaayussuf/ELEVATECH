import {
    Heart,
    Share2,
    Scale,
    Link2,
} from "lucide-react";

export default function ProductActions() {

    function copyLink() {

        navigator.clipboard.writeText(window.location.href);

        alert("Product link copied!");

    }

    return (

        <div className="grid grid-cols-2 gap-4 mt-8">

            <button className="flex items-center justify-center gap-2 border rounded-xl py-3 hover:bg-gray-100">

                <Heart size={20} />

                Wishlist

            </button>

            <button className="flex items-center justify-center gap-2 border rounded-xl py-3 hover:bg-gray-100">

                <Scale size={20} />

                Compare

            </button>

            <button className="flex items-center justify-center gap-2 border rounded-xl py-3 hover:bg-gray-100">

                <Share2 size={20} />

                Share

            </button>

            <button
                onClick={copyLink}
                className="flex items-center justify-center gap-2 border rounded-xl py-3 hover:bg-gray-100"
            >

                <Link2 size={20} />

                Copy Link

            </button>

        </div>

    );

}

