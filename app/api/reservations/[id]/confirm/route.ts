import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {

  const params = await context.params;

  const reservationId = Number(params.id);

  const reservation = await prisma.reservation.findUnique({
    where: {
      id: reservationId,
    },
  });

  if (!reservation) {

    return Response.json(
      { error: "Reservation not found" },
      { status: 404 }
    );
  }

  const updatedReservation =
    await prisma.reservation.update({
      where: {
        id: reservationId,
      },
      data: {
        status: "confirmed",
      },
    });

  return Response.json(updatedReservation);
}