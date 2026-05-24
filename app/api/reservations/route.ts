import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {

  try {

    const body = await request.json();

    const {
      productId,
      warehouseId,
      quantity,
    } = body;

    const reservation =
      await prisma.$transaction(async (tx) => {

        const inventory =
          await tx.inventory.findFirst({
            where: {
              productId,
              warehouseId,
            },
          });

        if (!inventory) {

          throw new Error("Inventory not found");
        }

        const availableStock =
          inventory.totalStock -
          inventory.reservedStock;

        if (availableStock < quantity) {

          throw new Error("Not enough stock");
        }

        const updatedInventory =
          await tx.inventory.updateMany({
            where: {
              id: inventory.id,
              reservedStock: inventory.reservedStock,
            },
            data: {
              reservedStock: {
                increment: quantity,
              },
            },
          });

        if (updatedInventory.count === 0) {

          throw new Error(
            "Race condition detected. Try again."
          );
        }

        const reservation =
          await tx.reservation.create({
            data: {
              productId,
              warehouseId,
              quantity,
              status: "pending",
              expiresAt: new Date(
                Date.now() + 10 * 60 * 1000
              ),
            },
          });

        return reservation;
      });

    return Response.json(reservation);

  } catch (error) {

    const err = error as Error;

    return Response.json(
      {
        error: err.message || "Something went wrong",
      },
      {
        status: 400,
      }
    );
  }
}