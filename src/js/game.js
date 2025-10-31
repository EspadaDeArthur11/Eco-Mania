document.getElementById("botaoMenu").onclick = function() {
    window.location.href = "index.html";
}

function tornarArrastavel(gameObject, enableLogs = false) {
    gameObject.setInteractive();

    // obter a cena para registrar listeners globais de input
    const scene = gameObject.scene;
    let offsetX = 0;
    let offsetY = 0;

    function log(msg) {
        if (enableLogs) {
            console.debug(msg);
        }
    }

    // pointer argument é passado pelo evento pointerdown
    function pegarObjeto(pointer) {
        log(`[tornarArrastavel:pegarObjeto] chamado para o objeto: ${gameObject.name}`);
        // calcula offset para que o objeto não "salte" para a posição do ponteiro
        const px = (pointer.worldX !== undefined) ? pointer.worldX : pointer.x;
        const py = (pointer.worldY !== undefined) ? pointer.worldY : pointer.y;
        offsetX = gameObject.x - px;
        offsetY = gameObject.y - py;

        // não usar apenas eventos do próprio gameObject: quando o ponteiro sai rápido do sprite,
        // o evento 'pointermove' no sprite pode parar de disparar. Registramos no scene.input
        // para garantir que continuaremos recebendo os movimentos enquanto o usuário arrasta.
        gameObject.off('pointerdown', pegarObjeto);
        scene.input.on('pointermove', arrastarObjeto);
        scene.input.on('pointerup', soltarObjeto);
    }

    function soltarObjeto(pointer) {
        log(`[tornarArrastavel:soltarObjeto] chamado para o objeto: ${gameObject.name}`);
        gameObject.on('pointerdown', pegarObjeto);
        scene.input.off('pointermove', arrastarObjeto);
        scene.input.off('pointerup', soltarObjeto);
    }

    function arrastarObjeto(pointer) {
        log(`[tornarArrastavel:arrastarObjeto] chamado para o objeto: ${gameObject.name}`);
        const px = (pointer.worldX !== undefined) ? pointer.worldX : pointer.x;
        const py = (pointer.worldY !== undefined) ? pointer.worldY : pointer.y;
        gameObject.x = px + offsetX;
        gameObject.y = py + offsetY;
    }

    function destruir() {
        log(`[tornarArrastavel:destruir] chamado para o objeto: ${gameObject.name}`);
        gameObject.off('pointerdown', pegarObjeto);
        scene.input.off('pointermove', arrastarObjeto);
        scene.input.off('pointerup', soltarObjeto);
    }

    gameObject.on('pointerdown', pegarObjeto);
    gameObject.on('destroy', destruir);
}

var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    backgroundColor: '#DCFBE9',
    physics: {
        default: 'arcade'
    },
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
    this.load.image('lixeira_metal', './assets/lixeira/metal.png');
    this.load.image('lixeira_papel', './assets/lixeira/papel.png');
    this.load.image('lixeira_plastico', './assets/lixeira/plastico.png');
    this.load.image('lixeira_vidro', './assets/lixeira/vidro.png');
    this.load.image('lixeira_organico', './assets/lixeira/organico.png');
    
    // carregar metal
    this.load.image('metal1', './assets/metal/metal1.png');
    this.load.image('metal2', './assets/metal/metal2.png');
    this.load.image('metal3', './assets/metal/metal3.png');
    // carregar papel
    this.load.image('papel1', './assets/papel/papel1.png');
    this.load.image('papel2', './assets/papel/papel2.png');
    this.load.image('papel3', './assets/papel/papel3.png');
    // carregar plastico
    this.load.image('plastico1', './assets/plastico/plastico1.png');
    this.load.image('plastico2', './assets/plastico/plastico2.png');
    this.load.image('plastico3', './assets/plastico/plastico3.png');
    // carregar vidro
    this.load.image('vidro1', './assets/vidro/vidro1.png');
    this.load.image('vidro2', './assets/vidro/vidro2.png');
    this.load.image('vidro3', './assets/vidro/vidro3.png');
    // carregar organico
    this.load.image('organico1', './assets/organico/organico1.png');
    this.load.image('organico2', './assets/organico/organico2.png');
    this.load.image('organico3', './assets/organico/organico3.png');
}

function create ()
{
    var lixeira_papel, lixeira_plastico, lixeira_vidro, lixeira_metal, lixeira_organico;
    //var lixo1, lixo2, lixo3, lixo4, lixo5;
    var lixo3;
    var tipos = ['lixeira_papel', 'lixeira_plastico', 'lixeira_vidro', 'lixeira_metal', 'lixeira_organico'];
    var pontuacao = 0;
    var vidas = ['vidas: ', 'vidas: ♡', 'vidas: ♡ ♡', 'vidas: ♡ ♡ ♡'];
    var quantVidas = 3;
    var textoPontuacao;
    var textoVidas;

    lixeira_papel = this.physics.add.image(320, 900, 'lixeira_papel');
    lixeira_plastico = this.physics.add.image(640, 900, 'lixeira_plastico');
    lixeira_vidro = this.physics.add.image(960, 900, 'lixeira_vidro');
    lixeira_metal = this.physics.add.image(1280, 900, 'lixeira_metal');
    lixeira_organico = this.physics.add.image(1600, 900, 'lixeira_organico');
    
    const daltonico = localStorage.getItem("eco.daltonico") === "1"
    if (daltonico) {
        console.log("Modo Daltônico ligado");
        this.add.text(320, 750, 'Papel', {
            align: 'center',
            fontSize: '40px',
            fontFamily: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
            wordWrap: {width: this.scale.width - 50},
            color: '#000'
        }).setOrigin(0.5);
        this.add.text(640, 750, 'Plástico', {
            align: 'center',
            fontSize: '40px',
            fontFamily: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
            wordWrap: {width: this.scale.width - 50},
            color: '#000'
        }).setOrigin(0.5);
        this.add.text(960, 750, 'Vidro', {
            align: 'center',
            fontSize: '40px',
            fontFamily: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
            wordWrap: {width: this.scale.width - 50},
            color: '#000'
        }).setOrigin(0.5);
        this.add.text(1280, 750, 'Metal', {
            align: 'center',
            fontSize: '40px',
            fontFamily: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
            wordWrap: {width: this.scale.width - 50},
            color: '#000'
        }).setOrigin(0.5);
        this.add.text(1600, 750, 'Orgânico', {
            align: 'center',
            fontSize: '40px',
            fontFamily: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
            wordWrap: {width: this.scale.width - 50},
            color: '#000'
        }).setOrigin(0.5);
    }
//    lixo1 = this.physics.add.image(320, 300, tipos[Phaser.Math.Between(0,4)]).setScale(0.5);
//    lixo1._spawnX = 320; lixo1._spawnY = 300;
//    tornarArrastavel(lixo1);
//
//    lixo2 = this.physics.add.image(640, 300, tipos[Phaser.Math.Between(0,4)]).setScale(0.5);
//    lixo2._spawnX = 640; lixo2._spawnY = 300;
//    tornarArrastavel(lixo2);

    lixo3 = this.physics.add.image(960, 300, tipos[Phaser.Math.Between(0,4)]).setScale(0.5);
    lixo3._spawnX = 960; lixo3._spawnY = 300;
    tornarArrastavel(lixo3);

//    lixo4 = this.physics.add.image(1280, 300, tipos[Phaser.Math.Between(0,4)]).setScale(0.5);
//    lixo4._spawnX = 1280; lixo4._spawnY = 300;
//    tornarArrastavel(lixo4);
//
//    lixo5 = this.physics.add.image(1600, 300, tipos[Phaser.Math.Between(1,3)]).setScale(0.5);
//    lixo5._spawnX = 1600; lixo5._spawnY = 300;
//    tornarArrastavel(lixo5);

    function coletarLixo(lixo, lixeira) {
        if (lixo._colidiu) return;
        lixo._colidiu = true;

        console.log('colidiu ' + lixo.texture.key + ' com ' + lixeira.texture.key);
        var acertou = false;
        var tipo = lixo.texture.key.split("_")[1];
        if ((tipo === 'papel'  && lixeira.texture.key === 'lixeira_papel') ||
            (tipo === 'plastico' && lixeira.texture.key === 'lixeira_plastico') ||
            (tipo === 'vidro' && lixeira.texture.key === 'lixeira_vidro') ||
            (tipo === 'metal' && lixeira.texture.key === 'lixeira_metal') ||
            (tipo === 'organico' && lixeira.texture.key === 'lixeira_organico')) {
                acertou = true;
            }
        
        if (acertou) {
            pontuacao += 10;
            textoPontuacao.setText('Pontuação: ' + pontuacao);
        } else {
            quantVidas = quantVidas - 1;
            textoVidas.setText(vidas[quantVidas]);
            if (quantVidas == 0) {
                window.endGame(pontuacao);
            }
        }

        if (lixo.body) {
            lixo.body.enable = false;
        }

        var scene = this;
        scene.input.once('pointerup', function() {
            if (lixo.body) {
                lixo.body.enable = true;
            }
            lixo.x = (typeof lixo._spawnX !== 'undefined') ? lixo._spawnX : lixeira.x;
            lixo.y = (typeof lixo._spawnY !== 'undefined') ? lixo._spawnY : 300;
            lixo._colidiu = false;
            lixo.setTexture(tipos[Phaser.Math.Between(0,4)]);
        }, scene);
    }

//    this.physics.add.overlap(lixo1, lixeira_papel, coletarLixo, null, this);
//    this.physics.add.overlap(lixo1, lixeira_plastico, coletarLixo, null, this);
//    this.physics.add.overlap(lixo1, lixeira_vidro, coletarLixo, null, this);
//    this.physics.add.overlap(lixo1, lixeira_metal, coletarLixo, null, this);
//    this.physics.add.overlap(lixo1, lixeira_organico, coletarLixo, null, this);
//
//    this.physics.add.overlap(lixo2, lixeira_plastico, coletarLixo, null, this);
//    this.physics.add.overlap(lixo2, lixeira_papel, coletarLixo, null, this);
//    this.physics.add.overlap(lixo2, lixeira_vidro, coletarLixo, null, this);
//    this.physics.add.overlap(lixo2, lixeira_metal, coletarLixo, null, this);
//    this.physics.add.overlap(lixo2, lixeira_organico, coletarLixo, null, this);

    this.physics.add.overlap(lixo3, lixeira_vidro, coletarLixo, null, this);
    this.physics.add.overlap(lixo3, lixeira_papel, coletarLixo, null, this);
    this.physics.add.overlap(lixo3, lixeira_plastico, coletarLixo, null, this);
    this.physics.add.overlap(lixo3, lixeira_metal, coletarLixo, null, this);
    this.physics.add.overlap(lixo3, lixeira_organico, coletarLixo, null, this);

//    this.physics.add.overlap(lixo4, lixeira_metal, coletarLixo, null, this);
//    this.physics.add.overlap(lixo4, lixeira_papel, coletarLixo, null, this);
//    this.physics.add.overlap(lixo4, lixeira_plastico, coletarLixo, null, this);
//    this.physics.add.overlap(lixo4, lixeira_vidro, coletarLixo, null, this);
//    this.physics.add.overlap(lixo4, lixeira_organico, coletarLixo, null, this);
//
//    this.physics.add.overlap(lixo5, lixeira_organico, coletarLixo, null, this);
//    this.physics.add.overlap(lixo5, lixeira_papel, coletarLixo, null, this);
//    this.physics.add.overlap(lixo5, lixeira_plastico, coletarLixo, null, this);
//    this.physics.add.overlap(lixo5, lixeira_vidro, coletarLixo, null, this);
//    this.physics.add.overlap(lixo5, lixeira_metal, coletarLixo, null, this);

    textoPontuacao = this.add.text(this.scale.width / 2 - 250, 150, 'Pontuação: 0', {
            align: 'center',
            fontSize: '40px',
            fontFamily: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
            wordWrap: {width: this.scale.width - 50},
            color: '#000'
        }).setOrigin(0.5);

    textoVidas = this.add.text(this.scale.width / 2 + 250, 150, 'Vidas: ♡ ♡ ♡', {
            align: 'center',
            fontSize: '40px',
            fontFamily: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
            wordWrap: {width: this.scale.width - 50},
            color: '#000'
        }).setOrigin(0.5);
}

    function update ()
    {
        
    }

window.endGame = async function(finalScore) {
  try {
    // se não conseguir recuperar o nome, usamos "Jogador"
    const name = document.getElementById('nomeJog').value || 'Jogador';
    await PhaserDB.reportScore({ name, score: Number(finalScore) || 0 });
    console.log("[game] pontuação salva:", { name, finalScore });
  } catch (e) {
    console.error("[game] erro ao salvar score:", e);
    alert("Não foi possível salvar sua pontuação agora :(");
  } finally {
    window.location.href = "records.html";
  }
};

// Botão "Voltar ao menu"
document.getElementById("botaoMenu")?.addEventListener("click", () => {
  window.location.href = "index.html";
});
