// middlewares/validateUUID.js
import { validate as uuidValidate } from "uuid";

export const validateUUID = (paramName) => {
  return (req, res, next) => {
    const value = req.params[paramName];
    if (!uuidValidate(value)) {
      return res
        .status(400)
        .json({ error: `${paramName} must be a valid UUID` });
    }
    next();
  };
};
