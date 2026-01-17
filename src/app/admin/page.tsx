"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AdminPortal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", ...loginData }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        toast.success("Admin login successful");
        fetchData();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin");
      const data = await response.json();
      setUsers(data.users);
      setNotifications(data.notifications);
    } catch (error) {
      toast.error("Failed to fetch data");
    }
  };

  const addMoney = async (e) => {
    e.preventDefault();
    if (!selectedUser || !amount) {
      toast.error("Please select user and enter amount");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addMoney",
          userId: selectedUser,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Money added successfully");
        setAmount("");
        setSelectedUser("");
        fetchData();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Failed to add money");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full bg-dark_grey/50 p-8 rounded-lg border border-white/10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
            <p className="text-white/60">Secure admin access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="admin@crypgo.com"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter admin password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/80 text-background font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login to Admin Portal"}
            </button>
          </form>
         
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/60 mt-1">Manage users and transactions</p>
          </div>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-dark_grey/50 p-6 rounded-lg border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">💰 Add Money to User</h2>
            <form onSubmit={addMoney} className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Select User</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-4 py-3 bg-dark border border-white/20 rounded-lg text-white focus:border-primary focus:outline-none"
                >
                  <option value="" className="bg-dark text-white">Choose a user...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id} className="bg-dark text-white">
                      {user.name} ({user.email}) - ${user.wallet.balance.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter amount to add"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:border-primary focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Adding Money..." : "Add Money"}
              </button>
            </form>
          </div>

          <div className="bg-dark_grey/50 p-6 rounded-lg border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">🔔 Recent Notifications</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification._id}
                    className="p-3 bg-white/5 rounded-lg border-l-4 border-primary"
                  >
                    <p className="text-white text-sm">{notification.message}</p>
                    <p className="text-white/60 text-xs mt-1">
                      {mounted ? new Date(notification.timestamp).toLocaleString() : 'Loading...'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-white/60 text-center py-4">No notifications yet</p>
              )}
            </div>
          </div>

          <div className="bg-dark_grey/50 p-6 rounded-lg border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">🔄 Data Management</h2>
              <button
                onClick={fetchData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Refresh Data
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-primary/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary">{users.length}</div>
                <div className="text-white/60 text-sm">Total Users</div>
              </div>
              <div className="bg-green-600/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-400">
                  ${users.reduce((sum, user) => sum + (user.wallet?.totalAdded || 0), 0).toFixed(2)}
                </div>
                <div className="text-white/60 text-sm">Total Money Added</div>
              </div>
              <div className="bg-blue-600/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">
                  ${users.reduce((sum, user) => sum + (user.wallet?.balance || 0), 0).toFixed(2)}
                </div>
                <div className="text-white/60 text-sm">Total Balance</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark_grey/50 p-6 rounded-lg border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">👥 All Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Balance</th>
                  <th className="text-left py-3 px-4">Total Added</th>
                  <th className="text-left py-3 px-4">Total Used</th>
                  <th className="text-left py-3 px-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4 font-medium">{user.name}</td>
                      <td className="py-3 px-4 text-white/70">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className="text-primary font-semibold">
                          ${user.wallet?.balance?.toFixed(2) || '0.00'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-green-400 font-semibold">
                          ${user.wallet?.totalAdded?.toFixed(2) || '0.00'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-red-400 font-semibold">
                          ${user.wallet?.totalUsed?.toFixed(2) || '0.00'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white/70">
                        {mounted ? new Date(user.createdAt).toLocaleDateString() : 'Loading...'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 px-4 text-center text-white/60">
                      No users registered yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;