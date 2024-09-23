import { useEffect, useState } from "react";
import bookCover from "../../components/books/book-cover-default.png";
import Pic from "./ex.jpg";
import Pic2 from "./icons8-plus-24.png";
import Pic3 from "./icons8-heart-24.png";
import {
  BookOpenIcon,
  BanknotesIcon,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/outline";
import { Button, Typography } from "@material-tailwind/react";
import ExchangeBookDialog from "../../components/exchange/ExchangeBookDialog";
import ExchangeMoneyDialog from "../../components/exchange/ExchangeMoneyDialog";
import WrapBar from "../../components/WrapBar";
import { useParams } from "react-router";
import { useCookies } from "react-cookie";
import environment from "../../environment";
import SuccessMessage from "../../components/SuccessMessage";
import ExchangeOffersTable from "../../components/exchange/ExchangeOffersTable";
import ChatMain from "../../components/chat/ChatMain";

const BookDetail = (props) => {
  const { id } = useParams();

  const [openExchangeBook, setOpenExchangeBook] = useState(false);
  const [openExchangeMoney, setOpenExchangeMoney] = useState(false);
  const handleOpenExchangeBook = () => setOpenExchangeBook((cur) => !cur);
  const handleOpenExchangeMoney = () => setOpenExchangeMoney((cur) => !cur);

  const [book, setBook] = useState();
  const [owner, setOwner] = useState();

  const [openOfferSuccessMessage, setOpenOfferSuccessMessage] = useState(false);

  const [cookies, setCookie] = useCookies(["accessToken", "user"]);
  const thisUser = cookies["user"];

  const [interested, setInterested] = useState(false);

  const addBookToInterest = async () => {
    const response = await fetch(`${environment.apiUrl}/books/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...book,
        concernedUserIds: [...book.concernedUserIds, thisUser.id],
      }),
    });
    if (response.ok) {
      setInterested(true);
    }
  };

  const removeBookFromInterest = async () => {
    const response = await fetch(`${environment.apiUrl}/books/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...book,
        concernedUserIds: book.concernedUserIds.filter(
          (userId) => userId != thisUser.id
        ),
      }),
    });
    if (response.ok) {
      setInterested(false);
    }
  };

  const fetchData = async (id) => {
    const bookResponse = await fetch(`${environment.apiUrl}/books/${id}`);
    const bookData = await bookResponse.json();
    setBook(bookData);
    setInterested(bookData.concernedUserIds.includes(thisUser.id));
    console.log(bookData);

    const userResponse = await fetch(
      `${environment.apiUrl}/users/${bookData.ownerId}`
    );
    const userData = await userResponse.json();
    setOwner(userData);
  };

  useEffect(() => {
    fetchData(id);
  }, []);

  const [openChat, setOpenChat] = useState(false);

  return (
    <WrapBar>
      <div className="space-y-5">
        <div className="max-w-6xl mx-auto px-5 space-y-5">
          <div className="flex space-x-10">
            <div className="flex flex-col space-y-2">
              <div>
                <img
                  className="w-72 h-96 rounded-lg  shadow-lg"
                  src={book?.imagePath || bookCover}
                  alt="book"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  className="flex items-center font-serif text-nowrap space-x-2 p-4 rounded-lg bg-blue-100 text-blue-500 w-full h-1/2 justify-center hover:bg-blue-200"
                  onClick={() => setOpenChat(true)}
                >
                  <ChatBubbleOvalLeftIcon className="h-5 w-5" />
                  <div>Contact owner</div>
                </button>
                {!interested ? (
                  <button
                    className={`flex items-center font-serif text-nowrap space-x-2 p-4 rounded-lg bg-pink-100 text-pink-500 w-full h-1/2 justify-center hover:bg-pink-200`}
                    onClick={addBookToInterest}
                  >
                    <img class="h-5 w-5" src={Pic3} alt="add-for-wish" />
                    <div>Add to interest</div>
                  </button>
                ) : (
                  <button
                    className={`flex items-center font-serif text-nowrap space-x-2 p-4 rounded-lg bg-pink-200 text-pink-500 w-full h-1/2 justify-center hover:bg-pink-100`}
                    onClick={removeBookFromInterest}
                  >
                    <img class="h-5 w-5" src={Pic3} alt="add-for-wish" />
                    <div>Remove from interest</div>
                  </button>
                )}
              </div>
            </div>
            <div class="flex-1 space-y-2">
              <div class="text-3xl text-gray-800 font-bold ">{book?.title}</div>
              <div class="text-2xl text-blue-500 font-bold ">
                {book?.author}
              </div>
              <div class="text-lg text-blue-500">
                Owner:{" "}
                <a class="text-blue-500 hover:underline">{owner?.name}</a>
              </div>
              {/* <div class="text-lg flex space-x-3">
                <div>2020</div>
                <div>32 psl.</div>
                <div>ISBN 9786094280245</div>
              </div> */}
              <div class="text-sm italic space-y-1">
                {book?.publisher && <div>Publisher: {book?.publisher} </div>}
                {book?.publishYear && (
                  <div>Publish year: {book?.publishYear} </div>
                )}
                {book?.language && <div>Language: {book?.language} </div>}
                {book?.weight && <div>Weight: {book?.weight} </div>}
                {book?.size && <div>Size: {book?.size} </div>}
                {book?.pages && <div>Number of pages: {book?.pages} </div>}
                {book?.layout && <div>Format: {book?.layout} </div>}
                {book?.status && <div>Status: {book?.status} </div>}
              </div>
              <div class="text-lg font-sans">
                <p>{book?.description || "No description."}</p>
              </div>
              <div class="space-x-2 text-lg text-blue-500">
                {book?.categories.length > 0 &&
                  book?.categories.map((c) => (
                    <a class="hover:underline">{c}</a>
                  ))}
              </div>
              <div className="flex space-x-4 mb-10">
                {thisUser?.id !== book?.ownerId &&
                  book?.status === "AVAILABLE" && (
                    <>
                      <Button
                        className="flex items-center font-serif text-nowrap space-x-2 p-4 rounded-lg bg-white text-red-500 w-full justify-center hover:bg-gray-200"
                        onClick={handleOpenExchangeMoney}
                      >
                        <BanknotesIcon className="h-6 w-6" />
                        <div>Exchange with money</div>
                      </Button>
                      <Button
                        className="flex items-center font-serif text-nowrap space-x-2 p-4 rounded-lg bg-white text-red-500 w-full justify-center hover:bg-gray-200"
                        onClick={handleOpenExchangeBook}
                      >
                        <BookOpenIcon className="h-6 w-6" />
                        <div>Exchange with another book</div>
                      </Button>
                    </>
                  )}
                <ExchangeBookDialog
                  open={openExchangeBook}
                  handleOpen={handleOpenExchangeBook}
                  handleSuccess={() => setOpenOfferSuccessMessage(true)}
                  book={book}
                  owner={owner}
                />
                <ExchangeMoneyDialog
                  open={openExchangeMoney}
                  handleOpen={handleOpenExchangeMoney}
                  handleSuccess={() => setOpenOfferSuccessMessage(true)}
                  book={book}
                  owner={owner}
                />
              </div>
            </div>
          </div>

          {thisUser?.id === book?.ownerId && book?.status === "AVAILABLE" && (
            <div className="flex flex-col gap-5 items-start">
              <Typography variant="h5" className="text-lg">
                Exchange Offers
              </Typography>
              <ExchangeOffersTable book={book} />
            </div>
          )}
        </div>
      </div>
      <SuccessMessage
        message="Offer sent successfully!"
        open={openOfferSuccessMessage}
        handleClose={() => setOpenOfferSuccessMessage(false)}
      />
      {openChat && (
        <ChatMain
          open={openChat}
          handleClose={() => setOpenChat(false)}
          partnerId={book?.ownerId}
        />
      )}
    </WrapBar>
  );
};
export default BookDetail;
