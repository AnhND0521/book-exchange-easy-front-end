import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import Signup from "./pages/LoginSignup/Signup";
import Login from "./pages/LoginSignup/Login";
import Forgot from "./pages/LoginSignup/Forgot";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Events from "./pages/Events";
import InterestBooks from "./pages/InterestBooks";
import MyBooks from "./pages/MyBooks";
import BookDetail from "./pages/BookDetail/BookDetail";
import SettingPage from "./pages/setting-user/SettingPage";
import EventDetails from "./pages/EventDetails";
import Notfound from "./pages/Notfound/Notfound";
import UserProfile from "./pages/UserProfile/UserProfile";
import TransactionHistory from "./pages/TransactionHistory";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Users from "./pages/Users";
import Transactions from "./pages/Transactions";
import ResetPassword from "./pages/LoginSignup/ResetPassword";
import Activate from "./pages/LoginSignup/Activate";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/activate" element={<Activate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<Forgot />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="home" element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="interest" element={<InterestBooks />} />
          <Route path="mybook" element={<MyBooks />} />
          <Route path="book/:id" element={<BookDetail />} />
          <Route path="/setting" element={<SettingPage />} />
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books-admin" element={<Books />} />
          <Route path="/users-admin" element={<Users />} />
          <Route path="/transactions-admin" element={<Transactions />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
