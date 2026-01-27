import React from "react";
import { Booking } from "../types/types";

interface Props {
  bookings: Booking[];
}

const BookingList: React.FC<Props> = ({ bookings }) => {
  if (bookings.length === 0) {
    return <div className="empty-state">No bookings scheduled</div>;
  }

  return (
    <div className="list-group">
      {bookings.map((b) => (
        <div key={b.id} className="list-item">
          <div className="list-item-content">
            <span className="list-item-title">Room {b.roomId}</span>
            <span className="list-item-sub">{b.date} • {b.startTime} - {b.endTime}</span>
          </div>
          <span className="badge">Scheduled</span>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
