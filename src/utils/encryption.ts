import bcrypt from "bcrypt";

export const encryptedPassword = async (password: string): Promise<string> => {
  const salt: string = await bcrypt.genSalt(10);
  const encryptedPassword: string = await bcrypt.hash(password, salt);

  return encryptedPassword;
};

export const decryptPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const isMatch: boolean = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};