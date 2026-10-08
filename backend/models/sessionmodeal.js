import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Speeds up queries during login/logout/verification
    },
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", sessionSchema);