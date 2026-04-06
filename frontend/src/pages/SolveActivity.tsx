export default function SolveActivity({ activity }: any) {
  const [answers, setAnswers] = useState<number[]>([]);

  const select = (qIndex: number, option: number) => {
    const updated = [...answers];
    updated[qIndex] = option;
    setAnswers(updated);
  };

  return (
    <div className="p-6 text-white">
      <h1>{activity.title}</h1>

      {activity.questions.map((q: any, i: number) => (
        <div key={i}>
          <p>{q.statement}</p>

          {q.options.map((opt: string, j: number) => (
            <button key={j} onClick={() => select(i, j)}>
              {opt}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}