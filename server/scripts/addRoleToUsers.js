const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

async function run() {

    await mongoose.connect(process.env.MONGO_URI);

    const result = await User.updateMany(
        { role: { $exists: false } },
        { $set: { role: 'user' } }
    );

    console.log(result);

    process.exit(0);
}

run().catch(console.error);