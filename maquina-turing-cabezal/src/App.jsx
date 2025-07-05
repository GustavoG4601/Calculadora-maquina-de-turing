import { useState } from "react";
import "./App.css";
import Tape from "./components/Tape";

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [input, setInput] = useState("");
  const [tape, setTape] = useState([]);
  const [head, setHead] = useState(0);
  const [log, setLog] = useState([]);
  const [result, setResult] = useState("");
  const [state, setState] = useState("q0");

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const drawStep = async (tapeArray, headPos, desc, newState = "") => {
    setTape([...tapeArray]);
    setHead(headPos);
    setLog((prev) => [...prev, desc]);
    if (newState) setState(newState);
    await delay(500);
  };

  const evaluate = async () => {
    setLog([]);
    setResult("");
    setState("q0");

    const binaryRegex = /^[01+\-*/\s]+$/;
    if (!binaryRegex.test(input)) {
      setLog(["❌ Solo se permiten números binarios (0 y 1) y operadores + - * /"]);
      return;
    }

    let expr = input.replace(/\s+/g, "");
    let tapeArray = ["#", ...expr.split(""), "_"];
    let headPos = 0;

    await drawStep(tapeArray, headPos, `✨ Estado: q0, Cabezal en ${headPos}, Leyó: '${tapeArray[headPos]}'`, "q0");

    while (headPos < tapeArray.length) {
      const char = tapeArray[headPos];
      await drawStep(tapeArray, headPos, `💾 Estado: ${state}, Cabezal en ${headPos}, Leyó: '${char}'`, state);
      headPos++;
    }

    setState("qf");

    try {
      const decimalExpr = expr.replace(/[01]+/g, (match) => parseInt(match, 2));
      const decimalResult = eval(decimalExpr);
      const binaryResult = (decimalResult >>> 0).toString(2);

      setResult(binaryResult);
      setLog((prev) => [...prev, `📊 Resultado binario: ${binaryResult}`, "✅ Finalizado."]);

      // Mostrar el resultado en una nueva cinta
      const resultTape = ["#", ...binaryResult.split(""), "_"];
      let resultHead = 0;
      setLog((prev) => [...prev, "🔁 Mostrando resultado en la cinta..."]);

      while (resultHead < resultTape.length) {
        await drawStep(resultTape, resultHead, `🎯 Mostrando resultado, Cabezal en ${resultHead}, Leyó: '${resultTape[resultHead]}'`, "qf");
        resultHead++;
      }

    } catch (err) {
      setLog((prev) => [...prev, "❌ Error al evaluar la expresión"]);
    }
  };

  if (showWelcome) {
    return (
      <div className="welcome-screen">
        <div className="images-top">
          <img src="https://cdn-icons-png.flaticon.com/128/10238/10238004.png" alt="suma" />
          <img src="https://cdn-icons-png.flaticon.com/128/753/753322.png" alt="resta" />
          <img src="https://cdn-icons-png.flaticon.com/128/5610/5610967.png" alt="multiplicacion" />
          <img src="https://cdn-icons-png.flaticon.com/128/17879/17879530.png" alt="division" />
        </div>

        <h1>👋 ¡Bienvenido a la Calculadora Binaria!</h1>
        <p>Desarrollado por:</p>
        <ul className="team-list">
          <li> Yovanny Martínez</li>
          <li> Jesús Barrios</li>
          <li> Gustavo Guerra</li>
        </ul>
        <button className="start-btn" onClick={() => setShowWelcome(false)}>
          Iniciar Calculadora 🚀
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>🧑‍🔧 Calculadora Binaria - Máquina de Turing</h1>
      <p className="subtitle">
        Ingresa una operación binaria combinada (ej: <code>101+10*11-1</code>)
      </p>
      <input
        type="text"
        placeholder="101+10*11-1"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={evaluate}>Iniciar Simulación ⏱</button>

      <Tape tape={tape} head={head} />

      <div className="status">
        🛠️ Estado actual: <span className="state">{state}</span>
      </div>

      <div className="log">
        <ul>
          {log.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>

      {result && (
        <h2 className="result">
          📈 Resultado final: <code>{result}</code>
        </h2>
      )}

      <div className="footer">
        <img
          src="https://cdn-icons-png.flaticon.com/512/201/201818.png"
          alt="binary icon"
          width={40}
        />
        <p>Simulando operaciones binarias paso a paso.</p>
      </div>
    </div>
  );
}

export default App;
