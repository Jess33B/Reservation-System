import { prisma } from "../../../lib/prisma";

export async function GET() {

  const inventories = await prisma.inventory.findMany({
    include: {
      product: true,
      warehouse: true,
    },
  });

  const formattedData = inventories.map((item) => ({
    productId: item.productId,
    warehouseId: item.warehouseId,

    product: item.product.name,
    warehouse: item.warehouse.name,

    totalStock: item.totalStock,
    reservedStock: item.reservedStock,
    availableStock:
      item.totalStock - item.reservedStock,
  }));

  return Response.json(formattedData);
}