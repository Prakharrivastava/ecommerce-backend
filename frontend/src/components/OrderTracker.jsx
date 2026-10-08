import React from "react";

const STEPS = ["Placed", "Processing", "Shipped", "Delivered"];

export const OrderTracker = ({ currentStatus }) => {
  if (currentStatus === "Cancelled") {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg font-semibold text-center my-4">
        This order has been cancelled.
      </div>
    );
  }

  const activeIndex = STEPS.indexOf(currentStatus);

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress Bar Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 -z-10" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 -z-10 transition-all duration-500"
          style={{
            width: `${(Math.max(0, activeIndex) / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {/* Status Steps */}
        {STEPS.map((step, index) => {
          const isDone = index <= activeIndex;
          return (
            <div key={step} className="flex flex-col items-center bg-white px-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  isDone
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  isDone ? "text-indigo-600 font-semibold" : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;