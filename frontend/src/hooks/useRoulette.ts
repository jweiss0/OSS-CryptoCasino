import { useState } from "react";

export const useRoulette = () => {
  const [straightUps, setStraightUps] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]); // 36 straight up numbers
  const [zeros, setZeros] = useState([0, 0]); // 0 - 00
  const [columns, setColumns] = useState([0, 0, 0]);
  const [dozens, setDozens] = useState([0, 0, 0]); // 1_12 - 13_24 - 25_36
  const [redBlack, setRedBlack] = useState([0, 0]); // red - black
  const [oddEven, setOddEven] = useState([0, 0]); // odd - even
  const [highLow, setHighLow] = useState([0, 0]); // 1_18 - 19_36

  const clear = () => {
    setStraightUps([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    setZeros([0, 0]);
    setColumns([0, 0, 0]);
    setDozens([0, 0, 0]);
    setRedBlack([0, 0]);
    setOddEven([0, 0]);
    setHighLow([0, 0]);
  };

  return {
    straightUps,
    setStraightUps,
    zeros,
    setZeros,
    columns,
    setColumns,
    dozens,
    setDozens,
    redBlack,
    setRedBlack,
    oddEven,
    setOddEven,
    highLow,
    setHighLow,
    clear,
  };
};
