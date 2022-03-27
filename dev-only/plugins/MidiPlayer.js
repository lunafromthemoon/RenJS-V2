class MidiPlayer extends RenJS.Plugin {

    synths = [];
    midis = {};

    onInit() {
        
        const binaryLoadCallback = (key, data) => {
            // Convert our binary file into a Uint8Array
            const binarydata = new Uint8Array(data);
            // Convert the binary array to json
            this.midis[key] = new Midi(binarydata);
            return binarydata
        }
        //preload your midis here
        this.game.load.binary('clairdelune', 'assets/audio/clair-de-lune.mid', binaryLoadCallback, this.game);
        this.game.load.start();
    }

    onCall(params) {
        if (params.body == "stop"){
            this.stopMidi();
        } else {
            this.playMidi(params.body);
        }
        this.game.resolveAction();
    }

    playMidi(key){
        const now = Tone.now() + 0.5;
        this.midis[key].tracks.forEach((track) => {
            //create a synth for each track
            const synth = new Tone.PolySynth(Tone.Synth, {
                envelope: {
                    attack: 0.02,
                    decay: 0.1,
                    sustain: 0.3,
                    release: 1,
                },
            }).toDestination();
            this.synths.push(synth);
            //schedule all of the events
            track.notes.forEach((note) => {
                if (note.duration>0){
                    synth.triggerAttackRelease(
                        note.name,
                        note.duration,
                        note.time + now,
                        note.velocity
                    );
                }
            });
        });
    }

    stopMidi(){
        while (this.synths.length) {
            const synth = this.synths.shift();
            synth.disconnect();
        }
    }
}

RenJSGame.addPlugin('MidiPlayer',MidiPlayer)