import React, { useEffect, useState } from 'react';
import './NbaPredictionsPage.css';
import { getCustomProjectFile, getIconImage } from '../../../App/fileFunctions';

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
        // If betting on the home team, the market probability is polymarket_win_percentage.
        if (game.bet_rec === game.home_team) {
            return game.polymarket_win_percentage;
        }
        // If betting on the away team, the market probability is 1 minus the home team probability.
        if (game.bet_rec === game.away_team) {
            return 1 - game.polymarket_win_percentage;
        }
        return null;
    };

    // Get today's date as a string in YYYY-MM-DD format.
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Compute yesterday's date string.
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Define date boundaries for “last week” and “last month”.
    const lastWeekDate = new Date();
    lastWeekDate.setDate(today.getDate() - 7);
    const lastMonthDate = new Date();
    lastMonthDate.setDate(today.getDate() - 30);

    // For statistics we only consider finished games (result is not null)
    // and we ignore any game where no bet was placed or where bet_rec is not defined.
    // In addition, we now use the following logic:
    // - A recommendation is correct if:
    //     • bet_rec equals home_team and result is "W"
    //     • or bet_rec equals away_team and result is "L"
    // - For each qualifying game, we add the stake (maxBet * bet_amount) to totalStake.
    // - And for each correct recommendation, we add (stake / impliedProbability) to totalWinnings.
    // - Finally, net totalReturn is totalWinnings minus totalStake.
    const computeStats = (games: GameEntry[]) => {
        let wins = 0;
        let totalBets = 0;
        let totalStake = 0;
        let totalWinnings = 0;

        games.forEach((game) => {
            if (!game.bet_rec || game.bet_rec.includes('No Bet')) return;
            if (!game.result) return;
            const betAmount = game.bet_amount ?? 0;
            if (betAmount <= 0) return; // only consider games with a bet amount > 0

            const actualBetAmount = maxBet * betAmount;
            totalStake += actualBetAmount;
            totalBets++;

            const impliedProb = getImpliedProbability(game);
            if (!impliedProb || impliedProb === 0) return;

            // Check if recommendation is correct:
            // - if bet_rec is home_team and result is "W"
            // - or if bet_rec is away_team and result is "L"
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

    // Filter games for the three periods.
    const lastWeekGames = results.filter((game) => {
        const gameDate = new Date(game.date);
        return gameDate >= lastWeekDate && gameDate < today && game.result;
    });

    const lastMonthGames = results.filter((game) => {
        const gameDate = new Date(game.date);
        return gameDate >= lastMonthDate && gameDate < today && game.result;
    });

    // “Season” statistics uses all finished games.
    const seasonGames = results.filter((game) => game.result);

    // Compute stats for each period.
    const lastWeekStats = computeStats(lastWeekGames);
    const lastMonthStats = computeStats(lastMonthGames);
    const seasonStats = computeStats(seasonGames);

    // Table 2: Yesterday's Results.
    // Only include games where the date exactly equals yesterday's date and a result exists.
    const yesterdayResults = results.filter(
        (game) => game.date === yesterdayStr && game.result
    );

    // Precompute total return for yesterday’s results.
    const totalDayReturn = yesterdayResults.reduce((acc, game) => {
        const betAmount = game.bet_amount ?? 0;
        const actualBetAmount = maxBet * betAmount;
        if (betAmount <= 0 || !game.bet_rec || game.bet_rec.includes('No Bet') || !game.result) return acc;
        const impliedProb = getImpliedProbability(game);
        if (!impliedProb || impliedProb === 0) return acc;
        const correctRecommendation =
            (game.bet_rec === game.home_team && game.result === 'W') ||
            (game.bet_rec === game.away_team && game.result === 'L');
        if (correctRecommendation) {
            return acc + (actualBetAmount / impliedProb) - actualBetAmount;
        }
        return acc - actualBetAmount;
    }, 0);

    // Table 3: Today's Predictions.
    // Only include games where a bet recommendation exists.
    const todayGames = results.filter(
        (game) => game.date === todayStr && game.bet_rec
    );

    return (
        <div className="page nba-predictions-page">
            <div className="header">
                <div className="header-left">
                    <h1>NBA Game Outcomes</h1>
                    <h2>AI Research Project</h2>
                    <p>
                        This codebase implements a comprehensive system for predicting NBA game outcomes and making data-driven betting recommendations based on historical game statistics and real betting lines. In the first section, the code builds a predictive model using a LightGBM classifier. It starts by preparing and splitting the training data, then tunes the model’s hyperparameters via cross-validation while providing real-time progress feedback through a progress bar. Once the optimal parameters are identified, the model is trained on the full dataset and used to update previous game predictions. This process includes encoding team IDs, computing various game statistics for both home and away teams, and ultimately generating win probability estimates that serve as a basis for further analysis.<br/><br/>

                        The second part of the code focuses on deriving profitable betting strategies. Here, the system uses a Random Forest regressor to predict the expected profit of a bet by comparing the model’s win percentage predictions against the the implied win percentage of real betting odds. For example, +200 implies a 33% chance of winning. Key features, such as the difference and ratio between the model’s win probability and the API’s probability, are calculated and used to train the profit prediction model. A grid search with cross-validation is applied to fine-tune the hyperparameters, ensuring the best model performance. The optimal profit threshold is then determined by identifying the value that maximizes realized profit across multiple cross-validation folds.<br/><br/>

                        For making real-time betting decisions, the code computes the Kelly criterion for bet sizing. When evaluating an upcoming game, it assesses whether the predicted net profit exceeds a preset threshold. Based on the comparison of the model’s win probability with implied betting odds, the system decides on which team to bet. If the model predicts a higher chance of winning for the home team compared to the API’s odds, the bet is placed on the home team; if the opposite is true, the away team is favored. The Kelly fraction is calculated differently for each side, ensuring that the bet amount is appropriately scaled as a fraction of the available bankroll. This approach helps in optimizing bet sizes while managing risk. Overall, the design combines robust machine learning methods with practical betting strategies to offer informed recommendations for NBA games.<br/><br/>

                        This model is trained to maximize profit, not win percentage, so it will often opt to bet on underdogs where it sees an edge versus the betting markets. Additionally, it will tend to avoid bets where the upside on the bet is very small even when the model predicts the team to win. These are denoted in the table as "No Bet (Profit Too Small)". Additionally, if either team experiences a major roster change (i.e. a trade or injury), this team will enter a cooldown period where the model will observe the team's performance for a manually specified number of games without recommending any bets on those games. These are denoted in the table as "No Bet (Cooldown)".
                    </p>
                </div>
                <div className="header-right">
                    <img src={getIconImage('nbalogo.jpg')} alt="NBA Visual" />
                </div>
            </div>

            {/* Input for the maximum betting amount */}
            <div className={'max-input-container'}>
                <h2>Kelly's Criterion</h2>
                <p>Kelly's Criterion computes a bet size from 0 to 1. Enter a maximum bet size to see the Kelly Criterion computed ideal betting amounts and how they would've performed over the course of this season</p>
                <div className="max-bet-input" style={{ margin: '1rem 0' }}>
                    <label htmlFor="maxBet" style={{ marginRight: '0.5rem' }}>
                        Max Betting Amount:
                    </label>
                    <input
                        type="number"
                        id="maxBet"
                        value={maxBet}
                        onChange={(e) => setMaxBet(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                    />
                </div>
            </div>

            <div className="tables-grid">
                {/* Table 1: Statistics for last week, last month, and season */}
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
                            <td>Season (All Time)</td>
                            <td>{seasonStats.winPercentage.toFixed(2)}%</td>
                            <td>${seasonStats.totalReturn.toFixed(2)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* Table 2: Yesterday's Results (with Winning Team and Return columns) */}
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
                                // Determine the winning team based on result.
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
                        {/* Total Return row */}
                        <tr>
                            <td colSpan={4}>
                                <strong>Yesterday's Net Return (Total Return - Spend)</strong>
                            </td>
                            <td>
                                <strong>${totalDayReturn.toFixed(2)}</strong>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* Table 3: Today's Predictions */}
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
            </div>
        </div>
    );
};

export default NbaPredictionsPage;
