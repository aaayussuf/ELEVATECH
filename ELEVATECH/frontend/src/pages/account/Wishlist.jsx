import { useContext } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

import { AuthContext } from "../../context/AuthContext";
import { WishlistContext } from "../../context/WishlistContext";
import { CartContext } from "../../context/CartContext";
import AccountLayout from "../../layouts/AccountLayout";

export default function Wishlist() {

  const {
    user,
    logout,
  } = useContext(AuthContext);

  const {
    wishlist,
    toggleWishlist,
  } = useContext(WishlistContext);

  const {
    addToCart,
  } = useContext(CartContext);


  function handleAddToCart(product) {

    addToCart(product);

  }


  function handleRemove(item) {

    if (!item?.product) {
      return;
    }

    toggleWishlist(item.product);

  }


  return (

    <AccountLayout
      user={user}
      onLogout={logout}
    >

      <div className="space-y-8">

        {/* HEADER */}

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold">
              My Wishlist
            </h1>

            <p className="text-gray-400 mt-2">
              Products you've saved for later.
            </p>

          </div>

          <div className="flex items-center gap-2 text-red-500">

            <Heart
              size={24}
              fill="currentColor"
            />

            <span className="font-semibold">
              {wishlist.length}
            </span>

          </div>

        </div>


        {/* EMPTY WISHLIST */}

        {wishlist.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-sm border p-12 text-center">

            <Heart
              size={60}
              className="mx-auto text-gray-300"
            />

            <h2 className="text-2xl font-bold mt-5">
              Your wishlist is empty
            </h2>

            <p className="text-gray-500 mt-2">
              Browse our products and save the ones you love.
            </p>

            <a
              href="/products"
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition"
            >
              Browse Products
            </a>

          </div>

        ) : (

          /* WISHLIST PRODUCTS */

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {wishlist.map((item) => {

              const product = item.product;

              if (!product) {
                return null;
              }

              return (

                <div
                  key={item.id}
                  className="bg-white rounded-3xl shadow-sm border overflow-hidden"
                >

                  {/* PRODUCT IMAGE */}

                  <div className="relative">

                    <img
                      src={
                        product.image ||
                        "https://placehold.co/500x500?text=ElevaTech"
                      }
                      alt={product.name}
                      className="w-full h-64 object-contain"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      className="absolute top-4 right-4 bg-white rounded-full p-3 shadow hover:bg-red-50 transition"
                      title="Remove from wishlist"
                    >

                      <Heart
                        size={20}
                        fill="red"
                        color="red"
                      />

                    </button>

                  </div>


                  {/* PRODUCT INFORMATION */}

                  <div className="p-5">

                    {product.brand && (

                      <p className="text-sm text-blue-600 font-semibold">
                        {product.brand}
                      </p>

                    )}

                    <h2 className="font-bold text-lg mt-2 line-clamp-2">
                      {product.name}
                    </h2>


                    {/* PRICE */}

                    <div className="mt-4">

                      {product.has_discount ? (

                        <>

                          <div className="text-2xl font-black text-blue-600">
                            KSh{" "}
                            {Number(
                              product.discount_price
                            ).toLocaleString()}
                          </div>

                          <div className="text-sm text-gray-400 line-through">
                            KSh{" "}
                            {Number(
                              product.price
                            ).toLocaleString()}
                          </div>

                        </>

                      ) : (

                        <div className="text-2xl font-black text-blue-600">
                          KSh{" "}
                          {Number(
                            product.price
                          ).toLocaleString()}
                        </div>

                      )}

                    </div>


                    {/* ACTIONS */}

                    <div className="flex gap-3 mt-5">

                      <button
                        type="button"
                        onClick={() =>
                          handleAddToCart(product)
                        }
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                      >

                        <ShoppingCart size={18} />

                        Add to Cart

                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(item)
                        }
                        className="px-4 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl transition"
                        title="Remove"
                      >

                        <Trash2 size={18} />

                      </button>

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>

    </AccountLayout>

  );
}