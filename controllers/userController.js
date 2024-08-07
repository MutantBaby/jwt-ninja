const User = require("../models/User");

const { errorHandlerForAuth } = require("../utils");

module.exports.allUsers_get = async function (req, res, next) {
  const arr = [];

  try {
    const allUsers = await User.find({});
    allUsers.forEach(({ _id, email }) => arr.push({ _id, email }));

    res.status(200).json({ success: true, message: "All Users", data: arr });
  } catch (err) {
    res.status(400).send({ sucess: false, error: errorHandlerForAuth(err) });
  }
};

module.exports.oneUser_get = async function (req, res, next) {
  const { id } = req.params;
  console.log(id);

  try {
    const user = await User.findById({ _id: id });

    res.status(200).json({ success: true, message: "Search Done", data: user });
  } catch (err) {
    res.status(400).send({ sucess: false, error: errorHandlerForAuth(err) });
  }
};
