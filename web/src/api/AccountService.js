import { api } from "src/boot/axios";

// 一般使用者登入
export const login_account = async (account) => {
  try {
    const res = await api.post("account/user/login", { account: account });
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, message: err.response.data.message };
  }
};
