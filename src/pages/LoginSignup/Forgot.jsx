import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import environment from "../../environment";
import { RESOURCE_NOT_FOUND_ERROR } from "../../constants";
import { Button } from "@material-tailwind/react";

const Forgot = () => {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [mailSent, setMailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(identifier);
    setLoading(true);
    setError("");

    const response = await fetch(
      `${environment.apiUrl}/users/forgot-password/request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIdentifier: identifier,
        }),
      }
    );

    const data = await response.json();
    console.log(data);

    setLoading(false);

    if (!response.ok && data.errorCode === RESOURCE_NOT_FOUND_ERROR) {
      setError("Sorry! Your account could not be found.");
      return;
    }

    setMailSent(true);
  };

  return (
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Forgot password
            </h1>
            {!mailSent && (
              <form
                class="space-y-4 md:space-y-6"
                action="#"
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    for="identifier"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Enter your email or phone number
                  </label>
                  <input
                    type="text"
                    name="identifier"
                    id="identifier"
                    placeholder="johndoe@example.com"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  color="blue"
                  loading={loading}
                  className="w-full justify-center"
                >
                  Confirm
                </Button>

                {error && (
                  <p className="text-red-800 bg-red-50 text-center px-4 py-2 rounded-md">
                    {error}
                  </p>
                )}

                <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                  <Link
                    to="/login"
                    class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Back to login
                  </Link>
                </p>
              </form>
            )}
            {mailSent && (
              <div class="space-y-4 md:space-y-6">
                <p class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  An email has been sent to your email address. Please follow the instructions to reset your password.
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
    </section>
  );
};

export default Forgot;
