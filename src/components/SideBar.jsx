import { List, ListItem, ListItemPrefix, Button } from "@material-tailwind/react";
import {
  HomeIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  BookOpenIcon,
  CreditCardIcon,
  ChartBarIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/outline";
import environment from "../environment";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";

export function MySidebar() {
  const [cookies, setCookie, removeCookie] = useCookies(['user', 'token']);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const thisUser = cookies['user'];

  const fetchData = async () => {
      if (!thisUser) {
          window.alert("Your session has expired. Please sign in again.");
          navigate('/login');
          return;
      }
  
      const response = await fetch(`${environment.apiUrl}/users/${thisUser.id}`);
      const data = await response.json();
      setUser(data);
    }

  useEffect(() => {
      fetchData();
  }, [] );

  return (
    <div className="min-h-96 w-full max-w-[20rem] bg-secondary pt-5 pr-5 pl-5">
      <List>
        <Link to="/home">
          <ListItem>
            <ListItemPrefix>
              <HomeIcon className="h-5 w-5" />
            </ListItemPrefix>
            Home
          </ListItem>
        </Link>
        <Link to="/explore">
          <ListItem>
            <ListItemPrefix>
              <Squares2X2Icon className="h-5 w-5" />
            </ListItemPrefix>
            Explore
          </ListItem>
        </Link>
        <Link to="/events">
          <ListItem>
            <ListItemPrefix>
              <CalendarDaysIcon className="h-5 w-5" />
            </ListItemPrefix>
            Community
          </ListItem>
        </Link>
        <Link to="/interest">
          <ListItem>
            <ListItemPrefix>
              <StarIcon className="h-5 w-5" />
            </ListItemPrefix>
            Interest
          </ListItem>
        </Link>
        <Link to="/mybook">
          <ListItem>
            <ListItemPrefix>
              <BookOpenIcon className="h-5 w-5" />
            </ListItemPrefix>
            My books
          </ListItem>
        </Link>
        <Link to="/transactions">
          <ListItem>
            <ListItemPrefix>
              <CreditCardIcon className="h-5 w-5" />
            </ListItemPrefix>
            My transactions
          </ListItem>
        </Link>
        <Link to="/setting">
          <ListItem>
            <ListItemPrefix>
              <Cog6ToothIcon className="h-5 w-5" />
            </ListItemPrefix>
            Settings
          </ListItem>
        </Link>
        {
          user.roles?.includes('ADMIN') &&
          <>
            <Link to="/dashboard">
              <ListItem>
                <ListItemPrefix>
                  <ChartBarIcon className="h-5 w-5" />
                </ListItemPrefix>
                Dashboard
              </ListItem>
            </Link>
            <Link to="/books-admin">
              <ListItem>
                <ListItemPrefix>
                  <BookOpenIcon className="h-5 w-5" />
                </ListItemPrefix>
                Manage Books
              </ListItem>
            </Link>
            <Link to="/users-admin">
              <ListItem>
                <ListItemPrefix>
                  <UsersIcon className="h-5 w-5" />
                </ListItemPrefix>
                Manage Users
              </ListItem>
            </Link>
            <Link to="/transactions-admin">
              <ListItem>
                <ListItemPrefix>
                  <CreditCardIcon className="h-5 w-5" />
                </ListItemPrefix>
                Manage Transactions
              </ListItem>
            </Link>
          </>
        }
      </List>
    </div>
  );
}
