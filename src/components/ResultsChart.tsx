import { createMemo, For, Show } from "solid-js";
import { BarChart } from "~/components/ui/charts";
import type { ChartData } from "../server-utils/results";
import { metric_order, caseLabels } from "~/lib/constants";
import type { ChartOptions } from "chart.js";

interface ResultsChartProps {
  data: ChartData[];
}

const BAR_HEIGHT = 30;
const AXIS_HEIGHT_AND_PADDING = 40;

export const metric_unit_map: Record<string, string> = {
  qps: "QPS",
  serial_latency_p99: "ms",
  recall: "%",
  load_duration: "s",
  max_load_count: "k",
};

function isLessBetter(metric: string) {
  return ["load_duration", "serial_latency_p99"].includes(metric);
}

const getColor = (dbName: string) => {
  const predefinedColors = {
    AWSOpenSearch: "#fb923c",
    ElasticCloud: "#facc15",
    LanceDB: "#4ade80",
    Milvus: "#2dd4bf",
    PgVector: "#3b82f6",
    Pinecone: "#818cf8",
    QdrantCloud: "#fb7185",
    Redis: "#dc2626",
    TiDB: "#4338ca",
    Vespa: "#0d9488",
    WeaviateCloud: "#059669",
    ZillizCloud: "#ea580c",
  };

  if (dbName in predefinedColors) {
    return predefinedColors[dbName as keyof typeof predefinedColors];
  }

  return "#000000";
};

export function ResultsChart(props: ResultsChartProps) {
  const availableMetrics = createMemo(() => {
    const metrics = new Set<string>();
    props.data.forEach((item) => {
      item.metricsSet?.forEach((metric) => {
        if (metric_order.includes(metric)) {
          metrics.add(metric);
        }
      });
    });
    return metric_order.filter((metric) => metrics.has(metric));
  });

  const dataByCase = createMemo(() => {
    return props.data.reduce(
      (acc, item) => {
        if (!acc[item.case_id]) {
          acc[item.case_id] = [];
        }
        acc[item.case_id]!.push(item);
        return acc;
      },
      {} as Record<keyof typeof caseLabels, ChartData[]>,
    );
  });

  return (
    <Show when={props.data.length > 0} fallback={<div class="text-center py-4">No data available</div>}>
      <div>
        <For each={Object.entries(dataByCase())}>
          {([caseId, caseData]) => (
            <div class="mb-8">
              <h3 class="text-lg font-semibold mb-2">
                {caseLabels[parseInt(caseId, 10) as keyof typeof caseLabels]}
              </h3>

              <For each={availableMetrics()}>
                {(metric) => {
                  const filteredData = createMemo(() =>
                    caseData.filter(
                      (item) =>
                        item.metricsSet?.includes(metric) &&
                        typeof item[metric as keyof ChartData] === "number" &&
                        (item[metric as keyof ChartData] as number) > 1e-7,
                    )
                  );

                  const sortedData = createMemo(() => {
                    const data = [...filteredData()];
                    return data.sort((a, b) => {
                      if (isLessBetter(metric)) {
                        return (
                          (a[metric as keyof ChartData] as number) -
                          (b[metric as keyof ChartData] as number)
                        );
                      }
                      return (
                        (b[metric as keyof ChartData] as number) -
                        (a[metric as keyof ChartData] as number)
                      );
                    });
                  });

                  const chartData = createMemo(() => ({
                    labels: sortedData().map(item => item.db_label),
                    datasets: [{
                      label: `${metric.replace("_", " ")} (${metric_unit_map[metric] || ""})`,
                      data: sortedData().map(item => item[metric as keyof ChartData] as number),
                      backgroundColor: sortedData().map(item => getColor(item.db_name)),
                      borderColor: sortedData().map(item => getColor(item.db_name)),
                      borderWidth: 1,
                    }]
                  }));

                  const chartOptions = createMemo(() => ({
                    animation: false,
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          title: (context: any) => {
                            const dataIndex = context[0]?.dataIndex;
                            return sortedData()[dataIndex]?.db_label || '';
                          },
                          label: (context: any) => {
                            const dataIndex = context.dataIndex;
                            const item = sortedData()[dataIndex];
                            const unit = metric_unit_map[metric] || "";
                            return [
                              `${metric.replace("_", " ")}: ${context.parsed.x}${unit}`,
                              item?.filename ? `File: ${item.filename}` : ''
                            ].filter(Boolean);
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        grid: {
                          display: true,
                          color: "rgba(0, 0, 0, 0.1)"
                        }
                      },
                      y: {
                        grid: {
                          display: false
                        }
                      }
                    }
                  } satisfies ChartOptions));

                  const unit = metric_unit_map[metric] || "";
                  const height = sortedData().length * BAR_HEIGHT + AXIS_HEIGHT_AND_PADDING;

                  return (
                    <Show when={filteredData().length > 0}>
                      <div class="mb-6 print:break-inside-avoid">
                        <h4 class="text-md font-medium mb-1">
                          {[
                            metric[0]!.toLocaleUpperCase(),
                            metric.slice(1).toLocaleLowerCase().replaceAll("_", " "),
                          ].join("")}
                          {!["qps", "recall"].includes(metric) && ` in ${unit}`}
                          <span class="text-xs text-gray-500 ml-1 dark:text-gray-300">
                            ({isLessBetter(metric) ? "less" : "more"} is better)
                          </span>
                        </h4>

                        <div style={{ height: `${height}px` }}>
                          <BarChart
                            data={chartData()}
                            options={chartOptions()}
                            height={height}
                          />
                        </div>
                      </div>
                    </Show>
                  );
                }}
              </For>
            </div>
          )}
        </For>
      </div>
    </Show>
  );
}
