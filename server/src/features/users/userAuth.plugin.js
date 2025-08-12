import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default function userAuthPlugin(schema) {
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
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  };

  schema.methods.isValidPassword = async function (userPassword) {
    return bcrypt.compare(userPassword, this.password);
  };

  schema.methods.toJSON = function () {
    const user = this.toObject({ virtuals: true });

    user.id = user._id;
    delete user._id;
    delete user.__v;

    delete user.password;

    return user;
  };
}
