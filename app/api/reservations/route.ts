import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest
) {

  try {

    const body = await request.json();

    const {
      productId,
      warehouseId,
      quantity,
    } = body;

    // VALIDATION

    if (
      !productId ||
      !warehouseId ||
      !quantity
    ) {

      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    // TRANSACTION

    const reservation =
      await prisma.$transaction(async (tx) => {

        // FIND INVENTORY

        const inventory =
          await tx.inventory.findFirst({
            where: {
              productId,
              warehouseId,
            },
          });

        if (!inventory) {

          throw new Error(
            "INVENTORY_NOT_FOUND"
          );
        }

        // AVAILABLE STOCK

        const availableStock =
          inventory.totalStock -
          inventory.reservedStock;

        if (
          availableStock < quantity
        ) {

          throw new Error(
            "OUT_OF_STOCK"
          );
        }

        // CONCURRENCY SAFE UPDATE

        const updatedInventory =
          await tx.inventory.updateMany({
            where: {
              id: inventory.id,

              reservedStock:
                inventory.reservedStock,
            },

            data: {
              reservedStock: {
                increment: quantity,
              },
            },
          });

        // RACE CONDITION CHECK

        if (
          updatedInventory.count === 0
        ) {

          throw new Error(
            "RACE_CONDITION"
          );
        }

        // CREATE RESERVATION

        const reservation =
          await tx.reservation.create({
            data: {
              productId,
              warehouseId,
              quantity,

              status: "PENDING",

              expiresAt: new Date(
                Date.now() +
                  10 * 60 * 1000
              ),
            },
          });

        return reservation;
      });

    return NextResponse.json(
      reservation
    );

  } catch (error) {

    console.error(error);

    const err = error as Error;

    // OUT OF STOCK

    if (
      err.message ===
      "OUT_OF_STOCK"
    ) {

      return NextResponse.json(
        {
          error:
            "Not enough stock available",
        },
        {
          status: 409,
        }
      );
    }

    // INVENTORY NOT FOUND

    if (
      err.message ===
      "INVENTORY_NOT_FOUND"
    ) {

      return NextResponse.json(
        {
          error:
            "Inventory not found",
        },
        {
          status: 404,
        }
      );
    }

    // RACE CONDITION

    if (
      err.message ===
      "RACE_CONDITION"
    ) {

      return NextResponse.json(
        {
          error:
            "Another user reserved the stock first. Try again.",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          "Failed to create reservation",
      },
      {
        status: 500,
      }
    );
  }
}