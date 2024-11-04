"use client";
import { Provider } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Github } from "lucide-react";
import { signup, signInWithGithub } from '@/app/actions/auth-actions'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { RegisterSchema } from "@/schema";

const SignUpForm = () => {
    const router = useRouter();

    const [isPendingGithub, startTransitionGithub] = useTransition();
    const [isPending, startTransition] = useTransition();
    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        startTransition(() => {
            signup(values)
        });
    };
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            fullName: ""
        },
    });

    const handleClickLoginButton = (provider: Provider) => {
        startTransitionGithub(async () => {
            const { errorMessage, url } = await signInWithGithub(provider);
            if (!errorMessage && url) {
                router.push(url);
            } else {
                console.error(errorMessage);
            }
        });
    };
    return (
        <div className="flex items-center w-full h-full px-8">
            {/* Main Container */}
            <div className="w-full h-full flex items-center  justify-center flex-col  ">
                {/* Text */}
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-bold">Sign up</h1>
                    <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                        Welcome to ChatGPT clone
                    </p>
                </div>
                {/* Github Button */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-[60%] mt-8">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex  font-sans">
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className=" rounded-xl border-neutral-200 "
                                            {...field}
                                            placeholder="Username"
                                            type="text"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage className="font-sans" />
                                </FormItem>
                            )}
                        ></FormField>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex  font-sans">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className=" rounded-xl border-neutral-200 "
                                            {...field}
                                            placeholder="John.doe@example.com"
                                            type="email"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage className="font-sans " />
                                </FormItem>
                            )}
                        ></FormField>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex  font-sans">
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className=" rounded-xl border-neutral-200 "
                                            {...field}
                                            disabled={isPending}
                                            placeholder="********"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage className="font-sans " />
                                </FormItem>
                            )}
                        ></FormField>
                        <Button type="submit" disabled={isPending}
                            className="flex justify-center bg-neutral-800 h-10 w-[265px] rounded-lg hover:bg-gray-200 hover:text-black transition-all duration-500 items-center mt-2"                        >
                            Sign up
                        </Button>
                    </form>
                </Form>
                <div>--or--</div>
                <Link href={'/auth/login'} className=" full">
                    <Button className="flex justify-center bg-neutral-800 h-10 w-[265px] rounded-lg hover:bg-gray-200 hover:text-black transition-all duration-500 items-center mt-2">
                        Login
                    </Button>
                </Link>
                <Button
                    onClick={() => handleClickLoginButton("github")}
                    disabled={isPendingGithub}
                    className="flex justify-center bg-neutral-800 w-[60%] h-10 rounded-md hover:bg-gray-200 hover:text-black transition-all duration-500 items-center gap-2 mt-3"
                >
                    {isPendingGithub ? "Signing in..." : "Sign up with GitHub"}
                    <Github size="16" />
                </Button>
            </div>
        </div>
    )
}

export default SignUpForm