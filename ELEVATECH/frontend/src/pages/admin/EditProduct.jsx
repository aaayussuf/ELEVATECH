import { useParams } from "react-router-dom";
import ProductForm from "../../components/admin/ProductForm";

export default function EditProduct() {

    const { id } = useParams();

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Edit Product
            </h1>

            <ProductForm
                mode="edit"
                productId={id}
            />

        </div>
    );
}

