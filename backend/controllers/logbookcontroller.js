import Logbook from "../models/logbook.js";

// CREATE logbook entry
export const createLogbookEntry = async (req, res) => {
  try {
    const { studentId, weekNumber, activityDescription } = req.body;

    const entry = await Logbook.create({
      studentId,
      weekNumber,
      activityDescription,
    });

    res.status(201).json({
      message: "Logbook entry created successfully",
      entry,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create logbook entry" });
  }
};

// GET all logbook entries
export const getLogbookEntries = async (req, res) => {
  try {
    const entries = await Logbook.findAll();
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch logbook entries" });
  }
};

// GET student logbook by ID
export const getStudentLogbook = async (req, res) => {
  try {
    const { studentId } = req.params;
    const entries = await Logbook.findAll({ where: { studentId } });

    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch student logbook" });
  }
};
