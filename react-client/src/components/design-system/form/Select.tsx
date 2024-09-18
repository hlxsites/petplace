import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import { useCombobox } from "downshift";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { classNames } from "~/util/styleUtil";
import { IconButton, IconButtonProps } from "../button/IconButton";
import { InputAccessibilityWrapper } from "./InputAccessibilityWrapper";
import {
  type ElementInputSingleSelect,
  type InputWithoutFormBuilderProps,
} from "./types/formTypes";
import { FORM_STYLES } from "./utils/formStyleUtils";

export type SelectProps = Omit<
  InputWithoutFormBuilderProps<ElementInputSingleSelect>,
  "options" | "optionsType"
> & {
  onChange: (newValue: string) => void;
  options: string[];
  required?: boolean;
  value: string;
};

const Select = forwardRef<HTMLInputElement, SelectProps>(
  ({ autoFocus, id, options, onChange, placeholder, value, ...rest }, ref) => {
    const [searchTerm, setSearchTerm] = useState("");

    const listRef = useRef<HTMLUListElement>(null);

    const searchTermIsExactMatch = options.find(
      (option) => option.toLowerCase() === searchTerm.toLowerCase()
    );

    const filteredOptions = (() => {
      const setList = new Set(options);
      const uniqueOptions = Array.from(setList);
      if (searchTermIsExactMatch === value) return uniqueOptions;

      return uniqueOptions.filter(filterOptions(searchTerm));
    })();

    const estimateSize = useCallback(() => 36, []);
    const getItemKey = useMemo(
      () => (index: number) => filteredOptions[index],
      [filteredOptions]
    );

    const rowVirtualizer = useVirtualizer({
      count: filteredOptions.length,
      estimateSize,
      getItemKey,
      getScrollElement: () => listRef.current,
      paddingStart: 10,
      paddingEnd: 10,
      overscan: 3,
    });

    const clearable = !rest.required;

    const {
      isOpen,
      getInputProps,
      getLabelProps,
      getMenuProps,
      getToggleButtonProps,
      getItemProps,
      highlightedIndex,
      selectItem,
    } = useCombobox<string>({
      id,
      items: filteredOptions,
      inputValue: searchTerm,
      onInputValueChange: ({ inputValue }) => {
        setSearchTerm(inputValue || "");
      },
      onSelectedItemChange: ({ selectedItem: newItem }) => {
        onChange?.(newItem || "");
      },
      onIsOpenChange: ({ isOpen }) => {
        if (!isOpen && !searchTermIsExactMatch) {
          if (value) {
            setSearchTerm(value);
          } else {
            setSearchTerm("");
          }
        } else if (!isOpen && searchTermIsExactMatch) {
          selectItem(searchTermIsExactMatch);
        }
      },
      // Set default as null to avoid it being used as uncontrolled input
      selectedItem: value ?? null,
    });

    // Hacky way to fix initial render value, not sure why Downshift doesn't get it correctly
    useEffect(() => {
      if (value) selectItem(value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <InputAccessibilityWrapper id={id} {...rest} labelProps={getLabelProps()}>
        {({ hasError, inputProps }) => (
          <div className="relative">
            <div
              className={classNames(FORM_STYLES.inputRoot, {
                "border-text-danger-default": hasError,
              })}
            >
              <input
                autoFocus={autoFocus}
                className={classNames(
                  FORM_STYLES.input,
                  "text-base border-none",
                  {
                    [FORM_STYLES.inputError]: hasError,
                  }
                )}
                placeholder={placeholder ?? "Select..."}
                {...inputProps}
                {...getInputProps({ ref })}
              />
              {renderButton()}
            </div>

            <ul
              {...getMenuProps({ ref: listRef })}
              className={classNames(
                "shadow absolute z-50 ml-[1px] mt-[-10px] max-h-60 w-[calc(100%-2px)] flex-row overflow-scroll rounded-b-md border border-t-0 border-solid bg-neutral-white p-0",
                {
                  hidden: !(isOpen && filterOptions.length),
                }
              )}
            >
              {renderOptions()}
            </ul>
          </div>
        )}
      </InputAccessibilityWrapper>
    );

    function renderButton() {
      if (rest.disabled) return null;

      if (value && clearable) {
        return renderIconButton({
          icon: "closeXMarkRegular",
          label: "Clear",
          onClick: () => {
            selectItem(null);
          },
          tabIndex: -1,
        });
      }
      return renderIconButton({
        ...getToggleButtonProps(),
        label: "Open dropdown list",
        icon: isOpen ? "chevronUp" : "chevronDown",
      });
    }

    function renderIconButton(
      props: Omit<
        IconButtonProps,
        "className" | "iconProps" | "variant" | "ref"
      >
    ) {
      return (
        <IconButton
          className="absolute right-0 mx-0 mr-small text-brand-secondary"
          iconProps={{ size: 20 }}
          variant="link"
          {...props}
        />
      );
    }

    function renderOptions() {
      if (!isOpen) return null;

      return (
        <>
          <li
            key="total-size"
            style={{
              height: rowVirtualizer.getTotalSize(),
              width: "100%",
            }}
          />
          {rowVirtualizer.getVirtualItems().map(renderOption)}
        </>
      );
    }

    function renderOption(virtualItem: VirtualItem) {
      const { index, key, size, start } = virtualItem;
      const item = filteredOptions[index];
      const isHighlighted = highlightedIndex === index;
      const isActive = value === item;
      return (
        <li
          className={classNames(
            "px-4 text-base absolute left-0 top-0 flex w-full cursor-pointer items-center hover:bg-neutral-50",
            {
              "text-primary": isActive || isHighlighted,
              "bg-accent": isHighlighted,
              "bg-secondary": isActive,
            }
          )}
          key={key}
          {...getItemProps({
            item,
            index,
          })}
          style={{
            height: size,
            transform: `translateY(${start}px)`,
          }}
        >
          {item}
        </li>
      );
    }

    function filterOptions(searchTerm: string) {
      return function optionsFilter(option: string) {
        return option.toLowerCase().includes(searchTerm.toLowerCase());
      };
    }
  }
);

Select.displayName = "Select";

export default Select;
