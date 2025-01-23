export interface TrackingEvent {
  event_type: 'mousemove' | 'click';
  timestamp: number;
  element: {
    tag: string;
    id?: string;
    class?: string;
    position: {
      x: number;
      y: number;
    }
  };
  page: {
    url: string;
    title?: string;
    viewport?: {
      width: number;
      height: number;
    };
  };
} 