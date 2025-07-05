"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTransactions } from "@/lib/transaction-context";
import { Skeleton } from "@/components/ui/skeleton";

export default function MonthlyCharts() {
  const { transactions, isLoading } = useTransactions();

  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    const monthlyData = new Map();

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    months.forEach((month, index) => {
      monthlyData.set(index, {
        name: month,
        expenses: 0,
      });
    });

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthIndex = date.getMonth();
      const amount = Math.abs(transaction.amount);

      const currentData = monthlyData.get(monthIndex);
      if (currentData) {
        currentData.expenses += amount;
      }
    });

    return Array.from(monthlyData.values());
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
            Add some transactions to see your monthly spending
          </p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 5,
        }}
        barSize={12}
      >
        <XAxis
          dataKey="name"
          scale="point"
          padding={{ left: 5, right: 5 }}
          tick={{ fontSize: 12 }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) =>
            new Intl.NumberFormat("en-US", {
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(value)
          }
        />
        <Tooltip
          formatter={(value, name) => [
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value),
            name === "expenses" ? "Expenses" : "",
          ]}
          labelStyle={{ fontSize: 12 }}
          contentStyle={{ fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <Bar dataKey="expenses" fill="#ef4444" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
