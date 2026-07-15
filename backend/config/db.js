import dns from "dns";
import mongoose from "mongoose";

// Fix for ISPs that block/mangle SRV DNS lookups needed by MongoDB Atlas.
// Pointing at Google + Cloudflare DNS resolves the common
// "querySrv ENOTFOUND _mongodb._tcp..." connection failure.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;

// 