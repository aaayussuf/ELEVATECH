import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import adminOrderService from "../../../services/adminOrderService";
import socket from "../../../services/socketService";

export default function OrderBoard() {
  const [board, setBoard] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBoard();

    socket.on("order_updated", () => {
      loadBoard();
    });

    return () => {
      socket.off("order_updated");
    };
  }, []);

  async function loadBoard() {
    try {
      const data = await adminOrderService.getKanban();
      setBoard(data);
    } finally {
      setLoading(false);
    }
  }

function onDragEnd(result) {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    const newBoard = { ...board };

    const sourceOrders = [...newBoard[sourceStatus]];
    const destOrders =
      sourceStatus === destStatus
        ? sourceOrders
        : [...newBoard[destStatus]];

    const [movedOrder] = sourceOrders.splice(source.index, 1);

    movedOrder.status = destStatus;

    destOrders.splice(destination.index, 0, movedOrder);

    newBoard[sourceStatus] = sourceOrders;
    newBoard[destStatus] = destOrders;

    setBoard(newBoard);

    saveOrderStatus(draggableId, destStatus);
  }

  async function saveOrderStatus(orderId, status) {
    try {
      await adminOrderService.updateOrder(orderId, {
        status,
      });
    } catch (err) {
      console.error(err);

      alert("Failed to update order.");

      loadBoard();
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        Loading board...
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Order Board
      </h1>

      <DragDropContext onDragEnd={onDragEnd}>

      <div className="flex gap-6 overflow-x-auto pb-4">

        {Object.entries(board).map(([status, orders]) => (

          <div
            key={status}
            className="w-80 bg-gray-100 rounded-xl p-4 flex-shrink-0"
          >

            <div className="flex justify-between items-center mb-4">

              <h2 className="font-bold text-lg">
                {status}
              </h2>

              <span className="bg-white rounded-full px-3 py-1 text-sm font-semibold">
                {orders.length}
              </span>

            </div>

<Droppable droppableId={status}>
              {(provided) => (

                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3 min-h-[100px]"
                >

                  {orders.map((order, index) => (

                    <Draggable
                      key={order.id}
                      draggableId={String(order.id)}
                      index={index}
                    >
                      {(provided) => (

                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white rounded-xl shadow p-4 border cursor-grab active:cursor-grabbing"
                        >

                          <div className="flex justify-between">

                            <strong>
                              #{order.id}
                            </strong>

                            <span>
                              KSh {Number(order.total).toLocaleString()}
                            </span>

                          </div>

                          <p className="text-sm mt-2">
                            Customer #{order.user_id}
                          </p>

                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(order.created_at).toLocaleString()}
                          </p>

                        </div>

                      )}
                    </Draggable>

                  ))}

                  {provided.placeholder}

                </div>

              )}
            </Droppable>

          </div>

        ))}

      </div>

      </DragDropContext>

    </div>
  );
}
