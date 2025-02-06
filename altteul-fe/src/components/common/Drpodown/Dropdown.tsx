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
  className,
}: DropdownProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      style={{ width, height }}
      className="text-gray-03 border border-gray-03 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-03"
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
