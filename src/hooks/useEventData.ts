import { useMemo } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { isAfter } from "date-fns";
import { minBy } from "lodash";
import type { EventItem } from "../components/EventCard";

export const useEventData = (event: EventItem) => {
  const { date, timezone, currency, sale_start_date, sold_out, ticket_types } =
    event;

  const formattedDate = useMemo(
    () => formatInTimeZone(new Date(date), timezone, "E dd MMMM - h:mmaaa"),
    [date, timezone]
  );

  const notOnSaleYet = isAfter(new Date(sale_start_date), new Date());

  const buttonText = useMemo(() => {
    if (sold_out) return "SOLD OUT";
    if (notOnSaleYet) return "GET REMINDED";
    return "BOOK NOW";
  }, [sold_out, notOnSaleYet]);

  const formattedPrice = useMemo(() => {
    const formatter = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return (price: number) => {
      const formattedString = formatter.format(price / 100);
      return formattedString.replace(/\.00$/, "");
    };
  }, [currency]);

  const cheapestPrice = useMemo(() => {
    const faceValue =
      minBy(ticket_types, (t) => t.price.face_value)?.price.face_value ?? 0;
    return formattedPrice(faceValue);
  }, [ticket_types, formattedPrice]);

  const onSaleDateFormatted = useMemo(() => {
    return formatInTimeZone(
      new Date(sale_start_date),
      timezone,
      "E dd MMM - h:mmaaa"
    );
  }, [sale_start_date, timezone]);

  const audioTrack = useMemo(
    () =>
      (event.apple_music_tracks?.[0]?.preview_url ||
        event.spotify_tracks?.[0]?.preview_url) ??
      null,
    [event.apple_music_tracks, event.spotify_tracks]
  );

  return {
    formattedDate,
    notOnSaleYet,
    buttonText,
    cheapestPrice,
    formattedPrice,
    onSaleDateFormatted,
    audioTrack,
  };
};
