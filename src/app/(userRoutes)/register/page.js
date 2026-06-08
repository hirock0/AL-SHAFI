"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addActiveFlag } from "@/utils/redux/slices/slice";
import { useRouter } from "next/navigation";
const Register = () => {
  const dispatch = useDispatch();
  const { activeFlag } = useSelector((state) => state?.slice);
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const onSubmit = async (data) => {
    const { fullName, email, password, confirmPassword } = data;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: fullName,
        email,
        password,
      };
      const { data } = await axios.post("/pages/api/user/register", payload);
      if (data?.success) {
        toast.success(data.message);
        dispatch(addActiveFlag(!activeFlag));
        router.push("/")
      } else {
        toast.warning(data.message);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-8 md:py-12">
      <div className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded md:rounded-md shadow-2xl w-full max-w-md animate-fadeIn">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Your Account
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Join us and get started instantly
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              {...register("fullName", { required: true })}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.fullName && (
              <span className="text-red-500 text-sm">
                Full Name is required
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="example@mail.com"
              {...register("email", { required: true })}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">Email is required</span>
            )}
          </div>

          {/* Password */}
          <div className="">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex flex-col relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                {...register("password", { required: true, minLength: 6 })}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm">
                Password must be at least 6 characters
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="flex flex-col relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Retype password"
                {...register("confirmPassword", { required: true })}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                Confirm password is required
              </span>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 md:py-3 rounded md:rounded-md text-white text-base md:text-lg font-medium transition ${
              loading
                ? "bg-primary-lighter cursor-not-allowed"
                : "bg-primary hover:bg-primary-dark"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm mt-5 text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className=" text-secondary hover:underline font-medium"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
