import {
  ChatBubbleBottomCenterIcon,
  ChatBubbleOvalLeftIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { Avatar, Card } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import PostMenu from "./PostMenu";
import { useCookies } from "react-cookie";
import environment from "../../environment";
import { getTimeAgo } from "../../utils/getDateShit";
import { Link } from "react-router-dom";
import CommentSection from "./CommentSection";
import ChatMain from "../chat/ChatMain";

export default function Post(props) {
  const { post } = props;
  const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
  const thisUser = cookies["user"];
  const [likes, setLikes] = useState(post.likedUserIds.length);
  const [liked, setLiked] = useState(post.likedUserIds.includes(thisUser?.id));
  const [showComment, setShowComment] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [chatPartnerId, setChatPartnerId] = useState(0);

  const likePost = async () => {
    const response = await fetch(`${environment.apiUrl}/posts/${post.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...post,
        likedUserIds: [...post.likedUserIds, thisUser.id],
      }),
    });
    if (response.ok) {
      setLiked(true);
      setLikes(likes + 1);
    }
  };

  const unlikePost = async () => {
    const response = await fetch(`${environment.apiUrl}/posts/${post.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...post,
        likedUserIds: post.likedUserIds.filter(
          (userId) => userId != thisUser.id
        ),
      }),
    });
    if (response.ok) {
      setLiked(false);
      setLikes(likes - 1);
    }
  };

  const handleChat = (partnerId) => {
    setChatPartnerId(partnerId);
    setOpenChat(true);
  } 

  return (
    <div className=" w-3/4">
      <Card className="w-full min-w-96 min-h-96 ">
        <div className=" py-3 px-5 flex gap-2">
          <div className=" flex items-center justify-center">
            <Avatar
              className=" h-10 w-10"
              src={post.userPictureUrl}
              alt="avatar"
            />
          </div>
          <div className=" w-5/6 pl-1 pt-1 pb-1">
            <div className=" text-black">
              <b>{post.userName}</b>
              {post.eventId && (
                <span>
                  {" "}
                  in{" "}
                  <b>
                    <Link to={`/events/${post.eventId}`}>{post.eventName}</Link>
                  </b>
                </span>
              )}
            </div>
            <div className=" text-xs ">{getTimeAgo(post.created)}</div>
          </div>
          {cookies["user"].id === post.userId && (
            <div>
              <PostMenu post={post} />
            </div>
          )}
        </div>
        <div className=" w-full px-5 text-lg font-bold text-pretty mb-2">
          {post.title}
        </div>
        <div className=" w-full px-5 text-sm text-pretty mb-3 ">
          {post.content}
        </div>
        <div className=" h-96 w-full px-5 mb-5">
          <img
            className="h-96 w-full rounded-lg object-cover object-center"
            src={post.imagePath}
          />
        </div>

        <div className=" h-5 mb-5 flex px-5 justify-between items-center text-sm">
          <div className=" pl-2 flex">
            <div className=" flex">
              {!liked ? (
                <div
                  className=" flex justify-center items-center mr-1"
                  onClick={likePost}
                >
                  <HeartIcon className=" h-5 w-5 duration-200 hover:fill-red-400 hover:scale-125 hover:text-red-400 active:scale-95 cursor-pointer" />
                </div>
              ) : (
                <div
                  className=" flex justify-center items-center mr-1"
                  onClick={unlikePost}
                >
                  <HeartIcon className=" h-5 w-5 duration-200 fill-red-400 hover:scale-125 text-red-400 active:scale-95 cursor-pointer" />
                </div>
              )}
              <div className=" flex justify-center items-center">
                <span>{likes}</span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="flex">
              <div
                className=" flex justify-center items-center mr-1"
                onClick={() => setShowComment((val) => !val)}
              >
                <ChatBubbleBottomCenterIcon className=" h-5 w-5 duration-200 hover:scale-125 active:scale-95 cursor-pointer" />
              </div>
              <div className=" flex justify-center items-center">
                <span>{post.commentCount}</span>
              </div>
            </div>
          </div>
          <div className=" pr-2">
            <div
              className=" flex justify-center items-center mr-1"
              onClick={() => handleChat(post.userId)}
            >
              <ChatBubbleOvalLeftIcon className=" h-5 w-5 duration-200 hover:scale-125 active:scale-95 cursor-pointer" />
            </div>
          </div>
        </div>
        {showComment && <CommentSection postId={post.id} />}
      </Card>
      {openChat && (
        <ChatMain
          open={openChat}
          handleClose={() => setOpenChat(false)}
          partnerId={chatPartnerId}
        />
      )}
    </div>
  );
}
