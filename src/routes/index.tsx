import { Title } from "@solidjs/meta";
import { createAsync } from "@solidjs/router";
import { Suspense } from "solid-js";
import { getAllResults } from "~/server-utils/results";

export default function Home() {
  const data = createAsync(() => getAllResults());

  return (
    <main>
      <Title>VectorDBBench UI</Title>

      <Suspense
        fallback={
          <div class="dark:bg-gray-900 flex items-center justify-center h-screen text-center text-lg dark:text-gray-100">
            Loading data...
          </div>
        }
      >
        <div>{JSON.stringify(data()?.chartData)}</div>
        <div>{JSON.stringify(data()?.dbNames)}</div>
        <div>{JSON.stringify(data()?.caseIds)}</div>
      </Suspense>
    </main>
  );
}
