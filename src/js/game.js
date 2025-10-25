var config = {
        type: Phaser.CANVAS,
        width: 1920,
        height: 1080,
        backgroundColor: '#DCFBE9',
        scene: {
            preload: preload,
            create: create,
            update: update
        },
        scale: { // Centralizar o jogo na tela
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        }
    };

    var game = new Phaser.Game(config);

    function preload ()
    {
        this.load.image('metal', './assets/metal.png');
        this.load.image('papel', './assets/papel.png');
        this.load.image('plastico', './assets/plastico.png');
        this.load.image('vidro', './assets/vidro.png');
        this.load.image('organico', './assets/organico.png');
    }

    function create ()
    {
        this.add.image(320, 800, 'papel');
        this.add.image(640, 800, 'plastico');
        this.add.image(960, 800, 'vidro');
        this.add.image(1280, 800, 'metal');
        this.add.image(1600, 800, 'organico');
    }

    function update ()
    {
        
    }