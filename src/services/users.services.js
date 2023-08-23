import BringUserDTO from "../DAO/DTO/bringUser.dto.js";
import userDao from "../DAO/users.dao.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await userDao.getAllUsers();

    const userDTO = users.map((user) => new BringUserDTO(user));

    res.status(200).json(userDTO);
  } catch (error) {
    next(error);
  }
};

export const changeRole = async (req, res, next) => {
  try {
    const userId = req.params.uid;

    const user = await userDao.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let newRole;
    if (user.role === "user") {
      newRole = "premium";
    } else if (user.role === "premium") {
      newRole = "user";
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    const updatedUser = await userDao.changeRole(userId, newRole);

    res
      .status(200)
      .json({ message: "User role updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Error changing user role" });
  }
};

export const deleteById = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    const user = await userDao.deleteById(uid);

    res.status(201).json({ message: `user by id ${uid} deleted`, user });
  } catch (error) {
    next(error);
  }
};

export const deleteByTime = async (req, res, next) => {
  try {
    const deleteInactiveUsers = userDao.deleteInactiveUsers();

    res
      .status(201)
      .json({ message: "Inactive accounts eliminated", deleteInactiveUsers });
  } catch (error) {
    next(error);
  }
};
