const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const PORT = process.env.PORT || 5000;

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
