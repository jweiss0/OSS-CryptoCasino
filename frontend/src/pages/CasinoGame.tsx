import { Blackjack } from '../components/casinoGames/Blackjack/Blackjack'; 

export interface IParams {
  mode: string; // game mode (blackjack, roulette, slots)
}

export const CasinoGame = (params: IParams) => {
  return (
    <main className="landing-page-container container min-vh-100 d-flex flex-column justify-content-center align-items-center gap-1 mx-auto w-100 text-center">
      <div>
        {params.mode === "blackjack" ? <Blackjack/> : <></>}
        {/* {params.mode === "Roulette" ? <Roulette/> : <></>} */}
        {/* {params.mode === "Slots" ? <Slots/> : <></>} */}
      </div>
    </main>
  );
};

export default CasinoGame;
