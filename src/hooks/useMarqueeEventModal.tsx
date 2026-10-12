import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { EventModal } from '../components/EventModal';
import { FLAGSHIP_EVENTS_DATA } from '../data/websiteData';
import { FlagshipEvent } from '../types';
import { pathFor } from '../routes';

// Marquee tiles open the matching event's details; unknown ids fall back to the events page
export function useMarqueeEventModal() {
  const navigate = useNavigate();
  const [event, setEvent] = useState<FlagshipEvent | null>(null);

  const onSelectEvent = (eventId: string) => {
    const matched = FLAGSHIP_EVENTS_DATA.find((e) => e.id === eventId);
    if (matched) setEvent(matched);
    else navigate(pathFor('events'));
  };

  const modal = <EventModal event={event} onClose={() => setEvent(null)} />;
  return { onSelectEvent, modal };
}
