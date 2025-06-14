import { Title } from "@solidjs/meta";
import Counter from "~/components/Counter";

export default function Home() {
  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!dfg</h1>
      <Counter />
      <div class="dark:bg-gray-900 flex items-center justify-center h-screen text-center text-lg dark:text-gray-100">
            Loading data...
          </div>
    </main>
  );
}
