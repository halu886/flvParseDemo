const le = (function () {
    const buf = new ArrayBuffer(2);
    (new DataView(buf)).setInt16(0, 256, true); // little-endian write
    return (new Int16Array(buf))[0] === 256; // platform-spec read, if equal then LE
})();
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
        let dataOffset = offset;
        const object = {};
        const uint8 = new Uint8Array(arr);
        const buffer = uint8.buffer;
        const dv = new DataView(buffer, 0, dataSize);
        let value = null;
        let objectEnd = false;
        const type = (dv.getUint8(dataOffset));
        dataOffset += 1;

        switch (type) {
            case 0:
                value = dv.getFloat64(dataOffset, !le);
                dataOffset += 8;
                break;
            case 1:
                {
                    const b = dv.getUint8(dataOffset);
                    value = !!b;
                    dataOffset += 1;
                    break;
                }
            default:
                break;
        }
    }
}