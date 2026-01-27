import React, { useState } from "react";
import { createRoom } from "../api/api";
import { Room } from "../types/types";

interface Props {
  onRoomAdded: () => void;
}

const RoomForm: React.FC<Props> = ({ onRoomAdded }) => {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || capacity <= 0) return alert("Enter valid data");

    const newRoom: Room = { name, capacity };
    await createRoom(newRoom);
    setName("");
    setCapacity(0);
    onRoomAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Room Name</label>
        <input
          className="form-control"
          placeholder="e.g. Lecture Hall A"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Capacity</label>
        <input
          type="number"
          className="form-control"
          placeholder="e.g. 50"
          value={capacity}
          onChange={(e) => setCapacity(+e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">Add Room</button>
    </form>
  );
};

export default RoomForm;
