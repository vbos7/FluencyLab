"use client";

import { useState } from "react";

type Props = {
  onChange: (billing: "monthly" | "annual") => void;
};

export default function PricingToggle({ onChange }: Props) {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  function toggle(value: "monthly" | "annual") {
    setBilling(value);
    onChange(value);
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => toggle("monthly")}
        className={`text-sm font-medium transition ${
          billing === "monthly" ? "text-gray-900" : "text-gray-400"
        }`}
      >
        Mensal
      </button>

      <button
        onClick={() => toggle(billing === "monthly" ? "annual" : "monthly")}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          billing === "annual" ? "bg-blue-600" : "bg-gray-200"
        }`}
        aria-label="Alternar cobrança"
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
            billing === "annual" ? "left-6" : "left-1"
          }`}
        />
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={() => toggle("annual")}
          className={`text-sm font-medium transition ${
            billing === "annual" ? "text-gray-900" : "text-gray-400"
          }`}
        >
          Anual
        </button>
        <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
          2 meses grátis
        </span>
      </div>
    </div>
  );
}