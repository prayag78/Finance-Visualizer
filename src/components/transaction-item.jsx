"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, DollarSign } from "lucide-react";
import { TransactionUpdateForm } from "@/components/transaction-update-form";
import { toast } from "sonner";
import { useTransactions } from "@/lib/transaction-context";
import { deleteTransaction } from "@/lib/actions";

export function TransactionItem({ transaction, id }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { refreshTransactions } = useTransactions();
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTransaction(id);
      toast.success("Transaction deleted successfully");
      refreshTransactions();
    } catch (error) {
      toast.error("Failed to delete transaction");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
      <div className="hover:shadow-md transition-shadow rounded-lg border border-gray-200 mb-1">
      <div className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
            <div className="p-2 rounded-full bg-red-100 text-red-600 flex-shrink-0">
              <DollarSign className="h-4 w-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 gap-1 sm:gap-2 mb-1">
                <p className="font-medium text-sm sm:text-base truncate">
                  {transaction.description}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {formatDate(transaction.date)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
            <span className="font-semibold text-red-600 text-sm sm:text-base">
              {formatAmount(transaction.amount)}
            </span>

            <div className="flex space-x-1">
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit transaction</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] max-w-[95vw]">
                  <DialogHeader>
                    <DialogTitle>Edit Transaction</DialogTitle>
                  </DialogHeader>
                  <TransactionUpdateForm
                    transaction={transaction}
                    onSuccess={() => setIsEditOpen(false)}
                  />
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isDeleting}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete transaction</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this transaction? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
