import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true  },
    description: { type: String, required: true },
    date: { type: Date, required: true },
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
      ],
      default: 'Other'
    },
  },
  { timestamps: true }
);



export const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
