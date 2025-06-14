import { createSignal, JSX } from "solid-js";
import { For } from "solid-js";

interface FileListTooltipProps {
  files: string[];
  children: JSX.Element;
}

export const FileListTooltip = (props: FileListTooltipProps) => {
  const [isVisible, setIsVisible] = createSignal(false);

  if (props.files.length === 0) {
    return <>{props.children}</>;
  }

  return (
    <div
      class="cursor-default"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {props.children}

      {isVisible() && props.files.length > 0 && (
        <div class="absolute z-10 left-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded shadow-lg p-3 max-h-[400px] overflow-y-auto">
          <ul class="text-xs space-y-1">
            <For each={props.files}>
              {(file, index) => (
                <li title={file}>
                  {file}
                </li>
              )}
            </For>
          </ul>
        </div>
      )}
    </div>
  );
};
