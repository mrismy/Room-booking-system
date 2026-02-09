package com.university.booking.service;

import com.university.booking.entity.Booking;
import com.university.booking.entity.Room;
import com.university.booking.repository.BookingRepository;
import com.university.booking.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking createBooking(Booking booking) {
        // Validate room exists
        Room room = roomRepository.findById(booking.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        booking.setRoom(room);

        // Check availability
        List<Booking> overlappingBookings = bookingRepository.findByRoomIdAndEndTimeAfterAndStartTimeBefore(
                room.getId(), booking.getStartTime(), booking.getEndTime());

        if (!overlappingBookings.isEmpty()) {
            throw new RuntimeException("Room is already booked for the selected time slot.");
        }

        return bookingRepository.save(booking);
    }

    public Booking updateBooking(Long id, Booking bookingDetails) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        // Validate room exists
        Room room = roomRepository.findById(bookingDetails.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        
        // Check availability (exclude current booking)
        List<Booking> overlappingBookings = bookingRepository.findByRoomIdAndEndTimeAfterAndStartTimeBefore(
                room.getId(), bookingDetails.getStartTime(), bookingDetails.getEndTime());
        
        overlappingBookings.removeIf(b -> b.getId().equals(id));
        
        if (!overlappingBookings.isEmpty()) {
            throw new RuntimeException("Room is already booked for the selected time slot.");
        }

        booking.setRoom(room);
        booking.setStartTime(bookingDetails.getStartTime());
        booking.setEndTime(bookingDetails.getEndTime());
        booking.setBookedBy(bookingDetails.getBookedBy());

        return bookingRepository.save(booking);
    }

    public Booking deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found");
        }
        Booking booking = bookingRepository.findById(id).get();
        bookingRepository.delete(booking);
        return booking;
    }
}
