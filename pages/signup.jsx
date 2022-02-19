import React from 'react';
import { getAuthenticatedUser } from '../lib/common';
import { useState, useEffect } from 'react';
import { API_ROUTES, APP_ROUTES } from '../utils/constants';
import Link from 'next/link';
import axios from 'axios';
import Router from 'next/router';
export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
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

  const signUp = async () => {
    try {
      setIsLoading(true);
      const response = await axios({
        method: 'post',
        url: API_ROUTES.SIGN_UP,
        data: {
          email,
          password,
          firstname,
          lastname
        }
      });
      if (!response?.data?.token) {
        console.log('Something went wrong during signing up: ', response);
        return;
      }
      Router.push(APP_ROUTES.SIGN_IN);
    }
    catch (err) {
      console.log('Some error occured during signing up: ', err);
    }
    finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full h-screen flex justify-center items-center bg-blue-900">
      <div className="w-1/2 h-3/4 shadow-lg rounded-md bg-white p-8 flex flex-col">
        <h2 className="text-center font-medium text-2xl mb-4">
          Sign Up
        </h2>
        <div className="flex flex-1 flex-col justify-evenly">
          <input
            className="border-2 outline-none p-2 rounded-md"
            type="email"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => { setFirstname(e.target.value); }}
          />
          <input
            className="border-2 outline-none p-2 rounded-md"
            type="email"
            placeholder="Last Name"
            value={lastname}
            onChange={(e) => { setLastname(e.target.value); }}
          />
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
             bg-blue-900  text-white 
             hover:bg-blue-800"
            onClick={signUp}
          >
            {
              isLoading ?
                <div className="mr-2 w-5 h-5 border-l-2 rounded-full animate-spin" /> : null
            }
            <span>
              SIGN UP
            </span>
          </button>
        </div>
        <div className="text-center text-sm">
          Already a User?
          <Link href="/signin">
            <a className="font-medium text-blue-900 ml-1">
              Sign In
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
