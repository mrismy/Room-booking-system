import React from "react";
import { Room } from "../types/types";

interface Props {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (id: number) => void;
}

const RoomList: React.FC<Props> = ({ rooms, onEdit, onDelete }) => {
  if (rooms.length === 0) {
    return <div className="empty-state">No rooms available</div>;
  }

  return (
    <div className="list-group">
      {rooms.map((room) => (
        <div key={room.id} className="list-item">
          <div className="list-item-content">
            <span className="list-item-title">{room.name}</span>
            <span className="list-item-sub">Capacity: {room.capacity}</span>
          </div>
          <div className="list-item-actions">
            <button
              className="btn-icon btn-edit"
              onClick={() => onEdit(room)}
              title="Edit room"
            >
              ✏️
            </button>
            <button
              className="btn-icon btn-delete"
              onClick={() => room.id && onDelete(room.id)}
              title="Delete room"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomList;
