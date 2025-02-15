import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const dorks = await prisma.dork.findMany();
    return NextResponse.json(dorks);
  } catch (error) {
    console.error("Error fetching dorks:", error);
    return NextResponse.json({ error: "Failed to retrieve dorks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id, title, description, value, author, favorite, createdAt } = await req.json();
    const newDork = await prisma.dork.create({
      data: {  id, title, description, value, author, favorite, createdAt },
    });
    return NextResponse.json(newDork, { status: 201 });
  } catch (error) {
    console.error("Error inserting dork:", error);
    return NextResponse.json({ error: "Failed to insert dork" }, { status: 500 });
  }
}
