import bcrypt from "bcryptjs";

// hashpassword
export const hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
