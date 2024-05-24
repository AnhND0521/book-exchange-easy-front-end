import React, { useEffect, useState } from "react";
import bookCover from "../../components/books/book-cover-default.png";
import Pic from "./ex.jpg";
import Pic2 from "./icons8-plus-24.png"
import Pic3 from"./icons8-heart-24.png";
import { BookOpenIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import { Button } from "@material-tailwind/react"
import ExchangeBookDialog from "../../components/exchange/ExchangeBookDialog";
import ExchangeMoneyDialog from "../../components/exchange/ExchangeMoneyDialog";
import WrapBar from "../../components/WrapBar";
import { useParams } from "react-router";

const apiUrl = "http://localhost:8080/api/v1";

const BookDetail = (props) => {
  const { id } = useParams();

  const [openExchangeBook, setOpenExchangeBook] = React.useState(false);
  const [openExchangeMoney, setOpenExchangeMoney] = React.useState(false)
  const handleOpenExchangeBook = () => setOpenExchangeBook((cur) => !cur);
  const handleOpenExchangeMoney = () => setOpenExchangeMoney((cur) => !cur);

  const [book, setBook] = useState();
  const [owner, setOwner] = useState();

  const fetchData = async(id) => {
    const bookResponse = await fetch(`${apiUrl}/books/${id}`);
    const bookData = await bookResponse.json();
    setBook(bookData);
    console.log(bookData);

    const userResponse = await fetch(`${apiUrl}/users/${bookData.ownerId}`);
    const userData = await userResponse.json();
    setOwner(userData);
    console.log(userData);
  }

  useEffect(() => {
    fetchData(id);
  }, []);

  return (
    <WrapBar>
      <div class="space-y-5">
        <div class="max-w-6xl mx-auto px-5 space-y-5">
          <div class="flex space-x-10">
            <div className="flex flex-col space-y-2">
              <div><img class="w-72 h-96 rounded-lg  shadow-lg" src= {book?.imagePath || bookCover} alt="book"/></div>
              <div className="flex flex-col space-y-2">
                <Button 
                  className="flex items-center font-serif text-nowrap space-x-2 p-4 rounded-lg bg-white text-red-500 w-full h-full justify-center hover:bg-gray-200"
                  onClick={handleOpenExchangeMoney}
                >
                  <BanknotesIcon className="h-6 w-6"/>
                  <div>Exchange with money</div>
                </Button>
                <Button 
                  className="flex items-center font-serif text-nowrap space-x-2 p-4 rounded-lg bg-white text-red-500 w-full h-full justify-center hover:bg-gray-200"
                  onClick={handleOpenExchangeBook}
                >
                  <BookOpenIcon className="h-6 w-6"/>
                  <div>Exchange with another book</div>
                </Button>
                <ExchangeBookDialog
                  open={openExchangeBook}
                  handleOpen={handleOpenExchangeBook}
                  img={Pic}
                />
                <ExchangeMoneyDialog
                  open={openExchangeMoney}
                  handleOpen={handleOpenExchangeMoney}
                  img={Pic}
                />
              </div>
            </div>
            <div class="flex-1 space-y-2">
              <div className="flex h-24 space-x-4">
                <button class="flex items-center font-serif text-nowrap space-x-2 p-4 rounded-lg bg-blue-100 text-blue-500 w-1/2 h-1/2 justify-center hover:bg-blue-200">
                  <img class="h-5 w-5" src= {Pic2} alt="add"/>
                  <div>Offer</div>
                </button>
                <button class="flex items-center font-serif text-nowrap space-x-2 p-4 rounded-lg bg-pink-100 text-pink-500 w-1/2 h-1/2 justify-center hover:bg-pink-200">
                  <img class="h-5 w-5" src={Pic3} alt="add-for-wish"/>
                  <div >Add to interest</div>
                </button>
              </div>
              <div class="text-3xl text-gray-800 font-bold ">{book?.title}</div>
              <div class="text-2xl text-blue-500 font-bold ">{book?.author}</div>
              <div class="text-lg text-blue-500">Owner: <a class="text-blue-500 hover:underline">{owner?.name}</a></div>
              {/* <div class="text-lg flex space-x-3">
                <div>2020</div>
                <div>32 psl.</div>
                <div>ISBN 9786094280245</div>
              </div> */}
              <div class="text-sm italic space-y-1">
                {book?.publisher && <div>Publisher: {book?.publisher} </div> }
                {book?.publishYear && <div>Publish year: {book?.publishYear} </div> }
                {book?.language && <div>Language: {book?.language} </div> }
                {book?.weight && <div>Weight: {book?.weight} </div> }
                {book?.size && <div>Size: {book?.size} </div> }
                {book?.pages && <div>Number of pages: {book?.pages} </div> }
                {book?.layout && <div>Format: {book?.layout} </div> }
              </div>
              <div class="text-lg font-sans">
                <p>{book?.description || 'Không có mô tả.'}</p>
              </div>
              <div class="space-x-2 text-lg text-blue-500">
                {book?.categories.length > 0 && book?.categories.map(c => (
                  <a class="hover:underline">{c}</a>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </WrapBar>
  );
};
export default BookDetail;
