const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "feedback", "dropdown", "checkbox", "rating", "nps"],
      required: true,
    },
    label: { type: String, required: true },
    placeholder: { type: String, default: "" },
    required: { type: Boolean, default: false },
    options: { type: [String], default: [] },
  },
  { _id: false }
);

const formSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    fields: {
      type: [fieldSchema],
      default: [],
    },
    appearance: {
      themeColor: { type: String, default: "#8b5cf6" },
      font: { type: String, default: "Inter" },
      position: { type: String, enum: ["floating", "inline"], default: "floating" },
      submitButtonLabel: { type: String, default: "Submit" },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    maxSubmissions: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

module.exports = mongoose.model("Form", formSchema);
