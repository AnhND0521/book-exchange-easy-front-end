import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Select, Option, Button } from "@material-tailwind/react";
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

const apiUrl = "http://localhost:8080/api/v1";

export const Signup = () => {
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [communeList, setCommuneList] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: undefined,
    phoneNumber: "",
    roles: ["BOOK_EXCHANGER"],
    gender: "MALE",
  });
  const [error, setError] = useState("");
  const [errorMap, setErrorMap] = useState({});
  const [anyErrors, setAnyErrors] = useState(false);
  const [anyRequiredFieldsEmpty, setAnyRequiredFieldsEmpty] = useState(true);
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const checkErrors = (formData, errorMap) => {
    const keys = Object.keys(errorMap);
    for (let i = 0; i < keys.length; i++) {
      if (errorMap[keys[i]] !== "") {
        setAnyErrors(true);
        return;
      }
    }
    setAnyErrors(false);

    let requiredFields = ["name", "email", "password", "confirmPassword"];
    for (let i = 0; i < requiredFields.length; i++) {
      if (!formData[requiredFields[i]] || formData[requiredFields[i]] === "") {
        setAnyRequiredFieldsEmpty(true);
        return;
      }
    }
    setAnyRequiredFieldsEmpty(false);
  };

  const updateData = (formData) => {
    setFormData(formData);

    let tmpErrorMap = { ...errorMap };
    Object.keys(errorMap).forEach((key) => {
      tmpErrorMap[key] = "";
    });
    console.log(formData);

    if (formData.name.length > 0 && formData.name.trim().length === 0) {
      tmpErrorMap.name = "Your name should not be empty.";
    }

    if (!formData.name.match(/^[A-Za-z0-9 ]*$/)) {
      console.log("ABC");
      tmpErrorMap.name =
        "Your name should contain letters, digits or spaces only.";
    }

    if (formData.email.length > 0 && !formData.email.match(/^.+@.+$/)) {
      tmpErrorMap.email = "Please input a valid email.";
    }

    if (formData.password.length > 0 && formData.password.length < 8) {
      tmpErrorMap.password = "Your password should have at least 8 characters.";
    }

    if (
      formData.confirmPassword.length > 0 &&
      formData.confirmPassword !== formData.password
    ) {
      tmpErrorMap.confirmPassword =
        "Confirm password does not match with password.";
    }

    if (formData.birthDate && formData.birthDate >= Date.now()) {
      tmpErrorMap.birthDate = "Your birth date should be before current date.";
    }

    if (
      formData.phoneNumber.length > 0 &&
      !formData.phoneNumber.match(/[0-9]{8,12}/)
    ) {
      tmpErrorMap.phoneNumber = "Please input a valid phone number.";
    }

    console.log(tmpErrorMap);
    setErrorMap(tmpErrorMap);
    checkErrors(formData, tmpErrorMap);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (formData.birthDate)
      formData.birthDate = formData.birthDate.toISOString().slice(0, 10);
    console.log(formData);

    setError("");

    const response = await fetch(`${apiUrl}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setLoading(false);

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      if (response.status === 500) {
        setError("There was some error.");
        return;
      }
      setError(data.message);
      return;
    }

    console.log("Success");
    setSuccess(true);
  };

  return (
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {!success?"Create an account":"Account created successfully!"}
            </h1>
            {!success && (
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
                      updateData({ ...formData, name: event.target.value })
                    }
                    required
                  />
                  {errorMap.name && (
                    <Typography
                      variant="small"
                      color="red"
                      className="mt-2 flex items-center gap-1 font-normal"
                    >
                      {errorMap.name}
                    </Typography>
                  )}
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
                      updateData({ ...formData, email: event.target.value })
                    }
                    required
                    email
                  />
                  {errorMap.email && (
                    <Typography
                      variant="small"
                      color="red"
                      className="mt-2 flex items-center gap-1 font-normal"
                    >
                      {errorMap.email}
                    </Typography>
                  )}
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
                      updateData({
                        ...formData,
                        password: event.target.value,
                      })
                    }
                    required
                  />
                  {errorMap.password && (
                    <Typography
                      variant="small"
                      color="red"
                      className="mt-2 flex items-center gap-1 font-normal"
                    >
                      {errorMap.password}
                    </Typography>
                  )}
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
                      updateData({
                        ...formData,
                        confirmPassword: event.target.value,
                      })
                    }
                    required
                  />
                  {errorMap.confirmPassword && (
                    <Typography
                      variant="small"
                      color="red"
                      className="mt-2 flex items-center gap-1 font-normal"
                    >
                      {errorMap.confirmPassword}
                    </Typography>
                  )}
                </div>
                <div>
                  <Select
                    className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    label="Select role *"
                    value="BOOK_EXCHANGER"
                    onChange={(val) =>
                      setFormData({ ...formData, roles: [val] })
                    }
                    required
                  >
                    <Option value="BOOK_EXCHANGER" selected={true}>
                      Book exchanger
                    </Option>
                    <Option value="BOOKSTORE">Bookstore</Option>
                  </Select>
                </div>
                <div>
                  <Select
                    className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    label="Select gender *"
                    value="MALE"
                    onChange={(val) =>
                      setFormData({ ...formData, gender: val.toUpperCase() })
                    }
                    required
                  >
                    <Option value="MALE" selected>
                      Male
                    </Option>
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
                        value={
                          formData.birthDate
                            ? format(formData.birthDate, "PPP")
                            : ""
                        }
                        className="cursor-pointer"
                      />
                    </PopoverHandler>
                    <PopoverContent className="p-2 shadow-lg rounded-md">
                      <DayPicker
                        mode="single"
                        selected={formData.birthDate}
                        onSelect={(date) => {
                          updateData({
                            ...formData,
                            birthDate: date,
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
                  {errorMap.birthDate && (
                    <Typography
                      variant="small"
                      color="red"
                      className="mt-2 flex items-center gap-1 font-normal"
                    >
                      {errorMap.birthDate}
                    </Typography>
                  )}
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
                      updateData({
                        ...formData,
                        phoneNumber: event.target.value,
                      })
                    }
                  />
                  {errorMap.phoneNumber && (
                    <Typography
                      variant="small"
                      color="red"
                      className="mt-2 flex items-center gap-1 font-normal"
                    >
                      {errorMap.phoneNumber}
                    </Typography>
                  )}
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
                      checked={termsAgreed}
                      onChange={(event) => setTermsAgreed(event.target.checked)}
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
                <Button
                  type="submit"
                  color="blue"
                  className="w-full justify-center"
                  disabled={anyErrors || anyRequiredFieldsEmpty || !termsAgreed || loading}
                  loading={loading}
                >
                  Create account
                </Button>
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
            )}
            {success && (
              <div class="space-y-4 md:space-y-3">
                <p class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  An email has been sent to your email address. Please follow
                  the instructions to activate your account.
                </p>
                <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                  <Link
                    to="/login"
                    class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Back to login
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {error && (
        <Alert
          color="red"
          className={`fixed justify-center top-0 left-1/2 transform -translate-x-1/2 py-4 px-6 rounded-md shadow-md`}
        >
          {error}
        </Alert>
      )}
    </section>
  );
};

export default Signup;
