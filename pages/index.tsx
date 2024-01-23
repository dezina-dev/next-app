// pages/index.tsx
import React from 'react';
import LoginForm from '../components/LoginForm';
import Layout from "../components/Layout";

const IndexPage = () => {


  return (
    <Layout title="About | Next.js + TypeScript Example">
      <div>
        <LoginForm />
      </div>
    </Layout>

  );
};

export default IndexPage;
