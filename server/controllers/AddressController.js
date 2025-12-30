// controllers/addressController.js
const Address = require('../models/AddressModel');

// Helper: Ensure address belongs to the logged-in user
const getAddressByIdAndUser = async (id, userId) => {
  return await Address.findOne({ _id: id, user: userId });
};

// @desc    Create new address
const addAddress = async (req, res) => {
  try {
    const address = await Address.create({
      ...req.body,
      user: req.user._id,
    });

    // Push address ID to user's addresses array
    await req.user.updateOne({ $push: { addresses: address._id } });

    res.status(201).json({
      success: true,
      data: address,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all addresses of logged-in user
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: addresses.length,
      data: addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single address by ID
const getAddressById = async (req, res) => {
  try {
    const address = await getAddressByIdAndUser(req.params.id, req.user._id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found or not authorized',
      });
    }

    res.json({
      success: true,
      data: address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update address
const updateAddress = async (req, res) => {
  try {
    const address = await getAddressByIdAndUser(req.params.id, req.user._id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found or not authorized',
      });
    }

    Object.assign(address, req.body);
    await address.save();

    res.json({
      success: true,
      data: address,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete address
const deleteAddress = async (req, res) => {
  try {
    const address = await getAddressByIdAndUser(req.params.id, req.user._id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found or not authorized',
      });
    }

    // Remove from Address collection
    await address.deleteOne();

    // Remove reference from user's addresses array
    await req.user.updateOne({ $pull: { addresses: req.params.id } });

    res.json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};
