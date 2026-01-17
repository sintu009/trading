"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export const plans = [
  {
    title: "Starter Plan",
    investment: 50,
    totalReturn: 75,
    durationDays: 15,
    // dailyProfit: 5,
    currency: "$",
    highlight: false,
  },
  {
    title: "Basic Plan",
    investment: 100,
    // totalReturn: 150,
    durationDays: 15,
    // dailyProfit: 10,
    currency: "$",
    highlight: false,
  },
  {
    title: "Standard Plan",
    investment: 200,
    totalReturn: 300,
    durationDays: 15,
    // dailyProfit: 20,
    currency: "$",
    highlight: true,
  },
  {
    title: "Premium Plan",
    investment: 500,
    totalReturn: 750,
    durationDays: 15,
    // dailyProfit: 50,
    currency: "$",
    highlight: false,
  },
  {
    title: "Premium Plan",
    investment: 500,
    totalReturn: 750,
    durationDays: 15,
    // dailyProfit: 50,
    currency: "$",
    highlight: false,
  },
];

const PricingCards = () => {
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [usdtAddress, setUsdtAddress] = useState("");
   const [user, setUser] = useState<any>(null); // get user from localStorage
  const [wallet, setWallet] = useState({ balance: 0, totalAdded: 0, totalUsed: 0, transactions: [] });
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const paymentLinks = [
    "upi://pay?pa=example@upi&pn=CrypGo",
    "phonepe://pay?pa=example@upi&pn=CrypGo",
    "gpay://upi/pay?pa=example@upi&pn=CrypGo",
  ];


  // Load user on mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setWallet(parsedUser.wallet || wallet);
    }
  }, []);

  const handleBuyNow = (plan: any) => {
    setSelectedPlan(plan);
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!user || !selectedPlan) return;

    const amount = selectedPlan.investment;

    // Optional: check if user has enough balance
    if (wallet.balance < amount) {
      toast.error("Insufficient balance!");
      return;
    }

    const payload = {
      userId: user.id,
      amount,
      link: usdtAddress || null, // optional
      description: `Investment: ${selectedPlan.title}`, // use title instead of name
    };

    try {
      const res = await fetch("/api/wallet/deduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to deduct amount");
        return;
      }

      toast.success("Amount deducted successfully!");

      // Update wallet state immediately
      setWallet(data.wallet);

      // Also update localStorage user
      const updatedUser = { ...user, wallet: data.wallet };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      

      // reset modal/input
      setUsdtAddress("");
      setOpen(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error("Deduction API error:", error);
      toast.error("Something went wrong");
    }
  };



  return (
    <>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-white text-3xl font-bold">Subscription</h2>
          <p className="text-gray-400 text-sm mt-2">
            Choose the plan that fits your investment goals
          </p>
        </div>

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
              }`}
            >
              <h3 className="text-white text-sm font-semibold mb-6">
                {plan.title}
              </h3>

              <div className="text-center mb-4">
                <p className="text-white text-4xl font-bold">
                  {plan.currency}
                  {plan.investment}
                </p>
                <p className="text-gray-400 text-xs mt-1">Investment Amount</p>
              </div>

              <p className="text-center text-xs text-gray-400 mb-5">
                {plan.durationDays} Days Plan
              </p>

              <button
                onClick={() => handleBuyNow(plan)}
                className="w-full bg-primary hover:bg-primary/90
                text-black text-sm font-semibold py-2.5 rounded-lg mb-6"
              >
                Buy Now
              </button>

              <p className="text-gray-300 text-xs mb-5">
                Earn total{" "}
                <span className="text-white font-semibold">
                  {plan.currency}
                  {plan.totalReturn}
                </span>{" "}
                in {plan.durationDays} days.
              </p>

              <ul className="space-y-2 text-xs text-gray-200">
                {/* <li>
                  ✓ Daily Profit: {plan.currency}
                  {plan.dailyProfit}
                </li> */}
                <li>
                  ✓ Total Return: {plan.currency}
                  {plan.totalReturn}
                </li>
                <li>✓ Duration: {plan.durationDays} Days</li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* POPUP MODAL */}
      {open && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#0f1418] rounded-xl w-full max-w-md p-6 border border-white/20">
            <h3 className="text-white text-lg font-semibold mb-4">
              Confirm Subscription
            </h3>

            {/* Plan Info */}
            <div className="bg-[#1c242b] rounded-lg p-4 mb-4">
              <p className="text-gray-400 text-xs">Selected Plan</p>
              <p className="text-white font-semibold">{selectedPlan.title}</p>
              <p className="text-cyan-400 text-lg font-bold mt-1">
                {selectedPlan.currency}
                {selectedPlan.investment}
              </p>
            </div>

            {/* Payment Links */}
            <div className="mb-4">
              <label className="text-gray-400 text-xs mb-2 block">Payment Links</label>
              <div className="space-y-2">
                {paymentLinks.map((link, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={link}
                      readOnly
                      className={`flex-1 px-3 py-2 rounded-lg text-white text-sm border transition-all ${
                        copiedIndex === idx 
                          ? "bg-green-500/20 border-green-500" 
                          : "bg-[#1c242b] border-white/20"
                      }`}
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(link);
                        setCopiedIndex(idx);
                        toast.success("Link copied!");
                        setTimeout(() => setCopiedIndex(null), 2000);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        copiedIndex === idx ? "bg-green-500 text-white scale-105" : "bg-primary text-black"
                      }`}
                    >
                      {copiedIndex === idx ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* USDT Input */}
            <div className="mb-4">
              <label className="text-gray-400 text-xs">
                USDT Wallet Address
              </label>
              <input
                type="text"
                value={usdtAddress}
                onChange={(e) => setUsdtAddress(e.target.value)}
                placeholder="Enter USDT address"
                className="w-full mt-1 px-3 py-2 rounded-lg
                bg-[#1c242b] text-white text-sm
                border border-white/20 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="w-full py-2 rounded-lg
                bg-white/10 text-white text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={!usdtAddress}
                className="w-full py-2 rounded-lg
                bg-primary text-black text-sm font-semibold
                disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PricingCards;
