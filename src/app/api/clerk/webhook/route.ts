// /api/clerk/webhook
import { db } from "@/server/db"

export const POST = async (req: Request) => {
  const { data } = await req.json()

  const id = data.id
  const firstName = data.first_name ?? ""
  const lastName = data.last_name ?? ""
  const imageURL = data.image_url ?? null

  // Check for email
  let emailAddress: string | null = null
  if (data.email_addresses && data.email_addresses.length > 0) {
    emailAddress = data.email_addresses[0].email_address
  }

  if (!emailAddress) {
    console.warn("No email found for Clerk user:", id)
    return new Response("No email found", { status: 200 })
  }

  await db.user.create({
    data: {
      id: id,
      emailAddress: emailAddress,
      firstName: firstName,
      lastName: lastName,
      imageURL: imageURL,
    },
  })

  console.log("User created.")

  return new Response("Webhook received", { status: 200 })
}