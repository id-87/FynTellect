const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');   // ← Adjust this path if your User model is in a different location
const fs = require('fs');
const path = require('path');
require('dotenv').config()

// Update this with your actual MongoDB connection string
const MONGO_URI = process.env.MONGO_URL;   // Change database name if different

const usersData = [
  {
    name: "Aarav Sharma",
    username: "aarav_admin",
    password: "Admin@123",
    role: "admin",
    organisation: "TechNova Solutions"
  },
  {
    name: "Priya Malhotra",
    username: "priya_user1",
    password: "User@123",
    role: "user",
    organisation: "TechNova Solutions"
  },
  {
    name: "Rohan Kapoor",
    username: "rohan_user2",
    password: "User@123",
    role: "user",
    organisation: "TechNova Solutions"
  },
  {
    name: "Sneha Verma",
    username: "sneha_user3",
    password: "User@123",
    role: "user",
    organisation: "TechNova Solutions"
  },
  {
    name: "Vikram Singh",
    username: "vikram_admin2",
    password: "Admin@456",
    role: "admin",
    organisation: "InnovateHub Pvt Ltd"
  },
  {
    name: "Meera Patel",
    username: "meera_user4",
    password: "User@123",
    role: "user",
    organisation: "InnovateHub Pvt Ltd"
  },
  {
    name: "Arjun Rao",
    username: "arjun_user5",
    password: "User@123",
    role: "user",
    organisation: "InnovateHub Pvt Ltd"
  }
];

const seedUsers = async () => {
  try {
    // Modern connection (no deprecated options)
    await mongoose.connect(MONGO_URI);

    console.log('✅ Connected to MongoDB');

    // Optional: Clear existing users (comment this out if you don't want to delete old data)
    // await User.deleteMany({});

    // Hash passwords properly
    for (let user of usersData) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(user.password, salt);
    }

    const insertedUsers = await User.insertMany(usersData);

    console.log(`✅ Successfully seeded ${insertedUsers.length} users!`);

    // Pretty print the inserted users with _id
    console.log("\nInserted Users (copy this for transactions seeding):");
    const userList = insertedUsers.map(user => ({
      _id: user._id.toString(),
      name: user.name,
      username: user.username,
      role: user.role,
      organisation: user.organisation
    }));

    console.table(userList);

    // Also save to a JSON file for easy reuse
    const outputPath = path.join(__dirname, 'inserted_users.json');
    fs.writeFileSync(outputPath, JSON.stringify(userList, null, 2));
    console.log(`\n📁 Saved user list to: ${outputPath}`);

    mongoose.connection.close();
    console.log('✅ Connection closed.');

  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    if (mongoose.connection) mongoose.connection.close();
  }
};

seedUsers();




