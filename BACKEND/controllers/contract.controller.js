const Contract = require("../models/contract.model"); // Change from import to require

exports.createsContract = async (req, res, next) => {
  const { name, contactp, startdate, enddate, Terms, payment, delivery, Renewal, status, SupId } = req.body;

  const newContract = new Contract({
    name,
    contactp,
    startdate,
    enddate,
    Terms,
    payment,
    delivery,
    Renewal,
    status,
    SupId
  });
  
  try {
    const savedContract = await newContract.save();
    res.status(201).json(savedContract);
  } catch (error) {
    next(error);
  }
};

exports.getAllContract = async (req, res, next) => {
  try {
    const contracts = await Contract.find();
    if (contracts.length > 0) {
      res.json({ message: "Contract details retrieved successfully", contracts });
    } 
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

exports.deleteContract = async (req, res, next) => {
  try {
    await Contract.findByIdAndDelete(req.params.CId);
    res.status(200).json("The contract has been deleted");
  } catch (error) {
    next(error);
  }
};

exports.updatesContract = async (req, res, next) => {
  try {
    const contract = await Contract.findByIdAndUpdate(
      req.params.contratId,
      {
        $set: {
          name: req.body.name,
          contactp: req.body.contactp,
          startdate: req.body.startdate,
          enddate: req.body.enddate,
          Terms: req.body.Terms,
          payment: req.body.payment,
          delivery: req.body.delivery,
          Renewal: req.body.Renewal,
          status: req.body.status,
          SupId: req.body.SupId,
        },
      },
      { new: true }
    );
    res.status(200).json(contract);
  } catch (error) {
    next(error);
  }
};

exports.getCcontract = async (req, res, next) => {
  try {
    const SupId = req.params.SupId;
    const detail = await Contract.find({ SupId });

    if (detail.length > 0) {
      res.json({ message: "Item details retrieved successfully", detail });
    } else {
      return next(new Error("Not found")); // Changed for clarity
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
