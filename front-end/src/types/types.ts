export interface Room {
  id?: number;
  name: string;
  capacity: number;
}

export interface Booking {
  id?: number;
  roomId: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}
