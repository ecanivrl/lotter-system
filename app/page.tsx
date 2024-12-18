'use client';

import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'tailwindcss/tailwind.css';
import './styles.css';
import LogoSVG from '@/public/logo.svg';

const TEAMS = Array.from({ length: 32 }, (_, i) => ({
  name: `Takım ${i + 1}`,
  logo: `https://via.placeholder.com/50?text=Takım+${i + 1}`,
}));

type Matchup = [string, string];
type Round = Matchup[];

const shuffleTeams = (teams: { name: string; logo: string }[]): string[] => {
  return [...teams].sort(() => Math.random() - 0.5).map((team) => team.name);
};

const generateMatchups = (teams: string[]): Matchup[] => {
  const matchups: Matchup[] = [];
  for (let i = 0; i < teams.length; i += 2) {
    matchups.push([teams[i], teams[i + 1]]);
  }
  return matchups;
};

const LotterySystem = () => {
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [winners, setWinners] = useState<string[]>([]);
  const [hiddenTeams, setHiddenTeams] = useState<Map<number, string>>(
    new Map()
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [roundStage, setRoundStage] = useState<number>(1); // Track the current round
  const [finalWinner, setFinalWinner] = useState<string | null>(null); // To track final winner

  const handleStartFirstRound = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const matchups = generateMatchups(shuffleTeams(TEAMS));
      setCurrentRound(matchups);
      setIsSpinning(false);
    }, 5000); // Çark dönme süresi
  };

  const handleWinnerSelection = (winner: string, index: number) => {
    setWinners((prevWinners) => [...prevWinners, winner]);
    setHiddenTeams((prevHiddenTeams) => {
      const updated = new Map(prevHiddenTeams);
      updated.set(index, winner);
      return updated;
    });
    toast.success(`${winner} kazandı!`);
  };

  const handleNextRound = () => {
    setIsSpinning(true); // Çarkı tekrar döndür
    setTimeout(() => {
      if (winners.length % 2 !== 0) {
        toast('Eşleşme yapabilmek için kazanan sayısı çift olmalı.');
        setIsSpinning(false);
        return;
      }
      const nextMatchups = generateMatchups(winners);
      setCurrentRound(nextMatchups);
      setWinners([]); // Reset winners for next round
      setHiddenTeams(new Map()); // Yeni turda butonlar yeniden görünür
      setRoundStage(roundStage + 1); // Increment round stage
      setIsSpinning(false); // Çark durdu
    }, 5000); // Çark dönme süresi
  };

  const handleFinalWinnerSelection = (winner: string) => {
    setFinalWinner(winner); // Set final winner
    toast.success(`${winner} kazandı! 🎉`);
  };

  const getRoundTitle = () => {
    switch (roundStage) {
      case 1:
        return '1. Tur';
      case 2:
        return "2.'Tur";
      case 3:
        return 'Çeyrek Final';
      case 4:
        return 'Yarı Final';
      case 5:
        return 'Final';
      default:
        return '';
    }
  };

  return (
    <>
      {finalWinner ? (
        <div className="relative h-[500px] w-full">
          <div className="h-screen mx-auto max-w-[800px] w-full  bg-[url('/logo.svg')] bg-center bg-no-repeat bg-cover opacity-10" />

          <div className=" absolute inset-0 mx-auto flex h-screen w-full  flex-col items-center justify-center bg-transparent">
            <h1 className="text-yellow-500 font-bold text-8xl nano animate-bounce">
              {finalWinner} - Kazandı!
            </h1>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
          <ToastContainer />
          <LogoSVG
            className={`w-32 h-32 animate-pulse ${
              isSpinning ? 'hidden' : 'block'
            }`}
          />

          <h1 className="sm:text-4xl text-xl font-extrabold mb-6 text-center">
            32 Takımlı Çekiliş Sistemi -{' '}
            <b className="text-yellow-500">{getRoundTitle()}</b>
          </h1>

          {!currentRound && (
            <button
              onClick={handleStartFirstRound}
              className={`px-8 py-4 ${
                isSpinning ? 'hidden' : 'bg-yellow-400 hover:scale-105'
              } text-black font-bold rounded-full shadow-lg transform transition`}
              disabled={isSpinning}
            >
              {isSpinning ? 'Çark Dönüyor...' : 'İlk Tur Başlat'}
            </button>
          )}

          {isSpinning && (
            <div className="flex justify-center items-center mt-10 p-1 border border-white w-[350px] h-[350px] rounded-full dado">
              <div className="flex justify-center items-center animate-spin rounded-full h-[300px] w-[300px] border-t-2 border-b-2 border-yellow-500">
                <div className="flex justify-center items-center animate-spin rounded-full h-[250px] w-[250px] border-l-2 border-r-2 border-lime-500">
                  <div className="flex justify-center items-center animate-spin rounded-full h-[200px] w-[200px] border-t-2 border-b-2 border-pink-500 border-2"></div>
                  <div className="flex justify-center items-center animate-spin rounded-full h-[150px] w-[150px] border-tl-2 border-r-2 border-yellow-500 border-2"></div>
                  <div className="flex justify-center items-center animate-spin rounded-full h-[100px] w-[100px] border-t-2 border-b-2 border-green-500 border-2"></div>
                  <div className="flex justify-center items-center animate-spin rounded-full h-[50px] w-[50px] border-r-2 border-l-2 border-blue-500 border-2"></div>
                </div>
              </div>
            </div>
          )}

          {!isSpinning && currentRound && (
            <div className="mt-12 w-full max-w-7xl bg-white p-6 rounded-lg shadow-lg mb-20">
              <h2 className="text-2xl font-bold mb-4 text-center text-black">
                Eşleşmeler
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {currentRound.map(([team1, team2], index) => (
                  <div
                    key={index}
                    className={`p-3 bg-black rounded-lg shadow-md text-center text-white transform transition duration-300 hover:scale-105 card card-delay-${index}`}
                  >
                    {hiddenTeams.has(index) ? (
                      <div className="flex flex-col gap-y-2 items-center justify-center">
                        <p className="font-bold text-lg text-yellow-400">
                          Kazanan <span className="text-white">:</span>{' '}
                          {hiddenTeams.get(index)}
                        </p>
                        <LogoSVG className="w-14 h-14 animate-pulse" />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between px-5 border border-yellow-500 rounded-lg">
                          <p className="font-semibold text-lg text-yellow-400">
                            {team1}
                          </p>
                          <b className="block my-2 text-white text-xl">vs</b>
                          <p className="font-semibold text-lg text-yellow-400">
                            {team2}
                          </p>
                        </div>
                        <div className="mt-4 flex justify-around gap-x-2">
                          <button
                            className="px-2 py-1.5 text-sm bg-yellow-500 text-black rounded hover:bg-white hover:text-black"
                            onClick={() => handleWinnerSelection(team1, index)}
                          >
                            {team1} Kazandı
                          </button>
                          <button
                            className="px-2 py-1.5 text-sm bg-yellow-500 text-black rounded hover:bg-white hover:text-black"
                            onClick={() => handleWinnerSelection(team2, index)}
                          >
                            {team2} Kazandı
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              {roundStage === 5 && !finalWinner && (
                <button
                  onClick={() => handleFinalWinnerSelection(winners[0])}
                  className={`mt-6 px-6 py-3 rounded-xl font-bold block mx-auto ${
                    winners.length === 0
                      ? 'bg-gray-500 cursor-not-allowed' // Kazanan seçilmediyse gri ve tıklanamaz
                      : 'bg-black hover:bg-black/70 text-yellow-500' // Kazanan seçildiyse normal buton
                  }`}
                  disabled={winners.length === 0} // Kazanan seçilmediyse buton disabled
                >
                  Kazanan Takımı Belirle
                </button>
              )}
              {winners.length > 0 && roundStage < 5 && (
                <button
                  onClick={handleNextRound}
                  className="mt-6 px-6 py-3 bg-black hover:bg-black/70 rounded-xl text-yellow-500 font-bold block mx-auto"
                >
                  Sonraki Turu Başlat
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default LotterySystem;
