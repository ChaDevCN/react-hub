import { useThrottleFn } from "../hooks/useThrottleFn/useThrottleFn";
import { useState } from "react";
import { debounce } from "../utils/utils";
const fn = debounce(() => {
  console.log("啊哈哈");
}, 2000);
export const TestUseThrottleFn = () => {
  const [num] = useState(0);

  const handleClick = () => {
    fn();
  };
  return (
    <div>
      <h1>TestUseThrottleFn</h1>
      <p>num:{num}</p>
      <button onClick={handleClick}>add</button>
    </div>
  );
};
