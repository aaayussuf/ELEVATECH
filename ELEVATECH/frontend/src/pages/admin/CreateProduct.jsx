import ProductForm from "../../components/admin/ProductForm";
import adminProductService from "../../services/adminProductService";

export default function CreateProduct() {

    async function createProduct(data) {
        await adminProductService.createProduct(data);
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">
                Add Product
            </h1>

            <ProductForm
                onSubmit={createProduct}
            />
        </div>
    );
}

