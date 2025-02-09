import TypeIt from "typeit";
import React, { useEffect, useRef } from 'react';

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
            <h1 id="typeit"></h1>
        </div>
    );
};

export default GameScenario;