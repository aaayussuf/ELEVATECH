import ProductForm from "../../components/admin/ProductForm";

export default function CreateProduct() {

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">
                Add Product
            </h1>

            <ProductForm
                mode="create"
            />
        </div>
    );
}

