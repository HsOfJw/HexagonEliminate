var WXHelper = require("WXHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        jjcySprite          : cc.Sprite, //显示即将超越
    },

    tex: null,

    ctor(){
    },

    onLoad(){
    },

    start(){
        this.tex = WXHelper.JJCYPlayer();

        this.schedule(this._updateSubDomainCanvas.bind(this), 0.5);
    },

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined) {
            if(this.tex && this.jjcySprite){
                this.tex.initWithElement(window.sharedCanvas);
                this.tex.handleLoadedTexture();
                this.jjcySprite.spriteFrame = new cc.SpriteFrame(this.tex);
            }
        }
    }
});
