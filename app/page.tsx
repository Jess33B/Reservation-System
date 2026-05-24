import ReserveButton from "@/components/ReserveButton";

async function getProducts() {

  const res = await fetch(
    "http://localhost:3000/api/products",
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function Home() {

  const products = await getProducts();

  return (
    <main
      style={{
        padding: "40px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >

      <h1
        style={{
          fontSize: "32px",
          marginBottom: "30px",
        }}
      >
        Inventory System
      </h1>

      <div style={{ marginTop: "20px" }}>

        {products.map((item: any, index: number) => (

          <div
            key={index}
            style={{
              backgroundColor: "white",
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "12px",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
            }}
          >

            <h2
              style={{
                fontSize: "24px",
                marginBottom: "10px",
              }}
            >
              {item.product}
            </h2>

            <p>
              <strong>Warehouse:</strong> {item.warehouse}
            </p>

            <p>
              <strong>Total Stock:</strong> {item.totalStock}
            </p>

            <p>
              <strong>Reserved Stock:</strong> {item.reservedStock}
            </p>

            <p>
              <strong>Available Stock:</strong> {item.availableStock}
            </p>

            <ReserveButton
            productId={item.productId}
            warehouseId={item.warehouseId}
            availableStock={item.availableStock}
            />

          </div>
        ))}

      </div>

    </main>
  );
}