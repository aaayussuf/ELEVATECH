export default function CustomerCard({ customer }) {

    if (!customer) return null;

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="font-bold text-xl mb-4">
                Customer
            </h2>

            <p>
                <strong>Name:</strong> {customer.name}
            </p>

            <p>
                <strong>Email:</strong> {customer.email}
            </p>

            <p>
                <strong>Phone:</strong> {customer.phone || "-"}
            </p>

        </div>

    );

}

