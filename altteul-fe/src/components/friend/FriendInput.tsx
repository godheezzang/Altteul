import React from "react";

type FriendInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
};

const FriendInput = ({ value, onChange, placeholder }: FriendInputProps) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="friend-input"
    />
  );
};

export default FriendInput;
