import React, { useCallback, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, View, SlotInfo, NavigateAction } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Booking } from "../types/types";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
    "en-US": enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
    getDay,
    locales,
});

interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    resource?: Booking;
}

interface Props {
    bookings: Booking[];
    onSelectSlot?: (start: Date, end: Date) => void;
    onSelectEvent?: (booking: Booking) => void;
}

const CalendarView: React.FC<Props> = ({ bookings, onSelectSlot, onSelectEvent }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState<View>("week");

    // Convert bookings to calendar events
    const events: CalendarEvent[] = useMemo(() =>
        bookings.map((booking) => ({
            id: booking.id || 0,
            title: booking.room?.name || "Room Booking",
            start: new Date(booking.startTime),
            end: new Date(booking.endTime),
            resource: booking,
        })), [bookings]
    );

    const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
        if (onSelectSlot) {
            onSelectSlot(slotInfo.start, slotInfo.end);
        }
    }, [onSelectSlot]);

    const handleSelectEvent = useCallback((event: CalendarEvent) => {
        if (onSelectEvent && event.resource) {
            onSelectEvent(event.resource);
        }
    }, [onSelectEvent]);

    const handleNavigate = useCallback((newDate: Date, view: View, action: NavigateAction) => {
        setCurrentDate(newDate);
    }, []);

    const handleViewChange = useCallback((view: View) => {
        setCurrentView(view);
    }, []);

    const eventStyleGetter = useCallback(() => {
        return {
            style: {
                backgroundColor: "#6366f1",
                borderRadius: "4px",
                opacity: 0.9,
                color: "white",
                border: "none",
                display: "block",
            },
        };
    }, []);

    const scrollToTime = useMemo(() => new Date(1970, 1, 1, 8, 0, 0), []);

    return (
        <div className="calendar-container">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                date={currentDate}
                view={currentView}
                onNavigate={handleNavigate}
                onView={handleViewChange}
                views={["month", "week", "day"]}
                scrollToTime={scrollToTime}
                eventPropGetter={eventStyleGetter}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                selectable
                popup
                step={30}
                timeslots={2}
                min={new Date(1970, 1, 1, 7, 0, 0)}
                max={new Date(1970, 1, 1, 22, 0, 0)}
            />
        </div>
    );
};

export default CalendarView;
