import React, { useEffect, useState } from "react";
import { getRooms, getBookings, createBooking, updateBooking, deleteBooking } from "../api/api";
import { Room, Booking } from "../types/types";
import BookingForm from "../components/BookingForm";
import BookingList from "../components/BookingList";
import CalendarView from "../components/CalendarView";
import Header from "../components/Header";
import Modal from "../components/Modal";

type ViewMode = "list" | "calendar";

interface BookingFormData {
    roomId: number;
    date: string;
    startTime: string;
    endTime: string;
}

const BookingsPage: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>("list");

    // Edit modal state
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
    const [editForm, setEditForm] = useState<BookingFormData>({
        roomId: 0,
        date: "",
        startTime: "",
        endTime: ""
    });

    // New booking from calendar slot
    const [showNewBookingModal, setShowNewBookingModal] = useState(false);
    const [newBookingForm, setNewBookingForm] = useState<BookingFormData>({
        roomId: 0,
        date: "",
        startTime: "",
        endTime: ""
    });

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

    // Extract date and time from ISO datetime string
    const extractDateTime = (isoString: string) => {
        const date = new Date(isoString);
        return {
            date: date.toISOString().split('T')[0],
            time: date.toTimeString().slice(0, 5)
        };
    };

    const handleEdit = (booking: Booking) => {
        const start = extractDateTime(booking.startTime);
        const end = extractDateTime(booking.endTime);

        setEditingBooking(booking);
        setEditForm({
            roomId: booking.room?.id || 0,
            date: start.date,
            startTime: start.time,
            endTime: end.time
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBooking?.id) return;

        try {
            await updateBooking(editingBooking.id, editForm);
            setEditingBooking(null);
            loadData();
        } catch (error) {
            console.error("Failed to update booking:", error);
            alert("Failed to update booking. The room might be occupied.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this booking?")) return;

        try {
            await deleteBooking(id);
            loadData();
        } catch (error) {
            console.error("Failed to delete booking:", error);
            alert("Failed to delete booking");
        }
    };

    // Handle calendar slot selection
    const handleSlotSelect = (start: Date, end: Date) => {
        const formatDate = (d: Date) => d.toISOString().split('T')[0];
        const formatTime = (d: Date) => d.toTimeString().slice(0, 5);

        setNewBookingForm({
            roomId: rooms[0]?.id || 0,
            date: formatDate(start),
            startTime: formatTime(start),
            endTime: formatTime(end)
        });
        setShowNewBookingModal(true);
    };

    // Handle calendar event click (edit)
    const handleEventClick = (booking: Booking) => {
        handleEdit(booking);
    };

    const handleNewBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBookingForm.roomId) {
            alert("Please select a room");
            return;
        }

        try {
            await createBooking(newBookingForm);
            setShowNewBookingModal(false);
            loadData();
        } catch (error) {
            console.error("Failed to create booking:", error);
            alert("Failed to create booking. The room might be occupied.");
        }
    };

    return (
        <div className="container">
            <Header title="Bookings" subtitle="Schedule lectures" />

            <div className="card">
                <div className="card-title">
                    <span>Bookings</span>
                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
                            onClick={() => setViewMode("list")}
                        >
                            📋 List
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === "calendar" ? "active" : ""}`}
                            onClick={() => setViewMode("calendar")}
                        >
                            📅 Calendar
                        </button>
                        <span className="badge">{bookings.length} Scheduled</span>
                    </div>
                </div>

                {viewMode === "list" && (
                    <>
                        <BookingForm rooms={rooms} onBookingAdded={loadData} />
                        <div style={{ marginTop: '2rem' }}>
                            {loading ? (
                                <div>Loading...</div>
                            ) : (
                                <BookingList
                                    bookings={bookings}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            )}
                        </div>
                    </>
                )}

                {viewMode === "calendar" && (
                    <div style={{ marginTop: '1rem' }}>
                        <p className="calendar-hint">💡 Click and drag on the calendar to create a new booking</p>
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <CalendarView
                                bookings={bookings}
                                onSelectSlot={handleSlotSelect}
                                onSelectEvent={handleEventClick}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Edit Booking Modal */}
            <Modal
                isOpen={editingBooking !== null}
                onClose={() => setEditingBooking(null)}
                title="Edit Booking"
            >
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label className="form-label">Room</label>
                        <select
                            className="form-control"
                            value={editForm.roomId}
                            onChange={(e) => setEditForm({ ...editForm, roomId: +e.target.value })}
                            required
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
                            type="date"
                            className="form-control"
                            value={editForm.date}
                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Start Time</label>
                            <input
                                type="time"
                                className="form-control"
                                value={editForm.startTime}
                                onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">End Time</label>
                            <input
                                type="time"
                                className="form-control"
                                value={editForm.endTime}
                                onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditingBooking(null)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>

            {/* New Booking from Calendar Modal */}
            <Modal
                isOpen={showNewBookingModal}
                onClose={() => setShowNewBookingModal(false)}
                title="New Booking"
            >
                <form onSubmit={handleNewBookingSubmit}>
                    <div className="form-group">
                        <label className="form-label">Room</label>
                        <select
                            className="form-control"
                            value={newBookingForm.roomId}
                            onChange={(e) => setNewBookingForm({ ...newBookingForm, roomId: +e.target.value })}
                            required
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
                            type="date"
                            className="form-control"
                            value={newBookingForm.date}
                            onChange={(e) => setNewBookingForm({ ...newBookingForm, date: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Start Time</label>
                            <input
                                type="time"
                                className="form-control"
                                value={newBookingForm.startTime}
                                onChange={(e) => setNewBookingForm({ ...newBookingForm, startTime: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">End Time</label>
                            <input
                                type="time"
                                className="form-control"
                                value={newBookingForm.endTime}
                                onChange={(e) => setNewBookingForm({ ...newBookingForm, endTime: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowNewBookingModal(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Create Booking
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default BookingsPage;
