"use client";

import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTransactions } from "@/lib/transaction-context";
import { DollarSign, TrendingUp, Clock, PieChart } from "lucide-react";
import { getTransactions } from "@/lib/actions";

const CATEGORIES = {
  "Food & Dining": "#ef4444",
  Transportation: "#3b82f6",
  Shopping: "#10b981",
  Entertainment: "#f59e0b",
  Healthcare: "#8b5cf6",
  Utilities: "#06b6d4",
  Housing: "#84cc16",
  Education: "#f97316",
  Travel: "#ec4899",
  Other: "#6b7280",
};

export default function DashboardSummary() {
  const { transactions, isLoading } = useTransactions();
  const [topCategories, setTopCategories] = useState([]);

  const summaryData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        totalExpenses: 0,
        totalTransactions: 0,
        topCategory: { category: "None", amount: 0 },
        recentTransactions: [],
      };
    }

    const totalExpenses = transactions.reduce((sum, transaction) => {
      return sum + Math.abs(transaction.amount);
    }, 0);

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

    const topCategory = Object.entries(categoryData).reduce(
      (max, [category, amount]) =>
        amount > max.amount ? { category, amount } : max,
      { category: "None", amount: 0 }
    );

    const recentTransactions = transactions
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    return {
      totalExpenses,
      totalTransactions: transactions.length,
      topCategory,
      recentTransactions,
    };
  }, [transactions]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const transactions = await getTransactions();
      //console.log("Alltransactions", transactions);

      const categoryData = transactions.reduce((acc, tx) => {
        const category = tx.category || "Other";
        const amount = Math.abs(tx.amount);

        acc[category] = (acc[category] || 0) + amount;

        return acc;
      }, {});

      //console.log("categoryData", categoryData);

      setTopCategories(categoryData);
    };

    fetchCategories();
  }, [summaryData]);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Expenses */}
      <Card className="bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatAmount(summaryData.totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground">
            {summaryData.totalTransactions} transactions
          </p>
        </CardContent>
      </Card>
      {/* Top Categories */}
      <Card className="bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Categories</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-start mb-2">
            {Object.entries(topCategories)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([category, amount], index) => (
                <div
                  key={index}
                  className="text-xs opacity-90 mb-2"
                  style={{
                    backgroundColor: CATEGORIES[category] || "#ddd",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {category} - {formatAmount(amount)}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
      {/* Average Transaction */}
      <Card className="bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Transaction
          </CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {summaryData.totalTransactions > 0
              ? formatAmount(
                  summaryData.totalExpenses / summaryData.totalTransactions
                )
              : formatAmount(0)}
          </div>
          <p className="text-xs text-muted-foreground">per transaction</p>
        </CardContent>
      </Card>
      {/* Recent Activity */}
      <Card className="bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {summaryData.recentTransactions.length > 0 ? (
              summaryData.recentTransactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">
                      {formatDate(transaction.date)}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-xs opacity-90"
                      style={{
                        backgroundColor: CATEGORIES[transaction.category],
                      }}
                    >
                      {transaction.category || "Other"}
                    </Badge>
                  </div>
                  <span className="font-medium">
                    {formatAmount(Math.abs(transaction.amount))}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">
                No recent transactions
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
