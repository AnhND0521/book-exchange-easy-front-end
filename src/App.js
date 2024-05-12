import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginSignup from "./pages/LoginSignup/LoginSignup";
import Home from "./pages/Home";
import WrapBar from "./components/WrapBar";
import Explore from "./pages/Explore";
import Event from "./pages/Event";
import InterestBooks from "./pages/InterestBooks";
import MyBooks from "./pages/MyBooks";
import BookDetail from "./pages/BookDetail/BookDetail";
import SettingPage from "./pages/setting-user/SettingPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginSignup />} />
        </Routes>
        <WrapBar>
          <Routes>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="events" element={<Event />} />
            <Route path="interest" element={<InterestBooks />} />
            <Route path="mybook/:user" element={<MyBooks />} />
            <Route path="book/:id" element={<BookDetail />} />
            <Route path="setting" element={<SettingPage />} />
          </Routes>
        </WrapBar>
      </BrowserRouter>
    </div>
  );
}
export default App;
