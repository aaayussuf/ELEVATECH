export default function Input({

    label,

    error,

    className = "",

    ...props

}) {

    return (

        <div className="space-y-2">

            {label && (

                <label className="font-medium">

                    {label}

                </label>

            )}

            <input

                className={`
                    w-full
                    border
                    rounded-xl
                    px-4
                    py-3
                    focus:ring-2
                    focus:ring-blue-500
                    outline-none
                    ${className}
                `}

                {...props}

            />

            {error && (

                <p className="text-red-600 text-sm">

                    {error}

                </p>

            )}

        </div>

    );

}
