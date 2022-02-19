import React from 'react';
import { getAuthenticatedUser, storeTokenInLocalStorage } from '../lib/common';
import { useState, useEffect } from 'react';
import { API_ROUTES, APP_ROUTES } from '../utils/constants';
import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirectIfAuthenticated = async () => {
    const isUserAuthenticated = await getAuthenticatedUser();
    if (isUserAuthenticated?.authenticated) {
      Router.push('/');
    }
  };

  useEffect(() => {
    redirectIfAuthenticated();
  }, []);

  const signIn = async () => {
    try {
      setIsLoading(true);
      const response = await axios({
        method: 'post',
        url: API_ROUTES.SIGN_IN,
        data: {
          email,
          password
        }
      });
      if (!response?.data?.token) {
        console.log('Something went wrong during signing in: ', response);
        return;
      }
      storeTokenInLocalStorage(response.data.token);
      Router.push(APP_ROUTES.HOME);
    }
    catch (err) {
      console.log('Some error occured during signing in: ', err);
    }
    finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full h-screen flex justify-center items-center bg-blue-900">
      <div className="w-1/2 h-1/2 shadow-lg rounded-md bg-white p-8 flex flex-col">
        <h2 className="text-center font-medium text-2xl mb-4">
          Sign in
        </h2>
        <div className="flex flex-1 flex-col justify-evenly">
          <input
            className="border-2 outline-none p-2 rounded-md"
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); }}
          />
          <input
            className="border-2 outline-none p-2 rounded-md"
            type="password"
            placeholder="*******" value={password}
            onChange={(e) => { setPassword(e.target.value); }}
          />

          <button
            className="
            flex justify-center
            p-2 rounded-md w-1/2 self-center
            bg-blue-900  text-white hover:bg-blue-800"
            onClick={signIn}
          >
            {
              isLoading ?
                <div className="mr-2 w-5 h-5 border-l-2 rounded-full animate-spin" /> : null
            }
            <span>
              SIGN IN
            </span>
          </button>
        </div>
        <div className="text-center text-sm">
          Not a User?
          <Link href="/signup">
            <a className="font-medium text-blue-900 ml-1">
              Sign Up
            </a>
          </Link>
        </div>
      </div>
    </div >
  );
}
