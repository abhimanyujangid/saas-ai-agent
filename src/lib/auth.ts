import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import * as schema from "@/db/schema"; // your schema
 
export const auth = betterAuth({
    emailAndPassword:{
        enabled: true,
        signUp: {
            enabled: true,
            // You can customize the sign-up logic here
        },
        signIn: {
            enabled: true,
            // You can customize the sign-in logic here
        },
    },
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: {
            ...schema, // your schema
        }, 
    }),
}) ; 