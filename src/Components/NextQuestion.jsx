function NextQuestion({ answer, dispatch, index, numQuestions }) {
  const isAnswered = answer !== null;
  if (index < numQuestions - 1)
    return (
      <>
        {isAnswered && (
          <button
            className="btn btn-ui"
            onClick={() => dispatch({ type: "nextQuestion" })}
          >
            Next
          </button>
        )}
      </>
    );
  if (index === numQuestions - 1)
    return (
      <>
        {isAnswered && (
          <button
            className="btn btn-ui"
            onClick={() => dispatch({ type: "finish" })}
          >
            Finish
          </button>
        )}
      </>
    );
}

export default NextQuestion;
