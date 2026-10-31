
import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import {
  MessageCircle,
  User,
  AtSign,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Users,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await API.post("/auth/signup", form);

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Account creation failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080D1A] text-white flex items-center justify-center p-0 sm:p-5 lg:p-8">

      <div className="w-full max-w-7xl min-h-screen sm:min-h-[680px] lg:min-h-[760px] grid grid-cols-1 lg:grid-cols-2 overflow-hidden sm:rounded-[30px] border border-white/10 shadow-2xl shadow-black/40">

        {/* LEFT SIDE - BRANDING */}

        <div className="hidden lg:flex relative flex-col justify-between overflow-hidden bg-gradient-to-br from-[#172554] via-[#101B3D] to-[#090F20] p-12 xl:p-16">

          {/* Background Effects */}
          <div className="absolute -top-32 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px]" />

          {/* Branding */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <MessageCircle size={26} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-wide">
                Chat<span className="text-blue-400">App</span>
              </h1>
              <p className="text-xs text-slate-400 tracking-widest">
                CONNECT. SHARE. REPEAT.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 max-w-lg">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-400/20 bg-blue-400/10 text-blue-300 text-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Your next connection starts here
            </div>

            <h2 className="text-5xl xl:text-6xl font-bold leading-tight mb-6">
              Your world,
              <br />
              your people,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                your stories.
              </span>
            </h2>

            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Create your account and become part of a
              community where every message brings people closer.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-3 gap-3 mt-12">

              <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10">
                <MessageCircle className="text-blue-400 mb-3" size={23} />
                <p className="font-semibold text-sm">Chat</p>
                <p className="text-xs text-slate-500 mt-1">Instantly</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10">
                <Users className="text-violet-400 mb-3" size={23} />
                <p className="font-semibold text-sm">Connect</p>
                <p className="text-xs text-slate-500 mt-1">With people</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10">
                <Zap className="text-yellow-400 mb-3" size={23} />
                <p className="font-semibold text-sm">Share</p>
                <p className="text-xs text-slate-500 mt-1">Your moments</p>
              </div>

            </div>
          </div>

          <p className="relative z-10 text-sm text-slate-500">
            © 2026 ChatApp. Made for meaningful connections.
          </p>
        </div>

        {/* RIGHT SIDE - SIGNUP FORM */}

        <div className="relative flex items-center justify-center bg-[#0D1425] px-5 py-10 sm:px-10 lg:px-12 xl:px-16">

          {/* Mobile Background Effects */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[90px] lg:hidden" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[90px] lg:hidden" />

          <div className="relative z-10 w-full max-w-md">

            {/* Mobile Branding */}
            <div className="flex lg:hidden items-center justify-center gap-3 mb-9">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-violet-600 flex items-center justify-center">
                <MessageCircle size={26} />
              </div>

              <h1 className="text-3xl font-bold">
                Chat<span className="text-blue-400">App</span>
              </h1>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <p className="text-blue-400 font-semibold text-sm tracking-widest uppercase mb-3">
                Join Our Community
              </p>

              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                Create your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                  account.
                </span>
              </h2>

              <p className="text-slate-400 mt-4">
                Fill in your details and start connecting.
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="space-y-4">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full h-13 pl-12 pr-4 rounded-xl bg-[#172238] border border-slate-700/70 outline-none text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>

                <div className="relative">
                  <AtSign
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    required
                    autoComplete="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full h-13 pl-12 pr-4 rounded-xl bg-[#172238] border border-slate-700/70 outline-none text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full h-13 pl-12 pr-4 rounded-xl bg-[#172238] border border-slate-700/70 outline-none text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full h-13 pl-12 pr-12 rounded-xl bg-[#172238] border border-slate-700/70 outline-none text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  {error}
                </p>
              )}

              {/* Signup Button */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full h-14 flex items-center justify-center gap-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Your Account"}

                {!loading && (
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                )}
              </button>

            </form>

            {/* Login Link */}
            <p className="text-center text-sm text-slate-400 mt-7">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-400 font-semibold hover:text-violet-400 transition-colors"
              >
                Login
              </Link>
            </p>

            {/* Security Info */}
            <div className="flex items-center justify-center gap-2 mt-7 text-sm text-slate-500">
              <ShieldCheck size={17} className="text-green-400" />
              Your information is protected.
            </div>

            <p className="text-center text-xs text-slate-600 mt-7 lg:hidden">
              © 2026 ChatApp. Made for meaningful connections.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Signup;
