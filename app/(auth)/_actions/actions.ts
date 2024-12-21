"use server";

import { instance } from "@/lib/utils/requestHandler";
import { EndPoints } from "@/lib/routes/EndPoints";
import { loginSchemaType } from "../_component/lib";

export async function loginAction(data: loginSchemaType) {
  try {
    // const res = await instance.post(EndPoints.login, { ...data });
    if (data.email === "admin@gmail.com" && data.password === "admin") {
      return {
        success: true,
        message: "Welcome Admin",
      };
    }
    return {
      success: false,
      message: "Invalid Email or Password",
    };
    // if (res.status === 200) {
    //   return {
    //     success: true,
    //     message: res.data,
    //   };
    // }
  } catch (error: any) {
    // const message = error?.response?.data[Object.keys(error.response.data)[0]];
    return {
      success: false,
      message: "Invalid Email or Password",
    };
  }
}
