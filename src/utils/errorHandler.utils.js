import HTTPError from "../DAO/repository/errors.repository.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HTTPError) {
    const errorMessage = err.message || "Unknown error";
    res.status(err.code).json({ error: errorMessage });
  } else {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
