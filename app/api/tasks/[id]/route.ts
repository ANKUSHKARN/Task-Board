import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookie } from "@/lib/auth";
import { updateTaskSchema } from "@/lib/validations";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserIdFromCookie();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const body = await req.json();

    const parsed =
      updateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!task) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    const updatedTask =
      await prisma.task.update({
        where: { id },
        data: {
          status: parsed.data.status,
        },
      });

    return NextResponse.json(updatedTask);
  } catch {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}