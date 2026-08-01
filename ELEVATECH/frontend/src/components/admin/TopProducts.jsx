export default function TopProducts({
    products,
}) {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold text-2xl mb-5">
                Top Products
            </h2>

            {products.map(product => (
                <div
                    key={product.name}
                    className="flex justify-between py-3 border-b"
                >
                    <span>
                        {product.name}
                    </span>

                    <span>
                        {product.sold} sold
                    </span>
                </div>
            ))}
        </div>
    );
}

