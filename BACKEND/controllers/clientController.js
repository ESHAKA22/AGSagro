const Client = require('../models/clientModel');

//Get all Client Details
const getClients = (req, res, next) => {
    Client.find()
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};


const getSelectedClient = (req, res, next) => {
    const { cid } = req.query; // Use query parameter to get specific Service data

    if (cid) {
        // If CID is provided, find the specific Service
        Client.findOne({ cid: cid })
            .then(response => {
                if (response) {
                    res.json({ response });
                } else {
                    res.status(404).json({ message: 'Client not found' });
                }
            })
            .catch(error => {
                console.error('Error fetching Service data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    } else {
        // If no CID is provided, return all Service
        Client.find()
            .then(response => {
                res.json({ response });
            })
            .catch(error => {
                console.error('Error fetching Client data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }
};

//Create new Client
const addClient = (req, res, next) => {
    const { cid, country, firstName, lastName, address, city, email, paymentMethods, phone, nic, zipCode, userName, password, regDate  } = req.body;

    const client = new Client({
        cid: cid,
        country: country,
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email,
        paymentMethods: paymentMethods,
        phone: phone,
        nic: nic,
        zipCode: zipCode,
        userName: userName,
        password: password,
        regDate: regDate,
    });

    client.save()
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            console.error('Error adding Client:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

//Update existing Client Details
const updateClient = (req, res, next) => {
    const { cid, country, firstName, lastName, address, city, email, paymentMethods, phone, nic, zipCode, userName, password } = req.body;
    
    Client.updateOne({ cid: cid }, { $set: { country: country, firstName: firstName, lastName: lastName, address: address, city: city, email:email, paymentMethods:paymentMethods, phone: phone, nic: nic, zipCode: zipCode, userName: userName, password: password } })
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};

//Delete existing Client
const deleteClient = (req, res, next) => {
    const cid = req.body.cid;
    Client.deleteOne({cid: cid})
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};

//Getting Client max id for add next Client in the CRM system
const getMaxId = (req, res, next) => {
    Client.find({}, { cid: 1 }).sort({ cid: -1 }).limit(1)
      .then(response => {
        const maxId = response.length > 0 ? response[0].cid : 0;
        res.json({ maxId }); 
      })
      .catch(error => {
        res.json({ error });
      });
  };
  

//Export all

exports.getClients = getClients;
exports.addClient = addClient;
exports.updateClient = updateClient;
exports.deleteClient = deleteClient;
exports.getMaxId = getMaxId;
exports.getSelectedClient = getSelectedClient;