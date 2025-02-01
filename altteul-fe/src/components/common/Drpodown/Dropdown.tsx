import React from "react";

type DropdownProps = {
  options: { id: string | null; value: string }[];
  value: string;
  onChange: () => void;
  width?: string;
  height?: string;
  className?: string;
};

const Dropdown = ({
  options,
  value,
  onChange,
  width,
  height,
  className = "",
}: DropdownProps) => {
  return (
    <select
      className={`dropdown ${className}`.trim()}
      value={value}
      onChange={onChange}
      style={{ width, height }}
    >
      {options.map((el) => (
        <option key={el.id} value={el.value}>
          {el.value}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
