const Visitor = require("../models/SecurityVisitorsLogs.model");

//add visitor
exports.CreateVisitor = async (req, res) => {
  try {
    const { name, number, date, wing, unit, time } = req.body;
    if (!name || !number || !wing || !unit) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const visitor = new Visitor({
      name,
      number,
      date,
      wing,
      unit,
      time,
    });
    await visitor.save();
    if (!visitor) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }

    return res.status(201).json({
      success: false,
      message: "Visitor Successfully Added",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
//get complaint
exports.GetAllVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.find({}).sort({ wing: 1, unit: 1 });

    return res.status(200).json({
      success: true,
      data: visitor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching visitor",
    });
  }
};

exports.FilterVisitor = async (req, res) => {
  try {
    const { timePeriod } = req.query;
    const currentDate = new Date();
    let dateFrom, dateTo;

    if (timePeriod === "lastWeek") {
      dateFrom = new Date(currentDate);
      dateFrom.setDate(currentDate.getDate() - 7);
      dateTo = currentDate;
    } else if (timePeriod === "lastMonth") {
      dateFrom = new Date(currentDate);
      dateFrom.setMonth(currentDate.getMonth() - 1);
      dateTo = currentDate;
    } else if (timePeriod === "lastYear") {
      dateFrom = new Date(currentDate);
      dateFrom.setFullYear(currentDate.getFullYear() - 1);
      dateTo = currentDate;
    } else {
      dateFrom = null;
      dateTo = null;
    }

    const filter =
      dateFrom && dateTo ? { date: { $gte: dateFrom, $lte: dateTo } } : {};

    const visitors = await Visitor.find(filter).sort({ wing: 1, unit: 1 });

    return res.status(200).json({
      success: true,
      data: visitors,
    });
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: "Error fetching visitors",
    });
  }
};


exports.UpdateVisitor = async (req, res) => {
  try {
    const { name, number, date, wing, unit, time } = req.body;
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { name, number, date, wing, unit, time },
      { new: true, runValidators: true }
    );
    if (!visitor) return res.status(404).json({ success: false, message: "Visitor not found" });
    return res.status(200).json({ success: true, message: "Visitor updated successfully", data: visitor });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating visitor" });
  }
};

exports.DeleteVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);
    if (!visitor) return res.status(404).json({ success: false, message: "Visitor not found" });
    return res.status(200).json({ success: true, message: "Visitor deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting visitor" });
  }
};
