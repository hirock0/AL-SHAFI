"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addActiveFlag } from "@/utils/redux/slices/slice";

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { activeFlag } = useSelector((state) => state?.slice);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const onSubmit = async (d) => {
    setLoading(true);
    try {
      const res = await axios.post("/pages/api/user/login", d);
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setLoading(false);
        dispatch(addActiveFlag(!activeFlag));
        router.push("/");
      } else {
        toast.warning(res?.data?.message);
      }
    } catch (err) {
      toast(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-8 md:py-12">
      <div className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded md:rounded-md shadow-2xl w-full max-w-md animate-fadeIn">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Login to access your dashboard
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="example@mail.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none pr-12"
                placeholder="•••••••••"
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 md:py-3 rounded md:rounded-md text-white text-base md:text-lg font-medium transition 
              ${
                loading
                  ? "bg-primary-lighter cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dark"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {/* Footer link */}
        <div className="text-center mt-5">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-secondary hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
