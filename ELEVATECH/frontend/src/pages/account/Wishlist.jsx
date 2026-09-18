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

      <div className="w-full min-w-0 space-y-6 sm:space-y-8">

        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              My Wishlist
            </h1>

            <p className="mt-1.5 text-sm text-gray-500 sm:mt-2 sm:text-base">
              Products you've saved for later.
            </p>

          </div>

          <div className="flex w-fit items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-red-500">

            <Heart
              size={20}
              fill="currentColor"
              aria-hidden="true"
            />

            <span className="text-sm font-bold sm:text-base">
              {wishlist.length}
            </span>

            <span className="text-sm font-medium">
              {wishlist.length === 1 ? "item" : "items"}
            </span>

          </div>

        </div>


        {/* EMPTY WISHLIST */}

        {wishlist.length === 0 ? (

          <div className="rounded-2xl border bg-white px-5 py-10 text-center shadow-sm sm:rounded-3xl sm:px-8 sm:py-12 lg:py-16">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 sm:h-20 sm:w-20">
              <Heart
                size={40}
                className="text-gray-300 sm:h-12 sm:w-12"
                aria-hidden="true"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
              Browse our products and save the ones you love.
            </p>

            <a
              href="/products"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:px-6 sm:text-base"
            >
              Browse Products
            </a>

          </div>

        ) : (

          /* WISHLIST PRODUCTS */

          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4 2xl:gap-7">

            {wishlist.map((item) => {

              const product = item.product;

              if (!product) {
                return null;
              }

              return (

                <div
                  key={item.id}
                  className="group min-w-0 overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:rounded-3xl"
                >

                  {/* PRODUCT IMAGE */}

                  <div className="relative aspect-square overflow-hidden bg-gray-50">

                    <img
                      src={
                        product.image ||
                        "https://placehold.co/500x500?text=ElevaTech"
                      }
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105 sm:p-5"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:right-4 sm:top-4"
                      title="Remove from wishlist"
                      aria-label={`Remove ${product.name} from wishlist`}
                    >

                      <Heart
                        size={19}
                        fill="red"
                        color="red"
                        aria-hidden="true"
                      />

                    </button>

                  </div>


                  {/* PRODUCT INFORMATION */}

                  <div className="flex min-w-0 flex-col p-4 sm:p-5">

                    {product.brand && (

                      <p className="truncate text-xs font-semibold uppercase tracking-wide text-blue-600 sm:text-sm">
                        {product.brand}
                      </p>

                    )}

                    <h2 className="mt-1.5 min-h-[2.75rem] line-clamp-2 text-base font-bold leading-5 text-gray-900 sm:mt-2 sm:text-lg sm:leading-6">
                      {product.name}
                    </h2>


                    {/* PRICE */}

                    <div className="mt-3 min-h-[3.5rem] sm:mt-4">

                      {product.has_discount ? (

                        <>

                          <div className="text-xl font-black text-blue-600 sm:text-2xl">
                            KSh{" "}
                            {Number(
                              product.discount_price
                            ).toLocaleString()}
                          </div>

                          <div className="mt-0.5 text-xs text-gray-400 line-through sm:text-sm">
                            KSh{" "}
                            {Number(
                              product.price
                            ).toLocaleString()}
                          </div>

                        </>

                      ) : (

                        <div className="text-xl font-black text-blue-600 sm:text-2xl">
                          KSh{" "}
                          {Number(
                            product.price
                          ).toLocaleString()}
                        </div>

                      )}

                    </div>


                    {/* ACTIONS */}

                    <div className="mt-4 grid grid-cols-[1fr_auto] gap-2 sm:mt-5 sm:gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          handleAddToCart(product)
                        }
                        className="flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:px-4 sm:text-base"
                      >

                        <ShoppingCart
                          size={18}
                          className="shrink-0"
                          aria-hidden="true"
                        />

                        <span className="truncate">
                          Add to Cart
                        </span>

                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(item)
                        }
                        className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-red-200 px-3 text-red-500 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        title="Remove"
                        aria-label={`Remove ${product.name}`}
                      >

                        <Trash2
                          size={18}
                          aria-hidden="true"
                        />

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