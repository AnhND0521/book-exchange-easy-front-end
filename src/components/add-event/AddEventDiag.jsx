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
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import environment from "../../environment";

export function AddEventDiag() {
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [image, setImage] = useState();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const [loading, setLoading] = useState(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const start = `${startDate}T${startTime}:00.000Z`;
  //   const end = `${endDate}T${endTime}:00.000Z`;

  //   try {
  //     const response = await fetch('http://localhost:8080/api/v1/events', {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         ownerId: cookies['user'].id,
  //         name: name,
  //         description: description,
  //         startTime: start,
  //         endTime: end,
  //         concernedUserIds: []
  //       }),
  //     })
  //     if (response.ok) {
  //       const data = await response.json();
  //       navigate(`/events/${data.id}`);
  //     }
  //   }
  //   catch(err) {
  //     console.log(err);
  //   }
  // }

  const handleChange = (e) => {
    setImagePath(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const start = `${startDate}T${startTime}:00.000Z`;
    const end = `${endDate}T${endTime}:00.000Z`;

    try {
      const response = await fetch('http://localhost:8080/api/v1/events', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerId: cookies['user'].id,
          name: name,
          description: description,
          startTime: start,
          endTime: end,
          concernedUserIds: []
        }),
      });
      setLoading(false);
      if (response.ok) {
        const data = await response.json();
        const formData = new FormData();
        formData.append("imageFile", image);

        const imageResponse = await fetch(`${environment.apiUrl}/events/${data.id}/upload-image-event`, {
          method: "POST",
          body: formData,
        });
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          const response = await fetch(`http://localhost:8080/api/v1/events/${data.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...data,
              imagePath: imageData.message,
            }),
          })
          if (response.ok) {
            navigate(`/events/${data.id}`);
          }
        }
      }
    }
    catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={handleOpen} className="w-full h-12 bg-blue-500 montserrat-font">
        <div className="flex justify-center items-center">
          <PlusIcon className="h-5 w-5 mr-2"/>
          <div className="font-black">
            Create new event
          </div>
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
                Add a new event
              </Typography>
            </div>
            <div>
              <button onClick={handleOpen} className=" flex justify-center items-center">
                <XMarkIcon className="h-6 w-6 text-gray-500 duration-300 hover:text-red-300" />
              </button>
            </div>
          </div>
          <CardBody className="flex flex-col gap-4 max-h-[500px] mb-4 overflow-y-auto scroll-smooth">
            <form onSubmit={handleSubmit}>
              <Typography className="mb-2" variant="h6">
                Name
              </Typography>
              <Input label="Name" size="lg" required value={name} onChange={(e) => setName(e.target.value)} />
              <div className=" flex gap-2 w-full">
                <div className=" h-full w-full">
                  <Typography className="mb-2" variant="h6">
                    Start date
                  </Typography>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    className=" h-full w-full p-2.5 border border-[#b0bec5] rounded-md font-roboto text-sm"
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className=" h-full w-full">
                  <Typography className="mb-2" variant="h6">
                    Start time
                  </Typography>
                  <input
                    type="time"
                    name="startTime"
                    id="startTime"
                    className=" h-full w-full p-2.5 border border-[#b0bec5] rounded-md font-roboto text-sm"
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className=" flex gap-2 w-full">
                <div className=" h-full w-full">
                  <Typography className="mb-2" variant="h6">
                    End date
                  </Typography>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    className=" h-full w-full p-2.5 border border-[#b0bec5] rounded-md font-roboto text-sm"
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
                <div className=" h-full w-full">
                  <Typography className="mb-2" variant="h6">
                    End time
                  </Typography>
                  <input
                    type="time"
                    name="endTime"
                    id="endTime"
                    className=" h-full w-full p-2.5 border border-[#b0bec5] rounded-md font-roboto text-sm"
                    value={endTime} 
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Typography className="mb-2" variant="h6" value={description} onChange={(e) => setDescription(e.target.value)}>
                Description
              </Typography>
              <Textarea label="Description" />
              <Typography className="mb-2" variant="h6">
                Cover image
              </Typography>
              <Input
                label="Image"
                size="lg"
                type="file"
                accept="image/png, image/jpeg"
                className=" flex justify-center items-center"
                onChange={handleChange}
                required
              />
              <img src={imagePath} className="w-full mb-2" />
              <Button variant="gradient" color="blue" type="submit" className="w-full justify-center" loading={loading} disabled={loading} >
                Create event
              </Button>
            </form>
          </CardBody>
        </Card>
      </Dialog>
    </>
  );
}

//todo : require attribute
/*
 {
  "id": 0,
  "ownerId": 0,
  "name": "string",
  "author": "string",
  "publisher": "string",
  "publishYear": 0,
  "language": "string",
  "weight": "string",
  "size": "string",
  "pages": 0,
  "layout": "string",
  "description": "string",
  "imagePath": "string",
  "status": "string",
  "created": "2024-05-07T08:39:48.062Z"
}
 */
