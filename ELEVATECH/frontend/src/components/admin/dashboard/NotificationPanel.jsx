export default function NotificationPanel({ notifications = [] }) {

  if (!notifications.length) {
    return null;
  }

  const colors = {
    red: "border-red-500 bg-red-50",
    yellow: "border-yellow-500 bg-yellow-50",
    blue: "border-blue-500 bg-blue-50",
    green: "border-green-500 bg-green-50",
  };

  return (
    <div className="space-y-3">

      {notifications.map((notification, index) => (

        <div
          key={index}
          className={`border-l-4 rounded-lg p-4 shadow-sm ${
            colors[notification.color] || "border-gray-400 bg-gray-50"
          }`}
        >
          <h3 className="font-semibold text-lg">
            {notification.title}
          </h3>

          <p className="text-gray-700">
            {notification.message}
          </p>
        </div>

      ))}

    </div>
  );
}
