export const possibleWin = [
    ['A1', 'A2', 'A3'],
    ['B1', 'B2', 'B3'],
    ['C1', 'C2', 'C3'],
    ['A1', 'B2', 'C3'],
    ['C1', 'B2', 'A3'],
    ['A1', 'B1', 'C1'],
    ['A2', 'B2', 'C2'],
    ['A3', 'B3', 'C3']
];

export const checkWin = (arrayGame) => {
    const game = arrayGame;

    for(let i = 0; i < possibleWin.length; i++) {
        let marker = [];
        for (let j = 0; j < possibleWin[i].length; j++) {
            marker.push(game[possibleWin[i][j]]);

            if (j === possibleWin[i][j].length) {
                let markerFinal = Object.values(marker);
                markerFinal = [...new Set(markerFinal)];
                if (markerFinal.length === 1 && markerFinal[0] !== null) {
                    return markerFinal;
                } 
            }
        }
    }
}

export const checkPossibleMarker = (arrayGame) => {
    const game = Object.entries(arrayGame);
    let tmpPossibleMarker = [];

    for(let i = 0; i < game.length; i++) {
        if (game[i].includes(null)) {
            tmpPossibleMarker.push({ [game[i][0]]: null });
        }

        if (i + 1 === game.length) {
            return tmpPossibleMarker;
        }
    }
}