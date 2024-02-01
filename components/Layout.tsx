import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "This is the default title" }: Props) => {
  const router = useRouter();

  // Use state to store user information
  const [user, setUser] = useState(null);

  // Check for user during component mount (client-side)
  useEffect(() => {
    const userData = localStorage.getItem("user");
    setUser(userData ? JSON.parse(userData) : null);
  }, []);

  const handleLogout = () => {
    // Perform logout logic, such as clearing localStorage
    localStorage.removeItem("user");
    // Redirect to the home page or login page
    router.push("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header className="bg-gray-800 p-4 text-white">
        <nav className="flex items-center">
          <Link href="/" className="text-white hover:text-gray-300 mr-4">
            Home
          </Link>
          <Link href="/about" className="text-white hover:text-gray-300 mr-4">
            About
          </Link>
          <Link href="/users" className="text-white hover:text-gray-300 mr-4">
            Users List
          </Link>
          <Link href='/todos' className="text-white hover:text-gray-300 mr-4">Todo's (SSR)</Link>

          {/* Conditionally render Signup & Logout based on user login */}
          {!user && (
            <Link href="/signup" className="text-white hover:text-gray-300 mr-4">
              Signup
            </Link>
          )}

          {user && (
            <>
              <Link href="/chat" className="text-white hover:text-gray-300 mr-4">
                My Chats
              </Link>
              <Link href="/groups" className="text-white hover:text-gray-300 mr-4">
                My Groups
              </Link>
              <button onClick={handleLogout} className="text-white hover:text-gray-300 cursor-pointer pr-4">
                Logout{" "}
              </button>
            </>
          )}
          <a href="/api/users" className="text-white hover:text-gray-300 ml-auto">
            Users API
          </a>
        </nav>
      </header>
      <main className="flex-1 p-4">{children}</main>
      <footer className="bg-gray-800 p-4 text-white">
        <hr className="border-gray-600" />
        <span></span>
      </footer>
    </div>
  );
};

export default Layout;