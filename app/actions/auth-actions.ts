'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Provider } from "@supabase/supabase-js";
import * as z from "zod";
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db';
import { getUserByEmail } from '../data-access/user';
import { LoginSchema, RegisterSchema } from '@/schema';
export async function signInWithGithub(provider: Provider) {
    const supabase = await createClient()
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
            },
        });

        if (error) throw error;

        return { errorMessage: null, url: data.url };
    } catch (error) {
        return { errorMessage: "Error logging in" };
    }
};


export async function login(values: z.infer<typeof LoginSchema>) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }
    const { password, email} = validatedFields.data;

    const { error } = await supabase.auth.signInWithPassword(validatedFields.data)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(values: z.infer<typeof RegisterSchema>) {
    const supabase = await createClient()
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }
    const { password, email, fullName } = validatedFields.data;

    // type-casting here for convenience
    // in practice, you should validate your inputs
    // const fullName = values.get('full_name') as string;
    // const email = formData.get('email') as string;
    // const password = formData.get('password') as string;
    if (!fullName || !email || !password) {
        return redirect('/error');
    }

    const { data: signUpData, error } = await supabase.auth.signUp({

        email,
        password,
        options: {
            data: { full_name: fullName },
        },
    });
    if (error) {
        redirect('/error')
    }
    const existingUser = await getUserByEmail( email );
    if (existingUser) return { error: 'Email already exist try to login instead' };

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) throw new Error("Failed to retrieve user data");
    const id = userData.user.id


    if (!existingUser) {
        await db.user.create({
            data: {
                id,
                email,
                name: fullName,
                avatar_url:'https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon'
            },
        });
    }
    
    revalidatePath('/', 'layout')
    redirect('/')
  
}