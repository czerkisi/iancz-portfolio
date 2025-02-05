import React from 'react';
import './NbaPredictionsPage.css';
import {getIconImage} from "../../../App/fileFunctions.ts";

const NbaPredictionsPage: React.FC = () => {
    return (
        <div className="page nba-predictions-page">
            {/* Top Section: Header with Two Columns */}
            <div className="header">
                <div className="header-left">
                    <h1>NBA Game Outcomes</h1>
                    <h2>AI Research Project</h2>
                    <p>
                        Welcome to our NBA predictions page. Here you will find the latest game
                        results, yesterday’s matchups, and today’s game predictions. Stay tuned
                        for more updates!
                    </p>
                </div>
                <div className="header-right">
                    {/* Placeholder image; replace src with your actual picture when ready */}
                    <img src={getIconImage('nbalogo.jpg')} alt="NBA Visual" />
                </div>
            </div>

            {/* Bottom Section: Tables Grid */}
            <div className="tables-grid">
                <div className="table-container">
                    <h3>Results Table</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Game</th>
                            <th>Score</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Team A vs Team B</td>
                            <td>102 - 98</td>
                        </tr>
                        {/* Additional rows can be added here */}
                        </tbody>
                    </table>
                </div>

                <div className="table-container">
                    <h3>Yesterday's Results Table</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Game</th>
                            <th>Score</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Team C vs Team D</td>
                            <td>110 - 105</td>
                        </tr>
                        {/* Additional rows can be added here */}
                        </tbody>
                    </table>
                </div>

                <div className="table-container">
                    <h3>Today's Predictions Table</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Game</th>
                            <th>Prediction</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Team E vs Team F</td>
                            <td>Team E wins</td>
                        </tr>
                        {/* Additional rows can be added here */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default NbaPredictionsPage;
