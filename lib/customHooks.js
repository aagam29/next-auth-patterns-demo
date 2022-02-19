import { useState, useEffect } from 'react';
import { getAuthenticatedUser } from './common';
import { APP_ROUTES } from '../utils/constants';
import Router from 'next/router';

export function useUser() {
  const [user, setUser] = useState(null);
  const [authenticated, setAutenticated] = useState(false);

  useEffect(() => {
    async function getUserDetails() {
      const { authenticated, user } = await getAuthenticatedUser();
      if (!authenticated) {
        Router.push(APP_ROUTES.SIGN_IN);
        return;
      }
      setUser(user);
      setAutenticated(authenticated);
    }
    getUserDetails();
  }, []);

  return { user, authenticated };
}