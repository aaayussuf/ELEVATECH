export default function Footer() {

    return (

        <footer className="bg-[#0A1528] mt-24 border-t border-slate-800">

            <div className="max-w-7xl mx-auto px-6 py-16">

                <div className="grid md:grid-cols-4 gap-10">

                    <div>

                        <h2 className="text-3xl font-black">

                            <span className="text-blue-500">

                                EV

                            </span>

                            ElevaTech

                        </h2>

                        <p className="mt-5 text-gray-400">

                            Premium electronics for your digital lifestyle.

                        </p>

                    </div>

                    <div>

                        <h3 className="font-bold mb-4">

                            Shop

                        </h3>

                        <p>Laptops</p>

                        <p>Phones</p>

                        <p>Printers</p>

                    </div>

                    <div>

                        <h3 className="font-bold mb-4">

                            Company

                        </h3>

                        <p>About</p>

                        <p>Support</p>

                        <p>Contact</p>

                    </div>

                    <div>

                        <h3 className="font-bold mb-4">

                            Newsletter

                        </h3>

                        <input
                            placeholder="Email Address"
                            className="w-full rounded-xl bg-slate-800 p-3"
                        />

                    </div>

                </div>

                <div className="border-t border-slate-800 mt-12 pt-6 text-center text-gray-500">

                    © 2026 ElevaTech. All rights reserved.

                </div>

            </div>

        </footer>

    );

}

