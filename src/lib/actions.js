"use server";

import { connectToDB } from "./mongodb";
import { Transaction } from "@/models/Transaction";
import { Budget } from "@/models/Budget";


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
        category: transactionData.category,
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

export async function getBudgets() {
  try {
    await connectToDB();
    const budgets = await Budget.find({}).sort({ month: -1, category: 1 });

    const plainBudgets = budgets.map((b) => {
      const plainObj = b.toObject();
      return {
        ...plainObj,
        _id: plainObj._id.toString(),
      };
    });

    return plainBudgets;
  } catch (error) {
    console.error("Error fetching budgets:", error);
    throw new Error("Failed to fetch budgets");
  }
}

export async function addBudget(data) {
  await connectToDB();

  if (!data.amount || data.amount <= 0) {
    throw new Error("Budget amount must be greater than 0");
  }

  if (!data.category) {
    throw new Error("Category is required");
  }

  if (!data.month) {
    throw new Error("Month is required");
  }

  const existingBudget = await Budget.findOne({
    category: data.category,
    month: data.month,
  });

  if (existingBudget) {
    throw new Error("Budget already exists for this category and month");
  }

  const newBudget = new Budget({
    ...data,
    year: new Date(data.month + "-01").getFullYear(),
  });

  await newBudget.save();

  return {
    success: true,
    message: "Budget added successfully",
  };
}

export async function getCategoryBudgets(category) {
  await connectToDB();

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const budgets = await Budget.find({ category });  
  const transactions = await Transaction.find({ category });

  const transactionMap = transactions.reduce((acc, tx) => {
    const date = new Date(tx.date);
    const year = date.getFullYear();
    const month = date.getMonth();

    const key = `${year}-${month}`;
    acc[key] = (acc[key] || 0) + tx.amount;

    return acc;
  }, {});

  const budgetMap = budgets.reduce((acc, budget) => {
    let year = budget.year;
    let monthIndex = 0;

    if (typeof budget.month === "string" && /^\d{4}-\d{2}$/.test(budget.month)) {
      const [parsedYear, parsedMonth] = budget.month.split("-").map(Number);
      year = parsedYear;
      monthIndex = parsedMonth - 1;
    }

    const key = `${year}-${monthIndex}`;
    acc[key] = budget.amount;

    return acc;
  }, {});

  const allKeys = new Set([
    ...Object.keys(transactionMap),
    ...Object.keys(budgetMap),
  ]);

  const summary = Array.from(allKeys).map((key) => {
    const [year, monthIndex] = key.split("-").map(Number);
    return {
      year,
      month: MONTH_NAMES[monthIndex],
      budget: budgetMap[key] || 0,
      spent: transactionMap[key] || 0,
    };
  });

  summary.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return MONTH_NAMES.indexOf(b.month) - MONTH_NAMES.indexOf(a.month);
  });

  //console.log("summary", summary);
  return summary;
}


export async function getBudgetVsActual(month) {
  try {
    await connectToDB();


    const budgets = await Budget.find({ month });

    
    const startDate = new Date(month + "-01");
    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0
    );

    const transactions = await Transaction.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    
    const actualSpending = transactions.reduce((acc, transaction) => {
      const category = transaction.category;
      const amount = Math.abs(transaction.amount);

      if (acc[category]) {
        acc[category] += amount;
      } else {
        acc[category] = amount;
      }

      return acc;
    }, {});

    
    const comparison = budgets.map((budget) => {
      const actual = actualSpending[budget.category] || 0;
      const remaining = budget.amount - actual;
      const percentage = budget.amount > 0 ? (actual / budget.amount) * 100 : 0;

      return {
        category: budget.category,
        budget: budget.amount,
        actual,
        remaining,
        percentage,
        status: remaining >= 0 ? "under" : "over",
      };
    });


    Object.keys(actualSpending).forEach((category) => {
      const hasBudget = comparison.some((item) => item.category === category);
      if (!hasBudget) {
        comparison.push({
          category,
          budget: 0,
          actual: actualSpending[category],
          remaining: -actualSpending[category],
          percentage: 0,
          status: "over",
        });
      }
    });

    //console.log("comparison", comparison);

    return comparison;
  } catch (error) {
    console.error("Error fetching budget vs actual:", error);
    throw new Error("Failed to fetch budget comparison");
  }
}
