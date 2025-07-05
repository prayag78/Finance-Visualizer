"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useTransactions } from "@/lib/transaction-context";
import { updateTransaction } from "@/lib/actions";

const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Utilities",
  "Housing",
  "Education",
  "Travel",
  "Other",
];

export function TransactionUpdateForm({ transaction, onSuccess }) {
  const { refreshTransactions } = useTransactions();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    description: "",
    category: "Other",
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount?.toString() || "",
        date: transaction.date
          ? new Date(transaction.date).toISOString().split("T")[0]
          : "",
        description: transaction.description || "",
        category: transaction.category || "Other",
      });
    }
  }, [transaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      await updateTransaction(transaction._id, {
        ...formData,
        amount: Number(formData.amount),
      });
      toast.success("Transaction updated successfully");
      refreshTransactions();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError("Failed to update transaction. Please try again.");
      toast.error("Failed to update transaction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            Amount
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, amount: e.target.value }))
            }
            className="text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
            }
            className="text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-medium">
          Category
        </Label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, category: e.target.value }))
          }
          className="w-full px-3 py-2 border rounded-md text-sm bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Enter transaction description..."
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          className="text-sm min-h-[80px] sm:min-h-[100px]"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 text-sm sm:text-base"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Transaction
        </Button>
      </div>
    </form>
  );
}
