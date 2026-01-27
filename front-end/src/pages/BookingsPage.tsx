import React, { useEffect, useState } from "react";
import { getRooms, getBookings } from "../api/api";
import { Room, Booking } from "../types/types";
import BookingForm from "../components/BookingForm";
import BookingList from "../components/BookingList";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BookingsPage: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth();

    const loadData = async () => {
        try {
            const [roomsData, bookingsData] = await Promise.all([
                getRooms(),
                getBookings(),
            ]);
            setRooms(roomsData);
            setBookings(bookingsData);
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
                    <h1>Bookings</h1>
                    <p>Schedule lectures</p>
                </div>
                <div>
                    <Link to="/rooms" className="btn btn-primary" style={{ marginRight: '1rem', width: 'auto' }}>Go to Rooms</Link>
                    <button onClick={logout} className="btn" style={{ width: 'auto', backgroundColor: '#e2e8f0' }}>Logout</button>
                </div>
            </div>

            <div className="card">
                <div className="card-title">
                    <span>Bookings</span>
                    <span className="badge">{bookings.length} Scheduled</span>
                </div>
                <BookingForm rooms={rooms} onBookingAdded={loadData} />
                <div style={{ marginTop: '2rem' }}>
                    {loading ? <div>Loading...</div> : <BookingList bookings={bookings} />}
                </div>
            </div>
        </div>
    );
};

export default BookingsPage;
