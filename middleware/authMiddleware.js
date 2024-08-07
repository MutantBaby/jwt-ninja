const fs = require("node:fs");
const path = require("node:path");
const jsonWebToken = require("jsonwebtoken");

const pathToPubKey = path.join(__dirname, "..", "keys", "id_rsa_pub.pem");
const publicKey = fs.readFileSync(pathToPubKey, "utf8");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

async function authorizationMiddleware(req, res, next) {
  const token = req.headers.authorization || req.cookies.jwt;

  if (!token) return res.status(401).redirect("/auth/login");

  const tokenParts = token.split(" ");

  if (
    tokenParts[0] !== "Bearer" &&
    tokenParts[1].match(/\S+\.\S+\.\S+/) === null
  )
    return res.status(401).redirect("/auth/login");

  try {
    await jsonWebToken.verify(tokenParts[1], publicKey, {
      algorithms: ["RS256"],
    });

    next();
  } catch (error) {
    return res.status(401).redirect("/auth/login");
  }
}

module.exports.authorizationMiddleware = authorizationMiddleware;
