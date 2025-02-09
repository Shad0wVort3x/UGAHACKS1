import React, { useEffect, useRef } from 'react';
import TypeIt from "typeit";
import './GameScenario.css';

const GameScenario = () => {
    const typeItInstance = useRef(null);

    useEffect(() => {
        typeItInstance.current = new TypeIt("#typeit", {
            strings: ["Welcome to the Game Scenario!", "Get ready for an adventure!"],
            speed: 50,
            loop: true,
            breakLines: false
        }).go();

        return () => {
            typeItInstance.current.destroy();
        };
    }, []);

    return (
        <div>
            <div className="static-box"></div>
            <div className="game-scenario-container">
                <h1 id="typeit"></h1>
            </div>
        </div>
    );
};

export default GameScenario;