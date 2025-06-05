import img from "../../images/Rectangle.png"
import card1 from "../../images/card1.png"
import card2 from "../../images/card2.png"
export default function Home() {
    return (
        <div className="relative min-h-screen ">
            {/* Background image */}
            <div className="absolute inset-0  h-full">
                <img
                    src={img}
                    alt="Background"
                    className="w-full h-full  object-fill"
                />
            </div>

            {/* Main content */}
            <div className="container mx-auto px-4 z-0  py-16 relative ">
                <div className="max-w-8xl pt-20 mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Trusted FinTech Software Development Partner</h1>
                    <p className="text-lg mb-12">
                        We create custom FinTech solutions that work flawlessly, manage financial services, and accelerate your
                        business success. As a forward-thinking fintech app development company, we deliver secure, scalable, and
                        high-performing applications tailored to your unique goals.
                    </p>

                    <div className="grid grid-cols-1 pb-20 md:grid-cols-2 gap-16">
                        <FinTechCard
                            title="Anti-Money Laundering (AML) Solution"
                            features={[
                                "Secure user authentication and transaction authorization",
                                "Real-time currency trends and live exchange rates",
                                "Broad credit union and payment network support",
                                "Compliance with global regulatory standards",
                                "Secure and fast money transmission",
                                "Instant notifications for transaction updates",
                            ]}
                            topImage={card2}
                        />

                        <FinTechCard
                            title="Fraud Prevention System"
                            features={[
                                "Secure user authentication and transaction authorization",
                                "Real-time currency trends and live exchange rates",
                                "Broad credit union and payment network support",
                                "Compliance with global regulatory standards",
                                "Secure and fast money transmission",
                                "Instant notifications for transaction updates",
                            ]}
                            topImage={card1}
                        />

                        <FinTechCard
                            title="Mobile Money Transfer Solutions"
                            features={[
                                "Secure user authentication and transaction authorization",
                                "Real-time currency trends and live exchange rates",
                                "Broad credit union and payment network support",
                                "Compliance with global regulatory standards",
                                "Secure and fast money transmission",
                                "Instant notifications for transaction updates",
                            ]}
                            topImage={card1}
                        />

                        <FinTechCard
                            title="Digital Wallet Solutions"
                            features={[
                                "Multi-currency support and conversion",
                                "Biometric authentication and security",
                                "Contactless payment integration",
                                "Real-time transaction monitoring",
                                "Cross-platform compatibility",
                                "24/7 customer support integration",
                            ]}
                            topImage={card2}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

function FinTechCard({ title, features, topImage, bottomImage }) {
    return (
        <div className="bg-white text-black rounded-lg shadow-lg  overflow-hidden border border-gray-800 flex flex-col">
            {/* Top image with title overlay */}
            <div className="p-6"> {/* Add padding here */}
                <div className="relative w-full  rounded-md overflow-hidden">
                    {topImage && (
                        <img src={topImage} alt="Card Top" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-md" />
                    <div
                        className="absolute left-0 bottom-[20%] px-4"
                        style={{ width: "70%" }}
                    >
                        <h3 className="text-4xl font-medium text-white text-left">{title}</h3>
                    </div>
                </div>
            </div>
            {/* Features list */}
            <div className="px-6 pb-6 flex-1">
                <ul className="space-y-2">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <span className="mr-2 text-black">•</span>
                            <span className="text-sm">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}