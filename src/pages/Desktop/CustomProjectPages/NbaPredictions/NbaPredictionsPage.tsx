import React, { useEffect, useState } from 'react';
import './NbaPredictionsPage.css';
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
            <div className="predictions-header">
                <h1 className={'nba-preds-header'}>NBA Game Outcomes</h1>
                <h2 className={'nba-preds-header-2'}>AI Research Project</h2>
                <p>
                    This code is designed to simulate and optimize a betting strategy by comparing predicted win percentages against market odds, with a focus on maximizing net profit. Initially, it processes historical game data to compute features such as the difference and ratio between the internally generated win probability and the market-implied probability. For each game, it also simulates the potential profit or loss from a fixed bet amount, thereby creating a training dataset that links these features to actual profit outcomes. The data processing step also filters out games without a recorded outcome unless explicitly instructed to include upcoming matches.<br/><br/>

                    The model training section leverages a Random Forest Regressor, employing a grid search with cross-validation to fine-tune hyperparameters such as the number of trees, maximum depth, and sample split criteria. Before training, the features are standardized using a scaler to ensure they are on a comparable scale, which is critical for model performance. The grid search evaluates multiple parameter combinations using a negative mean squared error metric, and it integrates progress tracking through a custom wrapper that uses a progress bar for user feedback.<br/><br/>

                    A key part of the strategy is determining an optimal threshold for predicted profit. The code implements a cross-validation routine that iterates over a range of potential threshold values, evaluating the aggregate profit on validation splits. The threshold that yields the highest average profit is chosen, ensuring that the model only recommends bets when the expected profit surpasses this minimum value. This threshold is then stored in the configuration for future reference.<br/><br/>

                    For real betting decisions, the evaluation function applies the Kelly criterion to determine the appropriate bet sizing. Based on the discrepancy between the predicted and market probabilities, it computes the fraction of the current bankroll to wager, aiming to balance the risk-reward trade-off. The simulation tracks the outcome of each bet (win or loss) and updates the bankroll accordingly, providing detailed output for each betting decision on the test set.<br/><br/>

                    Finally, the system integrates all these components by training the model, updating configurations, and then using the trained model to generate daily betting recommendations. It filters today’s game data, checks for any cooldown conditions, and evaluates each game using the model’s profit predictions and the Kelly criterion to decide whether to place a bet and on which team. Overall, the code forms a comprehensive pipeline—from data preparation and model training to threshold optimization and bet evaluation—aimed at identifying high-value betting opportunities based on statistical profit predictions.<br/><br/>

                    All source code for this project is available <a href={'https://github.com/czerkisi/nbapreds'}>here</a>.
                </p>
            </div>

            {/* Input for the maximum betting amount */}
            <h1>Results</h1>
            <div className={'max-input-container'}>
                <h2>Kelly's Criterion</h2>
                <p>Kelly's Criterion calculates the ideal bet size by using the probability of winning and the odds offered, typically computed as (bp - q) divided by b, where b represents the odds, p is the probability of a win, and q is the probability of losing. The maximum bet is needed to cap the wager size so that even if the computed Kelly bet is high, you don't risk more than a predetermined fraction of your bankroll, effectively managing risk over time.</p>                <div className="max-bet-input" style={{ margin: '1rem 0' }}>
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
                            <td>Season</td>
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
