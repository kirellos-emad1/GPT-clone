"use client";

import { UserT } from "@/types/collections"; // Adjust the import based on your types
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { ownerIDAtom } from "@/atoms/chat";

import useSWR from "swr";
import { getUserById } from "@/app/data-access/user"; // Adjust as needed
import { createClient } from "@/utils/supabase/client";
import { useSetAtom } from "jotai";

interface ContextI {
    user: UserT | null | undefined;
    error: any;
    isLoading: boolean;
    mutate: any; // Adjust the mutate function type if necessary
    signOut: () => Promise<void>;
}

const Context = createContext<ContextI>({
    user: null,
    error: null,
    isLoading: true,
    mutate: null,
    signOut: async () => { },
});

export default function AuthProvider({
    id,
    children,
}: {
    id?: string | null;
    children: React.ReactNode;
}) {
    const [userData, setUserData] = useState<UserT | null>(null);
    const setOwnerID = useSetAtom(ownerIDAtom);

    // THROW ERROR IF AUTH_REDIRECT IS NOT SET
    if (
        !process.env.NEXT_PUBLIC_SITE_URL &&
        (process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ||
            process.env.NEXT_PUBLIC_VERCEL_ENV === "preview")
    ) {
        throw new Error("NEXT_PUBLIC_AUTH_REDIRECT_URL must be set in .env");
    }

    const router = useRouter();

    // Get USER
    const getUser = async () => {
        if (!id) return null;
        const user = await getUserById(id);
        return user; // This should return the ProfileT type
    };
    useEffect(() => {
        const fetchUserData = async () => {

                if (!id) return null;

                // Fetch additional user data by ID from your API route
                const response = await fetch(`/api/user-data?id=${id}`);
                const userData = await response.json();

                setUserData(userData);
            
        };

        fetchUserData();
    }, []);


const {
    data: user,
    error,
    isLoading,
    mutate,
} = useSWR(id ? "profile-context" : null, getUser);

// Sign Out
const signOut = async () => {
    const supabase = createClient()
    supabase.auth.signOut()
    router.push("/login");
    console.log("Signed Out!");
};

useEffect(() => {
    if (user) {
      setOwnerID(user.id);
    }
  }, [setOwnerID, user]);


const exposed: ContextI = {
    user:userData,
    error,
    isLoading,
    mutate,
    signOut,
};

return <Context.Provider value={exposed}>{children}</Context.Provider>;
}

export const useAuth = () => {
    const context = useContext(Context);
    if (context === undefined) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
};
