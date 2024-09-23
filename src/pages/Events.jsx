import React, { useEffect, useState } from "react";
import Post from "../components/posts/Post";
import { AddEventDiag } from "../components/add-event/AddEventDiag";
import { Avatar, Button, Card } from "@material-tailwind/react";
import EventList from "../components/event-list/EventList";
import WrapBar from "../components/WrapBar";
import { useCookies } from "react-cookie";
import environment from "../environment";

export default function Events() {
  const [posts, setPosts] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

  const [page, setPage] = useState(0);
  const size = 5;

  const fetchPosts = async (page) => {
    try {
      const response = await fetch(`${environment.apiUrl}/posts/latest?page=${page}&size=${size}`)
      if (response.ok) {
        const data = await response.json();
        setPosts([...posts, ...data.content]);
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchPosts(0);
  }, []);

  const loadMore = () => {
    setPage(page+1);
    fetchPosts(page+1);
  }

  const postList = posts.map((post) => 
    <Post 
      post={post}
    />
  )

  return (
    <>
      <WrapBar>
        <div className="-ml-10 w-full h-full grid grid-cols-12 pr-16 ">
          <div className=" col-span-8 flex flex-col items-center gap-4">
            {postList}
            <a className="mb-5 cursor-pointer" onClick={loadMore}>Load more posts</a>
          </div>
          <EventList />
        </div>
      </WrapBar>
    </>
  );
}
