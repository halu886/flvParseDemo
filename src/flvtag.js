import { type } from "os";

export default class FlvTag {
    constructor() {
        this.tagType = -1;
        this.dataSize = -1;
        this.Timestamp = -1;
        this.StreamID = -1;
        this.body = -1;
    }

    toString() {
        let tagType = '';
        if (this.tagType == 8) {
            tagType = 'Audio'
        } else if (this.tagType == 9) {
            tagType = 'Video'
        } else if (this.tagType == 18) {
            tagType = "scripts"
        }

        return `tag:${tagType};
        dataSize:${this.hexTypeArray2int(this.dataSize)};
        timestamp:${this.hexTypeArray2int(this.Timestamp)};
        streamId:${this.hexTypeArray2int(this.StreamID)};`
    }

    hexTypeArray2int(typeArr) {
        const arr = []
        typeArr.forEach(n => {
            arr.push(n.toString(16).length == 1 ? '0' + n.toString(16) : n.toString(16))
        })
        return parseInt(arr.join(''), 16)
    }
}