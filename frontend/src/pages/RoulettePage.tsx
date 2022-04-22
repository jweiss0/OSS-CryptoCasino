import { useState } from "react";
import { Wheel } from "react-custom-roulette";
import { useRoulette } from "../hooks/useRoulette";

const numbers = [
  "00",
  27,
  10,
  25,
  29,
  12,
  8,
  19,
  31,
  18,
  6,
  21,
  33,
  16,
  4,
  23,
  35,
  14,
  2,
  0,
  28,
  9,
  26,
  30,
  11,
  7,
  20,
  32,
  17,
  5,
  22,
  34,
  15,
  3,
  24,
  36,
  13,
  1,
];

const data = numbers.map((number, index) => {
  let n = number.toString();

  if (index === 0 || index === 19) {
    return { option: n, style: { backgroundColor: "green" } };
  } else if (index % 2 === 0) {
    return { option: n, style: { backgroundColor: "black" } };
  } else {
    return { option: n, style: { backgroundColor: "red" } };
  }
});

const getRandomNumber = () => {
  return Math.floor(Math.random() * data.length);
};

interface Win {
  option: string;
  color: string;
}

export const RoulettePage = () => {
  const [mustStartSpinning, setMustStartSpinning] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(getRandomNumber());
  const [previousWins, setPreviousWins] = useState<Win[]>([]);
  const roulette = useRoulette();

  const handleClick = () => {
    const bets = [
      roulette.straightUps,
      roulette.zeros,
      roulette.oddEven,
      roulette.redBlack,
      roulette.highLow,
      roulette.dozens,
      roulette.columns,
    ]
      .flat(Infinity)
      .filter((v) => v !== 0);

    if (bets.length === 0) {
      alert("You must make a bet to play the game!");
      return;
    }

    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustStartSpinning(true);
  };

  const checkWins = () => {
    let win = 0;

    if (roulette.zeros[0] !== 0) {
      if (data[prizeNumber].option === "0") {
        win += roulette.zeros[0] * (1 + 1 / 37);
      } else {
        win -= roulette.zeros[0];
      }
    }

    if (roulette.zeros[1] !== 0) {
      if (data[prizeNumber].option === "00") {
        win += roulette.zeros[1] * (1 + 1 / 37);
      } else {
        win -= roulette.zeros[1];
      }
    }

    if (roulette.oddEven[0] !== 0) {
      if (parseInt(data[prizeNumber].option) % 2 !== 0) {
        win += roulette.oddEven[0] * (1 + (1 + 1 / 9));
      } else {
        win -= roulette.oddEven[0];
      }
    }

    if (roulette.oddEven[1] !== 0) {
      if (parseInt(data[prizeNumber].option) % 2 === 0) {
        win += roulette.oddEven[1] * (1 + (1 + 1 / 9));
      } else {
        win -= roulette.oddEven[1];
      }
    }

    if (roulette.redBlack[0] !== 0) {
      if (data[prizeNumber].style.backgroundColor === "red") {
        win += roulette.redBlack[0] * (1 + (1 + 1 / 9));
      } else {
        win -= roulette.redBlack[0];
      }
    }

    if (roulette.redBlack[1] !== 0) {
      if (data[prizeNumber].style.backgroundColor === "black") {
        win += roulette.redBlack[1] * (1 + (1 + 1 / 9));
      } else {
        win -= roulette.redBlack[1];
      }
    }

    if (roulette.highLow[0] !== 0) {
      if (
        parseInt(data[prizeNumber].option) > 18 &&
        parseInt(data[prizeNumber].option) < 37
      ) {
        win += roulette.highLow[0] * (1 + (1 + 1 / 9));
      } else {
        win -= roulette.highLow[0];
      }
    }

    if (roulette.highLow[1] !== 0) {
      if (
        parseInt(data[prizeNumber].option) > 0 &&
        parseInt(data[prizeNumber].option) < 19
      ) {
        win += roulette.highLow[1] * (1 + (1 + 1 / 9));
      } else {
        win -= roulette.highLow[1];
      }
    }

    if (roulette.dozens[0] !== 0) {
      if (
        parseInt(data[prizeNumber].option) > 0 &&
        parseInt(data[prizeNumber].option) < 13
      ) {
        win += roulette.dozens[0] * (1 + (2 + 1 / 6));
      } else {
        win -= roulette.dozens[0];
      }
    }

    if (roulette.dozens[1] !== 0) {
      if (
        parseInt(data[prizeNumber].option) > 12 &&
        parseInt(data[prizeNumber].option) < 25
      ) {
        win += roulette.dozens[1] * (1 + (2 + 1 / 6));
      } else {
        win -= roulette.dozens[1];
      }
    }

    if (roulette.dozens[2] !== 0) {
      if (
        parseInt(data[prizeNumber].option) > 24 &&
        parseInt(data[prizeNumber].option) < 37
      ) {
        win += roulette.dozens[2] * (1 + (2 + 1 / 6));
      } else {
        win -= roulette.dozens[2];
      }
    }

    if (win !== 0) {
      alert(`You've ${win < 0 ? "lost" : "won"} $${Math.abs(win).toFixed(2)}`);
    }
  };

  const handleStopSpinning = () => {
    setMustStartSpinning(false);
    setPreviousWins((previousWins) => [
      ...previousWins,
      {
        option: data[prizeNumber].option,
        color: data[prizeNumber].style.backgroundColor,
      },
    ]);

    checkWins();
  };

  const handleNewBet = (value: number | string) => {
    switch (value) {
      case 0:
        roulette.setZeros((p) => [p[0] + 1, p[1]]);
        break;
      case "00":
        roulette.setZeros((p) => [p[0], p[1] + 1]);
        break;
      case "odds":
        roulette.setOddEven((p) => [p[0] + 1, p[1]]);
        break;
      case "evens":
        roulette.setOddEven((p) => [p[0], p[1] + 1]);
        break;
      case "reds":
        roulette.setRedBlack((p) => [p[0] + 1, p[1]]);
        break;
      case "blacks":
        roulette.setRedBlack((p) => [p[0], p[1] + 1]);
        break;
      case "2nd 18":
        roulette.setHighLow((p) => [p[0] + 1, p[1]]);
        break;
      case "1st 18":
        roulette.setHighLow((p) => [p[0], p[1] + 1]);
        break;
      case "1st 12":
        roulette.setDozens((p) => [p[0] + 1, p[1], p[2]]);
        break;
      case "2nd 12":
        roulette.setDozens((p) => [p[0], p[1] + 1, p[2]]);
        break;
      case "3rd 12":
        roulette.setDozens((p) => [p[0], p[1], p[2] + 1]);
        break;

      default:
        roulette.setStraightUps((p) => {
          const straight = [...p];
          straight[(value as number) - 1]++;
          return straight;
        });
        break;
    }
  };

  const removeBet = (value: string | number) => {
    switch (value) {
      case 0:
        roulette.setZeros((p) => [0, p[1]]);
        break;
      case "00":
        roulette.setZeros((p) => [p[0], 0]);
        break;
      case "odds":
        roulette.setOddEven((p) => [0, p[1]]);
        break;
      case "evens":
        roulette.setOddEven((p) => [p[0], 0]);
        break;
      case "reds":
        roulette.setRedBlack((p) => [0, p[1]]);
        break;
      case "blacks":
        roulette.setRedBlack((p) => [p[0], 0]);
        break;
      case "2nd 18":
        roulette.setHighLow((p) => [0, p[1]]);
        break;
      case "1st 18":
        roulette.setHighLow((p) => [p[0], 0]);
        break;
      case "1st 12":
        roulette.setDozens((p) => [0, p[1], p[2]]);
        break;
      case "2nd 12":
        roulette.setDozens((p) => [p[0], 0, p[2]]);
        break;
      case "3rd 12":
        roulette.setDozens((p) => [p[0], p[1], 0]);
        break;

      default:
        roulette.setStraightUps((p) => {
          const straight = [...p];
          straight[(value as number) - 1] = 0;
          return straight;
        });
        break;
    }
  };

  const getBets = () => {
    const straights = roulette.straightUps
      .map((bets, index) => {
        return {
          bets,
          value: index + 1,
        };
      })
      .filter((v) => v.bets !== 0);

    const zeros = roulette.zeros[0];
    const doubleZeros = roulette.zeros[1];
    const odds = roulette.oddEven[0];
    const evens = roulette.oddEven[1];
    const reds = roulette.redBlack[0];
    const blacks = roulette.redBlack[1];
    const highs = roulette.highLow[0];
    const lows = roulette.highLow[1];
    const firstDozen = roulette.dozens[0];
    const secondDozen = roulette.dozens[1];
    const thirdDozen = roulette.dozens[2];

    return {
      straights,
      zeros,
      doubleZeros,
      odds,
      evens,
      reds,
      blacks,
      highs,
      lows,
      firstDozen,
      secondDozen,
      thirdDozen,
    };
  };

  return (
    <div className="mt-2 w-100vw">
      {previousWins.length !== 0 && (
        <>
          <h3 className="text-center">Last 20</h3>
          <div className="d-flex justify-content-between mx-4">
            <h6>recent</h6>
            <h6>older</h6>
          </div>
          <ul className="w-100vw" style={{ overflowX: "auto" }}>
            {[...previousWins].reverse().map((win) => (
              <li
                className="mr-2 old-result"
                style={{
                  backgroundColor: win.color,
                }}
                key={win.option}
              >
                {win.option}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="d-flex align-items-center justify-content-between flex-column">
        <div className="w-100">
          <div className="w-100 overflow-auto">
            <ul className="mt-2" style={{ width: "max-content" }}>
              {getBets().zeros !== 0 && (
                <li className="bet">
                  {getBets().zeros} bet{getBets().zeros !== 1 && "s"} on zero{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeBet(0)}
                  >
                    remove bet
                  </button>
                </li>
              )}
              {getBets().doubleZeros !== 0 && (
                <li className="bet">
                  {getBets().doubleZeros} bet
                  {getBets().doubleZeros !== 1 && "s"} on double zero{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeBet("00")}
                  >
                    remove bet
                  </button>
                </li>
              )}
              {getBets().odds !== 0 && (
                <li className="bet">
                  {getBets().odds} bet{getBets().odds !== 1 && "s"} on odds{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeBet("odds")}
                  >
                    remove bet
                  </button>
                </li>
              )}
              {getBets().evens !== 0 && (
                <li className="bet">
                  {getBets().evens} bet{getBets().evens !== 1 && "s"} on even{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeBet("evens")}
                  >
                    remove bet
                  </button>
                </li>
              )}
              {getBets().reds !== 0 && (
                <li className="bet">
                  {getBets().reds} bet{getBets().reds !== 1 && "s"} on red{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeBet("reds")}
                  >
                    remove bet
                  </button>
                </li>
              )}
              {getBets().blacks !== 0 && (
                <li className="bet">
                  {getBets().blacks} bet{getBets().blacks !== 1 && "s"} on black{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeBet("blacks")}
                  >
                    remove bet
                  </button>
                </li>
              )}
              {getBets().lows !== 0 && (
                <li className="bet">
                  {getBets().lows} bet{getBets().lows !== 1 && "s"} on 1 to 18{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeBet("1st 18")}
                  >
                    remove bet
                  </button>
                </li>
              )}
              {getBets().highs !== 0 && (
                <li className="bet">
                  {getBets().highs} bet{getBets().highs !== 1 && "s"} on 19 to
                  36{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeBet("2nd 18")}
                  >
                    remove bet
                  </button>
                </li>
              )}
              {getBets().firstDozen !== 0 && (
                <li className="bet">
                  {getBets().firstDozen} bet{getBets().firstDozen !== 1 && "s"}{" "}
                  on 1 to 12{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeBet("1st 12")}
                  >
                    remove bet
                  </button>
                </li>
              )}
              {getBets().secondDozen !== 0 && (
                <li className="bet">
                  {getBets().secondDozen} bet
                  {getBets().secondDozen !== 1 && "s"} on 13 to 24{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeBet("2nd 12")}
                  >
                    remove bet
                  </button>
                </li>
              )}
              {getBets().thirdDozen !== 0 && (
                <li className="bet">
                  {getBets().thirdDozen} bet{getBets().thirdDozen !== 1 && "s"}{" "}
                  on 25 to 36{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeBet("3rd 12")}
                  >
                    remove bet
                  </button>
                </li>
              )}
              {getBets().straights.map((s) => (
                <li className="bet" key={s.value}>
                  {s.bets} bet{s.bets !== 1 && "s"} on {s.value}{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeBet(s.value)}
                  >
                    remove bet
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="d-block mx-auto text-center">
            <div className="d-flex align-items-center justify-content-center">
              <Wheel
                mustStartSpinning={mustStartSpinning}
                prizeNumber={prizeNumber}
                data={data}
                innerRadius={35}
                innerBorderWidth={25}
                radiusLineColor="yellow"
                radiusLineWidth={1}
                textDistance={85}
                outerBorderWidth={20}
                textColors={["#ffffff"]}
                spinDuration={0.01}
                onStopSpinning={handleStopSpinning}
              />
            </div>
            <div className="text-center mt-2">
              <button className="btn btn-success" onClick={handleClick}>
                spin
              </button>
              <button className="btn btn-danger ms-2" onClick={roulette.clear}>
                clear bets
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <table className="mx-auto text-center">
            <tbody>
              <tr>
                <td
                  className="p-2 border border-warning bg-success text-white"
                  onClick={() => handleNewBet(0)}
                >
                  0
                </td>
                <td
                  className="p-2 border border-warning bg-success text-white"
                  onClick={() => handleNewBet("00")}
                >
                  00
                </td>
              </tr>
              <tr>
                <td
                  className="p-2 border border-warning bg-black text-white"
                  onClick={() => handleNewBet("odds")}
                >
                  odds
                </td>
                <td
                  className="p-2 border border-warning bg-danger text-white"
                  onClick={() => handleNewBet("evens")}
                >
                  evens
                </td>
              </tr>
              <tr>
                <td
                  className="p-2 border border-warning bg-danger text-white"
                  onClick={() => handleNewBet("reds")}
                >
                  reds
                </td>
                <td
                  className="p-2 border border-warning bg-black text-white"
                  onClick={() => handleNewBet("blacks")}
                >
                  blacks
                </td>
              </tr>
              <tr>
                <td
                  className="p-2 border border-warning border-bottom-0 bg-black text-white"
                  onClick={() => handleNewBet("1st 18")}
                >
                  1 to 18
                </td>
                <td
                  className="p-2 border border-warning border-bottom-0 bg-danger text-white"
                  onClick={() => handleNewBet("2nd 18")}
                >
                  19 to 36
                </td>
              </tr>
            </tbody>
          </table>
          <table className="mx-auto text-center">
            <tbody>
              <tr>
                <td
                  className="p-2 border border-warning bg-black text-white"
                  onClick={() => handleNewBet("1st 12")}
                >
                  1st 12
                </td>
                <td
                  className="p-2 border border-warning bg-danger text-white"
                  onClick={() => handleNewBet("2nd 12")}
                >
                  2nd 12
                </td>
                <td
                  className="p-2 border border-warning bg-black text-white"
                  onClick={() => handleNewBet("3rd 12")}
                >
                  3rd 12
                </td>
              </tr>
              {Array.from({ length: 12 }, (_, i) => i).map((_, i) => (
                <tr key={_}>
                  <td
                    className={`p-2 border border-warning text-white ${
                      i % 2 === 0 ? "bg-danger" : "bg-black"
                    }`}
                    onClick={() => handleNewBet(i * 3 + 1)}
                  >
                    {i * 3 + 1}
                  </td>
                  <td
                    className={`p-2 border border-warning text-white ${
                      (i + 1) % 2 === 0 ? "bg-danger" : "bg-black"
                    }`}
                    onClick={() => handleNewBet(i * 3 + 2)}
                  >
                    {i * 3 + 2}
                  </td>
                  <td
                    className={`p-2 border border-warning text-white ${
                      (i + 2) % 2 === 0 ? "bg-danger" : "bg-black"
                    }`}
                    onClick={() => handleNewBet(i * 3 + 3)}
                  >
                    {i * 3 + 3}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoulettePage;
