import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductForm from "../../components/admin/ProductForm";
import adminProductService from "../../services/adminProductService";

export default function EditProduct() {

    const { id } = useParams();

    const [product, setProduct] = useState(null);

    useEffect(() => {
        loadProduct();
    }, []);

    async function loadProduct() {
        const data = await adminProductService.getProduct(id);
        setProduct(data);
    }

    async function updateProduct(form) {
        await adminProductService.updateProduct(id, form);
    }

    if (!product)
        return <p className="p-6">Loading...</p>;

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Edit Product
            </h1>

            <ProductForm
                initialData={product}
                onSubmit={updateProduct}
            />

        </div>
    );
}

