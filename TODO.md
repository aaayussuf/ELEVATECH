# TODO — Emit Socket.IO event after updating an order

- [x] Step 1: Emit `order_updated` event in `admin_order_service.py` `update_order()` after `db.session.commit()`
- [x] Step 2: Emit `order_updated` event in `admin_orders.py` PUT route `update_order_full()` after `db.session.commit()`
- [x] Step 3: Add `socket` listener in `OrderBoard.jsx` that calls `loadBoard()` on `order_updated`
