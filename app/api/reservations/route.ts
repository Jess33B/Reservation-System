import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {

  try {

    const body = await request.json();

    const {
      productId,
      warehouseId,
      quantity,
    } = body;

    const inventory =
      await prisma.inventory.findFirst({
        where: {
          productId,
          warehouseId,
        },
      });

    if (!inventory) {

      return Response.json(
        { error: "Inventory not found" },
        { status: 404 }
      );
    }

    const availableStock =
      inventory.totalStock -
      inventory.reservedStock;

    if (availableStock < quantity) {

      return Response.json(
        { error: "Not enough stock" },
        { status: 400 }
      );
    }

    await prisma.inventory.update({
      where: {
        id: inventory.id,
      },
      data: {
        reservedStock: {
          increment: quantity,
        },
      },
    });

    const reservation =
      await prisma.reservation.create({
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

    return Response.json(reservation);

  } catch (error) {

    console.log(error);

    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}