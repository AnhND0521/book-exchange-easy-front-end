import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import environment from "../../environment";
import { Link } from "react-router-dom";

const Activate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [invalidKey, setInvalidKey] = useState(true);
  const [success, setSuccess] = useState(false);

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
    activate(key);
  };

  const activate = async (key) => {
    const response = await fetch(`${environment.apiUrl}/users/activate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({key: key}),
    });

    if (response.ok) {
        console.log("Success");
        setSuccess(true);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    let key = queryParams.get("key");
    if (!key) navigate("/404");
    validateKey(key);
  }, []);

  return (
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Activate account
            </h1>
            <div class="space-y-4 md:space-y-6">
              {!success && invalidKey && (
                <p class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Sorry, this activate URL is invalid.
                </p>
              )}

              {!success && !invalidKey && (
                <p class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Please wait while we activate your account...
                </p>
              )}

              {success && (
                <p class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your account has been activated successfully!
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Activate;
