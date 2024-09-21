import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Input } from '@material-tailwind/react';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';
import { ACCOUNT_NOT_ACTIVATED_ERROR } from '../../constants';

const apiUrl = "http://localhost:8080/api/v1";

export const Login = () => {
  const location = useLocation();
  const success = location.state?.success;

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const [cookies, setCookie] = useCookies(['accessToken', 'user']);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const response = await fetch(`${apiUrl}/users/auth`, {
      method: "POST",
      headers: { "Content-Type" : "application/json" },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      if (response.status === 500) {
        setError("There were some errors.");
        return;
      }
      if (data.errorCode === ACCOUNT_NOT_ACTIVATED_ERROR) {
        setError("Your account hasn't been activated yet.");
      }
      return;
    }

    console.log(data.accessToken);
    console.log(jwtDecode(data.accessToken));
    setCookie('accessToken', data.accessToken, { path: '/' } );
    setCookie('user', jwtDecode(data.accessToken), { path: '/' } );

    navigate("/home");
  };

  return (
    <section class="bg-gray-50 dark:bg-gray-900">
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Login to your account
              </h1>
              <form class="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                  <div>
                      {/* <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label> */}
                      <Input type="email" name="email" id="email" label="Email" onChange={({target}) => setEmail(target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required/>
                  </div>
                  <div>
                      {/* <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label> */}
                      <Input type="password" name="password" id="password" label="Password" onChange={({target}) => setPassword(target.value)} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                  </div>
                  <div class="flex items-center justify-between">
                      <div class="flex items-start">
                          <div class="flex items-center h-5">
                            <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"/>
                          </div>
                          <div class="ml-3 text-sm">
                            <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                          </div>
                      </div>
                      <Link to="/forgot-password" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</Link>
                  </div>
                  <button type="submit" class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Log in</button>
                  <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don’t have an account yet? <Link to="/signup" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                  </p>
              </form>
          </div>
      </div>
  </div>
  { success && <Alert color="green" className={`fixed justify-center top-0 left-1/2 transform -translate-x-1/2 py-4 px-6 rounded-md shadow-md`}>Sign up successfully!</Alert>}
  { error && <Alert color="red" className={`fixed justify-center top-0 left-1/2 transform -translate-x-1/2 py-4 px-6 rounded-md shadow-md`}>{error}</Alert>}
</section>
  );
}

export default Login;