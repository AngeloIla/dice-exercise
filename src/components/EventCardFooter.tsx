interface EventCardFooterProps {
  url: string;
  disabled: boolean;
  buttonText: string;
  hasMultipleTickets: boolean;
  price: string;
}

import Button from "./ui/Button";

const EventCardFooter = ({
  url,
  disabled,
  buttonText,
  hasMultipleTickets,
  price,
}: EventCardFooterProps) => {
  return (
    <div className="flex justify-between w-full items-end">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <Button disabled={disabled}>{buttonText}</Button>
      </a>

      <div className="flex flex-col items-end">
        {hasMultipleTickets && <span className="text-gray-500">From</span>}
        <span className="text-3xl">{price}</span>
      </div>
    </div>
  );
};

export default EventCardFooter;
