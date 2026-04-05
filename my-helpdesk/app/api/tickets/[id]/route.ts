import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const ticketId = Number(id);

    if (!ticketId || Number.isNaN(ticketId)) {
      return NextResponse.json(
        { error: "Invalid ticket id" },
        { status: 400 }
      );
    }

    // Delete messages first (foreign key constraint)
    await prisma.message.deleteMany({
      where: { ticket_id: ticketId },
    });

    await prisma.ticket.delete({
      where: { id: ticketId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Ticket DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}