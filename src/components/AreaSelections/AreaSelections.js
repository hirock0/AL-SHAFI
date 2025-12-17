"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const AreaSelections = ({ setSelectDta }) => {
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");

  const BDAPI = {
    division: "https://bdapi.vercel.app/api/v.1/division",
    districtByDivision: (divId) =>
      `https://bdapi.vercel.app/api/v.1/district/${encodeURIComponent(divId)}`,
    upazilaByDistrictPrimary: (disId) =>
      `https://bdapi.vercel.app/api/v.1/upazilla/${encodeURIComponent(disId)}`,
    upazilaByDistrictFallback: (disId) =>
      `https://bdapi.vercel.app/api/v.1/district/${encodeURIComponent(disId)}`,
  };

  // Fetch Divisions
  useEffect(() => {
    axios
      .get(BDAPI.division)
      .then((res) => setDivisions(res.data?.data || []))
      .catch((err) => console.error("Error fetching divisions:", err));
  }, []);

  useEffect(() => {
    if (!selectedDivision) return;
    const handler = () => {
      setDistricts([]);
      setSelectedDistrict("");
      setUpazilas([]);
      setSelectedUpazila("");

      axios
        .get(BDAPI.districtByDivision(selectedDivision))
        .then((res) => setDistricts(res.data?.data || []))
        .catch((err) => console.error("Error fetching districts:", err));
    };
    handler();
  }, [selectedDivision]);

  useEffect(() => {
    if (!selectedDistrict) return;

    const handler = () => {
      setUpazilas([]);
      setSelectedUpazila("");

      axios
        .get(BDAPI.upazilaByDistrictPrimary(selectedDistrict))
        .then((res) => {
          if (res.data?.data?.length > 0) {
            setUpazilas(res.data.data);
          } else {
            // fallback
            axios
              .get(BDAPI.upazilaByDistrictFallback(selectedDistrict))
              .then((res2) => setUpazilas(res2.data?.data || []))
              .catch((err2) => console.error("Fallback upazila error:", err2));
          }
        })
        .catch((err) => console.error("Error fetching upazilas:", err));
    };
    handler();
  }, [selectedDistrict]);

  // Notify parent about selection
  useEffect(() => {
    const handler = () => {
      const divisionName =
        divisions.find((d) => d.id === selectedDivision)?.name || "";
      const districtName =
        districts.find((d) => d.id === selectedDistrict)?.name || "";
      const upazilaName =
        upazilas.find((u) => u.id === selectedUpazila)?.name || "";

      const selection = {
        division: { id: selectedDivision, name: divisionName },
        district: { id: selectedDistrict, name: districtName },
        upazila: { id: selectedUpazila, name: upazilaName },
      };

      setSelectDta(selection);
    };
    handler();
  }, [
    selectedDivision,
    selectedDistrict,
    selectedUpazila,
    divisions,
    districts,
    upazilas,
  ]);
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {/* Division */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Division *
        </label>
        <select
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
        >
          <option value="">Select Division</option>
          {divisions.map((div) => (
            <option key={div.id} value={div.id}>
              {div.name}
            </option>
          ))}
        </select>
      </div>

      {/* District */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          District *
        </label>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
          disabled={!districts.length}
        >
          <option value="">Select District</option>
          {districts.map((dis) => (
            <option key={dis.id} value={dis.id}>
              {dis.name}
            </option>
          ))}
        </select>
      </div>

      {/* Upazila */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Upazila *
        </label>
        <select
          value={selectedUpazila}
          onChange={(e) => setSelectedUpazila(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
          disabled={!upazilas.length}
        >
          <option value="">Select Upazila</option>
          {upazilas.map((upa) => (
            <option key={upa.id} value={upa.id}>
              {upa.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AreaSelections;
