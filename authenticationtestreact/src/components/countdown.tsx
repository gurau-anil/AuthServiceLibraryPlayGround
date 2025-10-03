import { useEffect, useState } from "react";

function AppCountDown({ startFrom = 30 } : {startFrom?: number}) {
  const [counter, setCounter] = useState<number>(startFrom);

  useEffect(() => {
    if (counter === 0) return;

    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

  return (
  <>
  {counter}
  </>);
}

export default AppCountDown;
