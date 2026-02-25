import { useEffect, useState } from "react";

interface LeaderboardEntry {
  stats: {
    multiplayerWins: number;
    multiplayerLosses: number;
    bestStreak: number;
    totalRounds: number;
  };
  playerId: string;
}

interface LeaderboardProps {
  isVisible: boolean;
  onClose: () => void;
}

export function Leaderboard({ isVisible, onClose }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isVisible) {
      // Fetch leaderboard from Convex
      // This would be: const data = useQuery(api.games.getLeaderboard, { limit: 10 });
      // For now, using mock data
      setLoading(false);
      setLeaderboard([
        {
          stats: { multiplayerWins: 15, multiplayerLosses: 5, bestStreak: 8, totalRounds: 60 },
          playerId: "player1",
        },
        {
          stats: { multiplayerWins: 12, multiplayerLosses: 8, bestStreak: 5, totalRounds: 50 },
          playerId: "player2",
        },
        {
          stats: { multiplayerWins: 10, multiplayerLosses: 10, bestStreak: 4, totalRounds: 45 },
          playerId: "player3",
        },
      ]);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="border-4 border-black bg-[#d4c5a0] p-6 sm:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-[8px_8px_0px_rgba(0,0,0,1)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl" style={{ fontFamily: "'Rye', serif" }}>
            🏆 LEADERBOARD 🏆
          </h2>
          <button
            onClick={onClose}
            className="border-2 border-black bg-[#e8d5a3] px-4 py-2 text-sm hover:bg-[#d4c5a0]"
            style={{ fontFamily: "'Special Elite', monospace' }}
          >
            ✕ CERRAR
          </button>
        </div>

        {loading ? (
          <p className="text-center" style={{ fontFamily: "'Special Elite', monospace" }}>
            Cargando...
          </p>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.playerId}
                className={`border-2 border-black p-4 flex items-center gap-4 ${
                  index === 0 ? "bg-yellow-100" : index === 1 ? "bg-gray-100" : index === 2 ? "bg-orange-100" : "bg-[#e8d5a3]"
                }`}
              >
                <div
                  className="text-2xl font-bold w-8 text-center"
                  style={{ fontFamily: "'Rye', serif" }}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-bold" style={{ fontFamily: "'Rye', serif" }}>
                    Jugador {entry.playerId.slice(0, 8)}
                  </p>
                  <p className="text-xs" style={{ fontFamily: "'Special Elite', monospace" }}>
                    {entry.stats.multiplayerWins}V - {entry.stats.multiplayerLosses}L
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ fontFamily: "'Rye', serif" }}>
                    {entry.stats.multiplayerWins}
                  </p>
                  <p className="text-xs" style={{ fontFamily: "'Special Elite', monospace" }}>
                    Victorias
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
