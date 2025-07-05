"use server";

import { connectToDB } from "./mongodb";
import { Transaction } from "@/models/Transaction";

export async function getTransactions() {
  try {
    await connectToDB();

    const transactions = await Transaction.find({}).sort({ date: -1 });

    const plainTransactions = transactions.map((t) => {
      const plainObj = t.toObject();
      return {
        ...plainObj,
        _id: plainObj._id.toString(),
      };
    });

    return plainTransactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions");
  }
}

export async function addTransaction(data) {
  await connectToDB();

  if (!data.amount || data.amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  if (!data.date) {
    throw new Error("Date is required");
  }

  if (!data.description || data.description.trim() === "") {
    throw new Error("Description is required");
  }

  const newTransaction = new Transaction(data);

  await newTransaction.save();

  return {
    success: true,
    message: "Transaction added successfully",
  };
}

export async function updateTransaction(id, transactionData) {
  await connectToDB();

  if (transactionData.amount !== undefined && transactionData.amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  if (
    transactionData.description !== undefined &&
    transactionData.description.trim() === ""
  ) {
    throw new Error("Description is required");
  }

  const updated = await Transaction.findByIdAndUpdate(
    id,
    {
      $set: {
        amount: transactionData.amount,
        description: transactionData.description,
        date: transactionData.date,
      },
    },
    { new: true }
  );

  if (!updated) throw new Error("Transaction not found");

  return {
    success: true,
    message: "Transaction updated successfully",
  };
}

export async function deleteTransaction(id) {
  await connectToDB();

  const deletedTransaction = await Transaction.findByIdAndDelete(id);

  if (!deletedTransaction) {
    throw new Error("Transaction not found");
  }

  return {
    success: true,
    message: "Transaction deleted successfully",
  };
}
