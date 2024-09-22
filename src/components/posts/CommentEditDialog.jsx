import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button, Card, CardBody, Dialog, Input, Textarea, Typography } from '@material-tailwind/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import environment from '../../environment';

const CommentEditDialog = (props) => {
  const { open, handleOpen, comment, loadComments } = props;
  const navigate = useNavigate();
  const [commentData, setCommentData] = useState(comment);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${environment.apiUrl}/comments/${comment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      })
      setLoading(false);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        loadComments();
        handleOpen();
        return;
      }
    }
    catch(err) {
      console.log(err);
      setLoading(false);
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
              Edit comment
            </Typography>
          </div>
          <div>
            <button onClick={handleOpen} className=" flex justify-center items-center">
              <XMarkIcon className="h-6 w-6 text-gray-500 duration-300 hover:text-red-300" />
            </button>
          </div>
        </div>
        <CardBody className="flex flex-col gap-4 max-h-[500px] overflow-y-auto scroll-smooth">
          <form onSubmit={handleSubmit}>
            <Textarea 
              label="Content" 
              value={commentData.content} 
              onChange={e => setCommentData({ ...commentData, content: e.target.value })}
              className="mb-2" />
            <Button variant="gradient" color="blue" type="submit" className="w-full justify-center" loading={loading} disabled={loading}>
              Finish
            </Button>
          </form>
        </CardBody>
      </Card>
    </Dialog>
  )
}

export default CommentEditDialog