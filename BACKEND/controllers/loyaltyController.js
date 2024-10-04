const Loyalty = require('../models/loyaltyModel');

//Get all Loyalty Details
const getLoyaltys = (req, res, next) => {
    Loyalty.find()
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};

//Create new Loyalty
const addLoyalty = (req, res, next) => {
    const { loyaltyId, cid, cusName, Country, info, status  } = req.body;

    const loyalty = new Loyalty({
        loyaltyId: loyaltyId,
        cid: cid,
        cusName: cusName,
        Country: Country,
        info: info,
        status: status,
    });

    loyalty.save()
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            console.error('Error adding Loyalty:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

//Update existing Loyalty Details
const updateLoyalty = (req, res, next) => {
    const { loyaltyId, cid, cusName, Country, info, status } = req.body;
    
    Loyalty.updateOne({ loyaltyId: loyaltyId }, { $set: { cid: cid, cusName: cusName, Country: Country, info: info, status: status } })
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};

//Delete existing Loyalty
const deleteLoyalty = (req, res, next) => {
    const loyaltyId = req.body.loyaltyId;
    Loyalty.deleteOne({loyaltyId: loyaltyId})
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};

//Getting Loyalty max id for add next Loyalty in the CRM system
const getLoyaltyMaxId = (req, res, next) => {
    Loyalty.find({}, { loyaltyId: 1 }).sort({ loyaltyId: -1 }).limit(1)
      .then(response => {
        const maxId = response.length > 0 ? response[0].loyaltyId : 0;
        res.json({ maxId }); 
      })
      .catch(error => {
        res.json({ error });
      });
  };
  

//Export all

exports.getLoyaltys = getLoyaltys;
exports.addLoyalty = addLoyalty;
exports.updateLoyalty = updateLoyalty;
exports.deleteLoyalty = deleteLoyalty;
exports.getLoyaltyMaxId = getLoyaltyMaxId;