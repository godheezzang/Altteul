import React from "react";

type DropdownProps = {
  options: { id: number | null; value: string; label: string }[];
  value: string;
  onChange: (selected: string) => void;
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
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <select
      className={`dropdown ${className}`.trim()}
      value={value}
      onChange={handleChange}
      style={{ width, height }}
    >
      {options.map((el) => (
        <option key={el.id} value={el.value}>
          {el.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
