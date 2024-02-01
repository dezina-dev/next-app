import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Layout from '../../components/Layout';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface TodoDetailsProps {
  todo: Todo;
}

const TodoDetails: React.FC<TodoDetailsProps> = ({ todo }) => {
  const router = useRouter();

  // If the page is not yet generated, return an empty div
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Layout title="About | Next.js + TypeScript Example">
      <div className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">Todo Details</h1>
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold">{todo.title}</h2>
          <p className="mt-2">Completed: {todo.completed ? 'Yes' : 'No'}</p>
        </div>
        <div className="mt-4">
          <Link href="/todos">
            <button className="text-blue-500">← Back to Todos</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<TodoDetailsProps> = async ({ params }) => {
  const { id } = params;
  // Fetch data for the specific Todo using the ID
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  const todo: Todo = await response.json();

  return {
    props: {
      todo,
    },
  };
};

export default TodoDetails;
