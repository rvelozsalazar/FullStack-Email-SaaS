// /api/aurinko/callback 

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { Param } from "@prisma/client/runtime/library"
import { exchangeCodeForToken, getAccountDetails } from "@/lib/aurinko"
import { db } from "@/server/db"

export const GET = async (req: NextRequest) => {
    const {userId} = await auth()
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const params = req.nextUrl.searchParams
        const status = params.get('status')
        if (status != 'success') return NextResponse.json({ message: 'Failed to link account' }, { status: 400 })

        // get code to exchange for access token
        const code = params.get('code')
        if (!code) return NextResponse.json({ message: 'No code provided' }, { status: 400 })
        const token = await exchangeCodeForToken(code)
        if (!token) return NextResponse.json({ message: 'Failed to exchange code for token' }, { status: 500 })

        const accountDetails = await getAccountDetails(token.accessToken)


        await db.account.upsert({
            where: {
                id: token.accountId.toString()
            },
            update: {
                accessToken: token.accessToken
            },
            create: {
                id: token.accountId.toString(),
                userId,
                emailAddress: accountDetails.email,
                name: accountDetails.name,
                accessToken: token.accessToken
            }
        })



    return NextResponse.redirect(new URL('/mail', req.url))
}