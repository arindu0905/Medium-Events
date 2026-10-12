import React from 'react';
import { EventMarquee } from '../components/EventMarquee';
import { EventsSection } from '../components/EventsSection';
import { PastEventsSection } from '../components/PastEventsSection';
import { useMarqueeEventModal } from '../hooks/useMarqueeEventModal';

export default function EventsPage() {
  const { onSelectEvent, modal } = useMarqueeEventModal();
  return (
    <div className="pt-20">
      {/* Moving Ticker under header */}
      <EventMarquee onSelectEvent={onSelectEvent} />
      <EventsSection />
      <PastEventsSection />
      {modal}
    </div>
  );
}
