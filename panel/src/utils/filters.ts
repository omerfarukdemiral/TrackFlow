import { TrackingEvent } from '../types/tracking';
import { TimeFilter, EventTypeFilter } from '../types/filters';

export function filterDataByTime(data: TrackingEvent[], timeFilter: TimeFilter): TrackingEvent[] {
  if (timeFilter === 'all') return data;

  const now = Date.now();
  let timeThreshold: number;

  switch (timeFilter) {
    case '1min':
      timeThreshold = now - 60 * 1000; // 1 dakika
      break;
    case '3min':
      timeThreshold = now - 3 * 60 * 1000; // 3 dakika
      break;
    case '5min':
      timeThreshold = now - 5 * 60 * 1000; // 5 dakika
      break;
    case '1hour':
      timeThreshold = now - 60 * 60 * 1000; // 1 saat
      break;
    case '4hours':
      timeThreshold = now - 4 * 60 * 60 * 1000; // 4 saat
      break;
    case '1day':
      timeThreshold = now - 24 * 60 * 60 * 1000; // 1 gün
      break;
    default:
      return data;
  }

  return data.filter(event => event.timestamp >= timeThreshold);
}

export function filterDataByEventType(data: TrackingEvent[], eventTypeFilter: EventTypeFilter): TrackingEvent[] {
  if (eventTypeFilter === 'all') return data;
  return data.filter(event => event.event_type === eventTypeFilter);
} 