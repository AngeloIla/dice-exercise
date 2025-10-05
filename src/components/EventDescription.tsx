import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface EventDescriptionProps {
  descriptionContent: string;
  children?: React.ReactNode;
}

const EventDescription = ({
  descriptionContent,
  children,
}: EventDescriptionProps) => {
  return (
    <div className="p-4">
      <Markdown remarkPlugins={[remarkGfm]}>{descriptionContent}</Markdown>
      {children}
    </div>
  );
};

export default EventDescription;
