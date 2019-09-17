export default class flvDemux {
    constructor() {
    }

    static parseMetaDate(arr) {
        const name = flvDemux.parseScript(arr, 0);
        const value = flvDemux.parseScript(arr, name.size, arr.length - name.size);
        // return {}
        const data = {};
        data[name.data] = value.data;
        return data;
    }

    static parseScript(arr, offset, dataSize) {

    }
}