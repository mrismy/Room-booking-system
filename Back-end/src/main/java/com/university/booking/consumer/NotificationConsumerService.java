package com.university.booking.consumer;

import com.university.booking.event.BookingCreatedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Consumer Service: Notification Consumer
 *
 * This independent service subscribes to BookingCreatedEvent and processes
 * notifications asynchronously. It runs on a separate thread pool and does
 * NOT block the main API thread.
 *
 * If this consumer fails or is stopped, the main booking API continues
 * to function normally — demonstrating loose coupling via EDA.
 */
@Service
public class NotificationConsumerService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationConsumerService.class);

    @Async("eventExecutor")
    @EventListener
    public void handleBookingCreatedEvent(BookingCreatedEvent event) {
        logger.info("========== NOTIFICATION CONSUMER ==========");
        logger.info("[Consumer] Thread: {} | Received event: {}",
                Thread.currentThread().getName(), event.getEventName());
        logger.info("[Consumer] Booking ID: {} | Room: {} | Booked By: {}",
                event.getBookingId(), event.getRoomName(), event.getBookedBy());
        logger.info("[Consumer] Time Slot: {} to {}", event.getStartTime(), event.getEndTime());
        logger.info("[Consumer] Event Timestamp: {}", event.getTimestamp());

        // Simulate notification processing (e.g., sending email confirmation)
        logger.info("[Consumer] Sending email notification to {}...", event.getBookedBy());
        try {
            Thread.sleep(2000); // Simulate 2-second processing delay
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            logger.error("[Consumer] Notification processing interrupted", e);
        }

        logger.info("[Consumer] Email notification sent successfully for Booking ID: {}",
                event.getBookingId());
        logger.info("[Consumer] Full event payload: {}", event);
        logger.info("========== CONSUMER PROCESSING COMPLETE ==========");
    }
}
