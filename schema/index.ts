import * as z from "zod"
export const LoginSchema = z.object({
    email: z.string().email({
      message: "Please Enter a valid Email Address"
    }),
    password: z.string().min(6, {
      message: "Please enter a valid password with min of 6 characters"
    })
  })
  export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Please Enter a valid Email Address"
    }),
    password: z.string().min(6, {
        message: "Please enter a valid password with min of 6 characters"
    }),
    fullName: z.string().min(3, {
      message: "Please enter a valid Username"
    })
  });