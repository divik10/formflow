const express = require("express");
const mongoose = require("mongoose");
const Form = require("../models/Form");
const Submission = require("../models/Submission");

const router = express.Router();

const sanitizeFormInput = (body) => {
  const appearance = body.appearance || {};

  return {
    title: body.title?.trim() || "Untitled Form",
    description: body.description || "",
    fields: Array.isArray(body.fields) ? body.fields : [],
    appearance: {
      themeColor: appearance.themeColor || "#8b5cf6",
      font: appearance.font || "Inter",
      position: appearance.position === "inline" ? "inline" : "floating",
      submitButtonLabel: appearance.submitButtonLabel || "Submit",
    },
    isActive: typeof body.isActive === "boolean" ? body.isActive : true,
    maxSubmissions:
      body.maxSubmissions === "" || body.maxSubmissions === undefined || body.maxSubmissions === null
        ? null
        : Number(body.maxSubmissions),
  };
};

const ensureOwnerForm = async (formId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(formId)) {
    return null;
  }

  return Form.findOne({ _id: formId, userId });
};

router.get("/", async (req, res) => {
  try {
    const forms = await Form.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
    const formIds = forms.map((form) => form._id);
    const submissionCounts = await Submission.aggregate([
      { $match: { formId: { $in: formIds } } },
      { $group: { _id: "$formId", count: { $sum: 1 } } },
    ]);

    const countMap = submissionCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    const results = forms.map((form) => ({
      ...form,
      submissionCount: countMap[form._id.toString()] || 0,
    }));

    return res.json(results);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch forms" });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = sanitizeFormInput(req.body);

    if (!data.fields.length) {
      return res.status(400).json({ message: "At least one field is required" });
    }

    const form = await Form.create({
      userId: req.user._id,
      ...data,
    });

    return res.status(201).json(form);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create form" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const form = await ensureOwnerForm(req.params.id, req.user._id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    return res.json(form);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch form" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const form = await ensureOwnerForm(req.params.id, req.user._id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const data = sanitizeFormInput(req.body);

    if (!data.fields.length) {
      return res.status(400).json({ message: "At least one field is required" });
    }

    Object.assign(form, data);
    await form.save();

    return res.json(form);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update form" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const form = await ensureOwnerForm(req.params.id, req.user._id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    await Submission.deleteMany({ formId: form._id });
    await form.deleteOne();

    return res.json({ message: "Form deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete form" });
  }
});

router.post("/:id/duplicate", async (req, res) => {
  try {
    const form = await ensureOwnerForm(req.params.id, req.user._id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const duplicatedForm = await Form.create({
      userId: req.user._id,
      title: `Copy of ${form.title}`,
      description: form.description,
      fields: form.fields.map((field) => ({ ...field.toObject() })),
      appearance: { ...form.appearance.toObject() },
      isActive: form.isActive,
      maxSubmissions: form.maxSubmissions,
    });

    return res.status(201).json(duplicatedForm);
  } catch (error) {
    return res.status(500).json({ message: "Failed to duplicate form" });
  }
});

router.get("/:id/submissions", async (req, res) => {
  try {
    const form = await ensureOwnerForm(req.params.id, req.user._id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const submissions = await Submission.find({ formId: form._id }).sort({ submittedAt: -1 });

    return res.json({
      form,
      submissions,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch submissions" });
  }
});

router.get("/:id/analytics", async (req, res) => {
  try {
    const form = await ensureOwnerForm(req.params.id, req.user._id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const submissions = await Submission.find({ formId: form._id }).sort({ submittedAt: 1 }).lean();
    const ratingField = form.fields.find((field) => field.type === "rating");
    const npsField = form.fields.find((field) => field.type === "nps");
    const now = new Date();
    const last30 = new Date(now);
    last30.setDate(now.getDate() - 29);

    const dayMap = {};
    for (let i = 0; i < 30; i += 1) {
      const day = new Date(last30);
      day.setDate(last30.getDate() + i);
      const key = day.toISOString().split("T")[0];
      dayMap[key] = 0;
    }

    let ratingTotal = 0;
    let ratingCount = 0;
    let npsTotal = 0;
    let npsCount = 0;

    submissions.forEach((submission) => {
      const key = new Date(submission.submittedAt).toISOString().split("T")[0];
      if (dayMap[key] !== undefined) {
        dayMap[key] += 1;
      }

      if (ratingField) {
        const value = Number(submission.responses?.[ratingField.id]);
        if (!Number.isNaN(value) && value > 0) {
          ratingTotal += value;
          ratingCount += 1;
        }
      }

      if (npsField) {
        const value = Number(submission.responses?.[npsField.id]);
        if (!Number.isNaN(value) && value >= 0) {
          npsTotal += value;
          npsCount += 1;
        }
      }
    });

    return res.json({
      totalSubmissions: submissions.length,
      averageRating: ratingCount ? Number((ratingTotal / ratingCount).toFixed(1)) : null,
      averageNPS: npsCount ? Number((npsTotal / npsCount).toFixed(1)) : null,
      submissionsOverTime: Object.entries(dayMap).map(([date, count]) => ({ date, count })),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

module.exports = router;
