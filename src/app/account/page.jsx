"use client";

import { useEffect, useState } from "react";
import {
  Leaf,
  Heart,
  ShoppingCart,
  Eye,
  EyeOff,
  FileText,
  Download,
  MapPin,
  UserCircle,
  LogOut,
  Trash2,
  Plus,
} from "lucide-react";

/* Swap these for your real brand tokens */
const GREEN = "#173B22";
const GREEN_DARK = "#0F2818";

const NAV_LINKS = ["Home", "Shop", "Our Story", "Process", "Contact"];

const DASHBOARD_CARDS = [
  { key: "orders", label: "Orders", icon: FileText },
  { key: "downloads", label: "Downloads", icon: Download },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "account-details", label: "Account details", icon: UserCircle },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "logout", label: "Logout", icon: LogOut },
];

const SIDEBAR_ITEMS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "orders", label: "Orders" },
  { key: "downloads", label: "Downloads" },
  { key: "addresses", label: "Addresses" },
  { key: "account-details", label: "Account details" },
  { key: "wishlist", label: "Wishlist" },
  { key: "logout", label: "Logout" },
];

/* ================================================================== */
/* Site chrome — header + black page banner, shared by both states.    */
/* ================================================================== */
function SiteHeader({ loggedIn }) {
  return (
    <header className="flex items-center justify-between px-6 sm:px-10 py-4 border-b border-black/5">
      <div className="flex items-center gap-2">
        <Leaf className="w-7 h-7 text-[#4CAF50]" />
        <span className="font-bold text-lg leading-tight">
          <span className="text-[#4CAF50]">Little</span>
          <br />
          <span className="text-[#1a1a1a]">Farmer</span>
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide uppercase text-[#1a1a1a]">
        {NAV_LINKS.map((l) => (
          <a key={l} href="#" className="hover:opacity-70 transition-opacity">
            {l}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-6 text-sm font-semibold uppercase text-[#1a1a1a]">
        <a href="/my-account" className="hover:opacity-70 transition-opacity">
          {loggedIn ? "My account" : "Login / Register"}
        </a>
        <span className="relative">
          <Heart className="w-5 h-5" />
          <span className="absolute -top-2 -right-2 bg-[#4CAF50] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            0
          </span>
        </span>
        <span className="relative flex items-center gap-1">
          <ShoppingCart className="w-5 h-5" />
          <span className="absolute -top-2 -right-2 bg-[#4CAF50] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            0
          </span>
          <span className="ml-3">₹0.00</span>
        </span>
      </div>
    </header>
  );
}

function PageBanner({ showTitle }) {
  return (
    <div className="bg-black text-white px-6 sm:px-10 py-10">
      {showTitle && (
        <>
          <h1 className="text-4xl sm:text-6xl font-black">My account</h1>
          <p className="text-sm mt-3 text-white/70">
            <a href="/" className="hover:underline">
              Home
            </a>{" "}
            / <span className="font-semibold text-white">My account</span>
          </p>
        </>
      )}
    </div>
  );
}

/* ================================================================== */
/* Login / Register — matches the two-column WooCommerce layout.       */
/* ================================================================== */
function LoginRegister({ onAuthed }) {
  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 py-14 grid grid-cols-1 md:grid-cols-2 gap-14">
      <LoginColumn onAuthed={onAuthed} />
      <RegisterColumn onAuthed={onAuthed} />
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-4 my-5">
      <span className="flex-1 h-px bg-black/10" />
      <span className="text-xs text-black/50">OR</span>
      <span className="flex-1 h-px bg-black/10" />
    </div>
  );
}

function LoginColumn({ onAuthed }) {
  const [mode, setMode] = useState("password"); // "password" | "otp"
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      onAuthed(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send code.");
      setOtpSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid code.");
      onAuthed(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Login</h2>

      {mode === "password" ? (
        <>
          <button
            onClick={() => setMode("otp")}
            style={{ backgroundColor: GREEN }}
            className="w-full text-white font-bold tracking-wide text-sm py-3 rounded-sm hover:opacity-90 transition-opacity"
          >
            LOGIN WITH OTP
          </button>

          <Divider />

          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1.5">
                Username or email address <span className="text-red-600">*</span>
              </label>
              <input
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full border border-black/20 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black/50"
              />
            </div>
            <div>
              <label className="block text-sm mb-1.5">
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-black/20 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: GREEN }}
              className="text-white font-bold tracking-wide text-sm px-8 py-3 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? "LOGGING IN…" : "LOG IN"}
            </button>

            <div className="flex items-center justify-between pt-1 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember me
              </label>
              <a href="#" className="text-black/70 hover:underline">
                Lost your password?
              </a>
            </div>
          </form>
        </>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-black/60">We'll text a 6-digit code to verify it's you.</p>
          <div>
            <label className="block text-sm mb-1.5">
              Phone <span className="text-red-600">*</span>
            </label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={otpSent}
              className="w-full border border-black/20 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black/50 disabled:bg-black/5"
            />
          </div>

          {!otpSent ? (
            <button
              onClick={handleSendOtp}
              disabled={loading || !phone}
              style={{ backgroundColor: GREEN }}
              className="text-white font-bold tracking-wide text-sm px-6 py-3 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? "SENDING…" : "SEND CODE"}
            </button>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm mb-1.5">
                  Enter code <span className="text-red-600">*</span>
                </label>
                <input
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border border-black/20 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black/50"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: GREEN }}
                className="text-white font-bold tracking-wide text-sm px-6 py-3 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loading ? "VERIFYING…" : "VERIFY & LOG IN"}
              </button>
            </form>
          )}

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <button onClick={() => { setMode("password"); setOtpSent(false); }} className="text-sm text-black/60 hover:underline">
            Use password instead
          </button>
        </div>
      )}
    </div>
  );
}

function RegisterColumn({ onAuthed }) {
  const [mode, setMode] = useState("email"); // "email" | "mobile"
  const [email, setEmail] = useState("");
  const [phoneForEmail, setPhoneForEmail] = useState("");

  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone: phoneForEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed.");
      setSuccess(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send code.");
      setOtpSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid code.");
      onAuthed(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Register</h2>

      {mode === "email" ? (
        <>
          <button
            onClick={() => setMode("mobile")}
            style={{ backgroundColor: GREEN }}
            className="w-full text-white font-bold tracking-wide text-sm py-3 rounded-sm hover:opacity-90 transition-opacity"
          >
            SIGNUP WITH MOBILE
          </button>

          <Divider />

          <form onSubmit={handleEmailRegister} className="space-y-4">
            <div>
              <label className="block text-sm mb-1.5">
                Email address <span className="text-red-600">*</span>
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-black/20 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black/50"
              />
              <p className="text-xs text-black/50 mt-1.5">
                A link to set a new password will be sent to your email address.
              </p>
            </div>

            <div>
              <label className="block text-sm mb-1.5">
                Phone <span className="text-red-600">*</span>
              </label>
              <input
                required
                type="tel"
                value={phoneForEmail}
                onChange={(e) => setPhoneForEmail(e.target.value)}
                className="w-full border border-black/20 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black/50"
              />
            </div>

            <p className="text-xs text-black/50">
              Your personal data will be used to support your experience throughout this website, to
              manage access to your account, and for other purposes described in our{" "}
              <a href="#" className="underline">
                privacy policy
              </a>
              .
            </p>

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
            {success && <p className="text-sm text-[#3F6B32] font-medium">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: GREEN }}
              className="w-full text-white font-bold tracking-wide text-sm py-3 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? "REGISTERING…" : "REGISTER"}
            </button>
          </form>
        </>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-black/60">Sign up instantly by verifying your phone number.</p>
          <div>
            <label className="block text-sm mb-1.5">
              Phone <span className="text-red-600">*</span>
            </label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={otpSent}
              className="w-full border border-black/20 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black/50 disabled:bg-black/5"
            />
          </div>

          {!otpSent ? (
            <button
              onClick={handleSendOtp}
              disabled={loading || !phone}
              style={{ backgroundColor: GREEN }}
              className="text-white font-bold tracking-wide text-sm px-6 py-3 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? "SENDING…" : "SEND CODE"}
            </button>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm mb-1.5">
                  Enter code <span className="text-red-600">*</span>
                </label>
                <input
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border border-black/20 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black/50"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: GREEN }}
                className="text-white font-bold tracking-wide text-sm px-6 py-3 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loading ? "VERIFYING…" : "VERIFY & CREATE ACCOUNT"}
              </button>
            </form>
          )}

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <button onClick={() => { setMode("email"); setOtpSent(false); }} className="text-sm text-black/60 hover:underline">
            Use email instead
          </button>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/* Dashboard — sidebar + "Hello X" greeting + the 6 icon cards.        */
/* ================================================================== */
function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const identifier = user.phone || user.email;

  const go = (key) => (key === "logout" ? onLogout() : setActiveTab(key));

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12">
      <nav className="space-y-1">
        <h3 className="text-lg font-bold mb-3 pb-3 border-b border-black/10">My Account</h3>
        {SIDEBAR_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => go(item.key)}
            className={`block w-full text-left px-3 py-2.5 rounded text-sm font-medium transition-colors ${
              activeTab === item.key ? "bg-black/5 font-semibold" : "hover:bg-black/5 text-black/70"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div>
        {activeTab === "dashboard" && (
          <>
            <p className="text-sm">
              Hello {identifier} (not {identifier}?{" "}
              <button onClick={onLogout} className="underline font-semibold">
                Log out
              </button>
              )
            </p>
            <p className="text-sm text-black/60 mt-3 max-w-2xl">
              From your account dashboard you can view your <strong>recent orders</strong>, manage
              your <strong>shipping and billing addresses</strong>, and edit your{" "}
              <strong>password and account details</strong>.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
              {DASHBOARD_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.key}
                    onClick={() => go(card.key)}
                    className="border border-black/15 rounded-md py-10 flex flex-col items-center justify-center gap-3 hover:border-black/40 hover:shadow-sm transition-all"
                  >
                    <Icon className="w-8 h-8 text-black/60" strokeWidth={1.5} />
                    <span className="text-sm font-medium">{card.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {activeTab === "orders" && <OrdersPanel />}
        {activeTab === "downloads" && <DownloadsPanel />}
        {activeTab === "addresses" && <AddressesPanel />}
        {activeTab === "account-details" && <AccountDetailsPanel user={user} />}
        {activeTab === "wishlist" && <WishlistPanel />}
      </div>
    </div>
  );
}

function OrdersPanel() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []));
  }, []);

  if (orders === null) return <p className="text-sm text-black/50">Loading orders…</p>;
  if (orders.length === 0) return <p className="text-sm text-black/60">No orders yet.</p>;

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="border border-black/10 rounded-md p-4 flex items-center justify-between text-sm">
          <span className="font-semibold">#{o.id.slice(0, 8)}</span>
          <span className="text-black/60">{new Date(o.createdAt).toLocaleDateString()}</span>
          <span className="capitalize">{o.status}</span>
          <span className="font-semibold">₹{Number(o.total).toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

function DownloadsPanel() {
  return <p className="text-sm text-black/60">You have no downloads available.</p>;
}

function AddressesPanel() {
  const [addresses, setAddresses] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    label: "Home",
    name: "",
    line1: "",
    city: "",
    state: "",
    postcode: "",
    phone: "",
  });

  const load = () =>
    fetch("/api/addresses")
      .then((r) => r.json())
      .then((d) => setAddresses(d.addresses || []));

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setAdding(false);
    setForm({ label: "Home", name: "", line1: "", city: "", state: "", postcode: "", phone: "" });
    load();
  };

  const handleRemove = async (id) => {
    await fetch("/api/addresses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  if (addresses === null) return <p className="text-sm text-black/50">Loading addresses…</p>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((a) => (
          <div key={a.id} className="border border-black/15 rounded-md p-4">
            <span className="text-xs uppercase font-semibold text-black/50">{a.label}</span>
            <p className="font-semibold mt-1">{a.name}</p>
            <p className="text-sm text-black/60">
              {a.line1}, {a.city}, {a.state} {a.postcode}
            </p>
            <p className="text-sm text-black/50">{a.phone}</p>
            <button
              onClick={() => handleRemove(a.id)}
              className="flex items-center gap-1 text-xs text-red-600 mt-3 hover:underline"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        ))}
      </div>

      {!adding ? (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 text-sm font-semibold border border-dashed border-black/30 rounded-md px-4 py-2.5 hover:border-black/50"
        >
          <Plus className="w-4 h-4" />
          Add new address
        </button>
      ) : (
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-3 border border-black/15 rounded-md p-4">
          {["label", "name", "line1", "city", "state", "postcode", "phone"].map((key) => (
            <input
              key={key}
              required
              placeholder={key}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="border border-black/20 rounded-sm px-3 py-2 text-sm"
            />
          ))}
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" style={{ backgroundColor: GREEN }} className="text-white text-sm font-semibold px-5 py-2 rounded-sm">
              Save address
            </button>
            <button type="button" onClick={() => setAdding(false)} className="text-sm text-black/60">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function AccountDetailsPanel({ user }) {
  const [form, setForm] = useState({ name: user.name || "", email: user.email, phone: user.phone });
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaved(true);
  };

  return (
    <form onSubmit={handleSave} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm mb-1.5">Full name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-black/20 rounded-sm px-3 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm mb-1.5">Email address</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-black/20 rounded-sm px-3 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm mb-1.5">Phone</label>
        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border border-black/20 rounded-sm px-3 py-2.5 text-sm"
        />
      </div>
      {saved && <p className="text-sm text-[#3F6B32] font-medium">Saved.</p>}
      <button type="submit" style={{ backgroundColor: GREEN }} className="text-white text-sm font-semibold px-5 py-2.5 rounded-sm">
        Save changes
      </button>
    </form>
  );
}

function WishlistPanel() {
  const [items, setItems] = useState(null);

  const load = () =>
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []));

  useEffect(() => {
    load();
  }, []);

  const handleRemove = async (productId) => {
    await fetch("/api/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    load();
  };

  if (items === null) return <p className="text-sm text-black/50">Loading wishlist…</p>;
  if (items.length === 0) return <p className="text-sm text-black/60">Your wishlist is empty.</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {items.map((it) => (
        <div key={it.id} className="border border-black/15 rounded-md p-3">
          <p className="text-sm font-semibold">{it.title}</p>
          {it.note && <p className="text-xs text-black/50 mt-1">{it.note}</p>}
          <button
            onClick={() => handleRemove(it.productId)}
            className="text-xs text-red-600 mt-2 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

/* ================================================================== */
/* Page — decides guest vs logged-in state, hydrates from the server.  */
/* ================================================================== */
export default function MyAccountPage() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .finally(() => setChecking(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-black/50">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      <SiteHeader loggedIn={!!user} />
      <PageBanner showTitle={!user} />
      {user ? <Dashboard user={user} onLogout={handleLogout} /> : <LoginRegister onAuthed={setUser} />}
    </div>
  );
}