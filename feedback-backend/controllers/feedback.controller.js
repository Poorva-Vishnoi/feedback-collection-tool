import Feedback from '../models/feedback.model.js';
import { Parser } from 'json2csv'; 
export const submitFeedback = async (req, res) => {
  try {
    const { name, email, feedback, rating } = req.body;

    if (!feedback || !rating) {
      return res.status(400).json({ message: "Feedback and rating are required." });
    }

    const newFeedback = new Feedback({ name, email, feedback, rating });
    await newFeedback.save();

    // 🔁 Emit real-time update using Socket.IO
    const io = req.app.get("io");
    if (io) {
      io.emit("new-feedback", {
        _id: newFeedback._id,
        name: newFeedback.name,
        email: newFeedback.email,
        feedback: newFeedback.feedback,
        rating: newFeedback.rating,
        createdAt: newFeedback.createdAt,
      });
    }

    res.status(201).json({ message: "Feedback submitted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    const { sortBy, minRating, maxRating, stats } = req.query;

    // If stats=true, return average rating and count
    if (stats === 'true') {
      const result = await Feedback.aggregate([
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$rating" },
            totalFeedbacks: { $sum: 1 }
          }
        }
      ]);

      return res.status(200).json(result[0] || { avgRating: 0, totalFeedbacks: 0 });
    }

    // Build filters
    const filter = {};
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (maxRating) {
      filter.rating = filter.rating || {};
      filter.rating.$lte = Number(maxRating);
    }

    // Sorting logic
    let sortOption = { createdAt: -1 }; // default: latest first
    if (sortBy === 'rating-asc') sortOption = { rating: 1 };
    else if (sortBy === 'rating-desc') sortOption = { rating: -1 };

    const feedbacks = await Feedback.find(filter).sort(sortOption);
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch feedbacks.", error: err.message });
  }
};

export const exportFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();

    if (feedbacks.length === 0) {
      return res.status(404).json({ message: "No feedbacks to export." });
    }

    // Choose fields to include in CSV
    const fields = ['name', 'email', 'feedback', 'rating', 'createdAt'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(feedbacks);

    res.header('Content-Type', 'text/csv');
    res.attachment('feedbacks.csv');
    return res.send(csv);
  } catch (err) {
    console.error("CSV Export Error:", err);
    res.status(500).json({ message: "Failed to export feedbacks.", error: err.message });
  }
};
