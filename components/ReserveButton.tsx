"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  productId: number;
  warehouseId: number;
  availableStock: number;
};

export default function ReserveButton({
  productId,
  warehouseId,
  availableStock,
}: Props) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [reservationId, setReservationId] =
    useState<number | null>(null);

  async function reserveProduct() {

    try {

      setLoading(true);

      setMessage("");

      const response = await fetch(
        "http://localhost:3000/api/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            warehouseId,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setMessage(data.error || "Something failed");

      } else {

        setMessage("Reservation successful");

        setReservationId(data.id);

        setTimeout(() => {
          router.refresh();
        }, 500);
      }

    } catch (error) {

      setMessage("Something went wrong");

    } finally {

      setLoading(false);
    }
  }

  async function confirmReservation() {

    if (!reservationId) return;

    try {

      const response = await fetch(
        `http://localhost:3000/api/reservations/${reservationId}/confirm`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {

        setMessage("Confirm failed");

      } else {

        setMessage("Reservation confirmed");

        setReservationId(null);

        router.refresh();
      }

    } catch (error) {

      setMessage("Something went wrong");
    }
  }

  async function cancelReservation() {

    if (!reservationId) return;

    try {

      const response = await fetch(
        `http://localhost:3000/api/reservations/${reservationId}/release`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {

        setMessage("Release failed");

      } else {

        setMessage("Reservation cancelled");

        setReservationId(null);

        router.refresh();
      }

    } catch (error) {

      setMessage("Something went wrong");
    }
  }

  return (
    <div>

      <button
        onClick={reserveProduct}
        disabled={loading || availableStock === 0}
        style={{
          padding: "10px 20px",
          marginTop: "10px",
          cursor: "pointer",
          backgroundColor:
            availableStock === 0 ? "#999" : "#000",
          color: "white",
          border: "none",
          borderRadius: "6px",
        }}
      >
        {
          availableStock === 0
            ? "Out of Stock"
            : loading
            ? "Reserving..."
            : "Reserve"
        }
      </button>

      {message && (
        <p style={{ marginTop: "10px" }}>
          {message}
        </p>
      )}

      {reservationId && (

        <div style={{ marginTop: "15px" }}>

          <p>
            Reservation Active
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
            }}
          >

            <button
              onClick={confirmReservation}
              style={{
                padding: "8px 16px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Confirm
            </button>

            <button
              onClick={cancelReservation}
              style={{
                padding: "8px 16px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

          </div>

        </div>
      )}

    </div>
  );
}