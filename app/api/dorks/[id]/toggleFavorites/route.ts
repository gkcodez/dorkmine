import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, context: any) {
  try {
      const { id } = context.params;
  
      if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
      }

      const dork = await prisma.dork.findUnique({ where: { id } });

      if (!dork) {
        return NextResponse.json({ error: "Dork not found" }, { status: 404 });
      }
  
      // Toggle the favorite value
      const updatedDork = await prisma.dork.update({
        where: { id },
        data: { favorite: !dork.favorite },
      });
  
      return NextResponse.json(updatedDork);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  