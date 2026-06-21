const mongoose = require('mongoose');
module.exports = async () => {
  try {
    const { connection: c } = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB → ${c.host}`);
  } catch (e) { console.error(e.message); process.exit(1); }
};
