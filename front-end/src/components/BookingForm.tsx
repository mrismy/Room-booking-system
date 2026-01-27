import React, { useState } from "react";
import { createBooking } from "../api/api";
import { Room } from "../types/types";

interface Props {
  rooms: Room[];
  onBookingAdded: () => void;
}

const BookingForm: React.FC<Props> = ({ rooms, onBookingAdded }) => {
  const [roomId, setRoomId] = useState<number>(0);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId || !date || !startTime || !endTime)
      return alert("Fill all fields");

    await createBooking({ roomId, date, startTime, endTime });
    setRoomId(0);
    setDate("");
    setStartTime("");
    setEndTime("");
    onBookingAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Room</label>
        <select
          className="form-control"
          value={roomId}
          onChange={(e) => setRoomId(+e.target.value)}
          title="Room selection"
        >
          <option value={0}>Select Room</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name} (Cap: {room.capacity})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Date</label>
        <input
          className="form-control"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Start Time</label>
          <input
            className="form-control"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">End Time</label>
          <input
            className="form-control"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary">Book Room</button>
    </form>
  );
};

export default BookingForm;
