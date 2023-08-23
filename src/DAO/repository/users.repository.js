import moment from "moment/moment.js";
import Users from "../schemas/users.schemas.js";
import HTTPError from "./errors.repository.js";

export default class UserRepository {
  async findByEmail(email) {
    try {
      return await Users.findOne({ email: { $eq: email } });
    } catch (error) {
      throw new HTTPError("Error finding user by email", 500);
    }
  }

  async create(user) {
    try {
      return await Users.create(user);
    } catch (error) {
      throw new HTTPError("Error creating user", 500);
    }
  }

  async findById(id) {
    try {
      return await Users.findById(id);
    } catch (error) {
      throw new HTTPError("Error finding user", 500);
    }
  }

  async findByIdAndUpdate(id, updateData) {
    try {
      const user = await Users.findByIdAndUpdate(id, updateData, { new: true });
      if (!user) {
        throw new HTTPError("User not found", 404);
      }
      return user;
    } catch (error) {
      throw new HTTPError(`Error updating user id: ${id}`, 500);
    }
  }

  async getAllUsers() {
    try {
      const users = await Users.find();
      return users;
    } catch (error) {
      throw new HTTPError(`Error requiring the list of users.`, 500);
    }
  }

  async changeRole(id, newRole) {
    try {
      const user = await Users.findById(id);

      if (!user) {
        throw new HTTPError("User not found", 404);
      }

      if (user.role === "admin") {
        throw new HTTPError("Cannot change role of an admin user", 401);
      }

      user.role = newRole;

      await user.save();

      return user;
    } catch (error) {
      throw new HTTPError("Error changing user role", 500);
    }
  }
  async deleteById(id) {
    try {
      const deletedUser = await Users.findByIdAndDelete(id);

      if (!deletedUser) {
        throw new HTTPError(`User with ID ${id} not found`, 404);
      }

      return deletedUser;
    } catch (error) {
      throw new HTTPError("Error deleting user", 500);
    }
  }

  async deleteInactiveUsers() {
    try {
      const inactiveThreshold = moment().subtract(2, "days");

      const inactiveUsers = await Users.find({
        last_connection: { $lt: inactiveThreshold.toISOString() },
      });

      for (const user of inactiveUsers) {
        const userToDelete = await this.deleteById(user._id);
      }
      return inactiveUsers;
    } catch (error) {
      throw new HTTPError("Error deleting inactive users", 500);
    }
  }

  async updateUserWithCart(uid, cid) {
    const user = await Users.findByIdAndUpdate(
      uid,
      { $set: { cartId: cid } },
      { new: true }
    );
    return user;
  }
}
