import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import environment from "../../environment";
import { Button, Typography } from "@material-tailwind/react";
import { KEY_NOT_VALID_ERROR } from "../../constants";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [key, setKey] = useState();
  const [invalidKey, setInvalidKey] = useState(true);

  const validateKey = async (key) => {
    const response = await fetch(
      `${environment.apiUrl}/users/validate-key?key=${key}`
    );
    const data = await response.json();

    if (!data.isValid) {
      setInvalidKey(true);
      return;
    }

    setInvalidKey(false);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    let keyParam = queryParams.get("key");
    if (!keyParam) navigate("/404");
    setKey(keyParam);
    validateKey(keyParam);
  }, []);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [passwordValid, setPasswordValid] = useState(true);
  const [confirmPasswordMatches, setConfirmPasswordMatches] = useState(true);

  const validate = async (password, confirmPassword) => {
    console.log(password, confirmPassword);
    setPasswordValid(true);
    setConfirmPasswordMatches(true);
    if (password.length < 8) {
      setPasswordValid(false);
    }
    if (confirmPassword.length > 0 && password !== confirmPassword) {
      setConfirmPasswordMatches(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch(
      `${environment.apiUrl}/users/forgot-password/reset`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: key,
          newPassword: password,
        }),
      }
    );

    const data = await response.json();
    console.log(data);

    setLoading(false);

    if (!response.ok) {
      if (data.errorCode === KEY_NOT_VALID_ERROR) {
        setError("Sorry, your reset password period has expired.");
        return;
      }
      setError("There were some errors.");
      return;
    }

    setDone(true);
  };

  return (
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Reset password
            </h1>
            {!invalidKey && (
              <>
                {!done && (
                  <form
                    class="space-y-4 md:space-y-6"
                    action="#"
                    onSubmit={handleSubmit}
                  >
                    <div>
                      <label
                        for="password"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        New password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          validate(e.target.value, confirmPassword);
                        }}
                      />
                      {!passwordValid && (
                        <Typography
                          variant="small"
                          color="red"
                          className="mt-2 flex items-center gap-1 font-normal"
                        >
                          Your password should have at least 8 characters!
                        </Typography>
                      )}
                    </div>

                    <div>
                      <label
                        for="confirm-password"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Re-enter password
                      </label>
                      <input
                        type="password"
                        name="confirm-password"
                        id="confirm-password"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          validate(password, e.target.value);
                        }}
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
                {done && (
                  <div class="space-y-4 md:space-y-6">
                    <p class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Your password has been reset successfully!
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
              </>
            )}
            {invalidKey && (
              <div class="space-y-4 md:space-y-6">
                <p class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Sorry, your request to reset password is either invalid or
                  expired.
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

export default ResetPassword;
