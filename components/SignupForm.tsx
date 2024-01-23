import router from 'next/router';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';

interface FormData {
  username: string;
  email: string;
  password: string;
}

const SignupForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Call the signup API endpoint with the form data
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      // If login is successful, redirect to the chat page
      if (response.ok) {
        toast.success(result?.message);
        router.push('/');
      }
      else {
        toast.error('Login failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      toast.error('An error occurred'); // Display error toast
    }
  };

  return (
    <div className="mx-4 space-y-2">
      <h2 className="text-green-600 text-5xl font-bold text-center">
        Sign up
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto">
        <div className="mb-5">
          <label className='font-medium'>
            Username
            <input {...register('username', { required: 'Username is required' })}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
      focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
      dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            />
            {errors.username && <span>{errors.username.message}</span>}
          </label>
        </div>
        <div className="mb-5">
          <label className='font-medium'>
            Email
            <input {...register('email', { required: 'Email is required' })}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
      focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
      dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            />
            {errors.email && <span>{errors.email.message}</span>}
          </label>
        </div>
        <div className="mb-5">
          <label className='font-medium'>
            Password
            <input {...register('password', { required: 'Password is required' })} type="password"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
      focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
      dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            />
            {errors.password && <span>{errors.password.message}</span>}
          </label>
        </div>
        <button type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium 
     rounded-lg text-sm px-5 py-2.5 text-center 
     dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >Register</button>
      </form>
    </div>
  );
};

export default SignupForm;
