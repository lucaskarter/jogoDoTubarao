class oceanoMar extends Phaser.Scene {
    constructor() {
        super('oceanoMar'); //indica o nome de identificação desta instância específica para o Phaser que é a 'TelaInicial'.
    }

    // inicia antes de preload e create e serve para receber os dados de outra cena
    init(data) {
        // Salvamos o nome recebido da tela inicial na variável do jogo
        this.nomeJogador = data.nomeDoJogador;
    }
    
    // Carrega a imagens totais do jogo
    preload (){
        this.load.image('marAzul', 'Assets/FundoMar.png');
        this.load.spritesheet('tubarao', 'Assets/tubarao.png', { frameWidth: 516, frameHeight: 254 });
        this.load.image('pedras', 'Assets/pedras.png');
        this.load.spritesheet('peixe', 'Assets/peixe.png', { frameWidth: 279, frameHeight: 235 });
        
        this.load.image('garrafa', 'Assets/garrafa.png');
        this.load.image('lata', 'Assets/lata.png');
        this.load.image('sacola', 'Assets/sacola.png');
        this.load.image('canudo', 'Assets/canudo.png');
    }
    
    // Cria os elementos pré-carregados
    create (){
        // Variáveis para armazenar várias informações. Tamanho da tela, caractrísticas do tubarão e designs da tela de fundo
        const larguraTela = this.scale.width;
        const alturaTela = this.scale.height;
        this.add.image(0, 0, 'marAzul').setOrigin(0, 0).setDisplaySize(larguraTela, alturaTela);
        this.tubarao = this.physics.add.sprite(170, 130, 'tubarao');
        this.tubarao.setCollideWorldBounds(true);
        this.tubarao.setScale(0.4);
        this.tubarao.body.setSize(250, 200); //configurar o tamanho do quadrado de colisão do tubarão
        this.tubarao.body.setOffset(100, 50); //configurar o inicio do quadrado do tubarão
        this.tubarao.setDepth(2);
        this.pedras = this.add.image(0, 0, 'pedras').setOrigin(0, 0).setDisplaySize(larguraTela, alturaTela);
        this.pedras.setDepth(4); 
        this.teclas = this.input.keyboard.createCursorKeys(); // guarda entrada do jogador no teclado
        this.pontos = 0; 

        // inicia o texto na tela com o nome do jogo importado no INIT
        this.placar = this.add.text(larguraTela - 30, 30, this.nomeJogador + ': 0', { 
            fontSize: '45px', fill: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 6
        }).setOrigin(1, 0).setDepth(5);

        // animação de movimento contante do tubarão na tela
        this.anims.create({
            key: 'nadar',
            frames: this.anims.generateFrameNumbers('tubarao', { start: 0, end: 15 }),
            frameRate: 16,
            repeat: -1
        });
        this.tubarao.anims.play('nadar'); // inicia animação

        // animação de movimento constante do peixe
        this.anims.create({
            key: 'nadar_peixe',
            frames: this.anims.generateFrameNumbers('peixe', { start: 0, end: 15 }),
            frameRate: 12,
            repeat: -1
        });

        //criação de grupos vazios prontos para receber elementos e adicionar o motor de física do Phaser para isso
        this.peixes = this.physics.add.group();
        this.lixos = this.physics.add.group();

        // este é um evento que spawna objetos de tempo em tempo
        this.time.addEvent({
            delay: 2000, 
            callback: this.spawnObjeto,
            callbackScope: this,
            loop: true 
        });

        // sistema de sobreposição do tubarão com os objetos e o que faz
        this.physics.add.overlap(this.tubarao, this.peixes, this.comerPeixe, null, this);
        this.physics.add.overlap(this.tubarao, this.lixos, this.gameOver, null, this);
        
        this.isGameOver = false; // variável de gameOver
    }

    comerPeixe(tubarao, peixe) { // função de destruir o peixe e contabilizar pontos
        peixe.destroy();
        this.pontos += 1;
        // NOVO: Atualiza o placar usando o nome do jogador
        this.placar.setText(this.nomeJogador + ': ' + this.pontos);
    }

    gameOver(tubarao, lixo) { // função para quando o tubarão encostar no lixo
        this.isGameOver = true; 
        this.physics.pause(); // não há mais física
        this.tubarao.setTint(0xff0000); // tubarão muda a cor para vermelho
        this.tubarao.anims.stop(); 
        const larguraTela = this.scale.width;
        const alturaTela = this.scale.height;
        //adiciona na tela o texto grande de GAME OVER e estiliza
        this.add.text(larguraTela / 2, alturaTela / 2, 'GAME OVER', {
            fontSize: '80px', fill: '#ff0000', fontFamily: 'Arial', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5).setDepth(5);

        //subtitulo 
        this.add.text(larguraTela / 2, (alturaTela / 2) + 80, 'Pressione F5 para tentar de novo', {
            fontSize: '30px', fill: '#ffffff', fontFamily: 'Arial',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setDepth(5);
    }

    // função para o nascimento de um objeto e o que ele irá executar
    spawnObjeto () {
        const larguraTela = this.scale.width;
        const alturaTela = this.scale.height;
        const yPos = Phaser.Math.Between(150, alturaTela - 50); //limite para os objetos nascerem apenas no mar 
        const vemDaDireita = Phaser.Math.Between(0, 1) === 0; //escolhe entre 0 e 1 e isso significa esquerda e direita
        const nivelDificuldade = Math.floor(this.pontos / 10); //alguns objetos são mais rápidos com base na quantidade de pontos
        const velocidadeExtra = nivelDificuldade * 50; 

        let xPos;
        let velocidadeX;

        // verificar se vem da direita
        if (vemDaDireita) {
            xPos = larguraTela + 100; // nasce fora da tela
            velocidadeX = Phaser.Math.Between(-100 - velocidadeExtra, -200 - velocidadeExtra); // a velocidade é um número aleatorio entre -100 e -200  com base na velocidade extra
        } else {
            xPos = -100; 
            velocidadeX = Phaser.Math.Between(100 + velocidadeExtra, 200 + velocidadeExtra); 
        }

        const ehPeixe = Phaser.Math.Between(0, 1) === 0; //decidir se é peixe ou não para ser aleatório peixe e lixo

        //cria o peixe
        if (ehPeixe) {
            const peixe = this.peixes.create(xPos, yPos, 'peixe');
            peixe.setScale(0.3); 
            peixe.setDepth(2);
            peixe.anims.play('nadar_peixe');
            peixe.setVelocityX(velocidadeX);
            if (!vemDaDireita) peixe.setFlipX(true);
        } else {
            const listaLixos = ['garrafa', 'lata', 'sacola', 'canudo']; //lista com todas as imagens de lixo
            const lixoSorteado = Phaser.Math.RND.pick(listaLixos); //sorteia um item da lista

            const lixo = this.lixos.create(xPos, yPos, lixoSorteado);
            lixo.setScale(0.2); 
            lixo.setDepth(2);
            lixo.setVelocityX(velocidadeX);
            lixo.setAngularVelocity(Phaser.Math.Between(-50, 50));
        }
    }

    update (){
        if (this.isGameOver) return; //encerra a função se estiver em gameover

        let velX = 0;
        let velY = 0;
        const velocidadePadrao = 150;

        if (this.teclas.left.isDown) velX = -velocidadePadrao; // ir para a esquerda
        else if (this.teclas.right.isDown) velX = velocidadePadrao; // ir para a direita
        if (this.teclas.up.isDown) velY = -velocidadePadrao; // ir para cima
        else if (this.teclas.down.isDown) velY = velocidadePadrao; // ir para baixo

        this.tubarao.setVelocity(velX, velY);

        if (velX < 0) this.tubarao.setFlipX(false);
        else if (velX > 0) this.tubarao.setFlipX(true);

        // todas as combinações possíveis de diagonais do tubarão
        if (velX === 0 && velY === 0) this.tubarao.setAngle(0); 
        else if (velX > 0 && velY < 0) this.tubarao.setAngle(-45);
        else if (velX > 0 && velY > 0) this.tubarao.setAngle(45);
        else if (velX < 0 && velY < 0) this.tubarao.setAngle(45);
        else if (velX < 0 && velY > 0) this.tubarao.setAngle(-45);
        else if (velX === 0 && velY < 0) this.tubarao.setAngle(this.tubarao.flipX ? -90 : 90);
        else if (velX === 0 && velY > 0) this.tubarao.setAngle(this.tubarao.flipX ? 90 : -90);
        else this.tubarao.setAngle(0);

        const limiteCeu = 150; //para o tubarão não ir ao céu
        if (this.tubarao.y < limiteCeu) {
            this.tubarao.y = limiteCeu;
        }

        // esse modelo de estrutura faz com que analise constantemente todos os peixes da tela e faz com que se sua posição X for maior do que a largura da tela, o códico remove esse peixe
        this.peixes.getChildren().forEach(peixe => {
            if (peixe.x < -150 || peixe.x > this.scale.width + 150) peixe.destroy(); 
        });

        // mesma fução acima, mas para lixo
        this.lixos.getChildren().forEach(lixo => {
            if (lixo.x < -150 || lixo.x > this.scale.width + 150) lixo.destroy(); 
        });
    }
}
