"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", amount: 3800 },
  { day: "Tue", amount: 5200 },
  { day: "Wed", amount: 2900 },
  { day: "Thu", amount: 5800 },
  { day: "Fri", amount: 7400 },
  { day: "Sat", amount: 4600, active: true },
  { day: "Sun", amount: 1800 },
];

export function EarningsChart() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md h-[400px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Weekly Overview</h3>
          <p className="text-sm text-slate-500 font-medium">
            Daily earnings for the past 7 days
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button className="px-3 py-1.5 bg-[#3E8940] text-white text-xs font-semibold rounded-md shadow-sm">
            Chart
          </button>
          <button className="px-3 py-1.5 text-slate-600 text-xs font-semibold rounded-md hover:bg-slate-200 transition-colors">
            Table
          </button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg bg-[#3E8940] px-3 py-2 shadow-xl text-white font-bold text-sm">
                      ₹{payload[0].value}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="amount" radius={[8, 8, 8, 8]} barSize={32}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.active ? "#3E8940" : "#E2E8F0"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
