"use client";
import React, { useState, useMemo } from "react";
import { Package, MapPin, Phone, Mail, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/carts/useCart";
import Image from "next/image";
import AreaSelections from "@/components/AreaSelections/AreaSelections.js";
import Container from "@/components/Container/Container.js";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addActiveFlag } from "@/utils/redux/slices/slice";
import { useRouter } from "next/navigation";

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { activeFlag } = useSelector((state) => state?.slice);
  const { carts } = useCart();
  const quantityMap = useMemo(() => {
    const q = {};
    carts?.forEach((c) => {
      q[c.slug] = c.qty || 1;
    });
    return q;
  }, [carts]);

  const subtotal = useMemo(() => {
    return carts?.reduce((sum, p) => {
      const price = p.offerPrice || p.price || 0;
      const qty = p.qty || 1;
      return sum + price * qty;
    }, 0);
  }, [carts]);

  const shippingTotal = subtotal > 0 ? 120 : 0;
  const grandTotal = subtotal + shippingTotal;
  const [selectDta, setSelectDta] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    city: "",
    note: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // =====================================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const division = selectDta?.division;
    const district = selectDta?.district;
    const upazila = selectDta?.upazila;

    const fixedAddress = {
      divisionName: division?.name,
      districtName: district?.name,
      upazilaName: upazila?.name,
    };

    const payload = {
      ...formData,
      items: carts,
      flag: "steadFast",
      fixedAddress,
      totals: { subtotal, shippingTotal, grandTotal },
    };

    const { data } = await axios.post(
      "/pages/api/orders/create-order",
      payload
    );

    if (data?.success) {
      toast.success("Order created");
      localStorage.removeItem("carts");

      // HANDLE INVOICE STORAGE
      const existInvoices = localStorage.getItem("invoices");
      const inv = data?.orders?.invoice;

      if (existInvoices) {
        const parseInvoice = JSON.parse(existInvoices);
        localStorage.setItem(
          "invoices",
          JSON.stringify([inv, ...parseInvoice])
        );
      } else {
        localStorage.setItem("invoices", JSON.stringify([inv]));
      }

      dispatch(addActiveFlag(!activeFlag));
      router.push("/");
    } else {
      toast.warning("Order not created");
      dispatch(addActiveFlag(!activeFlag));
    }
  };

  // =====================================================================================

  return (
    <div className="py-8 md:py-12">
      <Container>
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold  mb-2">Checkout</h1>
          <p className="text-gray-600">
            Complete your order in a few simple steps
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ===================================================================================== */}
          {/* LEFT SECTION - FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded md:rounded-md shadow-sm p-8 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Contact Info */}
                <div>
                  <h2 className="text-lg font-semibold  mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/5 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    Contact Information
                  </h2>

                  <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 lg:space-x-4 ">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email{" "}
                        <span className="text-gray-400 font-normal">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="017xxxxxxxx"
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House no., Road no., Area..."
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <AreaSelections setSelectDta={setSelectDta} />
                </div>

                {/* Address */}

                <button
                  type="submit"
                  className="w-full bg-text hover:bg-black text-white py-3 font-semibold transition-all flex items-center justify-center gap-2 shadow-lg  mt-6"
                >
                  <Package className="w-5 h-5" />
                  Place Order
                </button>
              </form>
            </div>
          </div>

          {/* ===================================================================================== */}
          {/* RIGHT SECTION - ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded md:rounded-md shadow-sm p-6 border border-gray-100 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Order Summary
              </h2>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {carts?.map((p) => (
                  <div
                    key={p.slug}
                    className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200"
                  >
                    <Image
                      src={p.img}
                      alt={p.productName}
                      width={80}
                      height={80}
                      className="w-16 h-16 rounded-lg object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {p.productName}
                      </p>
                      <p className="text-xs text-gray-500 capitalize mt-0.5">
                        Category: {p.category}
                      </p>

                      <p className="text-sm font-medium mt-1">
                        Qty: {quantityMap[p.slug] || 1}
                      </p>

                      <p className="text-primary font-semibold text-sm mt-1">
                        ৳ {(p.offerPrice || p.price) * (p.qty || 1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 mt-6 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>৳ {subtotal}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>৳ {shippingTotal}</span>
                </div>

                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>৳ {grandTotal}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Payment Method
                </label>

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition bg-white"
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                  <option value="card">Credit / Debit Card</option>
                </select>

                {/* Payment Info */}
                <div className="mt-3">
                  {paymentMethod === "cod" && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-800">
                      <p className="font-semibold mb-1">Cash on Delivery</p>
                      <p>Pay when your order arrives at your doorstep.</p>
                    </div>
                  )}

                  {paymentMethod === "bkash" && (
                    <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 text-xs text-pink-800">
                      <p className="font-semibold mb-1">bKash Payment</p>
                      <p>
                        You will receive a bKash number after placing the order.
                      </p>
                    </div>
                  )}

                  {paymentMethod === "nagad" && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs text-orange-800">
                      <p className="font-semibold mb-1">Nagad Payment</p>
                      <p>Pay via Nagad after placing your order.</p>
                    </div>
                  )}

                  {paymentMethod === "rocket" && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs text-purple-800">
                      <p className="font-semibold mb-1">Rocket Payment</p>
                      <p>Payment instructions will be sent to your phone.</p>
                    </div>
                  )}

                  {paymentMethod === "card" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800">
                      <p className="font-semibold mb-1">Card Payment</p>
                      <p>We accept Visa, MasterCard, and American Express.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================================== */}
        </div>
      </Container>
    </div>
  );
};

export default Checkout;
