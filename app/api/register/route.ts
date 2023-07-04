import bcrypt from 'bcrypt';
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(
    request: Request
) {
    // get a data in input enterd by user
    const body = await request.json();
    const {
        name,
        email,
        password
    } = body;
    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    // create user in mongodb
    const user = await prisma.user.create({
        data: {
            name,
            email,
            hashedPassword
        }
    })

    return NextResponse.json(user);
}