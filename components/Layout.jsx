import React from 'react';
import { API_ROUTES, APP_ROUTES } from '../utils/constants';
import Link from 'next/link';
import Router from 'next/router';
import axios from 'axios';
export default function Layout({ children }) {
  const logOut = async () => {
    localStorage.clear();
    await axios({
      method: 'POST',
      url: API_ROUTES.SIGN_OUT
    });
    Router.push(APP_ROUTES.SIGN_IN);
  };
  return (
    <>
      <div className="h-screen">
        <header className="flex shadow-lg p-4 bg-blue-900 text-white">
          <Link href={APP_ROUTES.HOME}>
            <a className="mr-5" > Home </a>
          </Link>
          <Link href={APP_ROUTES.PROFILE}>
            <a className="mr-5"> Profile </a>
          </Link>
          <button className="ml-auto" onClick={logOut}> Logout </button>
        </header>
        <main className="h-full">
          {children}
        </main>
      </div>
    </>
  );
}
