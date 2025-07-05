import { Suspense } from "react";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionList } from "@/components/transaction-list";
import MonthlyCharts from "@/components/monthly-charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="text-center space-y-2 sm:space-y-3">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
          Personal Finance Visualizer
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Visualize your spending patterns and track your expenses
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2">
        <Card className="order-1 lg:order-1">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">
              Add Transaction
            </CardTitle>
            <CardDescription className="text-sm">
              Record a new income or expense transaction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionForm />
          </CardContent>
        </Card>

        <Card className="order-2 lg:order-2">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">
              Monthly Expenses
            </CardTitle>
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

      <Card className="order-3">
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
  );
}
