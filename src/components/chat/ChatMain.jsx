import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Button, Card, Input, Typography } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import "react-chat-elements/dist/main.css";
import { MessageBox } from "react-chat-elements";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import environment from "../../environment";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

export default function ChatMain(props) {
  const { open, handleClose, partnerId } = props
  const [messageInput, setMessageInput] = useState('');

  const [conversation, setConversation] = useState();
  const [partner, setPartner] = useState();
  const [messages, setMessages] = useState([]);

  const [cookies, setCookie] = useCookies(['user', 'accessToken']);
  const thisUser = cookies['user'];
  const navigate = useNavigate();

  const fetchPartner = async () => {
    const response = await fetch(`${environment.apiUrl}/users/${partnerId}`);
    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      return;
    }

    setPartner(data);
  }
  
  const fetchConversation = async () => {
    if (!thisUser) {
      window.alert("Your session has expired. Please sign in again.");
      navigate('/login');
      return;
    }

    const conversationResponse = await fetch(`${environment.apiUrl}/users/${thisUser.id}/conversations/find-by-partner?id=${partnerId}`);
    const conversationData = await conversationResponse.json();

    if (conversationResponse.ok) {
      setConversation(conversationData);

      const messagesResponse = await fetch(`${environment.apiUrl}/users/${thisUser.id}/conversations/${conversationData.id}/messages`);
      const messagesData = await messagesResponse.json();

      setMessages(messagesData.content.reverse());
      triggerScroll();
    } else if (conversationResponse.status === 404) {
      setConversation({
        userId1: thisUser.id,
        userId2: partnerId
      });
    } else {
      console.log(conversationData);
      return;
    }
  }

  useEffect(() => {
    fetchPartner();
    fetchConversation();
  }, []);

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
      console.log(message.body);
      const chatMessage = JSON.parse(message.body);
      if (!conversation.id) {
        conversation = {id: chatMessage.conversationId, ...conversation};
        setConversation(conversation);
      }
      setMessages([...messages, chatMessage]);
      triggerScroll();
    }
    setStomp(stompClient);
  }

  const sendMessage = () => {
    const message = {
      senderId: thisUser.id,
      receiverId: partnerId,
      messageType: "TEXT",
      content: messageInput
    };
    stomp.publish({
      destination: '/app/chat',
      body: JSON.stringify(message)
    });
    setMessageInput('');
  }

  const [shouldScroll, setShouldScroll] = useState(true);
  const divRef = useRef(null);
  
  useEffect(() => {
    setUpWebSocket();
  }, [shouldScroll]);

  useEffect(() => {
    if (shouldScroll && divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
      setShouldScroll(false); // Prevent infinite scrolling
    }
  }, [shouldScroll, divRef]); // Re-run effect when shouldScroll or divRef changes

  // Function to trigger auto-scroll (optional)
  const triggerScroll = () => {
    setShouldScroll(true);
  };

  const markAsSeen = async (conversationId) => {
    const response = await fetch(`${environment.apiUrl}/users/${thisUser.id}/conversations/${conversationId}/mark-as-seen`, {
      method: "POST"
    });
    const data = await response.json();

    if (!response.ok) return;
  }

  return (
    <>
      {open ? (
        <div>
          <div className=" fixed bottom-0 h-[500px] w-96 right-16 z-[9999]">
            <Card className="h-full w-full pt-1 shadow-lg shadow-blue-300 ">
              <div className=" h-14 border-b-2 border-b-blue-300/30 p-2 flex flex-row items-center drop-shadow-md ">
                <div className=" w-5/6 pl-3 font-black text-lg flex items-center gap-4">
                  <img src={partner?.pictureUrl} className="w-6 h-6 rounded-full" />
                  <Typography className="font-medium text-base">{partner?.name || 'Unknown'}</Typography>
                </div>
                <div className=" pl-5 ">
                  <Button
                    variant="text"
                    color="red"
                    className=" rounded-full p-1"
                    onClick={handleClose}
                  >
                    <XMarkIcon className=" h-5 w-5 text-red-600 " />
                  </Button>
                </div>
              </div>
              <div ref={divRef} onScroll={() => setShouldScroll(false)} className="w-full h-96 overflow-y-auto overflow-x-visible px-0.5 pt-2 bg-blue-100/20">
                {messages.map(({ content, senderId, timestamp }) => (
                    <>
                      <MessageBox
                        position={senderId === thisUser.id ? "right" : "left"}
                        type={"text"}
                        text={content}
                        date={timestamp}
                      />
                    </>
                  )
                )}
              </div>
              <div className="flex flex-row gap-2 border-t-2  p-2 px-3 border-t-blue-300/30">
                  <Input
                    label="Message"
                    color="blue"
                    value={messageInput}
                    onChange={(e) => {
                      setMessageInput(e.target.value);
                    }}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') sendMessage();
                    }}
                    onFocus={() => {
                      if (conversation.id) {
                        markAsSeen(conversation.id);
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    color="blue"
                    className=" p-2 "
                    variant="text"
                    onClick={sendMessage}
                  >
                    <PaperAirplaneIcon className=" h-6 w-6 text-blue-600" />
                  </Button>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
