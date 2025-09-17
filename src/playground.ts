import { db } from "./server/db";

await db.user.create({
    data: {
        emailAddress: "richirich@gmail.com",
        firstName: "Richard",
        lastName: "Salazar",
    }
});

console.log("Done");  
