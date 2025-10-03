import { useState } from "react";
import "./App.css";
import EventCard from "./components/EventCard";
import Button from "./components/ui/Button";
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

function App() {
  const [venue, setVenue] = useState("");
  const apiKey = import.meta.env.VITE_API_KEY;
  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
  const [events, setEvents] = useState<EventItem[]>([]);
  const [nextPage, setNextPage] = useState<number>(1);
  const PAGE_SIZE = 12;
  const [isLoading, setIsLoading] = useState(false);

  const fetchVenueData = async (venue: string, page: number) => {
    if (venue) {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${apiEndpoint}?filter[venues][]=${venue}&page[size]=${PAGE_SIZE}&page[number]=${page}`,
          {
            headers: {
              "x-api-key": apiKey,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setIsLoading(false);
        setEvents((prevEvents) => [...prevEvents, ...(data.data || [])]);
        if (data.links?.next !== null) {
          setNextPage(nextPage + 1);
        } else {
          setNextPage(1);
        }
      } catch (error) {
        console.error("Error fetching venue data:", error);
      }
    }
  };

  return (
    <div className="App">
      <h1 className="text-4xl font-bold">Search events by venue</h1>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter venue name"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          className="border p-2 rounded"
        />
        <Button
          onClick={() => {
            setEvents([]);
            fetchVenueData(venue, 1);
          }}
          disabled={!venue}
        >
          Search
        </Button>
      </div>

      {events.length > 0 ? (
        <>
          <h2 className="text-2xl font-bold mt-6">
            Upcoming Events at {events[0].venue}
          </h2>
          <div className="grid mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      ) : (
        <p>No events found.</p>
      )}
      {nextPage > 1 && (
        <div className="mt-12 text-center">
          <Button
            onClick={() => {
              fetchVenueData(venue, nextPage);
            }}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "LOAD MORE"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;
