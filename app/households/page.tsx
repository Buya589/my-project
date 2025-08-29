"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function HouseholdsPage() {
  const { data: session } = useSession();
  const [households, setHouseholds] = useState<any[]>([]);

  if (!session) {
    return <p>Та нэвтэрч орно уу.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👨‍👩‍👧‍👦 Миний Household-ууд</h1>

      {/* Household жагсаалт */}
      {households.length === 0 && (
        <p className="text-gray-500">Одоогоор household алга байна.</p>
      )}

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => alert("Household нэмэх API дараагийн алхамд хийнэ")}
      >
        ➕ Шинэ household үүсгэх
      </button>
    </div>
  );
}
