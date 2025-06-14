import { Title } from "@solidjs/meta";
import { createResource, Suspense } from "solid-js";
import { Results } from "~/components/Results";
import { getAllResults } from "~/server-utils/results";

export default function Home() {
  const [data] = createResource(() => getAllResults());

  return (
    <main>
      <Title>VectorDBBench UI</Title>

      <Suspense
        // when={data()}
        fallback={
          <div class="dark:bg-gray-900 flex items-center justify-center h-screen text-center text-lg dark:text-gray-100">
            Loading data...
          </div>
        }
      >
        <Results chartData={data()?.chartData} dbNames={data()?.dbNames} caseIds={data()?.caseIds} />
      </Suspense>
    </main>
  );
}
