"use client";

import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useTransactions } from "@/lib/transaction-context";
import { Skeleton } from "@/components/ui/skeleton";
import { COLORS } from "@/lib/items";


export default function CategoryPieChart() {
  const { transactions, isLoading } = useTransactions();

  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    const categoryData = transactions.reduce((acc, transaction) => {
      const category = transaction.category || "Other";
      const amount = Math.abs(transaction.amount);

      if (acc[category]) {
        acc[category] += amount;
      } else {
        acc[category] = amount;
      }

      return acc;
    }, {});

    return Object.entries(categoryData).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length],
    }));
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">No transaction data available</p>
          <p className="text-xs">
            Add some transactions to see category breakdown
          </p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
            {data.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Amount:{" "}
            <span className="font-semibold text-red-600">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(data.value)}
            </span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {(
              (data.value /
                chartData.reduce((sum, item) => sum + item.value, 0)) *
              100
            ).toFixed(1)}
            % of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12 }} formatter={(value) => value} />
      </PieChart>
    </ResponsiveContainer>
  );
}
