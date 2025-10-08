import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">Welcome to the Home Page</h1>
      <p className="text-lg text-gray-700 max-w-xl text-center">
        This is a placeholder home page. Replace this with your actual components or content.
      </p>
      <button
        onClick={() => alert("Navigate to another page or perform an action")}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Sample Action
      </button>
    </div>
  );
}
