import { useEffect, useReducer } from "react";
import "./App.css";
import Header from "./Components/Header";
import Main from "./Components/Main";
import Loader from "./Components/Loader";
import Error from "./Components/Error";
import StartScreen from "./Components/StartScreen";
import Question from "./Components/Question";
import NextQuestion from "./Components/NextQuestion";
import Progress from "./Components/Progress";
import FinishScreen from "./Components/FinishScreen";
import Footer from "./Components/Footer";
import Timer from "./Components/Timer";

const initialState = {
  questions: [],
  /* loading, error, ready, active, finished */
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };

    case "dataFailed":
      return { ...state, status: "error" };

    case "start":
      return { ...state, status: "active" };
    case "newAnswer":
      const currentQuestion = state.questions[state.index];
      const isCorrect = action.payload === currentQuestion.correctOption;

      return {
        ...state,
        answer: action.payload,
        points: isCorrect
          ? state.points + currentQuestion.points
          : state.points,
      };

    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };

    case "restart":
      return {
        ...state,
        status: "ready",
        points: 0,
        index: 0,
        answer: null,
      };
    default:
      throw new Error("Action is unKnown");
  }
}

function App() {
  const [{ questions, status, index, answer, points, highScore }, dispatch] =
    useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header></Header>
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              answer={answer}
              points={points}
              numQuestions={numQuestions}
              maxPoints={maxPoints}
              index={index}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} numQuestions={numQuestions} />
              <NextQuestion
                answer={answer}
                dispatch={dispatch}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            dispatch={dispatch}
            maxPoints={maxPoints}
            highScore={highScore}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
