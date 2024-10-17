import ReactGA from "react-ga4";

type EventCategory = "checkout";

type Event = {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
};

export function logAnalyticsEvent({
  category,
  action,
  label,
  value,
  nonInteraction,
}: Event) {
  ReactGA.event({
    category,
    action,
    label,
    value,
    nonInteraction,
  });
}
