window.Game = window.Game || {};
/**
* 消息管理器，负责跟服务器收发消息包
* @class
*/
window.Game.NetManager = {

    m_xhr: null,

    connectP: function (addr, port) {
    },

    onOpen: function (event) {
    },

    /**
     * 获取HttpRequest对象
     */
    getXMLHttpRequest: function () {
        return XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP");
    },

    /**
     * 发送消息回调函数
     */
    onMessage: function () {
        var self = this;

        var m_xhr = self.m_xhr;

        try {
            if(m_xhr.readyState == 4) {
                if(m_xhr.status == 200) {
                    var rawData = JSON.parse(m_xhr.responseText);
                } else {
                    self.onError("Net Status Error, Status = " + m_xhr.status);
                }
            }
        }catch (e){
        }
    },

    /*
    *   网络错误
    */
   onError: function (err) {
        cc.Log(err);
    },

    /**
     * 发送消息到服务器
     * @param msgType   [大消息Id]
     * @param msgId     [小消息Id]
     * @param data      [消息体]
     */
    sendMsg: function (type, url, requestData, successCb) {

        if(window.wx == undefined){
            return;
        }

        var self = this;

        wx.request({
            url: url,
            data: requestData,
            method: type,
            success: function (res) {
                console.log("服务器相应数据", res);
                
                var my_data = res.data;

                if (my_data.errno == 0) {//返回结果正确
                    successCb(my_data);
                } else {
                    console.log("服务器错误，请重新尝试", my_data);
                }
            },
        });
    },
};
