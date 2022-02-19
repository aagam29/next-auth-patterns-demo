import React from 'react';
import { API_ROUTES, APP_ROUTES } from '../utils/constants';
import { withIronSessionSsr } from 'iron-session/next';
import Layout from '../components/Layout';
import axios from 'axios';

const cookie = {
  cookieName: process.env.COOKIE_NAME,
  password: process.env.COOKIE_PASSWORD,
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
};

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const API_SERVER_URL = process.env.API_SERVER_URL;
    const defaultReturnObject = {
      redirect: {
        destination: APP_ROUTES.SIGN_IN,
        permanent: false,
      }
    };
    try {
      let userSession = req.session.user;
      if (!userSession?.token) {
        return defaultReturnObject;
      }
      const { token } = userSession;
      const response = await axios({
        method: 'POST',
        url: `${API_SERVER_URL}${API_ROUTES.GET_USER}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const { authenticated, user } = response.data;
      if (!authenticated || !user) {
        return defaultReturnObject;
      }
      return {
        props: {
          user
        },
      };
    }
    catch (error) {
      console.log('Profile Page, getServerSideProps, Something Went Wrong', error);
      return defaultReturnObject;
    }
  },
  cookie
);


export default function Profile({ user }) {
  return (
    <Layout>
      <div className="p-16">
        <div className="text-2xl mb-4 font-bold text-blue-900">Profile - Server Side Auth</div>
        {
          user &&
          <div>
            <div className="text-lg mb-2"> User Details </div>
            <div className="flex">
              <div className="w-24 font-medium">
                <div> Firstname: </div>
                <div> Lastname: </div>
                <div> Email: </div>
              </div>
              <div>
                <div> {user.firstname} </div>
                <div> {user.lastname} </div>
                <div> {user.email} </div>
              </div>
            </div>
          </div>
        }
      </div>
    </Layout>
  );
}
