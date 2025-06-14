import { createSignal, createMemo } from "solid-js";
import { Filters } from "./Filters";
import { ResultsChart } from "./ResultsChart";
import type {
  ChartData,
  Results as ResultsType,
} from "../server-utils/results";
import { ThemeToggle } from "./ThemeToggle";

export const filterChartData = (
  data: ChartData[],
  selectedDbs: string[],
  selectedCase: number,
  startDate?: Date,
): ChartData[] => {
  return data.filter((item) => {
    const dbFilter = selectedDbs.includes(item.db_name);
    const caseFilter = selectedCase === item.case_id;
    let dateFilter = true;

    if (startDate && item.fileDate) {
      dateFilter = item.fileDate >= startDate;
    }

    return dbFilter && caseFilter && dateFilter;
  });
};

export function Results({ chartData, dbNames, caseIds }: ResultsType) {
  const [filteredData, setFilteredData] = createSignal<ChartData[]>();
  const [currentStartDate, setCurrentStartDate] = createSignal<Date | undefined>();

  const fileStats = createMemo(() => {
    const startDate = currentStartDate();
    if (!startDate) {
      const uniqueFilenames = new Set<string>();
      chartData.forEach((item) => {
        if (item.filename) {
          uniqueFilenames.add(item.filename);
        }
      });
      return {
        fileCount: uniqueFilenames.size,
        filteredFiles: Array.from(uniqueFilenames),
      };
    }

    const uniqueFilenames = new Set<string>();

    chartData.forEach((item) => {
      if (item.fileDate && item.filename && item.fileDate >= startDate) {
        uniqueFilenames.add(item.filename);
      }
    });

    return {
      fileCount: uniqueFilenames.size,
      filteredFiles: Array.from(uniqueFilenames),
    };
  });

  const handleFiltersChange = (
    newSelectedDbs: string[],
    newSelectedCase: number,
    startDate?: Date,
  ) => {
    setCurrentStartDate(startDate);

    const newData = filterChartData(
      chartData,
      newSelectedDbs,
      newSelectedCase,
      startDate,
    );
    setFilteredData(newData);
  };

  return (
    <div class="flex">
      <div class="print:hidden">
        <Filters
          dbNames={dbNames}
          caseIds={caseIds}
          onFiltersChange={(selectedDbs, selectedCase, startDate) => {
            setTimeout(() => {
              handleFiltersChange(selectedDbs, selectedCase, startDate);
            }, 0);
          }}
          fileCount={fileStats().fileCount}
          filteredFiles={fileStats().filteredFiles}
        />
      </div>
      <div class="flex-1 py-8 px-8 print:w-full">
        <h1 class="text-4xl font-bold tracking-tight mb-6">
          VectorDB Benchmark Results
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-200 mb-6">
          Label Format:{" "}
          <code class="dark:border-gray-100 border border-gray-300 dark:border-gray-700 p-1 rounded-md">{`<db_name> (<db_label>?, <index>, <num_concurrency>[])`}</code>
        </p>

        {filteredData() && <ResultsChart data={filteredData()!} />}
      </div>
      <div class="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}
