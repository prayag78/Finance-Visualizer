"use client";

import { useTransactions } from "@/lib/transaction-context";
import { TransactionItem } from "@/components/transaction-item";

export default function TransactionList() {
  const { transactions, isLoading } = useTransactions();

  if (isLoading) {
    return (
      <div className="space-y-3 sm:space-y-4 max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] overflow-y-auto">
        <div className="animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 sm:h-20 bg-muted rounded mb-2 sm:mb-3"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-muted-foreground text-sm sm:text-base">
          No transactions found. Add your first transaction to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] overflow-y-auto">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction._id}
          id={transaction._id}
          transaction={transaction}
        />
      ))}
    </div>
  );
}
