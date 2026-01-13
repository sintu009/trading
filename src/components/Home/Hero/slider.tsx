export const plans = [
  {
    title: "Starter Plan",
    investment: 50,
    totalReturn: 75,
    durationDays: 15,
    dailyProfit: 5,
    currency: "$",
    highlight: false,
  },
  {
    title: "Basic Plan",
    investment: 100,
    totalReturn: 150,
    durationDays: 15,
    dailyProfit: 10,
    currency: "$",
    highlight: false,
  },
  {
    title: "Standard Plan",
    investment: 200,
    totalReturn: 300,
    durationDays: 15,
    dailyProfit: 20,
    currency: "$",
    highlight: true, // recommended
  },
  {
    title: "Premium Plan",
    investment: 500,
    totalReturn: 750,
    durationDays: 15,
    dailyProfit: 50,
    currency: "$",
    highlight: false,
  },
];

const PricingCards = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-6">
        {/* SECTION TITLE */}
        <div className="mb-12">
          <h2 className="text-white text-3xl font-bold">Subscription</h2>
          <p className="text-gray-400 text-sm mt-2">
            Choose the plan that fits your investment goals
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-6
                bg-gradient-to-b from-[#1c242b] to-[#0f1418]
                border ${
                  plan.highlight
                    ? "border-cyan-400 shadow-[0_0_0_2px_rgba(34,211,238,0.6)]"
                    : "border-white/20"
                }
                transition-all duration-300 hover:border-cyan-400`}
            >
              {/* Plan Title */}
              <h3 className="text-white text-sm font-semibold mb-6">
                {plan.title}
              </h3>

              {/* Investment */}
              <div className="text-center mb-4">
                <p className="text-white text-4xl font-bold">
                  {plan.currency}
                  {plan.investment}
                </p>
                <p className="text-gray-400 text-xs mt-1">Investment Amount</p>
              </div>

              {/* Duration */}
              <p className="text-center text-xs text-gray-400 mb-5">
                {plan.durationDays} Days Plan
              </p>

              {/* CTA */}
              <button
                className="w-full bg-primary hover:bg-primary/90
                           text-black text-sm font-semibold
                           py-2.5 rounded-lg transition mb-6"
              >
                Buy Now
              </button>

              {/* Description */}
              <p className="text-gray-300 text-xs leading-relaxed mb-5">
                Earn a total return of{" "}
                <span className="text-white font-semibold">
                  {plan.currency}
                  {plan.totalReturn}
                </span>{" "}
                in {plan.durationDays} days with guaranteed daily profit.
              </p>

              {/* Features */}
              <ul className="space-y-2 text-xs text-gray-200">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Daily Profit: {plan.currency}
                  {plan.dailyProfit}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Total Return: {plan.currency}
                  {plan.totalReturn}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Duration: {plan.durationDays} Days
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingCards;
