const User = require("../models/User");
const { errorHandlerForAuth, validPassword, genToken } = require("../utils");

module.exports.signup_get = function (req, res, next) {
  res.send("Signup Page");
};

module.exports.login_get = function (req, res, next) {
  res.send("Login Page");
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

module.exports.signup_post = async function (req, res, next) {
  const { email, password } = req.body;

  try {
    await User.create({ email, password });

    res.status(201).json({ success: true, message: "User Created" });
  } catch (err) {
    res.status(400).send({ sucess: false, error: errorHandlerForAuth(err) });
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

module.exports.login_post = async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "")
    return res.status(400).json({ success: false, message: "Invalid Input" });

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User Not Found!" });

    const isValid = validPassword(password, user.password, user.salt);

    if (!isValid)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });

    const { token, expires } = genToken(user);

    res.cookie("jwt", token, { maxAge: expires, httpOnly: true });
    res.status(200).json({ success: true, message: "User Logged In", token });
  } catch (err) {
    res.status(400).send({ sucess: false, error: errorHandlerForAuth(err) });
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

module.exports.logout_get = function (req, res, next) {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/auth/login");
};
