export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
export const GA_PROPERTY_ID = process.env.NEXT_PUBLIC_GA_PROPERTY_ID || "";

export const pageview = (url: string, title: string) => {
  //@ts-ignore
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_location: url,
    page_title: title,
  });
};

export const event = ({ action, category, label, value }: { action: string; category: string; label: string; value: string }) => {
  //@ts-ignore
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};