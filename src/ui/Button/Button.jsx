export default function Button({
    children,
    variant = "primary",
    type = "button",
    loading = false,
    disabled = false,
    className = "",
    ...props
}) {

    const variants = {

        primary:
            "bg-blue-600 hover:bg-blue-700 text-white",

        secondary:
            "bg-gray-100 hover:bg-gray-200 text-gray-900",

        success:
            "bg-green-600 hover:bg-green-700 text-white",

        danger:
            "bg-red-600 hover:bg-red-700 text-white",

        outline:
            "border border-gray-300 bg-white hover:bg-gray-50",

        ghost:
            "hover:bg-gray-100"

    };

    return (

        <button
            type={type}
            disabled={disabled || loading}
            className={`
                px-5
                py-2.5
                rounded-xl
                font-medium
                transition
                duration-200
                disabled:opacity-50
                disabled:cursor-not-allowed
                ${variants[variant]}
                ${className}
            `}
            {...props}
        >

            {loading ? "Loading..." : children}

        </button>

    );

}
