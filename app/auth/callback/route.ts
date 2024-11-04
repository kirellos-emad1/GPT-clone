import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { getUserByEmail } from '@/app/data-access/user'


export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) throw new Error("Failed to retrieve user data");

      const { email, name, avatar_url } = userData.user.identities?.[0]?.identity_data || {};

      if (email) {
        // Check if the user already exists in the Prisma database
        const existingUser = await getUserByEmail(email);

        // If the user does not exist, create a new user in Prisma
        if (!existingUser) {
          await db.user.create({
            data: {
              id: userData.user.id,
              email,
              avatar_url: avatar_url || null,
              name: name || email.split("@")[0],  //Fallback to part of email as name if name is unavailable
            },
          });
        }
      }
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}`)
}