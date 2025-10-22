const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
require('dotenv').config();
const connectDB = require('../config/db');

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();

    // Seed users
    const users = [
      { name: 'Test User 1', email: 'test1@example.com', password: 'password1' },
      { name: 'Test User 2', email: 'test2@example.com', password: 'password2' },
    ];
    await User.insertMany(users);

    // Seed projects
    const projects = [
      { name: 'Project 1', description: 'Test project 1', owner: users[0]._id },
      { name: 'Project 2', description: 'Test project 2', owner: users[1]._id },
    ];
    await Project.insertMany(projects);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();