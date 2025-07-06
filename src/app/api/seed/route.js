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

    // Demo transaction data
    const demoTransactions = [
      {
        amount: 45.5,
        description: "Grocery shopping at Walmart",
        date: new Date("2024-01-15"),
        category: "Food & Dining",
      },
      {
        amount: 120.0,
        description: "Gas station fill-up",
        date: new Date("2024-01-16"),
        category: "Transportation",
      },
      {
        amount: 89.99,
        description: "New headphones from Best Buy",
        date: new Date("2024-01-17"),
        category: "Shopping",
      },
      {
        amount: 65.0,
        description: "Movie tickets and snacks",
        date: new Date("2024-01-18"),
        category: "Entertainment",
      },
      {
        amount: 150.0,
        description: "Doctor's appointment",
        date: new Date("2024-01-19"),
        category: "Healthcare",
      },
      {
        amount: 85.0,
        description: "Electricity bill",
        date: new Date("2024-01-20"),
        category: "Utilities",
      },
      {
        amount: 1200.0,
        description: "Rent payment",
        date: new Date("2024-01-21"),
        category: "Housing",
      },
      {
        amount: 200.0,
        description: "Online course subscription",
        date: new Date("2024-01-22"),
        category: "Education",
      },
      {
        amount: 350.0,
        description: "Weekend trip to nearby city",
        date: new Date("2024-01-23"),
        category: "Travel",
      },
      {
        amount: 25.0,
        description: "Coffee and lunch",
        date: new Date("2024-01-24"),
        category: "Food & Dining",
      },
      {
        amount: 75.0,
        description: "Uber rides this week",
        date: new Date("2024-01-25"),
        category: "Transportation",
      },
      {
        amount: 45.0,
        description: "Clothing from Target",
        date: new Date("2024-01-26"),
        category: "Shopping",
      },
      {
        amount: 40.0,
        description: "Restaurant dinner",
        date: new Date("2024-01-27"),
        category: "Food & Dining",
      },
      {
        amount: 30.0,
        description: "Netflix subscription",
        date: new Date("2024-01-28"),
        category: "Entertainment",
      },
      {
        amount: 95.0,
        description: "Dental cleaning",
        date: new Date("2024-01-29"),
        category: "Healthcare",
      },
      {
        amount: 60.0,
        description: "Internet bill",
        date: new Date("2024-01-30"),
        category: "Utilities",
      },
      {
        amount: 180.0,
        description: "Books for professional development",
        date: new Date("2024-01-31"),
        category: "Education",
      },
      {
        amount: 15.0,
        description: "Parking fee",
        date: new Date("2024-02-01"),
        category: "Transportation",
      },
      {
        amount: 55.0,
        description: "Gym membership",
        date: new Date("2024-02-02"),
        category: "Healthcare",
      },
      {
        amount: 35.0,
        description: "Home supplies",
        date: new Date("2024-02-03"),
        category: "Shopping",
      },
    ];

    // Demo budget data
    const demoBudgets = [
      {
        category: "Food & Dining",
        amount: 400,
        month: "2024-01",
        year: 2024,
      },
      {
        category: "Transportation",
        amount: 300,
        month: "2024-01",
        year: 2024,
      },
      {
        category: "Shopping",
        amount: 200,
        month: "2024-01",
        year: 2024,
      },
      {
        category: "Entertainment",
        amount: 150,
        month: "2024-01",
        year: 2024,
      },
      {
        category: "Healthcare",
        amount: 250,
        month: "2024-01",
        year: 2024,
      },
      {
        category: "Utilities",
        amount: 200,
        month: "2024-01",
        year: 2024,
      },
      {
        category: "Housing",
        amount: 1200,
        month: "2024-01",
        year: 2024,
      },
      {
        category: "Education",
        amount: 300,
        month: "2024-01",
        year: 2024,
      },
      {
        category: "Travel",
        amount: 500,
        month: "2024-01",
        year: 2024,
      },
      {
        category: "Other",
        amount: 100,
        month: "2024-01",
        year: 2024,
      },
      {
        category: "Food & Dining",
        amount: 450,
        month: "2024-02",
        year: 2024,
      },
      {
        category: "Transportation",
        amount: 320,
        month: "2024-02",
        year: 2024,
      },
      {
        category: "Shopping",
        amount: 180,
        month: "2024-02",
        year: 2024,
      },
      {
        category: "Entertainment",
        amount: 160,
        month: "2024-02",
        year: 2024,
      },
      {
        category: "Healthcare",
        amount: 280,
        month: "2024-02",
        year: 2024,
      },
    ];

    // Insert transactions
    const insertedTransactions = await Transaction.insertMany(demoTransactions);

    // Insert budgets
    const insertedBudgets = await Budget.insertMany(demoBudgets);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${insertedTransactions.length} transactions and ${insertedBudgets.length} budgets`,
      transactionsCount: insertedTransactions.length,
      budgetsCount: insertedBudgets.length,
    });
  } catch (error) {
    console.error("Error seeding data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed data" },
      { status: 500 }
    );
  }
}
