const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// Create Task (Protected Route)
router.post('/', auth, async (req, res) => {
  const { title, description, deadline, category, assignee } = req.body;
  try {
    const task = new Task({ title, description, deadline, category, assignee });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Get Tasks (Protected Route)
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignee', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

// Update Task (Protected Route)
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

module.exports = router;