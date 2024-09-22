import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button, Card, CardBody, Dialog, Input, Textarea, Typography } from '@material-tailwind/react'
import moment from 'moment/moment';
import { useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';

const EventEditDialog = (props) => {
  const { open, handleOpen, event } = props;

  const navigate = useNavigate();
  const start = new Date(event.startTime);
  const end = new Date(event.endTime);

  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
  const [name, setName] = useState(event.name);
  const [description, setDescription] = useState(event.description);
  const [startDate, setStartDate] = useState(moment(start).format('YYYY-MM-DD'));
  const [startTime, setStartTime] = useState(moment(start).format('hh:mm'));
  const [endDate, setEndDate] = useState(moment(end).format('YYYY-MM-DD'));
  const [endTime, setEndTime] = useState(moment(end).format('hh:mm'));
  console.log(event)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const start = `${startDate}T${startTime}:00.000Z`;
    const end = `${endDate}T${endTime}:00.000Z`;

    const body = {
      id: event.id,
      ownerId: cookies['user'].id,
      name: name,
      description: description,
      startTime: start,
      endTime: end,
      imagePath: event.imagePath
    }
    console.log(body);

    try {
      const response = await fetch(`http://localhost:8080/api/v1/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      if (response.ok) {
        const data = await response.json();
        navigate(0);
      }
    }
    catch(err) {
      console.log(err);
    }
  }

  return (
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
              Edit event
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
            <Typography className="-mb-2" variant="h6">
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
                />
              </div>
            </div>
            <Typography className="-mb-2" variant="h6">
              Description
            </Typography>
            <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
            <Button variant="gradient" color="blue" type="submit">
              Finish
            </Button>
          </form>
        </CardBody>
      </Card>
    </Dialog>
  )
}

export default EventEditDialog