const Employee = require('../models/Employee');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

exports.getAll = async (req, res) => {
  try {
    const emps = await Employee.find().lean();
    const out = emps.map(e => ({
      employee_id: e._id,
      first_name: e.first_name,
      last_name: e.last_name,
      email: e.email,
      position: e.position,
      salary: e.salary,
      date_of_joining: e.date_of_joining,
      department: e.department
    }));
    return res.status(200).json(out);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status:false, message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ status:false, errors: errors.array() });

  try {
    const emp = new Employee(req.body);
    await emp.save();
    return res.status(201).json({ message: 'Employee created successfully.', employee_id: emp._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status:false, message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const { eid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eid)) return res.status(400).json({ status:false, message: 'Invalid id' });

    const emp = await Employee.findById(eid).lean();
    if (!emp) return res.status(404).json({ status:false, message: 'Employee not found' });

    return res.status(200).json({
      employee_id: emp._id,
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
      position: emp.position,
      salary: emp.salary,
      date_of_joining: emp.date_of_joining,
      department: emp.department
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status:false, message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ status:false, errors: errors.array() });

  try {
    const { eid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eid)) return res.status(400).json({ status:false, message: 'Invalid id' });

    await Employee.findByIdAndUpdate(eid, { $set: req.body, updated_at: Date.now() }, { new: true });
    return res.status(200).json({ message: 'Employee details updated successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status:false, message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { eid } = req.query;
    if (!eid) return res.status(400).json({ status:false, message: 'eid query param required' });
    if (!mongoose.Types.ObjectId.isValid(eid)) return res.status(400).json({ status:false, message: 'Invalid id' });

    const deleted = await Employee.findByIdAndDelete(eid);
    if (!deleted) return res.status(404).json({ status:false, message: 'Employee not found' });

    // Spec asks response code 204 — return no content.
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status:false, message: 'Server error' });
  }
};