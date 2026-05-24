import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  // DELETE OLD DATA

  await prisma.reservation.deleteMany();

  await prisma.inventory.deleteMany();

  await prisma.product.deleteMany();

  await prisma.warehouse.deleteMany();

  // CREATE WAREHOUSES

  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: "Chennai Warehouse",
    },
  });

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: "Bangalore Warehouse",
    },
  });

  // CREATE PRODUCTS

  const product1 = await prisma.product.create({
    data: {
      name: "iPhone 15",
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "AirPods Pro",
    },
  });

  // CREATE INVENTORY

  await prisma.inventory.createMany({
    data: [
      {
        productId: product1.id,
        warehouseId: warehouse1.id,
        totalStock: 10,
        reservedStock: 0,
      },
      {
        productId: product1.id,
        warehouseId: warehouse2.id,
        totalStock: 5,
        reservedStock: 0,
      },
      {
        productId: product2.id,
        warehouseId: warehouse1.id,
        totalStock: 20,
        reservedStock: 0,
      },
    ],
  });

  console.log("Seed data inserted");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });