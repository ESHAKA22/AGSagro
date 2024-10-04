const Edit = require("../models/edit.model");

// Create contract
exports.EcreatesContract = async (req, res, next) => {
  const { name, contactp, startdate, enddate, Terms, payment, delivery, Renewal, status } = req.body;

  const newContract = new Edit({
    name,
    contactp,
    startdate,
    enddate,
    Terms,
    payment,
    delivery,
    Renewal,
    status,
  });

  try {
    const savedContract = await newContract.save();
    res.status(201).json(savedContract);
  } catch (error) {
    next(error);
  }
};

// Get all contracts
exports.EgetAllContract = async (req, res, next) => {
  try {
    const contracts = await Edit.find();

    if (contracts.length > 0) {
      res.json({ message: "Contract details retrieved successfully", contracts });
    } else {
      res.status(404).json({ message: "No contracts found" });
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// Delete contract
exports.EdeleteContract = async (req, res, next) => {
  try {
    await Edit.findByIdAndDelete(req.params.EId);
    res.status(200).json("The contract has been deleted");
  } catch (error) {
    next(error);
  }
};

// Update contract
exports.EupdatesContract = async (req, res, next) => {
  try {
    const updatedContract = await Edit.findByIdAndUpdate(
      req.params.EcontratId,
      { $set: req.body },
      { new: true }
    );

    if (updatedContract) {
      res.status(200).json(updatedContract);
    } else {
      res.status(404).json({ message: "Contract not found" });
    }
  } catch (error) {
    next(error);
  }
};
