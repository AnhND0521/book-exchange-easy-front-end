import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import { useCookies } from "react-cookie";
import { getTimeAgo } from "../../utils/getDateShit";
import {
  ArrowUturnLeftIcon,
  ChatBubbleBottomCenterIcon,
  ChatBubbleOvalLeftIcon,
  HeartIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import environment from "../../environment";
import CommentDeleteDialog from "./CommentDeleteDialog";
import CommentEditDialog from "./CommentEditDialog";
import CommentReplies from "./CommentReplies";

const CommentSection = ({ postId }) => {
  const [cookies, setCookie] = useCookies(["cookie-name"]);

  const [comments, setComments] = useState([]);
  const [showReplies, setShowReplies] = useState([]);

  const fetchCommentList = async () => {
    const response = await fetch(
      `${environment.apiUrl}/posts/${postId}/comments?page=0&size=1000`
    );
    const data = await response.json();
    console.log(data);
    setComments(data.content);
  };

  useEffect(() => {
    fetchCommentList();
  }, []);

  const [createCommentLoading, setCreateCommentLoading] = useState(false);
  const [comment, setComment] = useState("");
  const handleSubmit = async () => {
    setCreateCommentLoading(true);
    const response = await fetch(
      `${environment.apiUrl}/posts/${postId}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          userId: cookies["user"].id,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
    setCreateCommentLoading(false);

    if (!response.ok) {
      console.error(data.message);
      return;
    }
    setComment("");
    fetchCommentList();
  };

  const [openEdit, setOpenEdit] = useState([]);
  const [openDelete, setOpenDelete] = useState([]);
  const handleOpenEdit = (i) => {
    if (!openEdit.includes(i)) openEdit.push(i);
    else openEdit.splice(openEdit.indexOf(i), 1);
    setOpenEdit([...openEdit]);
  };
  const handleOpenDelete = (i) => {
    if (!openDelete.includes(i)) openDelete.push(i);
    else openDelete.splice(openDelete.indexOf(i), 1);
    setOpenDelete([...openDelete]);
  };

  const likeComment = async (i) => {
    const response = await fetch(
      `${environment.apiUrl}/comments/${comments[i].id}/like`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: cookies["user"].id,
        }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      comments[i].likes += 1;
      comments[i].likedUserIds.push(cookies["user"].id);
      setComments([...comments]);
    } else {
      console.log(response.message);
    }
  };

  const unlikeComment = async (i) => {
    const response = await fetch(
      `${environment.apiUrl}/comments/${comments[i].id}/unlike`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: cookies["user"].id,
        }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      comments[i].likes -= 1;
      comments[i].likedUserIds = comments[i].likedUserIds.filter(
        (userId) => userId !== cookies["user"].id
      );
      setComments([...comments]);
    } else {
      console.log(response.message);
    }
  };

  return (
    <div className="pb-3 px-5 flex flex-col align-center">
      <p className="mb-3">Comments</p>
      {cookies["user"] && (
        <form className="w-full">
          <div className="flex justify-between gap-3">
            <Avatar
              className=" h-10 w-10 "
              src={cookies["user"].pictureUrl}
              alt="avatar"
            />
            <Textarea
              variant="outlined"
              color="blue"
              label="Your Comment"
              className="grow"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              required
            />
          </div>

          <div className="flex w-full justify-end py-1.5">
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                color="blue"
                className="rounded-md justify-center"
                onClick={handleSubmit}
                loading={createCommentLoading}
                disabled={createCommentLoading}
              >
                Post Comment
              </Button>
            </div>
          </div>
        </form>
      )}
      <div className="flex flex-col gap-3 items-start w-full">
        {comments.map((comment, i) => (
          <div key={i} className="flex flex-col gap-1 items-start w-full">
            <div className="flex justify-between gap-3 w-full mb-1">
              <Avatar
                className=" h-10 w-10 "
                src={comment.userPictureUrl}
                alt="avatar"
              />
              <Card className="w-full grow bg-gray-100">
                <CardBody className="p-3 flex flex-col items-start gap-2">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex justify-start items-center gap-2">
                      <Typography className="font-bold text-sm">
                        {comment.userName}
                      </Typography>
                      <Typography className="font-normal text-xs">
                        {getTimeAgo(new Date(comment.createdAt))}
                      </Typography>
                      {comment.isEdited && (
                        <Typography className="font-normal text-xs">
                          (edited)
                        </Typography>
                      )}
                    </div>
                    {cookies["user"]?.id === comment.userId && (
                      <div>
                        <Menu>
                          <MenuHandler>
                            <Typography className="cursor-pointer">
                              •••
                            </Typography>
                          </MenuHandler>
                          <MenuList>
                            <MenuItem
                              className="flex items-center gap-1"
                              onClick={() => handleOpenEdit(i)}
                            >
                              <PencilIcon className="w-4" />
                              Edit
                            </MenuItem>
                            <MenuItem
                              className="flex items-center gap-1 text-red-500"
                              onClick={() => handleOpenDelete(i)}
                            >
                              <TrashIcon className="w-4" />
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>

                        <CommentEditDialog
                          open={openEdit.includes(i)}
                          handleOpen={() => handleOpenEdit(i)}
                          comment={comment}
                          loadComments={fetchCommentList}
                        />

                        <CommentDeleteDialog
                          open={openDelete.includes(i)}
                          handleOpen={() => handleOpenDelete(i)}
                          commentId={comment.id}
                          loadComments={fetchCommentList}
                        />
                      </div>
                    )}
                  </div>
                  <Typography className="text-sm">{comment.content}</Typography>
                </CardBody>
              </Card>
            </div>
            <div className="ml-[54px] h-5 flex justify-start items-center gap-3 text-sm">
              <div className=" pl-2 flex">
                <div className=" flex">
                  {!comment.likedUserIds.includes(cookies["user"].id) ? (
                    <div
                      className=" flex justify-center items-center mr-1"
                      onClick={() => likeComment(i)}
                    >
                      <HeartIcon className=" h-5 w-5 duration-200 hover:fill-red-400 hover:scale-125 hover:text-red-400 active:scale-95 cursor-pointer" />
                    </div>
                  ) : (
                    <div
                      className=" flex justify-center items-center mr-1"
                      onClick={() => unlikeComment(i)}
                    >
                      <HeartIcon className=" h-5 w-5 duration-200 fill-red-400 hover:scale-125 text-red-400 active:scale-95 cursor-pointer" />
                    </div>
                  )}
                  <div className=" flex justify-center items-center">
                    <span>{comment.likes}</span>
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className="flex">
                  <div
                    className=" flex justify-center items-center mr-1"
                    onClick={() => {
                      if (!showReplies.includes(comment.id)) {
                        setShowReplies([...showReplies, comment.id]);
                      } else {
                        setShowReplies(
                          showReplies.filter((id) => id !== comment.id)
                        );
                      }
                    }}
                  >
                    <ArrowUturnLeftIcon className=" h-5 w-5 duration-200 hover:scale-125 active:scale-95 cursor-pointer" />
                  </div>
                  <div className=" flex justify-center items-center">
                    <span>{comment.replies}</span>
                  </div>
                </div>
              </div>
            </div>
            {showReplies.includes(comment.id) && (
              <CommentReplies commentId={comment.id} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
