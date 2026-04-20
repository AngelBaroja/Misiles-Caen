

class AudioSingleton {
    static Instancia;

    constructor(scene) {
        if (!!AudioSingleton.instance) {
            return AudioSingleton.instance;
        }

        this.scene = scene;
        this.musica = null;

        AudioSingleton.instance = this;
    }

     static getInstance(scene) {
        if (!AudioSingleton.instance) {
            AudioSingleton.instance = new AudioSingleton(scene);
        }
        return AudioSingleton.instance;
    }
    reproducirMusica() {
        if (!this.musica) {
            this.musica = this.scene.sound.add('musicaInicio', {
                loop: true,
                volume: 0.4
            });
            this.musica.play();
        }
    }
    detenerMusica() {
        if (this.musica) {
            this.musica.stop();
        }
    }
    iniciarMusica() {
        if (this.musica) {
            this.musica.play();
        }
    }
      
}