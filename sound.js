window.addEventListener('load', () => {
    let sound = new Sound();
    document.querySelector('#sin').addEventListener('click', () => sound.play( "sine", 0.8, getParam() ) );
    document.querySelector('#square').addEventListener('click', () => sound.play( "square", 0.3, getParam() ) );
    document.querySelector('#triangle').addEventListener('click', () => sound.play( "triangle", 0.7, getParam() ) );
    document.querySelector('#sawtooth').addEventListener('click', () => sound.play( "sawtooth", 0.5, getParam() ) );
    document.querySelector('#violin').addEventListener('click', () => sound.violin( 0.3, getParam() ) );
    document.querySelector('#clarinet').addEventListener('click', () => sound.clarinet( 0.4, getParam() ) );
    document.querySelector('#piano').addEventListener('click', () => sound.piano( 0.4, getParam() ) );
    document.querySelector('#flute').addEventListener('click', () => sound.flute( 0.5, getParam() ) );
});

class Sound {
    constructor() {
        window.AudioContext = window.webkitAudioContext || window.AudioContext;
        this.ctx = new AudioContext();
        this.number = 40;
    }

    /**
     * 基本波形を鳴らす
     * @param {String} type 波形{"sine", "square", "triangle", "sawtooth"のいずれか}
     * @param {Number} gain 音量
     * @param {Object} param 周波数の配列と鳴らす時間のハッシュ
     */
    play( type, gain, param ) {
        let frequency = param.freq || [440];
        let duration = param.duration || 1000;
        let oscNode = new Array( frequency.length );
        let gainNode = new Array( frequency.length );

        for( let i=0; i<oscNode.length; i++ ) {
            oscNode[i] = this.ctx.createOscillator();
            gainNode[i] = this.ctx.createGain();

            oscNode[i].connect( gainNode[i] );
            gainNode[i].connect( this.ctx.destination );

            oscNode[i].type = type;
            oscNode[i].frequency.value = frequency[i];
            gainNode[i].gain.value = gain;

            let dummy = this.ctx.currentTime + duration / 1000.0;
            oscNode[i].start();
            oscNode[i].stop( dummy );
        }
        // this.ctx.createGain();

        // oscNode.connect( gainNode );
        // gainNode.connect( this.ctx.destination );
        // oscNode.type = type;
        // oscNode.frequency.value = frequency;
        // gainNode.gain.value = gain;
        // oscNode.start();
        //setTimeout( () => { oscNode.stop() }, duration );
    }

    /**
     * 楽器音を合成するための，元となる正弦波を生成する
     * @param {Number} number 合成する正弦波の数
     * @param {Number} frequency 基音の周波数
     * @param {Number} gain 振幅
     */
    inst( number, frequency, gain ) {
        let type = "sine";
        let oscNode = new Array(number);
        let gainNode = new Array(number);
        for( let i=1; i<oscNode.length; i++ ) {
            oscNode[i] = this.ctx.createOscillator();
            gainNode[i] = this.ctx.createGain();

            oscNode[i].connect( gainNode[i] );
            gainNode[i].connect( this.ctx.destination );
            oscNode[i].type = type;
            oscNode[i].frequency.value = frequency*i;
            gainNode[i].gain.value = gain/i;
        }
        return [ oscNode, gainNode ];
    }

    /**
     * バイオリン：高い周波数成分まで含まれる音
     * @param {Number} gain 音量
     * @param {Object} param 周波数の配列と鳴らす時間のハッシュ
     */
    violin( gain, param ) {
        let frequency = param.freq || [440];
        let duration = param.duration || 1000;
        for( let j=0; j<frequency.length; j++ ) {
            let [oscNode, gainNode] = this.inst( this.number, frequency[j], gain );
            for( let i=1; i<this.number; i++ ) {
                oscNode[i].start();
                oscNode[i].stop( this.ctx.currentTime + duration / 1000.0 );
            }
        }
    }

    /**
     * クッリネット：奇数倍音で構成される音
     * @param {Number} gain 音量
     * @param {Object} param 周波数の配列と鳴らす時間のハッシュ
     */
    clarinet( gain, param ) {
        let frequency = param.freq || [440];
        let duration = param.duration || 1000;
        for( let j=0; j<frequency.length; j++ ) {
            let [oscNode, gainNode] = this.inst( this.number, frequency[j], gain );
            oscNode[1].start();
            oscNode[1].stop( this.ctx.currentTime + duration / 1000.0 );
            for( let i=2; i<this.number; i+=2 ) {
                oscNode[i].start();
                oscNode[i].stop( this.ctx.currentTime + duration / 1000.0 );
            }
        }
    }

    /**
     * ピアノ：偶数倍音で構成される音
     * @param {Number} gain 音量
     * @param {Object} param 周波数の配列と鳴らす時間のハッシュ
     */
    piano( gain, param ) {
        let frequency = param.freq || [440];
        let duration = param.duration || 1000;
        for( let j=0; j<frequency.length; j++ ) {
            let [oscNode, amp] = this.inst( this.number, frequency[j], gain );
            for( let i=1; i<this.number; i+=2 ) {
                oscNode[i].start();
                oscNode[i].stop( this.ctx.currentTime + duration / 1000.0 );
            }
        }
    }

    /**
     * フルート：低い周波数成分のみ含む音
     * @param {Number} gain 音量
     * @param {Object} param 周波数と鳴らす時間のハッシュ
     */
    flute( gain, param ) {
        let frequency = param.freq || [440];
        let duration = param.duration || 1000;
        for( let j=0; j<frequency.length; j++ ) {
            let [oscNode, amp] = this.inst( this.number, frequency[j], gain );
            for( let i=1; i<6; i++ ) {
                oscNode[i].start();
                oscNode[i].stop( this.ctx.currentTime + duration / 1000.0 );
            }
        }
    }
}

function getParam() {
    let freq1 = Number( document.querySelector('#freq1').value );
    let freq2 = Number( document.querySelector('#freq2').value );
    let freq3 = Number( document.querySelector('#freq3').value );
    let duration = Number( document.querySelector('#bar').value );
    freq = [ freq1 ];
    if( freq2 != 0 ) freq.push( freq2 );
    if( freq3 != 0 ) freq.push( freq3 );
    console.log( freq );
    return { freq: freq, duration: duration };
}