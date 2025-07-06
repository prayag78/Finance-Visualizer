import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import { Budget } from "@/models/Budget";

export async function POST() {
  try {
    await connectToDB();

    // Clear existing data
    await Transaction.deleteMany({});
    await Budget.deleteMany({});

    // ✅ New Demo Transactions
    const demoTransactions = [
      // Jan 2024
      {
        amount: 45.5,
        description: "Grocery shopping",
        date: new Date("2024-01-05"),
        category: "Food & Dining",
      },
      {
        amount: 110.0,
        description: "Fuel refill",
        date: new Date("2024-01-06"),
        category: "Transportation",
      },
      {
        amount: 89.99,
        description: "Headphones",
        date: new Date("2024-01-07"),
        category: "Shopping",
      },

      // Feb 2024
      {
        amount: 25.0,
        description: "Lunch with friends",
        date: new Date("2024-02-10"),
        category: "Food & Dining",
      },
      {
        amount: 70.0,
        description: "Bus pass",
        date: new Date("2024-02-11"),
        category: "Transportation",
      },
      {
        amount: 130.0,
        description: "New backpack",
        date: new Date("2024-02-12"),
        category: "Shopping",
      },
      {
        amount: 210.0,
        description: "Medical checkup",
        date: new Date("2024-02-13"),
        category: "Healthcare",
      },

      // March 2024
      {
        amount: 80.0,
        description: "Groceries",
        date: new Date("2024-03-02"),
        category: "Food & Dining",
      },
      {
        amount: 95.0,
        description: "Train ticket",
        date: new Date("2024-03-03"),
        category: "Transportation",
      },
      {
        amount: 150.0,
        description: "Clothing",
        date: new Date("2024-03-04"),
        category: "Shopping",
      },
      {
        amount: 50.0,
        description: "Netflix subscription",
        date: new Date("2024-03-05"),
        category: "Entertainment",
      },

      // Jan & Feb 2025
      {
        amount: 500.0,
        description: "Health insurance",
        date: new Date("2025-01-10"),
        category: "Healthcare",
      },
      {
        amount: 350.0,
        description: "Mini vacation",
        date: new Date("2025-02-14"),
        category: "Travel",
      },
      {
        amount: 90.0,
        description: "Dinner date",
        date: new Date("2025-02-14"),
        category: "Food & Dining",
      },
      {
        amount: 70.0,
        description: "Online certification",
        date: new Date("2025-02-20"),
        category: "Education",
      },
    ];

    // ✅ New Demo Budgets
    const demoBudgets = [
      // Jan 2024
      { category: "Food & Dining", amount: 400, month: "2024-01", year: 2024 },
      { category: "Transportation", amount: 300, month: "2024-01", year: 2024 },
      { category: "Shopping", amount: 200, month: "2024-01", year: 2024 },

      // Feb 2024
      { category: "Food & Dining", amount: 450, month: "2024-02", year: 2024 },
      { category: "Transportation", amount: 320, month: "2024-02", year: 2024 },
      { category: "Shopping", amount: 180, month: "2024-02", year: 2024 },
      { category: "Healthcare", amount: 280, month: "2024-02", year: 2024 },

      // March 2024
      { category: "Food & Dining", amount: 460, month: "2024-03", year: 2024 },
      { category: "Transportation", amount: 280, month: "2024-03", year: 2024 },
      { category: "Shopping", amount: 220, month: "2024-03", year: 2024 },
      { category: "Entertainment", amount: 180, month: "2024-03", year: 2024 },

      // 2025
      { category: "Healthcare", amount: 600, month: "2025-01", year: 2025 },
      { category: "Food & Dining", amount: 500, month: "2025-02", year: 2025 },
      { category: "Travel", amount: 400, month: "2025-02", year: 2025 },
      { category: "Education", amount: 350, month: "2025-02", year: 2025 },
    ];

    const insertedTransactions = await Transaction.insertMany(demoTransactions);
    const insertedBudgets = await Budget.insertMany(demoBudgets);

    return NextResponse.json({
      success: true,
      message: `Seeded ${insertedTransactions.length} transactions and ${insertedBudgets.length} budgets`,
      transactionsCount: insertedTransactions.length,
      budgetsCount: insertedBudgets.length,
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed data" },
      { status: 500 }
    );
  }
}
