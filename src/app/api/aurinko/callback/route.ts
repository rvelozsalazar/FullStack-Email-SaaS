// /api/aurinko/callback 

import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export const GET = async (req: Request) => {
    const {userId} = await auth()
    console.log('User ID is:', userId)
    return NextResponse.json({ message: 'Hello mi pequena Sami <3!' })
}