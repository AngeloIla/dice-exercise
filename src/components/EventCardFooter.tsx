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
        {hasMultipleTickets && <span>From</span>}
        <span className="font-semibold text-lg">{price}</span>
      </div>
    </div>
  );
};

export default EventCardFooter;
