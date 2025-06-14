"use client";

import type { TooltipProps } from "recharts";
import type { ChartData } from "../server-utils/results";

export function FilenameTooltip(props: TooltipProps<number, string>) {
  return () => {
    if (props.active && props.payload && props.payload[0]) {
      const { db_label, filename } = props.payload[0]?.payload as ChartData;
      const { name, value } = props.payload[0];
      return name && value && filename ? (
        <div class="bg-white border border-gray-200 rounded shadow-lg p-2 text-xs dark:bg-gray-700 dark:border-gray-700">
          <p class="font-bold">{db_label}</p>
          <p>{`${name}: ${value}`}</p>
          {filename && (
            <p class="text-gray-600 dark:text-gray-300">File: {filename}</p>
          )}
        </div>
      ) : null;
    }
    return null;
  };
}
