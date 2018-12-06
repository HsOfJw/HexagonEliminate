cc.Class({
    extends: cc.Component,

    properties: {
        imgSp: {displayName: "图表icon", default: null, type: cc.Node},
    },

    onLoad() {
        this.imgSp.on(cc.Node.EventType.TOUCH_END, this.onBtnClickItem.bind(this));
    },

    setItemData(directInfo) {
        this.directInfo = directInfo;
        this.createImage(directInfo.img_url, this.imgSp);

        this.tryCutGameName(directInfo.name);
    },

    tryCutGameName(name) {
        let newName = name;
        if(name.length > 4) {
            newName = `${name.substring(0 , 4)}...`;
        }
        this.node.getChildByName("name").getComponent(cc.Label).string = newName;
    },

    //执行跳转逻辑
    onBtnClickItem() {
        let that = this;
        if (window.wx != undefined) {
            wx.navigateToMiniProgram({
                appId: that.directInfo.app_id,
                path: that.directInfo.path,
                extraData: {
                    gameId: that.directInfo.game_id
                },
                envVersion: 'release',
                success() {
                    //console.log("跳转成功");
                },
                fail(res) {
                    //console.log("跳转失败", res);
                },
            })
        }
    },

    createImage(avatarUrl , spNode) {
        if(window.wx != undefined) {
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        let sp = new cc.SpriteFrame(texture);
                        spNode.getComponent(cc.Sprite).spriteFrame = sp;
                    }catch(e) {
                        console.log("load image error");
                    }
                }
                image.src = avatarUrl;
            }catch(e) {
                console.log("createImage error");
            }
        }else {
            cc.loader.load({
                url: avatarUrl, type: 'jpg'
            }, (err, texture) => {
                let sp = new cc.SpriteFrame(texture);
                spNode.getComponent(cc.Sprite).spriteFrame = sp;
            });
        }
    },
});
