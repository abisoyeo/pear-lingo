import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default userAuthPlugin = function (schema) {
  schema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
      this.password = await bcrypt.hash(this.password, 12);
      next();
    } catch (error) {
      next(error);
    }
  });

  schema.methods.generateAuthToken = function () {
    return jwt.sign(
      { user: { id: this._id, email: this.email } },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  };

  schema.methods.isValidPassword = async function (userPassword) {
    return bcrypt.compare(userPassword, this.password);
  };
};
