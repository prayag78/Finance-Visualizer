"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { getBudgetVsActual } from "@/lib/actions";
import { Skeleton } from "./ui/skeleton";

export default function SpendingInsights({ month }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentMonth = month || new Date().toISOString().slice(0, 7);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const comparisonData = await getBudgetVsActual(currentMonth);
        setData(comparisonData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentMonth]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInsights = () => {
    if (!data || data.length === 0) return [];

    const insights = [];

    // Find categories over budget
    const overBudget = data.filter(
      (item) => item.status === "over" && item.budget > 0
    );
    if (overBudget.length > 0) {
      const worstCategory = overBudget.reduce((max, item) =>
        item.percentage > max.percentage ? item : max
      );
      insights.push({
        type: "warning",
        title: "Over Budget Categories",
        message: `${overBudget.length} category${
          overBudget.length > 1 ? "ies" : "y"
        } over budget`,
        detail: `"${
          worstCategory.category
        }" is ${worstCategory.percentage.toFixed(1)}% over budget`,
        icon: AlertTriangle,
        color: "text-red-600",
        bgColor: "bg-red-50",
      });
    }

    // Find categories under budget
    const underBudget = data.filter(
      (item) => item.status === "under" && item.budget > 0
    );
    if (underBudget.length > 0) {
      const bestCategory = underBudget.reduce((min, item) =>
        item.percentage < min.percentage ? item : min
      );
      insights.push({
        type: "success",
        title: "Under Budget Categories",
        message: `${underBudget.length} category${
          underBudget.length > 1 ? "ies" : "y"
        } under budget`,
        detail: `"${bestCategory.category}" is ${(
          100 - bestCategory.percentage
        ).toFixed(1)}% under budget`,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
      });
    }

    // Find categories with no budget but spending
    const noBudget = data.filter(
      (item) => item.budget === 0 && item.actual > 0
    );
    if (noBudget.length > 0) {
      const totalUnbudgeted = noBudget.reduce(
        (sum, item) => sum + item.actual,
        0
      );
      insights.push({
        type: "info",
        title: "Unbudgeted Spending",
        message: `${noBudget.length} category${
          noBudget.length > 1 ? "ies" : "y"
        } without budgets`,
        detail: `Total unbudgeted spending: ${formatAmount(totalUnbudgeted)}`,
        icon: TrendingUp,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      });
    }

    // Overall budget status
    const totalBudget = data.reduce((sum, item) => sum + item.budget, 0);
    const totalActual = data.reduce((sum, item) => sum + item.actual, 0);
    const totalRemaining = data.reduce((sum, item) => sum + item.remaining, 0);

    if (totalBudget > 0) {
      const overallPercentage = (totalActual / totalBudget) * 100;
      insights.push({
        type: overallPercentage > 100 ? "warning" : "success",
        title: "Overall Budget Status",
        message:
          overallPercentage > 100 ? "Over total budget" : "Under total budget",
        detail: `${overallPercentage.toFixed(
          1
        )}% of total budget used (${formatAmount(totalRemaining)} remaining)`,
        icon: overallPercentage > 100 ? TrendingUp : TrendingDown,
        color: overallPercentage > 100 ? "text-red-600" : "text-green-600",
        bgColor: overallPercentage > 100 ? "bg-red-50" : "bg-green-50",
      });
    }

    return insights;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-1/2 mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Error loading insights</p>
            <p className="text-xs">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const insights = getInsights();

  if (insights.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">No insights available</p>
            <p className="text-xs">
              Set budgets and add transactions to see insights
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => {
        const IconComponent = insight.icon;
        return (
          <Card
            key={index}
            className={`${insight.bgColor} border-l-4 border-l-current`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <IconComponent className={`h-4 w-4 ${insight.color}`} />
                <CardTitle className={`text-sm font-medium ${insight.color}`}>
                  {insight.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium mb-1">{insight.message}</p>
              <p className="text-xs text-muted-foreground">{insight.detail}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
