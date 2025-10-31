function tornarArrastavel(gameObject, enableLogs = false) {
  gameObject.setInteractive();

  // obter a cena para registrar listeners globais de input
  const scene = gameObject.scene;
  let offsetX = 0;
  let offsetY = 0;

  function log(msg) {
    if (enableLogs) console.debug(msg);
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

let GAME_OVER = false;

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

function preload() {
  this.load.image('lixeira_metal', './assets/lixeira/metal.png');
  this.load.image('lixeira_papel', './assets/lixeira/papel.png');
  this.load.image('lixeira_plastico', './assets/lixeira/plastico.png');
  this.load.image('lixeira_vidro', './assets/lixeira/vidro.png');
  this.load.image('lixeira_organico', './assets/lixeira/organico.png');

  // carregar metal
  this.load.image('metal_1', './assets/metal/metal_1.png');
  this.load.image('metal_2', './assets/metal/metal_2.png');
  this.load.image('metal_3', './assets/metal/metal_3.png');
  // carregar papel
  this.load.image('papel_1', './assets/papel/papel_1.png');
  this.load.image('papel_2', './assets/papel/papel_2.png');
  this.load.image('papel_3', './assets/papel/papel_3.png');
  // carregar plastico
  this.load.image('plastico_1', './assets/plastico/plastico_1.png');
  this.load.image('plastico_2', './assets/plastico/plastico_2.png');
  this.load.image('plastico_3', './assets/plastico/plastico_3.png');
  // carregar vidro
  this.load.image('vidro_1', './assets/vidro/vidro_1.png');
  this.load.image('vidro_2', './assets/vidro/vidro_2.png');
  this.load.image('vidro_3', './assets/vidro/vidro_3.png');
  // carregar organico
  this.load.image('organico_1', './assets/organico/organico_1.png');
  this.load.image('organico_2', './assets/organico/organico_2.png');
  this.load.image('organico_3', './assets/organico/organico_3.png');
}

function create() {
  var lixeira_papel, lixeira_plastico, lixeira_vidro, lixeira_metal, lixeira_organico;
  var lixo3;
  var tipos = ['papel_1', 'papel_2', 'papel_3',
               'plastico_1', 'plastico_2', 'plastico_3',
               'vidro_1', 'vidro_2', 'vidro_3',
               'metal_1', 'metal_2', 'metal_3',
               'organico_1', 'organico_2', 'organico_3'];
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

  const daltonico = localStorage.getItem("eco.daltonico") === "1";
  if (daltonico) {
    console.log("Modo Daltônico ligado");
    this.add.text(320, 750, 'Papel', {
      align: 'center',
      fontSize: '40px',
      fontFamily: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
      wordWrap: { width: this.scale.width - 50 },
      color: '#000'
    }).setOrigin(0.5);
    this.add.text(640, 750, 'Plástico', {
      align: 'center',
      fontSize: '40px',
      fontFamily: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
      wordWrap: { width: this.scale.width - 50 },
      color: '#000'
    }).setOrigin(0.5);
    this.add.text(960, 750, 'Vidro', {
      align: 'center',
      fontSize: '40px',
      fontFamily: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
      wordWrap: { width: this.scale.width - 50 },
      color: '#000'
    }).setOrigin(0.5);
    this.add.text(1280, 750, 'Metal', {
      align: 'center',
      fontSize: '40px',
      fontFamily: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
      wordWrap: { width: this.scale.width - 50 },
      color: '#000'
    }).setOrigin(0.5);
    this.add.text(1600, 750, 'Orgânico', {
      align: 'center',
      fontSize: '40px',
      fontFamily: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
      wordWrap: { width: this.scale.width - 50 },
      color: '#000'
    }).setOrigin(0.5);
  }

  lixo3 = this.physics.add.image(960, 300, tipos[Phaser.Math.Between(0, 14)]).setScale(0.5);
  lixo3._spawnX = 960; lixo3._spawnY = 300;
  tornarArrastavel(lixo3);

  function coletarLixo(lixo, lixeira) {
    if (lixo._colidiu) return;
    lixo._colidiu = true;

    console.log('colidiu ' + lixo.texture.key + ' com ' + lixeira.texture.key);
    var acertou = false;
    var tipo = lixo.texture.key.split("_")[0];
    if ((tipo === 'papel'     && lixeira.texture.key === 'lixeira_papel') ||
        (tipo === 'plastico'  && lixeira.texture.key === 'lixeira_plastico') ||
        (tipo === 'vidro'     && lixeira.texture.key === 'lixeira_vidro') ||
        (tipo === 'metal'     && lixeira.texture.key === 'lixeira_metal') ||
        (tipo === 'organico'  && lixeira.texture.key === 'lixeira_organico')) {
      acertou = true;
    }

    if (acertou) {
      pontuacao += 10;
      textoPontuacao.setText('Pontuação: ' + pontuacao);
    } else {
      quantVidas = quantVidas - 1;
      textoVidas.setText(vidas[quantVidas]);

      // --- GAME OVER: trava, pausa e finaliza ---
      if (quantVidas <= 0 && !GAME_OVER) {
        GAME_OVER = true;
        this.physics.world.pause();
        this.input.enabled = false;
        this.time.delayedCall(50, () => {
          window.endGame(pontuacao);
        });
        return; // impede continuar executando
      }
    }

    if (lixo.body) {
      lixo.body.enable = false;
    }

    var scene = this;
    scene.input.once('pointerup', function () {
      if (lixo.body) {
        lixo.body.enable = true;
      }
      lixo.x = (typeof lixo._spawnX !== 'undefined') ? lixo._spawnX : lixeira.x;
      lixo.y = (typeof lixo._spawnY !== 'undefined') ? lixo._spawnY : 300;
      lixo._colidiu = false;
      lixo.setTexture(tipos[Phaser.Math.Between(0, 14)]);
    }, scene);
  }

  this.physics.add.overlap(lixo3, lixeira_vidro,    coletarLixo, null, this);
  this.physics.add.overlap(lixo3, lixeira_papel,    coletarLixo, null, this);
  this.physics.add.overlap(lixo3, lixeira_plastico, coletarLixo, null, this);
  this.physics.add.overlap(lixo3, lixeira_metal,    coletarLixo, null, this);
  this.physics.add.overlap(lixo3, lixeira_organico, coletarLixo, null, this);

  textoPontuacao = this.add.text(this.scale.width / 2 - 250, 150, 'Pontuação: 0', {
    align: 'center',
    fontSize: '40px',
    fontFamily: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
    wordWrap: { width: this.scale.width - 50 },
    color: '#000'
  }).setOrigin(0.5);

  textoVidas = this.add.text(this.scale.width / 2 + 250, 150, 'Vidas: ♡ ♡ ♡', {
    align: 'center',
    fontSize: '40px',
    fontFamily: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
    wordWrap: { width: this.scale.width - 50 },
    color: '#000'
  }).setOrigin(0.5);
}

function update() {
  // loop vazio
}

window.endGame = async function (finalScore) {
  try {
    const name = (document.getElementById('nomeJog')?.value || "").trim() || 'Jogador';
    await PhaserDB.reportScore({ name, score: Number(finalScore) || 0 });
    console.log("[game] pontuação salva:", { name, finalScore });
  } catch (e) {
    console.error("[game] erro ao salvar score:", { e });
    alert("Não foi possível salvar sua pontuação agora :(");
  } finally {
    window.location.href = "records.html";
  }
};

// Botão "Voltar ao menu"
document.getElementById("botaoMenu")?.addEventListener("click", () => {
  window.location.href = "index.html";
});
