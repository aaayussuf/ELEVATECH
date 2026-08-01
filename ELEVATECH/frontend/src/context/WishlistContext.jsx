import {
    createContext,
    useEffect,
    useState,
} from "react";

import wishlistService from "../services/wishlistService";

export const WishlistContext =
    createContext();

export function WishlistProvider({

    children,

}) {

    const [wishlist,setWishlist] =
        useState([]);

    useEffect(()=>{

        loadWishlist();

    },[]);

    async function loadWishlist(){

        try{

            const data =
                await wishlistService.getWishlist();

            setWishlist(data);

        }catch{

            setWishlist([]);

        }

    }

    async function toggleWishlist(product){

        const exists =
            wishlist.find(
                p=>p.id===product.id
            );

        if(exists){

            await wishlistService.remove(product.id);

        }else{

            await wishlistService.add(product.id);

        }

        loadWishlist();

    }

    return(

        <WishlistContext.Provider
            value={{
                wishlist,
                toggleWishlist,
            }}
        >

            {children}

        </WishlistContext.Provider>

    );

}

