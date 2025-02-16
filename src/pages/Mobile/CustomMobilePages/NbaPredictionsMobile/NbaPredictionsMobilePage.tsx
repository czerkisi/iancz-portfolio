import React, { useEffect, useState } from 'react';
import './NbaPredictionsMobilePage.css';
import { getCustomProjectFile } from '../../../App/fileFunctions';

// Define the shape of a game entry.
interface GameEntry {
    date: string;
    home_team: string;
    away_team: string;
    predicted_win_percentage: number;
    polymarket_win_percentage: number;
    result: string | null; // "W" means home win; "L" means home loss.
    bet_rec?: string;
    bet_amount?: number;
}

const NbaPredictionsPage: React.FC = () => {
    const [maxBet, setMaxBet] = useState<number>(20);
    const [results, setResults] = useState<GameEntry[]>([]);

    // On component mount, fetch the results JSON.
    useEffect(() => {
        fetch(getCustomProjectFile('nbapreds', 'results.json'))
            .then((res) => res.json())
            .then((data: GameEntry[]) => setResults(data))
            .catch((err) => console.error('Error fetching results:', err));
    }, []);

    // Helper: Given a game, return the implied probability (market odds) for the recommended team.
    const getImpliedProbability = (game: GameEntry): number | null => {
        if (!game.bet_rec || game.bet_rec.includes('No Bet')) return null;
        if (game.bet_rec === game.home_team) {
            return game.polymarket_win_percentage;
        }
        if (game.bet_rec === game.away_team) {
            return 1 - game.polymarket_win_percentage;
        }
        return null;
    };

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const lastWeekDate = new Date();
    lastWeekDate.setDate(today.getDate() - 7);
    const lastMonthDate = new Date();
    lastMonthDate.setDate(today.getDate() - 30);

    const computeStats = (games: GameEntry[]) => {
        let wins = 0;
        let totalBets = 0;
        let totalStake = 0;
        let totalWinnings = 0;

        games.forEach((game) => {
            if (!game.bet_rec || game.bet_rec.includes('No Bet')) return;
            if (!game.result) return;
            const betAmount = game.bet_amount ?? 0;
            if (betAmount <= 0) return;

            const actualBetAmount = maxBet * betAmount;
            totalStake += actualBetAmount;
            totalBets++;

            const impliedProb = getImpliedProbability(game);
            if (!impliedProb || impliedProb === 0) return;

            const correctRecommendation =
                (game.bet_rec === game.home_team && game.result === 'W') ||
                (game.bet_rec === game.away_team && game.result === 'L');

            if (correctRecommendation) {
                wins++;
                totalWinnings += actualBetAmount / impliedProb;
            }
        });

        const winPercentage = totalBets > 0 ? (wins / totalBets) * 100 : 0;
        const totalReturn = totalWinnings - totalStake;
        return { winPercentage, totalReturn };
    };

    const lastWeekGames = results.filter((game) => {
        const gameDate = new Date(game.date);
        return gameDate >= lastWeekDate && gameDate < today && game.result;
    });

    const lastMonthGames = results.filter((game) => {
        const gameDate = new Date(game.date);
        return gameDate >= lastMonthDate && gameDate < today && game.result;
    });

    const seasonGames = results.filter((game) => game.result);

    const lastWeekStats = computeStats(lastWeekGames);
    const lastMonthStats = computeStats(lastMonthGames);
    const seasonStats = computeStats(seasonGames);

    const yesterdayResults = results.filter(
        (game) => game.date === yesterdayStr && game.result
    );

    const totalDayReturn = yesterdayResults.reduce((acc, game) => {
        const betAmount = game.bet_amount ?? 0;
        const actualBetAmount = maxBet * betAmount;
        if (betAmount <= 0 || !game.bet_rec || game.bet_rec.includes('No Bet') || !game.result)
            return acc;
        const impliedProb = getImpliedProbability(game);
        if (!impliedProb || impliedProb === 0) return acc;
        const correctRecommendation =
            (game.bet_rec === game.home_team && game.result === 'W') ||
            (game.bet_rec === game.away_team && game.result === 'L');
        if (correctRecommendation) {
            return acc + actualBetAmount / impliedProb - actualBetAmount;
        }
        return acc - actualBetAmount;
    }, 0);

    const todayGames = results.filter(
        (game) => game.date === todayStr && game.bet_rec
    );

    return (
        <div className="page nba-predictions-page">
            <header className="predictions-header">
                <h1 className="nba-preds-header">NBA Game Outcomes</h1>
                <h2 className="nba-preds-header-2">AI Research Project</h2>
                <p>
                    This system predicts NBA game outcomes and generates data-driven betting recommendations based on historical statistics and betting odds. It includes detailed analysis on win probabilities, optimal bet sizing using the Kelly Criterion, and real-time predictions.
                </p>
            </header>

            <section className="max-input-container">
                <h2>Kelly's Criterion</h2>
                <p>
                    Enter a maximum bet size to see how the Kelly Criterion would have scaled bets and affected performance over the season.
                </p>
                <div className="max-bet-input">
                    <label htmlFor="maxBet">Max Betting Amount:</label>
                    <input
                        type="number"
                        id="maxBet"
                        value={maxBet}
                        onChange={(e) => setMaxBet(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                    />
                </div>
            </section>

            <section className="tables-grid">
                <div className="table-container">
                    <h3>Statistics</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Period</th>
                            <th>Win Percentage</th>
                            <th>Total Return</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Last Week</td>
                            <td>{lastWeekStats.winPercentage.toFixed(2)}%</td>
                            <td>${lastWeekStats.totalReturn.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Last Month</td>
                            <td>{lastMonthStats.winPercentage.toFixed(2)}%</td>
                            <td>${lastMonthStats.totalReturn.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Season</td>
                            <td>{seasonStats.winPercentage.toFixed(2)}%</td>
                            <td>${seasonStats.totalReturn.toFixed(2)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="table-container">
                    <h3>Yesterday's Results</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Matchup</th>
                            <th>Betting Rec</th>
                            <th>Bet Amount</th>
                            <th>Winning Team</th>
                            <th>Return</th>
                        </tr>
                        </thead>
                        <tbody>
                        {yesterdayResults.length > 0 ? (
                            yesterdayResults.map((game, index) => {
                                const betAmount = game.bet_amount ?? 0;
                                const actualBetAmount = maxBet * betAmount;
                                const impliedProb = getImpliedProbability(game);
                                let rowReturn = 0;
                                if (
                                    betAmount > 0 &&
                                    game.bet_rec &&
                                    !game.bet_rec.includes('No Bet') &&
                                    game.result &&
                                    impliedProb &&
                                    impliedProb !== 0
                                ) {
                                    const correctRecommendation =
                                        (game.bet_rec === game.home_team && game.result === 'W') ||
                                        (game.bet_rec === game.away_team && game.result === 'L');
                                    if (correctRecommendation) {
                                        rowReturn = actualBetAmount / impliedProb;
                                    }
                                }
                                const winningTeam =
                                    game.result === 'W'
                                        ? game.home_team
                                        : game.result === 'L'
                                            ? game.away_team
                                            : 'N/A';
                                return (
                                    <tr key={index}>
                                        <td>
                                            {game.home_team} vs {game.away_team}
                                        </td>
                                        <td>{game.bet_rec || 'N/A'}</td>
                                        <td>${actualBetAmount.toFixed(2)}</td>
                                        <td>{winningTeam}</td>
                                        <td>${rowReturn.toFixed(2)}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5}>No games played yesterday.</td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan={4}>
                                <strong>Yesterday's Net Return</strong>
                            </td>
                            <td>
                                <strong>${totalDayReturn.toFixed(2)}</strong>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="table-container">
                    <h3>Today's Predictions</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Matchup</th>
                            <th>Recommended Bet</th>
                            <th>Recommended Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {todayGames.length > 0 ? (
                            todayGames.map((game, index) => {
                                const betAmount = game.bet_amount ?? 0;
                                const actualBetAmount = maxBet * betAmount;
                                return (
                                    <tr key={index}>
                                        <td>
                                            {game.home_team} vs {game.away_team}
                                        </td>
                                        <td>{game.bet_rec}</td>
                                        <td>${actualBetAmount.toFixed(2)}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={3}>No games scheduled for today.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default NbaPredictionsPage;
