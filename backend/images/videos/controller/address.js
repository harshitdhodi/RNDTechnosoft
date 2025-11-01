const Address = require('../model/address');

// Controller to get the address
const getAddress = async (req, res) => {
  try {
    const address = await Address.findOne();
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching address', error });
  }
};

// Controller to edit the address (create if not exists)
const editAddress = async (req, res) => {
  const { headOfficeAddress, salesOfficeAddress, location } = req.body;

  try {
    let address = await Address.findOne();

    if (address) {
      // Update existing address
      address.headOfficeAddress = headOfficeAddress || address.headOfficeAddress;
      address.salesOfficeAddress = salesOfficeAddress || address.salesOfficeAddress;
      address.location = location || address.location;
    } else {
      // Create new address if none exists
      address = new Address({
        headOfficeAddress,
        salesOfficeAddress,
        location,
      });
    }

    const savedAddress = await address.save();
    res.status(200).json(savedAddress);
  } catch (error) {
    res.status(500).json({ message: 'Error updating or creating address', error });
  }
};

module.exports = {
  getAddress,
  editAddress,
};
