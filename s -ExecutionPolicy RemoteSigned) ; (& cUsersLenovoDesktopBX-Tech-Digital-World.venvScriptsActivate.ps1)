import "../styles/products.css";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function Products() {

    const [products,setProducts]=useState([]);
    const [search,setSearch]=useState("");

    useEffect(()=>{

        axios.get("http://localhost:5000/api/products")
        .then(res=>setProducts(res.data))
        .catch(console.error);

    },[]);

    const filtered=products.filter(product=>{

        return product.name.toLowerCase().includes(search.toLowerCase());

    });

    return(

<div className="products-page">

<h1>Products</h1>

<input
type="text"
placeholder="Search products..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="search-input"
/>

<div className="products-grid">

{filtered.map(product=>(

<ProductCard
key={product.id}
product={product}
/>

))}

</div>

</div>

);

}