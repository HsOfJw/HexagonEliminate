window.Game = window.Game || {};

//声音类型
window.Game.SoundType = cc.Enum({
    ST_BGMusic          : 1,  //背景音乐

    ST_CommonBtn        : 2,    
    ST_BombSound        : 3,
    ST_PlaceSuccess     : 4,
    ST_PlaceFail        : 5,
    ST_RotateHexagon    : 6,
    ST_SynthesiT1       : 7,
    ST_SynthesiT2       : 8,
    ST_SynthesiT3       : 9,
    ST_Perfact          : 10,
});

//声音文件路径
var SoundFile = {
};

SoundFile[Game.SoundType.ST_BGMusic]        = "";
SoundFile[Game.SoundType.ST_CommonBtn]      = "btnclick";
SoundFile[Game.SoundType.ST_BombSound]      = "bomb";
SoundFile[Game.SoundType.ST_PlaceSuccess]   = "place_success";
SoundFile[Game.SoundType.ST_PlaceFail]      = "place_fail";
SoundFile[Game.SoundType.ST_RotateHexagon]  = "rotate";
SoundFile[Game.SoundType.ST_SynthesiT1]     = "synthesi";
SoundFile[Game.SoundType.ST_SynthesiT2]     = "synthesi2";
SoundFile[Game.SoundType.ST_SynthesiT3]     = "synthesi3";
SoundFile[Game.SoundType.ST_Perfact]        = "PERFECT_1";

cc.Class({
    extends: cc.Component,

    isOpenSound: null,

    curBgm: null,

    //播放音效
    PlaySoundEffect(type){
        var soundFile = SoundFile[type];
        if(soundFile){
            this.playEffect(soundFile);
        }
    },

    //通用按钮音效
    PlayBtnSound(){
        this.PlaySoundEffect(Game.SoundType.ST_CommonBtn);
    },

    //播放合成音效
    PlaySynthesiSound(count){
        var type = null;
        if(count == 1){
            type = Game.SoundType.ST_SynthesiT1;
        }else if(count == 2){
            type = Game.SoundType.ST_SynthesiT2;
        }else if(count >= 3){
            type = Game.SoundType.ST_SynthesiT3;
        }
        this.PlaySoundEffect(type);
    },

    //播放-背景-音乐
    PlayBackgroundSound(){
        if(this.curBgm != null){
            return;
        }

        var soundFile = SoundFile[SoundType.ST_BGMusic];
        if(soundFile){
            this.curBgm = this.playBackgroundMusic(this.background_music);
        }
    },

    //停止-背景-音乐
    StopBackgroundSound(){
        if(this.curBgm != null){
            cc.audioEngine.stop(this.curBgm);
            this.curBgm = null;
        }
    },

    //暂停-背景-音乐
    PauseBackgroundSound(){
        if(this.curBgm != null)
            cc.audioEngine.pause(this.curBgm);
    },

    //恢复-背景-音乐
    ResumeBackgroundSound(){
        if(this.curBgm != null)
            cc.audioEngine.resume(this.curBgm);
    },

    //打开声音
    OpenSound(){
        this.isOpenSound = true;

        // this.resumeBackgroundSound();
    },

    //关闭声音
    CloseSound(){
        this.isOpenSound = false;

        // this.pauseBackgroundSound();
    },

    playEffect(audio){
        if(!GameConfig.SoundSwitch)
            return;
        if(!this.isOpenSound)
            return;
        if(!audio){
            return;
        }

        var url = "sound/" + audio;

        cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
            var audioID = cc.audioEngine.play(clip, false, 1);
        });
    },

    playBackgroundMusic(audio){
        if(!GameConfig.SoundSwitch)
            return;
        if(!this.isOpenSound)
            return null;
        if(!audio){
            return;
        }

        var self = this;

        var url = "sound/" + audio;

        cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
            self.curBgm = cc.audioEngine.play(clip, true, 1);
        });
    },


    //通用按钮-音效
    playButtonSound(){
        this.playEffect(this.button_Sound);
    },

    //爆炸-音效
    playBombSound(){
        this.playEffect(this.bomb_Sound);
    },

    //放置成功-音效
    playPlaceSuccessSound(){
        this.playEffect(this.place_success_Sound);
    },

    //放置失败-音效
    playPlaceFailSound(){
        this.playEffect(this.palce_fail_Sound);
    },

    //旋转方块-音效
    playRotateSound(){
        this.playEffect(this.rotate_hexagon_Sound);
    },

    //合成音效1-音效
    playSynthesiSound(count){
        if(count == 1){
            this.playEffect(this.synthesi_1_Sound);
        }else if(count == 2){
            this.playEffect(this.synthesi_2_Sound);
        }else if(count >= 3){
            this.playEffect(this.synthesi_3_Sound);
        }
    },

    //播放perfect音效
    playPerfectSound(){
        this.playEffect(this.perfect_Sound);
    },

    onLoad () {
        this.isOpenSound = true;
        Game.AudioManager = this;
    },

    start () {

    },
    // update (dt) {},
});
