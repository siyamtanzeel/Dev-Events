import { FaArrowDownLong } from "react-icons/fa6";
import EventCard from "./components/EventCard";
import events from "./lib/constants";
export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center space-y-2 py-10 text-center p-6 max-w-7xl mx-auto">
      <h1 className="font-bold text-3xl md:text-5xl">
        The Hub for Every Dev <br />
        Event You Can’t Miss
      </h1>
      <p className="text-primary-content/70 text-sm md:text-lg">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>
      <button className="btn w-full md:w-auto lg:btn-lg rounded-4xl mt-3 py-6">
        <a href="#section" className="flex items-center">
          Explore More <FaArrowDownLong />
        </a>
      </button>
      <div
        id="section"
        className="mt-20 w-full flex flex-col items-center justify-center">
        <h3 className="text-2xl font-bold w-full text-left">Featured Events</h3>
        <div className="mt-5 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-stretch items-center">
          {events.map((event) => (
            <EventCard key={event.title} event={event}></EventCard>
          ))}
        </div>
      </div>
    </section>
  );
}
