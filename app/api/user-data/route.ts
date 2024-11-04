import { getUserById } from "@/app/data-access/user";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Check if ID is provided
    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Fetch user by ID
    const user = await getUserById(id);

    // Handle case where user is not found
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user data as JSON
    return NextResponse.json(user);
}
