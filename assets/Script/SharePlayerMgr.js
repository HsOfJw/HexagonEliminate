window.Game = window.Game || {};

window.Game.SharePlayerMgr = {

    data: null,

    init(playerData){
        this.data = playerData.concat();
    },

    getHeadURL(uid){
        if(!this.data || this.data.length <= 0){
            return;
        }

        for(var i = 0;i < this.data.length;i ++){
            if(this.data[i].user_id == uid){
                return this.data[i].avatar_url;
            }
        }
        return null;
    },

    clear(){
        if(this.data){
            this.data.length = 0;
        }
    }
};
