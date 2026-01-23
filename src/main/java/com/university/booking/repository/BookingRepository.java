package com.university.booking.repository;

import com.university.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByRoomIdAndStartTimeBetween(Long roomId, LocalDateTime start, LocalDateTime end);

    List<Booking> findByRoomIdAndEndTimeAfterAndStartTimeBefore(Long roomId, LocalDateTime start, LocalDateTime end);
}
