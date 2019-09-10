class FlvTag {
    constructor() {
        this.tagType = -1;
        this.dataSize = -1;
        this.Timestamp = -1;
        this.StreamID = -1;
        this.body = -1;
    }
}

class FlvParse {
    constructor() {
        this.tempUint8 = [];
        this.arrTag = [];
        this.index = 0;
        this.tempArr = [];
    }

    setFlv(uint8) {
        this.tempUint8 = uint8;
        this.parse();
    }

    parse() {
        this.read(9);
        this.read(4);

        while (this.index < this.tempUint8.length) {
            let t = new tag();
            t.tagType = (this.read(1)[0]); // tag 类型
            t.dataSize = [].concat(this.read(3));  // 包体大小
            t.Timestamp = [].concat(this.read(4)); //解码时间
            t.StreamID = [].concat(this.read(3)); // stream id
            t.body = [].concat(this.read(this.getBodySum(t.dataSize))); //取出body
            this.arrTag.push(t);
            this.read(4);
        }
    }

    read(length) {
        this.tempArr.length = 0;
        for (let i = 0; i < length; i++) {
            this.tempArr.push(this.tempUint8[this.index]);
            this.index += 1;
        }
        return this.tempArr;
    }

    getBodySum(arr) {
        let _str = "";
        _str += (arr[0].toString(16).length == 1 ? "0" + arr[0].toString(16) : arr[0].toString(16));
        _str += (arr[1].toString(16).length == 1 ? "0" + arr[1].toString(16) : arr[1].toString(16));
        _str += (arr[2].toString(16).length == 1 ? "0" + arr[2].toString(16) : arr[2].toString(16));
        return parseInt(_str, 16);
    }

}

Window.flvParse = {
    setFlv: function (unit8) {
        flvparse.setFlv(unit8);
    },
    nextTag: function () { }
}
