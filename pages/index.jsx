import React from 'react';
import { useUser } from '../lib/customHooks';
import Layout from '../components/Layout';
export default function Home() {
  const { user, authenticated } = useUser();
  if (!user || !authenticated) {
    return <Layout>
      <div className="p-16">
        <div className="text-2xl mb-4 font-bold text-blue-900">Home - Client Side Auth</div>
        <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-blue-900" />
      </div>
    </Layout>;
  }
  return (
    <Layout>
      <div className="p-16">
        <div className="text-2xl mb-4 font-bold text-blue-900">Home - Client Side Auth</div>
        {
          user &&
          <div>
            <div className="text-lg mb-2"> User Details </div>
            <div className="flex">
              <div className="w-24 font-medium">
                <div> Email : </div>
                <div> Firstname : </div>
                <div> Lastname : </div>
              </div>
              <div>
                <div> {user.email} </div>
                <div> {user.firstname} </div>
                <div> {user.lastname} </div>
              </div>
            </div>
          </div>
        }
      </div>

    </Layout>
  );
}
