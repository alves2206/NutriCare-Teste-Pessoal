"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { WeightEntry } from "@/types/nutrition";
import { formatShortDateBR } from "@/lib/formatters";

type WeightChartProps = {
  entries: WeightEntry[];
};

export function WeightChart({ entries }: WeightChartProps) {
  const data = entries.map((entry) => ({
    date: entry.date,
    label: formatShortDateBR(entry.date),
    weight: entry.weightKg
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: -20, right: 16, top: 12, bottom: 6 }}>
          <CartesianGrid stroke="#f2e7ea" strokeDasharray="4 4" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#78716c", fontSize: 12 }} />
          <YAxis
            domain={["dataMin - 1", "dataMax + 1"]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#78716c", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              border: "1px solid #ffe8ec",
              borderRadius: 16,
              boxShadow: "0 18px 45px rgba(80, 53, 71, 0.08)"
            }}
            formatter={(value) => [`${value} kg`, "Peso"]}
            labelFormatter={(label) => `Data: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#c95d7e"
            strokeWidth={3}
            dot={{ r: 4, fill: "#fff", stroke: "#c95d7e", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
