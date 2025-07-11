"use client";

import { Suspense } from "react";
import { TransactionForm } from "@/components/transaction-form";
import TransactionList from "@/components/transaction-list";
import MonthlyCharts from "@/components/monthly-charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2">
        <Card className="order-1 lg:order-1">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex flex-row justify-between">
              <CardTitle className="text-lg sm:text-xl">
                Add Transaction
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Link href="/budget">
                  <div className="text-sm sm:text-base text-gray-900 max-w-2xl mx-auto">
                    Set Budget{" "}
                    <ArrowRightIcon className="w-4 h-4 inline-block" />
                  </div>
                </Link>
              </Button>
            </div>
            <CardDescription className="text-sm">
              Record a new income or expense transaction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionForm />
          </CardContent>
        </Card>

        <Card className="order-2">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">
              Recent Transactions
            </CardTitle>
            <CardDescription className="text-sm">
              View and manage your transaction history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <Skeleton className="h-[300px] sm:h-[400px] lg:h-[500px] w-full" />
              }
            >
              <TransactionList />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <Card className="order-3">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl">Monthly Expenses</CardTitle>
          <CardDescription className="text-sm">
            Your spending over the last 12 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] sm:h-[300px] lg:h-[350px] w-full">
            <MonthlyCharts />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
