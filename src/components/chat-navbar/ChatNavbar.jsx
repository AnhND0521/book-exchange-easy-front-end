import React, { useEffect, useState } from "react";
import {
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Badge,
} from "@material-tailwind/react";

import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import ChatMain from "../chat/ChatMain";
import { useCookies } from "react-cookie";
import environment from "../../environment";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

export default function ChatNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuHandler = (val) => {
    setIsMenuOpen(val);
    fetchData();
  } 
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [partnerId, setPartnerId] = useState();

  const closeMenu = () => setIsMenuOpen(false);

  const [cookies, setCookie] = useCookies(['user', 'accessToken']);
  const thisUser = cookies['user'];
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);

  const fetchData = async () => {
    if (!thisUser) {
      window.alert("Your session has expired. Please sign in again.");
      navigate('/login');
      return;
    }

    const response = await fetch(`${environment.apiUrl}/users/${thisUser.id}/conversations?size=10`);
    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      return;
    }

    setConversations(data.content);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const markAsSeen = async (conversationId) => {
    const response = await fetch(`${environment.apiUrl}/users/${thisUser.id}/conversations/${conversationId}/mark-as-seen`, {
      method: "POST"
    });
    const data = await response.json();

    if (!response.ok) return;
  }

  // websocket
  const [stomp, setStomp] = useState();
  const setUpWebSocket = () => {
    const mySocketFactory = () => new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(mySocketFactory);

    stompClient.connect({token: cookies['accessToken']}, onConnect);

    function onConnect() {
      stompClient.subscribe(`/user/${thisUser.id}/chat`, onMessageReceived);
    }

    function onMessageReceived(message) {
      fetchData();
      if (!isChatOpen) {
        console.log(message.body);
        const chatMessage = JSON.parse(message.body);
        setPartnerId(thisUser.id === chatMessage.senderId ? chatMessage.receiverId : chatMessage.senderId);
        setIsChatOpen(true);
      }
    }
    setStomp(stompClient);
  }

  useEffect(() => {
    setUpWebSocket();
  }, []);

  const notSeen = conversations.filter(c => (thisUser.id === c.userId1 && !c.seenByUser1) || (thisUser.id === c.userId2 && !c.seenByUser2)).length;

  return (
    <>
      <Menu open={isMenuOpen} handler={menuHandler} placement="bottom">
        <Badge content={notSeen} invisible={notSeen === 0}>
          <MenuHandler>
            <Button
              variant="text"
              className="h-10 w-10 bg-blue-100/20 rounded-full flex justify-center items-center p-0.5"
            >
              <ChatBubbleOvalLeftEllipsisIcon className="text-blue-300  p-1" />
            </Button>
          </MenuHandler>
        </Badge>
        <MenuList className="p-2 w-[500px] overflow-y-auto overflow-x-clip">
          {conversations.map(c => {
            return (
              <MenuItem
                onClick={() => {
                  closeMenu();
                  setPartnerId(thisUser.id === c.userId1 ? c.userId2 : c.userId1);
                  setIsChatOpen(true);
                  markAsSeen(c.id);
                }}
                className={`flex items-center gap-2 h-14 rounded ${(thisUser.id === c.userId1 && !c.seenByUser1) || (thisUser.id === c.userId2 && !c.seenByUser2) ? "bg-blue-300/20 text-black font-black" : ""}`}
              >
                <div>
                  <div className=" mb-1">
                    <span className="font-bold">{thisUser.id === c.userId1 ? c.userName2 : c.userName1}</span>
                  </div>
                  <div className=" flex flex-row ">
                    <div>
                      { (thisUser.id === c.userId1 && c.lastSentByUser1) || (thisUser.id === c.userId2 && !c.lastSentByUser1) ? (
                        <>
                          <span className=" mr-1 text-black font-black font-medium">You: </span>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className=" overflow-x-hidden overflow-y-hidden">{c.lastMessageContent}</div>
                  </div>
                </div>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
      <div>
        {isChatOpen && <ChatMain open={isChatOpen} handleClose={() => setIsChatOpen(false)} partnerId={partnerId} />}
      </div>
    </>
  );
}
