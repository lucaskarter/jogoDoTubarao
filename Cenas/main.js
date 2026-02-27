// Configuração do Jogo
const config = {
    type: Phaser.AUTO,
    // Configuração do tamanho da tela
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
    },
    // Configuração de física do jogo
    physics: {
        default: 'arcade',
        matter: {
            gravity: { y: 0, x: 0 },
            debug: false
        }
    },
    // Dizer quais cenas que vão existir. É respeitado por ordem cronológica
    scene: [TelaInicial, oceanoMar] 
};

// Dá a partida no jogo
const game = new Phaser.Game(config);
