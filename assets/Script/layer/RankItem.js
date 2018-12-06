var Util = require("Util");

cc.Class({
    extends: cc.Component,

    properties: {
        bgImg: cc.Node,
        cupImg: cc.Node,
        headImg: cc.Node, 
        playerName: cc.Node,
        rankNum: cc.Node,
        score: cc.Node,
    },

    initView(rank, data, isme){
        if(rank <= 3 || data.is_rank === false){
            this.cupImg.active = true;
            this.rankNum.active = false;
            if(data.is_rank === false){
                Util.SetNodeTexture(this.cupImg, "resources/startscene/bw.png");
            }else{
                Util.SetNodeTexture(this.cupImg, "resources/startscene/No" + rank + ".png");
            }
        }else{
            this.rankNum.active = true;
            this.cupImg.active = false;
            Util.SetNodeText(this.rankNum, rank);
        }

        if( (rank % 2) == 0){
            Util.SetNodeTexture(this.bgImg, "resources/startscene/fankFrame2.png");
        }

        if(isme){
            Util.SetNodeTexture(this.bgImg, "resources/startscene/meFrame.png");
        }

        //限制昵称最大为10个字符
        var nickname = Util.GetByteVal(data.nickname, 10);

        Util.LoadHeadImg(this.headImg, data.avatar_url);
        Util.SetNodeText(this.playerName, nickname);
        Util.SetNodeText(this.score, data.value);
    },
    // update (dt) {},
});
