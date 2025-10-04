import { useState, useCallback } from "react";
import "./App.css";
import EventCard from "./components/EventCard";
import Button from "./components/ui/Button";

interface EventItem {
  id: string;
  name: string;
  date: string;
  timezone: string;
  venue: string;
  location: { city: string; country: string };
  event_images: { square: string; landscape: string };
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
  const [venueQuery, setVenueQuery] = useState("");
  const [searchedVenue, setSearchedVenue] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_API_KEY;
  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
  const PAGE_SIZE = 12;

  const fetchEvents = useCallback(
    async (url: string, isNewSearch: boolean) => {
      setIsLoading(true);
      setError(null);
      if (isNewSearch) {
        setEvents([]);
      }

      try {
        const response = await fetch(url, { headers: { "x-api-key": apiKey } });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setEvents((prevEvents) => [...prevEvents, ...(data.data || [])]);
        setNextPageUrl(
          data.links?.next?.replace("events-api", "partners-endpoint") || null
        );
      } catch (error) {
        console.error("Error fetching event data:", error);
        setError("Failed to fetch events. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey]
  );

  const handleSearch = () => {
    setSearchedVenue(venueQuery);
    const initialUrl = `${apiEndpoint}?filter[venues][]=${venueQuery}&page[size]=${PAGE_SIZE}`;
    fetchEvents(initialUrl, true);
  };

  const loadMore = () => {
    if (nextPageUrl) {
      fetchEvents(nextPageUrl, false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const initialMessage = !venueQuery
    ? "Please enter a venue to search for events."
    : isLoading
    ? "Searching for events..."
    : error
    ? error
    : events.length === 0
    ? `No events found for "${searchedVenue}".`
    : "";

  return (
    <div className="App">
      <h1 className="text-4xl font-bold">Search events by venue</h1>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="e.g., Troxy"
          value={venueQuery}
          onChange={(e) => setVenueQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border p-2 rounded"
        />
        <Button onClick={handleSearch} disabled={!venueQuery || isLoading}>
          Search
        </Button>
      </div>

      {initialMessage && <p className="mt-8">{initialMessage}</p>}

      {events.length > 0 && (
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
      )}

      {nextPageUrl && (
        <div className="mt-12 text-center">
          <Button onClick={loadMore} disabled={isLoading}>
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;
