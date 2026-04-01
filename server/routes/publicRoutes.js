const express = require("express");
const mongoose = require("mongoose");
const Form = require("../models/Form");
const Submission = require("../models/Submission");

const router = express.Router();

const isMissingValue = (value, type) => {
  if (type === "checkbox") {
    return !Array.isArray(value) || value.length === 0;
  }

  return value === undefined || value === null || value === "";
};

router.get("/forms/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Form not found" });
    }

    const form = await Form.findById(req.params.id).lean();

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const submissionCount = await Submission.countDocuments({ formId: form._id });
    const hasReachedLimit =
      form.maxSubmissions !== null &&
      form.maxSubmissions !== undefined &&
      submissionCount >= form.maxSubmissions;

    return res.json({
      _id: form._id,
      title: form.title,
      description: form.description,
      fields: form.fields,
      appearance: form.appearance,
      isActive: form.isActive,
      maxSubmissions: form.maxSubmissions,
      hasReachedLimit,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch public form" });
  }
});

router.post("/forms/:id/submit", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Form not found" });
    }

    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (!form.isActive) {
      return res.status(403).json({ message: "This form is currently unavailable" });
    }

    const submissionCount = await Submission.countDocuments({ formId: form._id });
    if (form.maxSubmissions !== null && submissionCount >= form.maxSubmissions) {
      return res.status(403).json({ message: "This form is now closed" });
    }

    const responses = req.body.responses || {};

    for (const field of form.fields) {
      if (field.required && isMissingValue(responses[field.id], field.type)) {
        return res.status(400).json({ message: `${field.label} is required` });
      }
    }

    const submission = await Submission.create({
      formId: form._id,
      responses,
    });

    return res.status(201).json({
      message: "Submission received",
      submissionId: submission._id,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit form" });
  }
});

module.exports = router;
