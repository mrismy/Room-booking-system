package com.university.booking.controller;

import com.university.booking.entity.Booking;
import com.university.booking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            Booking newBooking = bookingService.createBooking(booking);
            return ResponseEntity.ok(newBooking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Booking> deleteBooking(@PathVariable Long id) {
        try {
            Booking deletedBooking = bookingService.deleteBooking(id);
            return ResponseEntity.ok(deletedBooking);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
