class Tutorial extends Phaser.Scene {

    constructor() {
        super('Tutorial');
    }

    preload() {
        //this.load.baseURL = '/curso/phaser/ex/fall-down-game/';
        resize();
        window.addEventListener('resize', resize);
        this.load.image('fondo', '../img/Tutorial.png');
        this.load.image('misil0', '../img/misil0.png');
        this.load.image('misil1', '../img/misil1.png');
        this.load.spritesheet('explosion', '../img/crash.png', {
            frameWidth: 199,
            frameHeight: 200
        });
        this.load.spritesheet('vida', '../img/vida.png', {
            frameWidth: 50,
            frameHeight: 50
        });
        this.load.audio('musicaInicio', '../sonido/Broken beat.mp3');
        this.load.audio('misilCayendo', '../sonido/Delay swoosh.mp3');
        this.load.audio('misilDestruido', '../sonido/Chipped.mp3');
        this.load.audio('misilImpacto', '../sonido/Dark hit, echo.mp3');
        this.load.audio('ambiente', '../sonido/Lost.mp3');  
        this.load.audio('nivel++', '../sonido/Space woosh.mp3');        
    }

    create() {
        this.add.sprite(config.width / 2, config.height / 2, 'fondo');
        this.sound.play("ambiente",{
            loop:true,
            volume: 0.3
        })
        AudioSingleton.getInstance(this).reproducirMusica();
        AudioSingleton.getInstance(this).iniciarMusica();

        this.nivelTexto = this.add.text(150, 50, 'NIVEL TUTORIAL', {
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '32px',
            color: '#00ff41',
            stroke: '#003300',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        this.vida1 = this.add.sprite(50, 100, 'vida');
        this.vida2 = this.add.sprite(100, 100, 'vida');
        this.vida3 = this.add.sprite(150, 100, 'vida');
        this.vida4 = this.add.sprite(200, 100, 'vida');
        this.vida5 = this.add.sprite(250, 100, 'vida');
        this.contadorVidas = 5;       

        this.time.delayedCall(0, this.onEvent, [], this);

        this.physics.world.setBoundsCollision(true, true, true, true);

        this.anims.create({
            key: 'explosionAnim',
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0,
                end: 4
            }),
            frameRate: 7
        });
        this.anims.create({
            key: 'sinVida',
            frames: this.anims.generateFrameNumbers('vida', {
                start: 1,
                end: 1
            }),
            frameRate: 1
        });
        //LAZAR MISIL
        this.velocidadMisil = 20;
        this.lanzarMisil();
        this.time.addEvent({
            delay: 15000, // 15 segundos
            callback: this.cambiarDificultad, 
            callbackScope:this,          
        });
       
        this.physics.world.on('worldbounds', (body) => {
            
             // Evita que el evento se dispare más de una vez por este misil
            body.gameObject.onWorldBounds = false;
            body.gameObject.disableBody(); // detiene física y colisiones
            this.sound.play("misilImpacto",{
                volume: 0.5
            });
            body.gameObject.play("explosionAnim").on("animationcomplete",()=>body.gameObject.destroy());
            
            --this.contadorVidas;
            if (this.contadorVidas == 4) {
                this.vida5.play("sinVida");
            }
            if (this.contadorVidas == 3) {
                this.vida4.play("sinVida");
            }
            if (this.contadorVidas == 2) {
                this.vida3.play("sinVida");
            }
            if (this.contadorVidas == 1) {
                this.vida2.play("sinVida");
            }
            if (this.contadorVidas == 0) {
                this.vida1.play("sinVida");
                AudioSingleton.getInstance(this).detenerMusica();
                this.sound.stopAll();
                this.scene.start('perderScene');
            }
        });
    }

    lanzarMisil() {
        this.sound.play('misilCayendo',{
            volume: 0.4
        });
        const aleatorio = Math.floor(Math.random() * 2);
        const posicionMisil = Math.floor(Math.random() * 520 + 50); // para que no salga tan pegado al borde
        const misil = this.physics.add.sprite(posicionMisil, 100, 'misil' + aleatorio).setInteractive();
        misil.setVelocity(0, this.velocidadMisil);
        misil.setCollideWorldBounds(true);
        misil.body.onWorldBounds = true;
        

        misil.on('pointerdown', () => this.misilPulsado(misil));
        this.timerMisil = this.time.delayedCall(2000, this.lanzarMisil, [], this);
    }
    cambiarDificultad() {    
        if (this.timerMisil) this.timerMisil.remove(); // detiene el anterior   
        this.sound.play("nivel++",{
            volume:0.3
        });
        this.scene.start("Escena");
     
    }

    misilPulsado(m) {
        m.removeInteractive(); // 👈 ya no acepta más clicks
        this.sound.play("misilDestruido",{
                volume: 0.4
            });        
        m.disableBody();
        m.play("explosionAnim").on('animationcomplete', () => m.destroy());
    }

}

class Escena extends Phaser.Scene {

    constructor() {
        super('Escena');
    }

    preload() {
        //this.load.baseURL = '/curso/phaser/ex/fall-down-game/';
        resize();
        window.addEventListener('resize', resize);
        this.load.image('fondo2', '../img/fondo.jpg');
        this.load.image('misil0', '../img/misil0.png');
        this.load.image('misil1', '../img/misil1.png');
        this.load.spritesheet('explosion', '../img/crash.png', {
            frameWidth: 199,
            frameHeight: 200
        });
        this.load.spritesheet('vida', '../img/vida.png', {
            frameWidth: 50,
            frameHeight: 50
        });
        this.load.audio('musicaInicio', '../sonido/Broken beat.mp3');
        this.load.audio('misilCayendo', '../sonido/Delay swoosh.mp3');
        this.load.audio('misilDestruido', '../sonido/Chipped.mp3');
        this.load.audio('misilImpacto', '../sonido/Dark hit, echo.mp3');
        this.load.audio('ambiente', '../sonido/Lost.mp3');  
        this.load.audio('nivel++', '../sonido/Space woosh.mp3');  
        this.load.audio('llamas', '../sonido/Volcano Eruption.wav');          
    }

    create() {
        this.sound.play("llamas",{
            volume:0.6
        })
        this.time.removeAllEvents(); // detiene todos los eventos programados (como el lanzamiento de misiles)
        this.add.sprite(320, 480, 'fondo2');
        this.sound.play("ambiente",{
            loop:true,
            volume: 0.3
        })
        AudioSingleton.getInstance(this).reproducirMusica();
        AudioSingleton.getInstance(this).iniciarMusica();

        this.nivel = 1;
        this.nivelTexto = this.add.text(100, 50, 'NIVEL 01', {
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '32px',
            color: '#00ff41',
            stroke: '#003300',
            strokeThickness: 2
        }).setOrigin(0.5);
              // Animación de escala: crece y vuelve a su tamaño normal
        this.tweens.add({
            targets: this.nivelTexto,
            scaleX: 1.8,
            scaleY: 1.8,
            duration: 200,        // tiempo en crecer (ms)
            yoyo: true,           // vuelve solo al tamaño original
            ease: 'Bounce.Out'    // efecto de rebote
        });
        
        this.vida1 = this.add.sprite(50, 100, 'vida');
        this.vida2 = this.add.sprite(100, 100, 'vida');
        this.vida3 = this.add.sprite(150, 100, 'vida');
    
        this.contadorVidas = 3;       

        this.time.delayedCall(0, this.onEvent, [], this);

        this.physics.world.setBoundsCollision(true, true, true, true);

        this.anims.create({
            key: 'explosionAnim',
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0,
                end: 4
            }),
            frameRate: 7
        });
        this.anims.create({
            key: 'sinVida',
            frames: this.anims.generateFrameNumbers('vida', {
                start: 1,
                end: 1
            }),
            frameRate: 1
        });
        //LAZAR MISIL
        this.velocidadMisil = 100;
        this.lanzarMisil();
        this.time.addEvent({
            delay: 10000, // 10 segundos
            callback: this.cambiarDificultad,
            callbackScope: this,
            loop: true 
        });
       
        this.physics.world.on('worldbounds', (body) => {
            
             // Evita que el evento se dispare más de una vez por este misil
            body.gameObject.onWorldBounds = false;
            body.gameObject.disableBody(); // detiene física y colisiones
            this.sound.play("misilImpacto",{
                volume: 0.5
            });
            body.gameObject.play("explosionAnim").on("animationcomplete",()=>body.gameObject.destroy());
            
            --this.contadorVidas;         
            if (this.contadorVidas == 2) {
                this.vida3.play("sinVida");
            }
            if (this.contadorVidas == 1) {
                this.vida2.play("sinVida");
            }
            if (this.contadorVidas == 0) {
                this.vida1.play("sinVida");
                AudioSingleton.getInstance(this).detenerMusica();
                this.sound.stopAll();
                this.scene.start('perderScene');
            }
        });
    }

    lanzarMisil() {
        this.sound.play('misilCayendo',{
            volume: 0.4
        });
        const aleatorio = Math.floor(Math.random() * 2);
        const posicionMisil = Math.floor(Math.random() * 520 + 50); // para que no salga tan pegado al borde
        const misil = this.physics.add.sprite(posicionMisil, 100, 'misil' + aleatorio).setInteractive();
        misil.setVelocity(0, this.velocidadMisil);
        misil.setCollideWorldBounds(true);
        misil.body.onWorldBounds = true;
        

        misil.on('pointerdown', () => this.misilPulsado(misil));
        this.time.delayedCall(2000, this.lanzarMisil, [], this);
    }
    cambiarDificultad() {
        if (this.timerMisil) {
            this.timerMisil.remove(); // detiene el anterior
        }
        this.velocidadMisil += 50; //  más velocidad cada 10 segundos
        this.nivel++;
        const nivelStr = String(this.nivel).padStart(2, '0');
        this.nivelTexto.setText('NIVEL ' + nivelStr);
        this.sound.play("nivel++",{
            volume:0.3
        });
           // Animación de escala: crece y vuelve a su tamaño normal
        this.tweens.add({
            targets: this.nivelTexto,
            scaleX: 1.8,
            scaleY: 1.8,
            duration: 200,        // tiempo en crecer (ms)
            yoyo: true,           // vuelve solo al tamaño original
            ease: 'Bounce.Out'    // efecto de rebote
        });
        
    }

    misilPulsado(m) {
        m.removeInteractive(); // 👈 ya no acepta más clicks
        this.sound.play("misilDestruido",{
                volume: 0.4
            });        
        m.disableBody();
        m.play("explosionAnim").on('animationcomplete', () => m.destroy());
    }

}

class PerderEscena extends Phaser.Scene {
    constructor() {
        super('perderScene');
    }

    preload() {
        //this.load.baseURL = '/curso/phaser/ex/fall-down-game/';
        this.load.image('fin', '../img/fin-de-juego-vertical.jpg');
        this.load.audio("sonidoPerder", '../sonido/Arcade Gliss Down.WAV');
    }

    create() {
        this.add.image(320, 480, 'fin');
        this.sound.play("sonidoPerder",{
            volume:0.4
        });
        
        this.input.on('pointerdown', () => this.volverAJugar())
    }

    volverAJugar() {
        this.scene.start('Escena');
    }
}

function resize() {
    const canvas = document.querySelector("canvas");
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const windowRatio = windowWidth / windowHeight;
    const gameRatio = config.width / config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width =`${windowWidth}px`;
        canvas.style.height = `${windowWidth / gameRatio}px`;
    } else {
        canvas.style.width = `${windowHeight * gameRatio}px`;
        canvas.style.height = `${windowHeight}px`;
    }
}

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    scene: [Tutorial,Escena, PerderEscena],
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