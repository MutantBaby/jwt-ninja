const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const jsonWebToken = require("jsonwebtoken");

require("dotenv").config();

const pathToKey = path.join(__dirname, "..", "keys", "id_rsa_pri.pem");
const privateKey = fs.readFileSync(pathToKey, "utf8");

function genToken(user) {
  const _id = user._id;
  const expiresIn = 1000 * 24 * 60 * 60;

  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jsonWebToken.sign(payload, privateKey, {
    expiresIn,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}

function validPassword(password, hash, salt) {
  return crypto
    .pbkdf2Sync(password, salt, 10001, 64, "sha512")
    .toString("hex") === hash
    ? true
    : false;
}

function genPassword(password) {
  const salt = crypto.randomBytes(32).toString("hex");
  const genHash = crypto
    .pbkdf2Sync(password, salt, 10001, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}

function errorHandlerForAuth(error) {
  if (error.message.includes("user validation failed")) {
    let errorsObject = { email: "", password: "" };

    Object.values(error.errors).forEach(({ properties }) => {
      errorsObject[properties.path] = properties.message;
    });

    return errorsObject;
  } else if (error.code === 11000)
    return { email: "Email is Already Registered" };
  else return { error: error.message };
}

module.exports.genToken = genToken;
module.exports.genPassword = genPassword;
module.exports.validPassword = validPassword;
module.exports.errorHandlerForAuth = errorHandlerForAuth;
