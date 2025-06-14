import { RadioGroup } from "@kobalte/core/radio-group";

interface RadioboxProps {
  label: string;
  value: string;
}

export function Radiobox(props: RadioboxProps) {
  return (
    <RadioGroup.Item
      class="flex items-center mb-2"
      value={props.value}
    >
      <RadioGroup.ItemInput class="sr-only" />
      <RadioGroup.ItemControl class="flex size-[20px] appearance-none items-center justify-center rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-300 outline-none hover:bg-gray-100 dark:hover:bg-gray-600 focus:ring-2 focus:ring-primary data-[checked]:bg-primary data-[checked]:border-primary">
        <RadioGroup.ItemIndicator class="block w-[7px] h-[7px] rounded-full bg-gray-700 dark:bg-white" />
      </RadioGroup.ItemControl>
      <RadioGroup.ItemLabel class="ml-2 text-sm text-gray-700 dark:text-gray-200 cursor-pointer">
        {props.label}
      </RadioGroup.ItemLabel>
    </RadioGroup.Item>
  );
};
