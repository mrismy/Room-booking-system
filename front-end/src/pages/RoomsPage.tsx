import React, { useEffect, useState } from "react";
import { getRooms, createRoom, updateRoom, deleteRoom } from "../api/api";
import { Room } from "../types/types";
import RoomForm from "../components/RoomForm";
import RoomList from "../components/RoomList";
import Header from "../components/Header";
import Modal from "../components/Modal";

const RoomsPage: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [editName, setEditName] = useState("");
    const [editCapacity, setEditCapacity] = useState(0);

    const loadData = async () => {
        try {
            const data = await getRooms();
            setRooms(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleEdit = (room: Room) => {
        setEditingRoom(room);
        setEditName(room.name);
        setEditCapacity(room.capacity);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRoom?.id) return;

        try {
            await updateRoom(editingRoom.id, { name: editName, capacity: editCapacity });
            setEditingRoom(null);
            loadData();
        } catch (error) {
            console.error("Failed to update room:", error);
            alert("Failed to update room");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;

        try {
            await deleteRoom(id);
            loadData();
        } catch (error) {
            console.error("Failed to delete room:", error);
            alert("Failed to delete room. It may have bookings associated.");
        }
    };

    return (
        <div className="container">
            <Header title="Lecture Rooms" subtitle="Manage university rooms" />

            <div className="card">
                <div className="card-title">
                    <span>Rooms</span>
                    <span className="badge">{rooms.length} Active</span>
                </div>
                <RoomForm onRoomAdded={loadData} />
                <div style={{ marginTop: '2rem' }}>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <RoomList
                            rooms={rooms}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>

            {/* Edit Room Modal */}
            <Modal
                isOpen={editingRoom !== null}
                onClose={() => setEditingRoom(null)}
                title="Edit Room"
            >
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label className="form-label">Room Name</label>
                        <input
                            className="form-control"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Capacity</label>
                        <input
                            type="number"
                            className="form-control"
                            value={editCapacity}
                            onChange={(e) => setEditCapacity(+e.target.value)}
                            required
                            min={1}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditingRoom(null)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default RoomsPage;
