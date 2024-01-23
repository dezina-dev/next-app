import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const LoginForm = () => {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    // Call the login API endpoint with the form data
    try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          // If login is successful, redirect to the chat page
       localStorage.setItem('user', JSON.stringify(result?.data)); // Store the user ID in local storage
          router.push('/chat');
        } else {
          toast.error(result?.error); // Display error toast
        }
      } catch (error) {
        console.error('Error during login:', error);
        toast.error('An error occurred'); // Display error toast
      }
  };

  return (
    <div className="mx-4 space-y-2">
    <h2 className="text-green-600 text-5xl font-bold text-center"> 
       Sign in
    </h2> 
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto">
        <div className="mb-5">
        <label className='font-medium'>
        Email:
        <input {...register('email')} type="email" required 
        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
        dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
        />
      </label>
        </div>
      
      <div className="mb-5">
      <label className='font-medium'>
        Password:
        <input {...register('password')} type="password" required
        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
        dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
         />
      </label>
      </div>
    
      <button type="submit"
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium 
      rounded-lg text-sm px-5 py-2.5 text-center 
      dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >Login</button>
    </form>
    </div>
  );
};

export default LoginForm;
