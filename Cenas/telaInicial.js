class TelaInicial extends Phaser.Scene {
    constructor() {
        super('TelaInicial'); //indica o nome de identificação desta instância específica para o Phaser que é a 'TelaInicial'.
    }

    // Carrega a imagem do fundo
    preload (){
        this.load.image('telaInicial', 'Assets/telaInicial.jpg');
    }   
    //cria as cenas 
    create() {
        // Variáveis para armazenar os tamanhos da tela
        const larguraTela = this.scale.width;
        const alturaTela = this.scale.height;

        // Adiconar imagem pré-carregada
        this.add.image(0, 0, 'telaInicial').setOrigin(0, 0).setDisplaySize(larguraTela, alturaTela);

        // Texto e estilo de texto do título com CSS embutido
        this.add.text(larguraTela / 2, alturaTela / 2 - 50, 'JOGO DO TUBARÃO', {
            fontSize: '60px', fill: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5);

        // Subtitulo com CSS embutido
        this.add.text(larguraTela / 2, alturaTela / 2 + 50, 'Clique na tela para começar', {
            fontSize: '30px', fill: '#ffffff', fontFamily: 'Arial',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        // aciona o código para ficar atento ao evento de clique do jogador na tela para executar uma ação
        this.input.on('pointerdown', () => {
            let nome = prompt("Qual é o seu nome?"); // esse 'prompt' interrompe para mostrar na tela uma mensagem
            if (!nome || nome.trim() === "") {
                nome = "Tubarão"; //caso não for digitado nada
            }
            this.scene.start('oceanoMar', { nomeDoJogador: nome });
        });
    }
}
