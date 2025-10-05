import type { ReactNode } from "react";

interface CardImageContainerProps {
  src: string;
  alt: string;
  children?: ReactNode;
}

const CardImageContainer = ({
  src,
  alt,
  children,
}: CardImageContainerProps) => {
  return (
    <div className="relative w-full h-[320px]">
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      {children}
    </div>
  );
};

export default CardImageContainer;
