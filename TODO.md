# TODO

## Coupon Integration Task

- [x] Add `from app.models.coupon import Coupon` import to orders.py
- [x] Replace `create_order()` function in orders.py with coupon-enabled version
- [x] Update Checkout.jsx order body to send `coupon_code: couponCode`

## Coupon State in Checkout.jsx

- [x] Step 1: Add coupon state declarations (couponCode, couponMessage, discount, subtotal)
- [x] Step 2: Add the Apply Coupon function using couponMessage
- [x] Step 3: Add the Coupon section UI above the payment method
- [x] Step 4: Replace the simple heading with an Order Summary
- [x] Step 5: Verify `coupon_code: couponCode` is sent with the order (already done)
