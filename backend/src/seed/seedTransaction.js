const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

require('dotenv').config()
// ================== CONFIGURATION ==================
// UPDATE THIS LINE WITH YOUR MONGODB CONNECTION STRING
const MONGO_URI = process.env.MONGO_URL;

// UPDATE THIS PATH IF YOUR Transactions MODEL IS LOCATED ELSEWHERE
const Transactions = require('../models/transactionModel');

const transactionsData = [
  // Aarav Sharma (admin) - 13 transactions
  { user: "69ce7c61ddc8e0046e69f03e", type: "debit", amount: 12450.75, category: "development", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f03e", type: "credit", amount: 8750.00, category: "marketing", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f03e", type: "debit", amount: 3250.50, category: "testing", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f03e", type: "credit", amount: 18900.25, category: "legal", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f03e", type: "debit", amount: 6750.00, category: "development", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f03e", type: "credit", amount: 12400.80, category: "marketing", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f03e", type: "debit", amount: 2890.35, category: "testing", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f03e", type: "credit", amount: 15670.45, category: "development", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f03e", type: "debit", amount: 9450.60, category: "legal", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f03e", type: "credit", amount: 7800.00, category: "marketing", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f03e", type: "debit", amount: 11200.25, category: "testing", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f03e", type: "credit", amount: 4350.90, category: "development", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f03e", type: "debit", amount: 16780.00, category: "legal", status: "successful" },

  // Priya Malhotra (user) - 12 transactions
  { user: "69ce7c61ddc8e0046e69f03f", type: "credit", amount: 9850.40, category: "marketing", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f03f", type: "debit", amount: 3240.75, category: "development", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f03f", type: "credit", amount: 14750.00, category: "testing", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f03f", type: "debit", amount: 6720.30, category: "legal", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f03f", type: "credit", amount: 8930.65, category: "marketing", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f03f", type: "debit", amount: 2150.80, category: "development", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f03f", type: "credit", amount: 16890.25, category: "testing", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f03f", type: "debit", amount: 5340.00, category: "legal", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f03f", type: "credit", amount: 11200.50, category: "marketing", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f03f", type: "debit", amount: 7890.75, category: "development", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f03f", type: "credit", amount: 4560.90, category: "testing", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f03f", type: "debit", amount: 13450.25, category: "legal", status: "failed" },

  // Rohan Kapoor (user) - 11 transactions
  { user: "69ce7c61ddc8e0046e69f040", type: "debit", amount: 15670.80, category: "development", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f040", type: "credit", amount: 6780.45, category: "marketing", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f040", type: "debit", amount: 9450.30, category: "testing", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f040", type: "credit", amount: 12340.75, category: "legal", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f040", type: "debit", amount: 2890.60, category: "development", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f040", type: "credit", amount: 18750.00, category: "marketing", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f040", type: "debit", amount: 7650.25, category: "testing", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f040", type: "credit", amount: 4320.90, category: "legal", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f040", type: "debit", amount: 10980.50, category: "development", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f040", type: "credit", amount: 15600.75, category: "marketing", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f040", type: "debit", amount: 6780.40, category: "testing", status: "pending" },

  // Sneha Verma (user) - 12 transactions
  { user: "69ce7c61ddc8e0046e69f041", type: "credit", amount: 21450.30, category: "development", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f041", type: "debit", amount: 8750.65, category: "marketing", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f041", type: "credit", amount: 12340.80, category: "legal", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f041", type: "debit", amount: 5670.25, category: "testing", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f041", type: "credit", amount: 18900.00, category: "development", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f041", type: "debit", amount: 4320.90, category: "marketing", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f041", type: "credit", amount: 15670.45, category: "testing", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f041", type: "debit", amount: 7890.75, category: "legal", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f041", type: "credit", amount: 11200.30, category: "development", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f041", type: "debit", amount: 9450.60, category: "marketing", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f041", type: "credit", amount: 6780.25, category: "testing", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f041", type: "debit", amount: 13450.80, category: "legal", status: "successful" },

  // Vikram Singh (admin) - 11 transactions
  { user: "69ce7c61ddc8e0046e69f042", type: "credit", amount: 25670.50, category: "development", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f042", type: "debit", amount: 9870.75, category: "marketing", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f042", type: "credit", amount: 14500.25, category: "legal", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f042", type: "debit", amount: 6780.40, category: "testing", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f042", type: "credit", amount: 18900.60, category: "development", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f042", type: "debit", amount: 5340.90, category: "marketing", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f042", type: "credit", amount: 11250.30, category: "testing", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f042", type: "debit", amount: 7650.75, category: "legal", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f042", type: "credit", amount: 13400.45, category: "development", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f042", type: "debit", amount: 8950.80, category: "marketing", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f042", type: "credit", amount: 16780.25, category: "legal", status: "successful" },

  // Meera Patel (user) - 12 transactions
  { user: "69ce7c61ddc8e0046e69f043", type: "debit", amount: 7650.30, category: "development", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f043", type: "credit", amount: 12340.75, category: "marketing", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f043", type: "debit", amount: 4320.90, category: "testing", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f043", type: "credit", amount: 18900.45, category: "legal", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f043", type: "debit", amount: 6780.25, category: "development", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f043", type: "credit", amount: 9450.60, category: "marketing", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f043", type: "debit", amount: 11200.80, category: "testing", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f043", type: "credit", amount: 5670.35, category: "legal", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f043", type: "debit", amount: 13450.50, category: "development", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f043", type: "credit", amount: 7890.75, category: "marketing", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f043", type: "debit", amount: 3250.90, category: "testing", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f043", type: "credit", amount: 15670.25, category: "legal", status: "successful" },

  // Arjun Rao (user) - 11 transactions
  { user: "69ce7c61ddc8e0046e69f044", type: "credit", amount: 19850.40, category: "development", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f044", type: "debit", amount: 7650.75, category: "marketing", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f044", type: "credit", amount: 13400.30, category: "testing", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f044", type: "debit", amount: 5670.90, category: "legal", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f044", type: "credit", amount: 11250.45, category: "development", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f044", type: "debit", amount: 8950.60, category: "marketing", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f044", type: "credit", amount: 16780.25, category: "testing", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f044", type: "debit", amount: 4320.80, category: "legal", status: "failed" },
  { user: "69ce7c61ddc8e0046e69f044", type: "credit", amount: 9450.35, category: "development", status: "pending" },
  { user: "69ce7c61ddc8e0046e69f044", type: "debit", amount: 12340.70, category: "marketing", status: "successful" },
  { user: "69ce7c61ddc8e0046e69f044", type: "credit", amount: 6780.90, category: "testing", status: "failed" }
];

const seedTransactions = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Optional: Clear existing transactions before inserting new ones
    // await Transactions.deleteMany({});

    const inserted = await Transactions.insertMany(transactionsData);

    console.log(`✅ Successfully seeded ${inserted.length} transactions!`);

    // Show count per user
    const countPerUser = {};
    transactionsData.forEach(tx => {
      const uid = tx.user;
      countPerUser[uid] = (countPerUser[uid] || 0) + 1;
    });
    console.log("\n📊 Transactions per user:");
    console.table(countPerUser);

    // Save backup
    const outputPath = path.join(__dirname, 'inserted_transactions.json');
    fs.writeFileSync(outputPath, JSON.stringify(transactionsData, null, 2));
    console.log(`\n📁 Backup saved to: ${outputPath}`);

    await mongoose.connection.close();
    console.log('✅ Seeding completed successfully. Connection closed.');

  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    if (mongoose.connection) await mongoose.connection.close();
  }
};

seedTransactions();