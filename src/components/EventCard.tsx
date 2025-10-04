import PlayButton from "./ui/PlayButton";
import { formatInTimeZone } from "date-fns-tz";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { isAfter } from "date-fns";
import { memo, useMemo, useRef, useState } from "react";
import Button from "./ui/Button";

import { minBy } from "lodash";
import Badge from "./ui/Badge";

interface EventItem {
  id: string;
  name: string;
  date: string;
  timezone: string;
  venue: string;
  location: {
    city: string;
    country: string;
  };
  event_images: {
    square: string;
    landscape: string;
  };
  description: string;
  lineup: { details: string; time?: string }[];
  ticket_types: {
    name: string;
    price: { face_value: number };
    soldout: boolean;
  }[];
  currency: string;
  apple_music_tracks?: { preview_url: string }[];
  spotify_tracks?: { preview_url: string }[];
  sale_start_date: string;
  featured: boolean;
  sold_out: boolean;
  url: string;
}

const CardImage = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} className="w-full h-auto object-cover" />
);

const DetailsSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col mt-4 gap-3">
    <h5 className="text-blue-500">{title}</h5>
    {children}
  </div>
);

const OnsaleDateBadge = ({ onSaleDate }: { onSaleDate: string }) => {
  return (
    <Badge
      text={`On sale ${onSaleDate}`}
      className="bg-slate-700 absolute bottom-2 right-2 text-xs"
    />
  );
};

const EventCard = ({ event }: { event: EventItem }) => {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const formattedDate = useMemo(
    () =>
      formatInTimeZone(
        new Date(event.date),
        event.timezone,
        "E dd MMMM - h:mmaaa"
      ),
    [event.date, event.timezone]
  );

  const audioTrack = useMemo(
    () =>
      (event.apple_music_tracks || event.spotify_tracks)?.[0]?.preview_url ??
      null,
    [event.apple_music_tracks, event.spotify_tracks]
  );

  const formattedPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: event.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price / 100);
  };

  const notOnSaleYet = useMemo(
    () => isAfter(new Date(event.sale_start_date), new Date()),
    [event.sale_start_date]
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col space-y-2 w-[320px] h-[640px] items-start gap-4">
      <div className="w-full relative">
        <CardImage
          src={
            showMoreInfo
              ? `${event.event_images.landscape}&w=320`
              : `${event.event_images.square}&w=320`
          }
          alt={`Poster for the event ${event.name} at ${event.venue}`}
        />
        {audioTrack && (
          <div>
            <audio
              className="w-full"
              ref={audioRef}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={audioTrack} type="audio/mpeg" />
            </audio>
            <PlayButton
              isPlaying={isPlaying}
              onClick={togglePlayPause}
              className="absolute bottom-0 left-0"
            />
          </div>
        )}
        {notOnSaleYet ? (
          <OnsaleDateBadge
            onSaleDate={formatInTimeZone(
              new Date(event.sale_start_date),
              event.timezone,
              "E dd MMM - h:mmaaa"
            )}
          />
        ) : event.featured ? (
          <Badge className="absolute bottom-2 right-2" text="FEATURED" />
        ) : null}
      </div>
      <div className="flex flex-col text-left w-full">
        <p className="text-gray-500">{formattedDate}</p>
        <h2 className="text-xl font-bold">{event.name}</h2>
        <h3 className="text-lg font-semibold">{event.venue}</h3>
        <h4 className="text-md font-medium">
          {event.location.city}, {event.location.country}
        </h4>
      </div>
      <div className="bg-gray-100 rounded mt-auto w-full overflow-scroll relative">
        <div className="flex justify-between items-center mb-2 font-semibold sticky top-0 left-0 bg-gray-100 w-full z-10 p-4">
          <p>More info</p>
          <button
            onClick={() => setShowMoreInfo(!showMoreInfo)}
            className="px-2"
          >
            {showMoreInfo ? "-" : "+"}
          </button>
        </div>
        {showMoreInfo && (
          <div className="p-4">
            <Markdown remarkPlugins={[remarkGfm]}>{event.description}</Markdown>
            <DetailsSection title="LINE UP">
              {event.lineup && event.lineup.length > 0 ? (
                <ul className="list-none list-inside">
                  {event.lineup.map((entry, idx) => (
                    <li key={idx}>
                      {entry.details}
                      {entry.time ? (
                        <span className="font-semibold"> - {entry.time}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No lineup announced yet.</p>
              )}
            </DetailsSection>
            <DetailsSection title="TICKETS">
              {event.ticket_types && event.ticket_types.length > 0 ? (
                <ul className="list-none list-inside">
                  {event.ticket_types.map((ticket, idx) => (
                    <li key={idx}>
                      {ticket.name} -{" "}
                      <span className="font-semibold">
                        {ticket.price.face_value === 0
                          ? "FREE"
                          : formattedPrice(ticket.price.face_value)}
                      </span>
                      {ticket.soldout ? (
                        <span className="text-grey-500 font-semibold">
                          SOLD OUT
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tickets available.</p>
              )}
            </DetailsSection>
          </div>
        )}
      </div>
      <div className="flex justify-between w-full">
        <Button
          onClick={() => window.open(event.url, "_blank")}
          disabled={event.sold_out}
        >
          {event.sold_out
            ? "SOLD OUT"
            : notOnSaleYet
            ? "GET REMINDED"
            : "BOOK NOW"}
        </Button>
        <div className="flex flex-col items-end">
          <span>From</span>
          <span className="font-semibold">
            {formattedPrice(
              minBy(
                event.ticket_types,
                (t: EventItem["ticket_types"][number]) => t.price.face_value
              )?.price.face_value ?? 0
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(EventCard);
