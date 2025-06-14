import { createSignal, createEffect, onMount, For } from "solid-js";
import type { Results } from "../server-utils/results";
import { caseLabels } from "../lib/constants";
import { FileListTooltip } from "./FileListTooltip";
import { Checkbox } from "./Checkbox";
import { InfoIcon } from "./InfoIcon";
import { Radiobox } from "./Radiobox";
import { RadioGroup } from "@kobalte/core/radio-group";

interface FiltersProps {
  dbNames: Results["dbNames"];
  caseIds: Results["caseIds"];
  onFiltersChange: (
    selectedDbs: string[],
    selectedCase: number,
    startDate?: Date,
  ) => void;
  fileCount?: number;
  filteredFiles?: string[];
}

const START_DATE = "2023-01-01";

// Case groups for organized display
const caseGroups = [
  {
    title: "Capacity Tests",
    ids: [2, 1],
  },
  {
    title: "768D Performance Tests",
    ids: [3, 4, 5],
  },
  {
    title: "768D Filtering Tests",
    ids: [6, 7, 8, 9],
  },
  {
    title: "1536D Performance Tests",
    ids: [11, 10, 50],
  },
  {
    title: "1536D Filtering Tests",
    ids: [13, 12, 15, 14],
  },
  {
    title: "Custom Tests",
    ids: [100, 101],
  },
] as const;

function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setToLocalStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore localStorage errors
  }
}

export function Filters(props: FiltersProps) {
  const [selectedDbs, setSelectedDbs] = createSignal<string[]>(props.dbNames);
  const [selectedCase, setSelectedCase] = createSignal<number>(props.caseIds[0] || 0);
  const [startDate, setStartDate] = createSignal<string>(START_DATE);
  const [isInitialized, setIsInitialized] = createSignal(false);

  onMount(() => {
    const storedDbs = getFromLocalStorage("dbNames", props.dbNames);
    const storedCase = getFromLocalStorage("case", props.caseIds[0] || 0);
    const storedStartDate = getFromLocalStorage("startDate", START_DATE);

    setSelectedDbs(storedDbs);
    setSelectedCase(storedCase);
    setStartDate(storedStartDate);

    props.onFiltersChange(storedDbs, storedCase, new Date(storedStartDate));
    setIsInitialized(true);
  });

  createEffect(() => {
    if (isInitialized()) {
      const dbs = selectedDbs();
      const caseId = selectedCase();
      const date = startDate();

      setToLocalStorage("dbNames", dbs);
      setToLocalStorage("case", caseId);
      setToLocalStorage("startDate", date);

      props.onFiltersChange(dbs, caseId, new Date(date));
    }
  });

  const handleDbToggle = (dbName: string) => {
    const current = selectedDbs();
    const newSelection = current.includes(dbName)
      ? current.filter((db) => db !== dbName)
      : [...current, dbName];

    setSelectedDbs(newSelection);
  };

  const handleStartDateChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.value === "") {
      setStartDate(START_DATE);
    } else {
      setStartDate(target.value);
    }
  };

  const selectAllDbs = () => {
    setSelectedDbs([...props.dbNames]);
  };

  const clearAllDbs = () => {
    setSelectedDbs([]);
  };

  // Generate list of available cases grouped by category
  const getGroupedCases = () => {
    const availableCaseIds = new Set(props.caseIds);
    return caseGroups
      .map((group) => ({
        ...group,
        cases: group.ids.filter((id) => availableCaseIds.has(id)),
      }))
      .filter((group) => group.cases.length > 0);
  };

  return (
    <div class="h-full bg-gray-50 p-4 border-r border-b border-gray-200 w-64 shrink-0 dark:bg-gray-800 dark:border-gray-600">
      <h3 class="font-semibold mb-2">Results after</h3>
      <div class="mb-4 pl-2">
        <div class="mb-2">
          <input
            type="date"
            value={startDate()}
            onInput={handleStartDateChange}
            min={START_DATE}
            max={new Date().toISOString().split("T")[0]}
            class="border border-gray-300 rounded"
          />
        </div>
        <FileListTooltip files={props.filteredFiles || []}>
          <div class="dark:bg-gray-700 bg-gray-200 px-3 py-2 rounded text-sm relative inline-flex items-center">
            {props.fileCount || 0} files match <InfoIcon />
          </div>
        </FileListTooltip>
      </div>

      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-semibold">DB Filter</h3>
          <div>
            <button
              onClick={selectAllDbs}
              class="bg-primary text-white px-2 py-1 text-xs rounded mr-2"
            >
              Select All
            </button>
            <button
              onClick={clearAllDbs}
              class="bg-gray-500 text-white px-2 py-1 text-xs rounded"
            >
              Clear All
            </button>
          </div>
        </div>
        <div class="flex flex-col pl-2">
          <For each={props.dbNames}>
            {(dbName) => (
              <Checkbox
                checked={selectedDbs().includes(dbName)}
                onChange={() => handleDbToggle(dbName)}
                label={dbName}
              />
            )}
          </For>
        </div>
      </div>

      <div>
        <h3 class="font-semibold mb-2">Case Filter</h3>

        <RadioGroup
          value={selectedCase().toString()}
          onChange={(value: string) => setSelectedCase(parseInt(value, 10))}
        >
          <For each={getGroupedCases()}>
            {(group) => (
              <div class="mb-3">
                <h4 class="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {group.title}
                </h4>
                <div class="flex flex-col pl-2">
                  <For each={group.cases}>
                    {(caseId) => (
                      <Radiobox
                        label={caseLabels[caseId]}
                        value={caseId.toString()}
                      />
                    )}
                  </For>
                </div>
              </div>
            )}
          </For>
        </RadioGroup>
      </div>
    </div>
  );
}
