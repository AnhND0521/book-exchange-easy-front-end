import React, { useEffect, useState } from "react";
import Post from "../components/posts/Post";
import { Avatar, Button, Card } from "@material-tailwind/react";
import EventList from "../components/event-list/EventList";
import { AddPostDiag } from "../components/add-post/AddPostDiag";
import EventDetailsCover from "../components/event-details/EventDetailsCover";
import WrapBar from "../components/WrapBar";
import { useParams } from "react-router";
import { useCookies } from "react-cookie";
import environment from "../environment";

export default function EventDetails() {
  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
  const [posts, setPosts] = useState([]);
  const [event, setEvent] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${environment.apiUrl}/events/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data);
          console.log(data);
        }
      }
      catch (err) {
        console.log(err);
      }
    }

    const fetchPosts = async () => {
      try {
        const response = await fetch(`${environment.apiUrl}/posts/find-by-event?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setPosts(data.content);
        }
      }
      catch (err) {
        console.log(err);
      }
    }

    fetchEvent();
    fetchPosts();
  }, [id]);

  const postList = posts.map((post) => 
    <Post
      key={post.id}
      post={post}
    />
  )

  return (
    <>
      <WrapBar>
        <div className="-ml-10 w-full h-full grid grid-cols-12">
          <EventDetailsCover
            event={event}
          />
          <div className=" col-span-8 flex flex-col items-center gap-4">
            {
              cookies['user'] &&
              <Card className="w-3/4 min-w-96 flex flex-row items-center gap-2 py-3 px-5">
                <div className=" flex items-center justify-center">
                  <Avatar
                    className=" h-10 w-10"
                    src={cookies["user"].pictureUrl}
                    alt="avatar"
                  />
                </div>
                <div className=" w-full">
                  <AddPostDiag eventId={id} />
                </div>
              </Card>
            }
            {postList}
          </div>
          <EventList />
        </div>
      </WrapBar>
    </>
  );
}
