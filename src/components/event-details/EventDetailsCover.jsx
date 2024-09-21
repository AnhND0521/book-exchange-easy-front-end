import { Button, Card } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import EventMenu from './EventMenu'
import { useCookies } from 'react-cookie'
import environment from '../../environment'

const EventDetailsCover = (props) => {
  const { event } = props;
  console.log(event);

  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
  const thisUser = cookies['user'];

  const [interested, setInterested] = useState(false);

  useEffect(() => {
    setInterested(event.concernedUserIds?.includes(thisUser.id));
  }, [event])

  const addEventToInterest = async () => {
    const response = await fetch(`${environment.apiUrl}/events/${event.id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          ...event,
          concernedUserIds: [...event.concernedUserIds, thisUser.id]
        }
      ),
    })
    if (response.ok) {
      setInterested(true);
    }
  }

  const removeEventFromInterest = async () => {
    const response = await fetch(`${environment.apiUrl}/events/${event.id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          ...event,
          concernedUserIds: event.concernedUserIds.filter(userId => userId != thisUser.id)
        }
      ),
    })
    if (response.ok) {
      setInterested(false);
    }
  }

  return (
    <div className=" relative -top-5 h-72 w-full col-span-11 col-start-2 pr-4 overflow-hidden">
      <Card className=" w-full h-full flex flex-col rounded-md">
        <img
          src={event.imagePath}
          alt="image 1"
          className="h-full w-full object-cover rounded-md"
        />
        <div className=" absolute bottom-10 w-3/4 ml-36 p-3 bg-black/50 flex flex-row rounded-lg">
          <div className=" w-5/6 text-white ">
            <div>
              <h2 className=" text-3xl mb-1">{event.name}</h2>
            </div>
            <div className=" text-xs text-white/80">
              from <span>{event.startTime?.substring(0, 10)}</span> to <span>{event.endTime?.substring(0, 10)}</span>
            </div>
          </div>
          <div className=" w-1/4 flex flex-row justify-center items-center gap-2">
            {
              !interested ?
              <Button variant='filled' color='blue' className=" text-white duration-150 hover:scale-90" onClick={addEventToInterest}>
                Interested
              </Button> :
              <Button color='blue' className="bg-white text-black duration-150 hover:scale-90" onClick={removeEventFromInterest}>
                Uninterested
              </Button>
            }
            {
              cookies['user'].id === event.ownerId && <EventMenu event={event} />
            }
          </div>
        </div>
      </Card>
    </div>
  )
}

export default EventDetailsCover