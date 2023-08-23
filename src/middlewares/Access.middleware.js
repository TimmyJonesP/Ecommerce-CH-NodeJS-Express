import HTTPError from "../DAO/repository/errors.repository.js";

export function adminAccess(req, res, next) {
  req.session.user.role === "admin" ? next() : next(new HTTPError(401));
}

export function privateAccess(req, res, next) {
  if (!req.session.user) return res.redirect("/api/login");
  next();
}

export function publicAccess(req, res, next) {
  if (req.session.user) {
    res.redirect("/api/products");
  } else {
    next();
  }
}

export function userAccess(req, res, next) {
  req.session.user.role === "user" || req.session.user.role === "admin"
    ? next()
    : next(new HTTPError(403));
}
