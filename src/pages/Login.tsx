import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const success = await login(email, password);

    if (success) navigate("/dashboard/home");

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 md:p-8 mt-8">
        {/* Logo + Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto flex items-center justify-center mb-3">
            <div className="w-22 h-22 rounded-lg flex items-center justify-center shrink-0">
              <img src="/logo98.png" className="w-16 h-16" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-[#0F172A]">
            Legacy Investment
          </h1>

          <p className="text-sm text-[#64748B]">
            Elevate your real estate managment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm text-[#0F172A]">Email Address</label>

            <Input
              type="email"
              placeholder="agent@estatesync.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 bg-white border-gray-300 text-gray-800"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between text-sm">
              <label className="text-[#0F172A]">Password</label>

              <button type="button" className="text-[#0EA5E9] hover:underline">
                Forgot password?
              </button>
            </div>

            <div className="relative mt-1">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10 bg-white border-gray-300 text-gray-800"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember */}
          <div className="flex items-center gap-2 text-sm text-[#475569]">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            Remember me for 30 days
          </div>

          {/* Sign In */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0EA5E9] hover:bg-sky-600 text-white"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          {/* Divider */}
          <div className="text-center text-sm text-[#94A3B8]">
            Or continue with
          </div>

          {/* Google */}
          <Button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-4 h-4"
            />
            Google
          </Button>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 space-y-2">
        <p className="text-sm text-[#475569]">
          Don't have an account?
          <span
            onClick={() => navigate("/create-account")}
            className="text-[#0EA5E9] ml-1 cursor-pointer"
          >
            Sign up
          </span>
        </p>

        <div className="text-xs text-gray-400 flex gap-4 justify-center">
          <span className="cursor-pointer hover:underline">Privacy Policy</span>
          <span className="cursor-pointer hover:underline">
            Terms of Service
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
