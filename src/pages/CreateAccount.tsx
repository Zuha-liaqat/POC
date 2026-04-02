import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, phone, password });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#F5F5F5] px-4 py-8">
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 md:p-8">
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
            Elevate your real estate management.
          </p>
        </div>

        <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
          Create your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-[#0F172A]">Full Name</label>
            <Input
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 bg-white border-gray-300 text-gray-800"
            />
          </div>

          <div>
            <label className="text-sm text-[#0F172A]">Email Address</label>
            <Input
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 bg-white border-gray-300 text-gray-800"
            />
          </div>

          <div>
            <label className="text-sm text-[#0F172A]">Phone Number</label>
            <Input
              placeholder="(555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 bg-white border-gray-300 text-gray-800"
            />
          </div>

          <div>
            <label className="text-sm text-[#0F172A]">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 bg-white border-gray-300 text-gray-800"
            />
          </div>

          <label className="flex items-start gap-2 text-[#475569] cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="shrink-0 mt-0.5"
            />
            <span className="text-xs">
              I agree to the{" "}
              <span className="text-[#0EA5E9]">Terms of Service</span> and{" "}
              <span className="text-[#0EA5E9]">Privacy Policy</span>
            </span>
          </label>

          <Button className="w-full bg-[#0EA5E9] text-white hover:bg-sky-600">
            Create Account
          </Button>

          <div className="text-center text-sm text-[#94A3B8]">
            Or continue with
          </div>

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

      {/* Footer (closer to card) */}
      <div className="text-center mt-4 space-y-2">
        <p className="text-sm text-[#475569]">
          Already have an account?
          <span
            onClick={() => navigate("/")}
            className="text-[#0EA5E9] ml-1 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;
