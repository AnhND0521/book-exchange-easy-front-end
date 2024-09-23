import { useEffect, useState } from "react";
import EventListEvent from "./EventListEvent";
import EventCalendar from "../calendar/EventCalendar";
import { Avatar, Button, Card } from "@material-tailwind/react";
import { useCookies } from "react-cookie";
import environment from "../../environment";
import { AddEventDiag } from "../add-event/AddEventDiag";

const EventList = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
  console.log(cookies["user"]);

  const today = new Date();
  const [activeDate, setActiveDate] = useState(today);
  const [filter, setFilter] = useState(1);
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const size = 3;

  const fetchEvent = async (filter, page) => {
    let url;
    if (filter == 1) {
      url = `${environment.apiUrl}/events/latest?page=${page}&size=${size}`;
    } else if (filter == 2) {
      url = `${environment.apiUrl}/events/filter-event-that-user-concern?id=${cookies["user"].id}&page=${page}&size=${size}`;
    } else {
      url = `${environment.apiUrl}/events/find-by-owner?id=${cookies["user"].id}&page=${page}&size=${size}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      setEvents([...events, ...data.content]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEvent(1, 0);
  }, [filter]);

  // useEffect(() => {
  //   const fetchEvent = async () => {
  //     const date = activeDate.toLocaleDateString("en-CA", {
  //       year: "numeric",
  //       month: "2-digit",
  //       day: "2-digit",
  //     });
  //     console.log(date);
  //     try {
  //       const response = await fetch(
  //         `${environment.apiUrl}/events/event-by-date?from=${date}&to=${date}`
  //       );
  //       const data = await response.json();
  //       console.log(data);
  //       setEvents(data.content);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   fetchEvent();
  // }, [activeDate]);

  const loadMore = () => {
    setPage(page + 1);
    fetchEvent(filter, page + 1);
  };

  const changeFilter = (i) => {
    if (i != filter) {
      setFilter(i);
      setPage(0);
      fetchEvent(i, 0);
    }
  };

  const eventList = events.map((event) => (
    <EventListEvent key={event.id} event={event} />
  ));

  return (
    <div className=" col-span-3 w-full flex flex-col gap-4">
      {cookies["user"] && (
        <Card className="min-w-96 flex flex-row items-center gap-2 py-3 px-5">
          <div className=" flex items-center justify-center">
            <Avatar
              className=" h-10 w-10"
              src={cookies["user"].pictureUrl}
              alt="avatar"
            />
          </div>
          <div className=" w-full">
            <AddEventDiag />
          </div>
        </Card>
      )}
      {/* <div className=" w-full ">
        <EventCalendar activeDate={activeDate} setActiveDate={setActiveDate} />
      </div> */}
      <div className=" w-full flex items-center">
        <Button
          className={
            filter === 1
              ? "mr-2 bg-white text-blue-500 shadow-none"
              : " mr-2 bg-blue-500"
          }
          onClick={() => setFilter(1)}
        >
          All
        </Button>
        <Button
          className={
            filter === 2
              ? "mr-2 bg-white text-blue-500 shadow-none"
              : " mr-2 bg-blue-500"
          }
          onClick={() => setFilter(2)}
        >
          Interested
        </Button>
        <Button
          className={
            filter === 3
              ? "mr-2 bg-white text-blue-500 shadow-none"
              : " mr-2 bg-blue-500"
          }
          onClick={() => setFilter(3)}
        >
          My events
        </Button>
      </div>
      <div className=" w-[396px]">
        {eventList.length === 0 && (
          <p>
            <i>No events found.</i>
          </p>
        )}{" "}
        {eventList.length > 0 && (
          <>
            <div className="  min-w-[396px] flex flex-col">{eventList}</div>
            <a className="mb-5 cursor-pointer" onClick={loadMore}>
              Load more events
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default EventList;
