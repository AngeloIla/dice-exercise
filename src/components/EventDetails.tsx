interface EventDetailsProps {
  date: string;
  name: string;
  venue: string;
  city: string;
  country: string;
}

export const EventDetails = ({
  date,
  name,
  venue,
  city,
  country,
}: EventDetailsProps) => {
  return (
    <div className="flex flex-col text-left w-full">
      <p className="text-gray-500">{date}</p>
      <h2 className="text-xl font-bold mt-2">{name}</h2>
      <h3 className="font-semibold mt-4">{venue}</h3>
      <h4>
        {city}, {country}
      </h4>
    </div>
  );
};
