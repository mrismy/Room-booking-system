import React from "react";
import { Room } from "../types/types";

interface Props {
  rooms: Room[];
}

const RoomList: React.FC<Props> = ({ rooms }) => {
  if (rooms.length === 0) {
    return <div className="empty-state">No rooms available</div>;
  }

  return (
    <div className="list-group">
      {rooms.map((room) => (
        <div key={room.id} className="list-item">
          <div className="list-item-content">
            <span className="list-item-title">{room.name}</span>
            <span className="list-item-sub">Max Capacity: {room.capacity}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomList;
