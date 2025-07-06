"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { addBudget } from "@/lib/actions";
import { CATEGORIES } from "@/lib/items";


export default function BudgetForm({ onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    category: "Food & Dining",
    month: new Date().toISOString().slice(0, 7),
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (
      !formData.amount ||
      isNaN(Number(formData.amount)) ||
      Number(formData.amount) <= 0
    ) {
      newErrors.amount = "Please enter a valid budget amount greater than 0";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.month) {
      newErrors.month = "Please select a month";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    //console.log("formData for budget", formData);

    try {
      await addBudget({
        ...formData,
        amount: Number(formData.amount),
      });
      toast.success("Budget set successfully");
      setFormData({
        amount: "",
        category: "Food & Dining",
        month: new Date().toISOString().slice(0, 7),
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
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
            Budget Amount
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
            className={`text-sm ${errors.amount ? "border-destructive" : ""}`}
          />
          {errors.amount && (
            <p className="text-xs text-destructive">{errors.amount}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="month" className="text-sm font-medium">
            Month
          </Label>
          <Input
            id="month"
            type="month"
            value={formData.month}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, month: e.target.value }))
            }
            className={`text-sm ${errors.month ? "border-destructive" : ""}`}
          />
          {errors.month && (
            <p className="text-xs text-destructive">{errors.month}</p>
          )}
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
          className={`w-full px-3 py-2 border rounded-md text-sm bg-background ${errors.category ? "border-destructive" : "border-input"} focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent`}>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-xs text-destructive">{errors.category}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full text-sm sm:text-base"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Set Budget
      </Button>
    </form>
  );
}
