export default function PurchaseOrderSummary({

    items

}) {

    const total = items.reduce(

        (sum, item) =>

            sum +

            item.quantity *

            item.unit_cost,

        0

    );

    return (

        <div>

            <h2 className="text-xl font-semibold mb-6">

                Summary

            </h2>

            <div className="flex justify-between mb-3">

                <span>Total Items</span>

                <strong>

                    {items.length}

                </strong>

            </div>

            <div className="flex justify-between">

                <span>Grand Total</span>

                <strong>

                    ${total.toFixed(2)}

                </strong>

            </div>

        </div>

    );

}
