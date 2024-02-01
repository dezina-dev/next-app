import Link from 'next/link';
import { GetServerSideProps } from 'next';
import Layout from '../../components/Layout';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface TodosProps {
  todos: Todo[];
}

const Todos: React.FC<TodosProps> = ({ todos }) => {
  return (
    <Layout title="About | Next.js + TypeScript Example">
      <div className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">Server Side Rendered Todos</h1>
        <div className="bg-blue-500 text-white p-4 mt-4 rounded-md">
          <p className="text-lg font-semibold">Server Side Rendering in Next.js:</p>
          <p>Improves initial page load speed by rendering content on the server,
            enhancing SEO, user experience, and providing consistent styling.</p>
          <p>If a page uses Server-side Rendering, the page HTML is generated on each request.</p>
          <p>To use Server-side Rendering for a page, you need to export an async function called getServerSideProps. This function will be called by the server on every request.</p>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {todos.map((todo) => (
            <li key={todo.id} className="bg-white p-4 rounded-md shadow-md">
              <Link href={`/todos/${todo.id}`}>

                <h2 className="text-lg font-semibold">{todo.title}</h2>
                <p className="mt-2">Completed: {todo.completed ? 'Yes' : 'No'}</p>

              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<TodosProps> = async () => {
  // Fetch data from the JSONPlaceholder API's todos endpoint
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  const todos: Todo[] = await response.json();

  return {
    props: {
      todos,
    },
  };
};

export default Todos;
