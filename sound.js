window.addEventListener('load', () => {
    let sound = new Sound();
    document.querySelector('#sin').addEventListener('click', () => sound.play( 440, "sine", 0.8 ) );
    document.querySelector('#square').addEventListener('click', () => sound.play( 440, "square", 0.1 ) );
    document.querySelector('#triangle').addEventListener('click', () => sound.play( 440, "triangle", 0.5 ) );
    document.querySelector('#sawtooth').addEventListener('click', () => sound.play( 440, "sawtooth", 0.2 ) );
});

class Sound {
    constructor() {
        window.AudioContext = window.webkitAudioContext || window.AudioContext;
        this.ctx = new AudioContext();
    }

    play( frequency, type, gain ) {
        let oscNode = this.ctx.createOscillator();
        let gainNode = this.ctx.createGain();

        oscNode.connect( gainNode );
        gainNode.connect( this.ctx.destination );
        oscNode.type = type;
        oscNode.frequency.value = frequency;
        gainNode.gain.value = gain;
        oscNode.start();
        setTimeout( () => { oscNode.stop() }, 1000 );
    }
}