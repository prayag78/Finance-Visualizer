import mongoose from "mongoose";


const BudgetSchema = new mongoose.Schema(
    {
      category: { 
        type: String, 
        required: true,
        enum: [
          'Food & Dining',
          'Transportation',
          'Shopping',
          'Entertainment',
          'Healthcare',
          'Utilities',
          'Housing',
          'Education',
          'Travel',
          'Other'
        ]
      },
      amount: { type: Number, required: true },
      month: { type: String, required: true },
      year: { type: Number, required: true },
    },
    { timestamps: true }
  );

  export const Budget = mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);