import PlayButton from "./ui/PlayButton";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { memo, useState } from "react";
import Button from "./ui/Button";
import Badge from "./ui/Badge";

import { useEventData } from "../hooks/useEventData";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

export interface EventItem {
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

interface EventDetailsProps {
  date: string;
  name: string;
  venue: string;
  city: string;
  country: string;
}

const EventDetails = ({
  date,
  name,
  venue,
  city,
  country,
}: EventDetailsProps) => {
  return (
    <div className="flex flex-col text-left w-full">
      <p className="text-gray-500">{date}</p>
      <h2 className="text-xl font-bold">{name}</h2>
      <h3 className="text-lg font-semibold">{venue}</h3>
      <h4 className="text-md font-medium">
        {city}, {country}
      </h4>
    </div>
  );
};

const EventCard = ({ event }: { event: EventItem }) => {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const {
    formattedDate,
    notOnSaleYet,
    buttonText,
    formattedPrice,
    onSaleDateFormatted,
    audioTrack,
    price,
  } = useEventData(event);

  const { isPlaying, togglePlayPause, AudioPlayer } =
    useAudioPlayer(audioTrack);

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
        {AudioPlayer}
        {audioTrack && (
          <PlayButton
            className="absolute bottom-0 left-0"
            isPlaying={isPlaying}
            onClick={togglePlayPause}
          />
        )}
        {notOnSaleYet ? (
          <OnsaleDateBadge onSaleDate={onSaleDateFormatted} />
        ) : event.featured ? (
          <Badge className="absolute bottom-2 right-2" text="FEATURED" />
        ) : null}
      </div>
      <EventDetails
        date={formattedDate}
        name={event.name}
        venue={event.venue}
        city={event.location.city}
        country={event.location.country}
      />
      <div className="bg-gray-100 rounded mt-auto w-full overflow-scroll relative">
        <div className="flex justify-between items-center mb-2 font-semibold sticky top-0 left-0 bg-gray-100 w-full z-10 py-2 px-4">
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
      <div className="flex justify-between w-full items-end">
        <a href={event.url} target="_blank" rel="noopener noreferrer">
          <Button disabled={event.sold_out}>{buttonText}</Button>
        </a>

        <div className="flex flex-col items-end">
          {event.ticket_types.length > 1 ? <span>From</span> : null}
          <span className="font-semibold text-lg">{price}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(EventCard);
