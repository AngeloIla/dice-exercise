import PlayButton from "./ui/PlayButton";
import { memo, useState } from "react";
import Badge from "./ui/Badge";

import { useEventData } from "../hooks/useEventData";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import CardImageContainer from "./CardImageContainer";
import { EventDetails } from "./EventDetails";
import EventDescription from "./EventDescription";
import EventCardFooter from "./EventCardFooter";
import type { EventItem } from "../types/EventItem";

const CardContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-2 w-[320px] h-[640px] items-start gap-4">
    {children}
  </div>
);

const DescriptionContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-gray-100 rounded mt-auto w-full overflow-scroll relative">
    {children}
  </div>
);

const DescriptionSubSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col mt-4 gap-3">
    <h5 className="text-blue-500 font-semibold">{title}</h5>
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

const MoreInfoBanner = ({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) => {
  return (
    <div className="flex justify-between items-center mb-2 font-semibold sticky top-0 left-0 bg-gray-100 w-full z-10 py-2 px-4">
      <p>More info</p>
      <button onClick={onClick} className="px-2">
        {isOpen ? "-" : "+"}
      </button>
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
    <CardContainer>
      <CardImageContainer
        src={
          showMoreInfo
            ? `${event.event_images.landscape}&w=320`
            : `${event.event_images.square}&w=320`
        }
        alt={`Poster for the event ${event.name} at ${event.venue}`}
      >
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
          <Badge className="absolute bottom-2 right-2" text={"FEATURED"} />
        ) : null}
      </CardImageContainer>
      <EventDetails
        date={formattedDate}
        name={event.name}
        venue={event.venue}
        city={event.location.city}
        country={event.location.country}
      />
      <DescriptionContainer>
        <MoreInfoBanner
          onClick={() => setShowMoreInfo(!showMoreInfo)}
          isOpen={showMoreInfo}
        />
        {showMoreInfo && (
          <EventDescription descriptionContent={event.description}>
            <DescriptionSubSection title="LINE UP">
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
            </DescriptionSubSection>
            <DescriptionSubSection title="TICKETS">
              {event.ticket_types && event.ticket_types.length > 0 ? (
                <ul className="list-none list-inside">
                  {event.ticket_types.map((ticket) => (
                    <li key={ticket.name}>
                      {ticket.name} -{" "}
                      <span className="font-semibold">
                        {ticket.price.face_value === 0
                          ? "FREE"
                          : formattedPrice(ticket.price.face_value)}
                      </span>{" "}
                      {ticket.sold_out ? (
                        <span className="text-grey-500">SOLD OUT</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tickets available.</p>
              )}
            </DescriptionSubSection>
          </EventDescription>
        )}
      </DescriptionContainer>
      <EventCardFooter
        url={event.url}
        disabled={event.sold_out}
        buttonText={buttonText}
        hasMultipleTickets={event.ticket_types.length > 1}
        price={price}
      />
    </CardContainer>
  );
};

export default memo(EventCard);
