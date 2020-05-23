window.addEventListener('load', () => {
    let sound = new Sound();
    document.querySelector('#sin').addEventListener('click', () => sound.play( "sine", 0.8, getParam() ) );
    document.querySelector('#square').addEventListener('click', () => sound.play( "square", 0.1, getParam() ) );
    document.querySelector('#triangle').addEventListener('click', () => sound.play( "triangle", 0.5, getParam() ) );
    document.querySelector('#sawtooth').addEventListener('click', () => sound.play( "sawtooth", 0.2, getParam() ) );
});

class Sound {
    constructor() {
        window.AudioContext = window.webkitAudioContext || window.AudioContext;
        this.ctx = new AudioContext();
    }

    play( type, gain, param ) {
        let frequency = param.freq || 440;
        let duration = param.duration || 1;
        let oscNode = this.ctx.createOscillator();
        let gainNode = this.ctx.createGain();

        oscNode.connect( gainNode );
        gainNode.connect( this.ctx.destination );
        oscNode.type = type;
        oscNode.frequency.value = frequency;
        gainNode.gain.value = gain;
        oscNode.start();
        setTimeout( () => { oscNode.stop() }, duration * 1000 );
    }
}

function getParam() {
    let freq = document.querySelector('#freq').rawValue;
    let duration = document.querySelector('#bar').value;
    console.log( freq );
    return { freq: freq, duration: duration };
}