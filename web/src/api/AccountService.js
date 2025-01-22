import { api } from "src/boot/axios";

export const login_account = async (account) => {
  try {
    const res = await api.post("account/user/login", { account: account });
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, message: err.response.data.message };
  }
};
