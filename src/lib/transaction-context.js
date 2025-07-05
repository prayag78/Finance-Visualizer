"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getTransactions } from "@/lib/actions";

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTransactions = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshTrigger]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        isLoading,
        refreshTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider"
    );
  }
  return context;
}
