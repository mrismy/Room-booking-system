import React from "react";
import { Booking } from "../types/types";

interface Props {
  bookings: Booking[];
  onEdit: (booking: Booking) => void;
  onDelete: (id: number) => void;
}

const formatDateTime = (dateTimeStr: string) => {
  const date = new Date(dateTimeStr);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};

const BookingList: React.FC<Props> = ({ bookings, onEdit, onDelete }) => {
  if (bookings.length === 0) {
    return <div className="empty-state">No bookings scheduled</div>;
  }

  return (
    <div className="list-group">
      {bookings.map((b) => {
        const start = formatDateTime(b.startTime);
        const end = formatDateTime(b.endTime);
        return (
          <div key={b.id} className="list-item">
            <div className="list-item-content">
              <span className="list-item-title">{b.room?.name || 'Unknown Room'}</span>
              <span className="list-item-sub">
                {start.date} • {start.time} - {end.time}
              </span>
              {b.bookedBy && (
                <span className="list-item-sub">Booked by: {b.bookedBy}</span>
              )}
            </div>
            <div className="list-item-actions">
              <button
                className="btn-icon btn-edit"
                onClick={() => onEdit(b)}
                title="Edit booking"
              >
                ✏️
              </button>
              <button
                className="btn-icon btn-delete"
                onClick={() => b.id && onDelete(b.id)}
                title="Delete booking"
              >
                🗑️
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookingList;
