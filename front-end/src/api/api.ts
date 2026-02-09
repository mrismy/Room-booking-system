const BASE_URL = "http://localhost:8080/api";

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('accessToken');
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// Helper function to handle response
const handleResponse = async (res: Response) => {
  if (res.status === 401) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  return res.json();
};

// ==================== ROOMS ====================

export const getRooms = async () => {
  const res = await fetch(`${BASE_URL}/rooms`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const createRoom = async (room: { name: string; capacity: number }) => {
  const res = await fetch(`${BASE_URL}/rooms`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(room),
  });
  return handleResponse(res);
};

export const updateRoom = async (id: number, room: { name: string; capacity: number }) => {
  const res = await fetch(`${BASE_URL}/rooms/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(room),
  });
  return handleResponse(res);
};

export const deleteRoom = async (id: number) => {
  const res = await fetch(`${BASE_URL}/rooms/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

// ==================== BOOKINGS ====================

export const getBookings = async () => {
  const res = await fetch(`${BASE_URL}/bookings`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const createBooking = async (booking: {
  roomId: number;
  date: string;
  startTime: string;
  endTime: string;
}) => {
  const payload = {
    room: { id: booking.roomId },
    startTime: `${booking.date}T${booking.startTime}:00`,
    endTime: `${booking.date}T${booking.endTime}:00`,
  };

  const res = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const updateBooking = async (
  id: number,
  booking: { roomId: number; date: string; startTime: string; endTime: string }
) => {
  const payload = {
    room: { id: booking.roomId },
    startTime: `${booking.date}T${booking.startTime}:00`,
    endTime: `${booking.date}T${booking.endTime}:00`,
  };

  const res = await fetch(`${BASE_URL}/bookings/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const deleteBooking = async (id: number) => {
  const res = await fetch(`${BASE_URL}/bookings/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};
