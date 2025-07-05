import React from "react";
import "../App.css";

const Tape = ({ tape, head }) => {
  return (
    <div className="tape">
      {tape.map((symbol, index) => (
        <div
          key={index}
          className={`cell ${index === head ? "head" : ""}`}
        >
          {symbol}
        </div>
      ))}
    </div>
  );
};

export default Tape;
