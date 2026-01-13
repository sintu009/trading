"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState({ balance: 0, totalAdded: 0, totalUsed: 0, transactions: [] });
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/signin");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setWallet(parsedUser.wallet || { balance: 0, totalAdded: 0, totalUsed: 0, transactions: [] });
  }, [router]);

  const refreshWallet = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/wallet?userId=${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setWallet(data.wallet);
        const updatedUser = { ...user, wallet: data.wallet };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      toast.error("Failed to refresh wallet");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Wallet Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-dark_grey/50 p-8 rounded-lg border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">My Wallet</h2>
              <button
                onClick={refreshWallet}
                className="bg-primary hover:bg-primary/80 text-background px-4 py-2 rounded-lg"
              >
                Refresh
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-600/20 p-6 rounded-lg border border-green-600/30 text-center">
                <h3 className="text-green-400 text-lg mb-2">Total Added by Admin</h3>
                <div className="text-3xl font-bold text-green-400">
                  ${wallet.totalAdded?.toFixed(2) || '0.00'}
                </div>
              </div>
              
              <div className="bg-red-600/20 p-6 rounded-lg border border-red-600/30 text-center">
                <h3 className="text-red-400 text-lg mb-2">Total Used</h3>
                <div className="text-3xl font-bold text-red-400">
                  ${wallet.totalUsed?.toFixed(2) || '0.00'}
                </div>
              </div>
              
              <div className="bg-primary/20 p-6 rounded-lg border border-primary/30 text-center">
                <h3 className="text-primary text-lg mb-2">Current Balance</h3>
                <div className="text-3xl font-bold text-primary">
                  ${wallet.balance?.toFixed(2) || '0.00'}
                </div>
              </div>
            </div>

            <div className="bg-background/50 rounded-lg p-6">
              <h3 className="text-white text-xl font-semibold mb-4">Transaction History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wallet.transactions && wallet.transactions.length > 0 ? (
                      wallet.transactions.map((transaction, index) => (
                        <tr key={index} className="border-b border-white/10">
                          <td className="py-3 px-4">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-sm ${
                              transaction.type === 'added' 
                                ? 'bg-green-600/20 text-green-400' 
                                : 'bg-red-600/20 text-red-400'
                            }`}>
                              {transaction.type === 'added' ? 'Added by Admin' : 'Used'}
                            </span>
                          </td>
                          <td className={`py-3 px-4 font-semibold ${
                            transaction.type === 'added' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {transaction.type === 'added' ? '+' : '-'}${transaction.amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-white/70">
                            {transaction.description}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-8 px-4 text-center text-white/60">
                          No transactions yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;