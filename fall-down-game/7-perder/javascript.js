class Escena extends Phaser.Scene {

    preload() {
        //this.load.baseURL = '/curso/phaser/ex/fall-down-game/';
        resize();
        window.addEventListener('resize', resize);

        this.load.image('fondo', '../img/fondo.jpg');
        this.load.image('misil0', '../img/misil0.png');
        this.load.image('misil1', '../img/misil1.png');
    }

    create() {
        this.add.sprite(320, 480, 'fondo');
        this.time.delayedCall(0, this.onEvent, [], this);

        this.physics.world.setBoundsCollision(true, true, true, true);
        this.physics.world.on('worldbounds', () => {
            alert('fin del juego');
        });
        this.lanzarMisil();
    }

    lanzarMisil() {
        const aleatorio = Math.floor(Math.random() * 2);
        const posicionMisil = Math.floor(Math.random() * 590);
        const misil = this.physics.add.sprite(posicionMisil, 100, 'misil' + aleatorio).setInteractive();
        misil.setVelocity(0, 200);
        misil.setCollideWorldBounds(true);
        misil.body.onWorldBounds = true;
        misil.setBounce(0.1, 0.1);
        misil.on('pointerdown', () => this.misilPulsado(misil));
        this.time.delayedCall(1000, this.lanzarMisil, [], this);
    }

    misilPulsado(m) {
        m.destroy();
    }
}

function resize() {
    const canvas = document.querySelector("canvas");
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const windowRatio = windowWidth / windowHeight;
    const gameRatio = config.width / config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = '${windowWidth}px';
        canvas.style.height = '${windowWidth / gameRatio}px';
    } else {
        canvas.style.width = '${windowHeight * gameRatio}px';
        canvas.style.height = '${windowHeight}px';
    }
}

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    scene: Escena,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 200
            },
        },
    },
};

new Phaser.Game(config);