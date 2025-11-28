import Image from "next/image";
import { IoIosClock } from "react-icons/io";
import { IoCalendarOutline, IoLocationOutline } from "react-icons/io5";

type TProps = {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

const EventCard = ({ event }: { event: TProps }) => {
  return (
    <div className="card bg-base-100 w-full shadow-sm ">
      <figure className="relative w-full overflow-hidden aspect-4/3">
        <Image
          src={event.image}
          alt="Shoes"
          fill
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="card-body p-2">
        <span className="flex items-center justify-start text-primary-content/70">
          <IoLocationOutline className="mr-1.5" /> {event.location}
        </span>
        <h2 className="card-title">{event.title}</h2>
        <div className="flex items-center justify-start space-x-2 text-xs text-primary-content/70 font-extralight">
          <span className="flex items-center">
            {" "}
            <IoCalendarOutline className="mr-1.5" />
            {event.date}
          </span>
          <span className="">|</span>
          <span className="flex items-center">
            {" "}
            <IoIosClock className="mr-1.5" /> {event.time}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
