import { useEffect, useState } from "react";
const SECS_PER_QUESTIONS = 30;
function Timer({ dispatch, numQuestions }) {
  const [seconds, setSeconds] = useState(numQuestions * SECS_PER_QUESTIONS);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (seconds <= 0) dispatch({ type: "finish" });
  useEffect(function () {
    const id = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(id);
  }, []);
  return (
    <button className="timer btn btn-ui">
      {mins < 10 && "0"}
      {mins}:{secs < 10 && "0"}
      {secs}
    </button>
  );
}

export default Timer;
