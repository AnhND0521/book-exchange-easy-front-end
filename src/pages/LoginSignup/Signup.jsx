import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Select, Option } from "@material-tailwind/react";
import {
  Input,
  Popover,
  PopoverHandler,
  PopoverContent,
  Typography,
  Alert,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import "font-awesome/css/font-awesome.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const apiUrl = "http://localhost:8080/api/v1";

export const Signup = () => {
  const [birthDate, setBirthDate] = useState();
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [communeList, setCommuneList] = useState([]);

  const [formData, setFormData] = useState({});
  const [confirmPasswordMatches, setConfirmPasswordMatches] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fetchProvinceList = async () => {
    const response = await fetch(`${apiUrl}/address/provinces`);
    const data = await response.json();
    setProvinceList(data);
    console.log(data);
  };

  const fetchDistrictList = async (province) => {
    const response = await fetch(
      `${apiUrl}/address/districts?province-id=${province}`
    );
    const data = await response.json();
    setDistrictList(data);
    console.log(data);
  };

  const fetchCommuneList = async (district) => {
    const response = await fetch(
      `${apiUrl}/address/communes?district-id=${district}`
    );
    const data = await response.json();
    setCommuneList(data);
    console.log(data);
  };

  useEffect(() => {
    fetchProvinceList();
  }, []);

  useEffect(() => {
    if (formData.provinceId) fetchDistrictList(formData.provinceId);
  }, [formData.provinceId]);

  useEffect(() => {
    if (formData.districtId) fetchCommuneList(formData.districtId);
  }, [formData.districtId]);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);

    setError("");

    const response = await fetch(`${apiUrl}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      setError(data.message);
      return;
    }

    setSuccess(true);
    navigate("/login", { state: { success: true } });
  };

  return (
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form
              class="space-y-4 md:space-y-3"
              action="#"
              onSubmit={handleSubmit}
            >
                <div>
                  <Input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    label="Your Name"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData({ ...formData, name: event.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    label="Email"
                    placeholder="name@company.com"
                    onChange={(event) =>
                      setFormData({ ...formData, email: event.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    label="Password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        password: event.target.value,
                      })
                    }
                    required
                  />
                  {/* <Typography
                  variant="small"
                  color="gray"
                  className="mt-2 flex items-center gap-1 font-normal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="-mt-px h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Your password should contain at least 8 characters.
                </Typography> */}
                </div>
                <div>
                  <Input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="••••••••"
                    label="Confirm Password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(event) =>
                      setConfirmPasswordMatches(
                        event.target.value === formData.password
                      )
                    }
                    required
                    error={!confirmPasswordMatches}
                  />
                  {!confirmPasswordMatches && (
                    <Typography
                      variant="small"
                      color="red"
                      className="mt-2 flex items-center gap-1 font-normal"
                    >
                      Password and confirm password do not match!
                    </Typography>
                  )}
                </div>
                <div>
                  <Select
                    className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    label="Select role *"
                    onChange={(val) =>
                      setFormData({ ...formData, roles: [val] })
                    }
                    required
                  >
                    <Option value="BOOK_EXCHANGER">Book exchanger</Option>
                    <Option value="BOOKSTORE">Bookstore</Option>
                  </Select>
                </div>
                <div>
                  <Select
                    className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    label="Select gender *"
                    onChange={(val) =>
                      setFormData({ ...formData, gender: val.toUpperCase() })
                    }
                    required
                  >
                    <Option value="MALE">Male</Option>
                    <Option value="FEMALE">Female</Option>
                    <Option value="OTHER">Other</Option>
                  </Select>
                </div>

                <div className="relative">
                  <Popover placement="bottom">
                    <PopoverHandler>
                      <Input
                        label="Birth date"
                        onChange={() => null}
                        value={birthDate ? format(birthDate, "PPP") : ""}
                        className="cursor-pointer"
                      />
                    </PopoverHandler>
                    <PopoverContent className="p-2 shadow-lg rounded-md">
                      <DayPicker
                        mode="single"
                        selected={birthDate}
                        onSelect={(date) => {
                          setBirthDate(date);
                          setFormData({
                            ...formData,
                            birthDate: date.toISOString().slice(0, 10),
                          });
                        }}
                        showOutsideDays
                        fromYear={1930}
                        toYear={2024}
                        captionLayout="dropdown"
                        className="border-0"
                        classNames={{
                          caption:
                            "flex justify-between items-center py-2 mb-4 relative",
                          caption_label: "text-sm font-medium text-gray-900",
                          nav: "flex items-center",
                          nav_button:
                            "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                          nav_button_previous: "absolute left-1.5",
                          nav_button_next: "absolute right-1.5",
                          table: "w-full border-collapse",
                          head_row: "flex font-medium text-gray-900",
                          head_cell: "m-0.5 w-9 font-normal text-sm",
                          row: "flex w-full mt-2",
                          cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "h-9 w-9 p-0 font-normal",
                          day_range_end: "day-range-end",
                          day_selected:
                            "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                          day_today: "rounded-md bg-gray-200 text-gray-900",
                          day_outside:
                            "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                          day_disabled: "text-gray-500 opacity-50",
                          day_hidden: "invisible",
                        }}
                        components={{
                          IconLeft: ({ ...props }) => (
                            <ChevronLeftIcon
                              {...props}
                              className="h-4 w-4 stroke-2"
                            />
                          ),
                          IconRight: ({ ...props }) => (
                            <ChevronRightIcon
                              {...props}
                              className="h-4 w-4 stroke-2"
                            />
                          ),
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    label="Phone Number"
                    placeholder="xxx-xxx-xxxx"
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        phoneNumber: event.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Select
                    className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    label="City / Province"
                    // value={formData.provinceId}
                    onChange={(val) => {
                      setFormData({ ...formData, provinceId: val });
                    }}
                  >
                    {provinceList.map((p) => (
                      <Option key={p.id} value={p.id}>
                        {p.name}
                      </Option>
                    ))}
                  </Select>
                </div>

                {districtList.length > 0 && (
                  <div>
                    <Select
                      className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      label="District"
                      // value={formData.districtId}
                      onChange={(val) => {
                        setFormData({ ...formData, districtId: val });
                      }}
                    >
                      {districtList.map((d) => (
                        <Option key={d.id} value={d.id}>
                          {d.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                )}

                {communeList.length > 0 && (
                  <div>
                    <Select
                      className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      label="Ward / Commune"
                      // value={formData.communeId}
                      onChange={(val) => {
                        setFormData({ ...formData, communeId: val });
                      }}
                    >
                      {communeList.map((c) => (
                        <Option key={c.id} value={c.id}>
                          {c.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                )}

                {formData.communeId && (
                  <div>
                    <Input
                      type="text"
                      name="detailedAddress"
                      id="detailedAddress"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      label="Detailed Address"
                      placeholder="123 Main Street"
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          detailedAddress: event.target.value,
                        })
                      }
                    />
                  </div>
                )}

              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label
                    for="terms"
                    class="font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                class="w-full text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Create an account
              </button>
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login now
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      {error && (
        <Alert
          color="red"
          className={`fixed top-0 left-1/2 transform -translate-x-1/2 py-4 px-6 rounded-md shadow-md`}
        >
          {error}
        </Alert>
      )}
    </section>
  );
};

export default Signup;
