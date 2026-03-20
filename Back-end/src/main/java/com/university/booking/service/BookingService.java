package com.university.booking.service;

import com.university.booking.entity.Booking;
import com.university.booking.entity.Room;
import com.university.booking.event.BookingCreatedEvent;
import com.university.booking.repository.BookingRepository;
import com.university.booking.repository.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

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

        // Step 1: Database operation completes successfully
        Booking savedBooking = bookingRepository.save(booking);
        logger.info("========== EVENT PRODUCER ==========");
        logger.info("[Producer] Thread: {} | Booking saved successfully (ID: {})",
                Thread.currentThread().getName(), savedBooking.getId());

        // Step 2: Publish domain event AFTER DB commit
        BookingCreatedEvent event = new BookingCreatedEvent(
                savedBooking.getId(),
                room.getName(),
                savedBooking.getBookedBy(),
                savedBooking.getStartTime(),
                savedBooking.getEndTime()
        );
        eventPublisher.publishEvent(event);
        logger.info("[Producer] Thread: {} | BookingCreatedEvent published to Event Bus",
                Thread.currentThread().getName());

        // Step 3: API returns response immediately without waiting for consumer
        logger.info("[Producer] Thread: {} | Returning API response to client NOW (consumer processes async)",
                Thread.currentThread().getName());
        logger.info("========== PRODUCER COMPLETE ==========");

        return savedBooking;
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
