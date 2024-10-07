const StockReplenishmentRequest = require('../models/StockReplenishmentRequestModel');

// Stock Manager: Create a new stock replenishment request
exports.createRequest = async (req, res) => {
  try {
    const { productId, supplierId, quantity } = req.body;
    const newRequest = new StockReplenishmentRequest({ productId, supplierId, quantity });
    await newRequest.save();
    res.status(201).json({ message: 'Request created successfully', request: newRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error creating request', error });
  }
};

// Stock Manager: View all requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await StockReplenishmentRequest.find().populate('productId supplierId');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error });
  }
};

// Stock Manager: Update request quantity
exports.updateRequestQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body; // new quantity

    const updatedRequest = await StockReplenishmentRequest.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: 'Request updated successfully', request: updatedRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error updating request', error });
  }
};

// Stock Manager: Delete a request
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRequest = await StockReplenishmentRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting request', error });
  }
};

// Supplier: Update the status of a request
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body; // New status and reason for rejection

    // Find the request by ID
    const request = await StockReplenishmentRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Prevent further updates if already approved or rejected
    if (request.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot update an already processed request' });
    }

    // Update the request status and reason if it's rejected
    request.status = status;
    if (status === 'Rejected' && reason) {
      request.Reason = reason;
    }

    const updatedRequest = await request.save(); // Save the updated request

    res.status(200).json({
      message: 'Request status updated successfully',
      request: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating request status',
      error,
    });
  }
};
