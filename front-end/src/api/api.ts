const BASE_URL = "http://localhost:8080/api";

export const getRooms = async () => {
  const res = await fetch(`${BASE_URL}/rooms`);
  return res.json();
};

export const createRoom = async (room: any) => {
  const res = await fetch(`${BASE_URL}/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(room),
  });
  return res.json();
};

export const getBookings = async () => {
  const res = await fetch(`${BASE_URL}/bookings`);
  return res.json();
};

export const createBooking = async (booking: any) => {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
  return res.json();
};
