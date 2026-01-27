import React, { useEffect, useState } from "react";
import { getRooms } from "../api/api";
import { Room } from "../types/types";
import RoomForm from "../components/RoomForm";
import RoomList from "../components/RoomList";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoomsPage: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth();

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

    return (
        <div className="container">
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Lecture Rooms</h1>
                    <p>Manage university rooms</p>
                </div>
                <div>
                    <Link to="/bookings" className="btn btn-primary" style={{ marginRight: '1rem', width: 'auto' }}>Go to Bookings</Link>
                    <button onClick={logout} className="btn" style={{ width: 'auto', backgroundColor: '#e2e8f0' }}>Logout</button>
                </div>
            </div>

            <div className="card">
                <div className="card-title">
                    <span>Rooms</span>
                    <span className="badge">{rooms.length} Active</span>
                </div>
                <RoomForm onRoomAdded={loadData} />
                <div style={{ marginTop: '2rem' }}>
                    {loading ? <div>Loading...</div> : <RoomList rooms={rooms} />}
                </div>
            </div>
        </div>
    );
};

export default RoomsPage;
