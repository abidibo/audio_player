"use strict";

var Player = function(audio_element, options) {

    this.audio_obj = document.id(audio_element);
    this.options = options;

    this.init = function() {
        this.status = 'pause';
        //this.duration = this.audio_obj.duration;
        this.time = '00';
        this.render();
        this.addEvents();
    };

    this.render = function() {

        // source controller
        this.source_ctrl_el = new Element('div.source-ctrl.fa.fa-play');
        this.source_ctrl_button = new Element('div.source-ctrl-container')
            .adopt(this.source_ctrl_el);

        // time info
        this.time_current_el = new Element('span.time-current');
        this.time_duration_el = new Element('span.time-duration');
        var time_info = new Element('div.time-info')
            .adopt(
                this.time_current_el,
                new Element('span.time-current-duration-separator').set('text', ' / '),
                this.time_duration_el
            );

        // volume ctrl
        this.volume_slider = new Element('div.volume-slider');
        this.volume_ctrl = new Element('div.volume-ctrl')
            .adopt(
                new Element('span.fa.fa-2x.fa-volume-off'),
                this.volume_slider.adopt( new Element('div.volume-knob')),
                new Element('span.fa.fa-2x.fa-volume-up')
            );

        var container = new Element('div.player')
            .adopt(
                this.source_ctrl_button,
                new Element('div.volume-ctrl-container').adopt(this.volume_ctrl),
                time_info
            )
            .inject(this.audio_obj, 'after');
    };

    this.addEvents = function() {
        this.audio_obj.addEventListener('loadeddata', function() { 
            this.time_duration_el.set('text', this.toHHMMSS(this.audio_obj.duration));
            this.time_current_el.set('text', this.toHHMMSS(this.audio_obj.currentTime));
        }.bind(this));
        this.source_ctrl_button.addEvent('click', this.sourceCtrlAction.bind(this));

        new Slider(this.volume_slider, this.volume_slider.getElement('.volume-knob'), {
            range: [0, 100],
            initialStep: this.audio_obj.volume * 100,
            onChange: function(value){
                this.audio_obj.volume = value/100;
            }.bind(this)
        });
    };

    this.sourceCtrlAction = function() {
        if(this.status == 'pause') {
            this.play();
        }
        else {
            this.pause();
        }
    };

    this.toHHMMSS = function(s) {
        var sec_num = parseInt(s, 10);
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if(hours   < 10) { hours   = "0" + hours; }
        if(minutes < 10) { minutes = "0" + minutes; }
        if(seconds < 10) { seconds = "0" + seconds; }

        var time = (hours == '00' ? '' : hours + ':') + minutes + ':' + seconds;

        return time;
    }

    this.play = function() {
        this.time_current_el.set('text', this.toHHMMSS(this.audio_obj.currentTime));
        this.time_ti = setInterval(function() {
            this.time_current_el.set('text', this.toHHMMSS(this.audio_obj.currentTime));
        }.bind(this), 1000);
        this.source_ctrl_el.removeClass('fa-play').addClass('fa-pause');
        this.audio_obj.play();
        this.status = 'play';
    };

    this.pause = function() {
        clearInterval(this.time_ti);
        this.source_ctrl_el.removeClass('fa-pause').addClass('fa-play');
        this.audio_obj.pause();
        this.status = 'pause';
    };

}
