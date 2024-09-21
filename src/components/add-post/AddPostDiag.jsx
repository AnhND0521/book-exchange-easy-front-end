import React, { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import environment from "../../environment";
export function AddPostDiag(props) {
  const { eventId } = props;
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  const handleChange = (e) => {
    setImagePath(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${environment.apiUrl}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: cookies["user"].id,
          title: title,
          content: content,
          eventId: eventId,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const formData = new FormData();
        formData.append("imageFile", image);

        const imageResponse = await fetch(
          `${environment.apiUrl}/posts/${data.id}/upload-image-post`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          const response = await fetch(
            `http://localhost:8080/api/v1/posts/${data.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...data,
                imagePath: imageData.message,
              }),
            }
          );
          if (response.ok) {
            navigate(0);
          }
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        className="w-full h-12 bg-blue-500 montserrat-font"
      >
        <div className="flex justify-center items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          <div className="font-black">Add post</div>
        </div>
      </Button>
      <Dialog
        size="xl"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none nunito-font"
      >
        <Card className="mx-auto w-full max-w-[600px] pt-5">
          <div className=" flex flex-row items-center">
            <div className=" w-11/12">
              <Typography variant="h4" color="blue-gray" className="ml-5">
                Create a new post
              </Typography>
            </div>
            <div>
              <button
                onClick={handleOpen}
                className=" flex justify-center items-center"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500 duration-300 hover:text-red-300" />
              </button>
            </div>
          </div>
          <CardBody className="flex flex-col gap-4 max-h-[500px] overflow-y-auto scroll-smooth">
            <form onSubmit={handleSubmit}>
              <Typography className="mb-2" variant="h6">
                Title
              </Typography>
              <Input
                label="Title"
                size="lg"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Typography className="mb-2" variant="h6">
                Content
              </Typography>
              <Textarea
                label="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <Typography className="mb-2" variant="h6">
                Image
              </Typography>
              <Input
                label="Image"
                size="lg"
                type="file"
                accept="image/png, image/jpeg"
                className=" flex justify-center items-center"
                onChange={handleChange}
              />
              <img src={imagePath} className="w-full mb-2" />
              <Button
                variant="gradient"
                color="blue"
                type="submit"
                className="w-full justify-center"
                loading={loading}
                disabled={loading}
              >
                Post
              </Button>
            </form>
          </CardBody>
        </Card>
      </Dialog>
    </>
  );
}
