// import list of games
// TicTac
import TicTacGame from './TicTac';

const gameList = [
    {
        title: 'TicTacToe',
        sub_title: 'Multiplayer',
        icon: 'images/tictactoe.png',
        path: '/tictactoe'
    }
];

const gameRoutes = [
    {
        path: '/tictactoe',
        exact: true,
        component: TicTacGame
    }
];

export { gameList, gameRoutes };