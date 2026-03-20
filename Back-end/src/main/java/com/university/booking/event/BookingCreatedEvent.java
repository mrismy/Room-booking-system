package com.university.booking.event;

import java.time.LocalDateTime;

/**
 * Domain event representing a successful room booking creation.
 * Published by the BookingService (producer) after the booking is persisted.
 * Contains event metadata as required by the lab specification.
 */
public class BookingCreatedEvent {

    private final String eventName;
    private final Long bookingId;
    private final String roomName;
    private final String bookedBy;
    private final LocalDateTime startTime;
    private final LocalDateTime endTime;
    private final LocalDateTime timestamp;

    public BookingCreatedEvent(Long bookingId, String roomName, String bookedBy,
                                LocalDateTime startTime, LocalDateTime endTime) {
        this.eventName = "BOOKING_CREATED";
        this.bookingId = bookingId;
        this.roomName = roomName;
        this.bookedBy = bookedBy;
        this.startTime = startTime;
        this.endTime = endTime;
        this.timestamp = LocalDateTime.now();
    }

    public String getEventName() {
        return eventName;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public String getRoomName() {
        return roomName;
    }

    public String getBookedBy() {
        return bookedBy;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    @Override
    public String toString() {
        return "BookingCreatedEvent{" +
                "eventName='" + eventName + '\'' +
                ", bookingId=" + bookingId +
                ", roomName='" + roomName + '\'' +
                ", bookedBy='" + bookedBy + '\'' +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", timestamp=" + timestamp +
                '}';
    }
}
