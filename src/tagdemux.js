import flvDemux from "./flvDemux.js";
import mediainfo from './media-info';
class tagDemux {

    constructor() {
        this.TAG = this.constructor.name;

        this._config = {};

        this._onError = null;
        this._onMediaInfo = null;
        this._onTrackMetadata = null;
        this._onDataAvailable = null;

        this._dataOffset = 0;
        this._firstParse = true;
        this._dispatch = false;

        this._hasAudio = false;
        this._hasVideo = false;

        this._audioInitialMetadataDispatched = false;
        this._videoInitialMetadataDispatched = false;

        this._mediaInfo = new mediainfo();
        this._mediaInfo.hasAudio = this._hasAudio;
        this._mediaInfo.hasVideo = this._hasVideo;
        this._metadata = null;
        this._audioMetadata = null;
        this._videoMetadata = null;

        this._naluLengthSize = 4;
        this._timestampBase = 0; // int32, in milliseconds
        this._timescale = 1000;
        this._duration = 0; // int32, in milliseconds
        this._durationOverrided = false;
        this._referenceFrameRate = {
            fixed: true,
            fps: 23.976,
            fps_num: 23976,
            fps_den: 1000
        };

        this._videoTrack = { type: 'video', id: 1, sequenceNumber: 0, addcoefficient: 2, samples: [], length: 0 };
        this._audioTrack = { type: 'audio', id: 2, sequenceNumber: 1, addcoefficient: 2, samples: [], length: 0 };

        this._littleEndian = (function () {
            const buf = new ArrayBuffer(2);
            (new DataView(buf)).setInt16(0, 256, true); // little-endian write
            return (new Int16Array(buf))[0] === 256; // platform-spec read, if equal then LE
        })();
    }

    moof(tags) {
        for (let i = 0; i < tags.length; i++) {
            this.parseChunks(tags[i]);
        }

    }

    parseChunks(flvtag) {

        switch (flvtag.tagType) {
            case 18: // ScriptDataObject
                this.parseMetadata(flvtag.body);
                break;
        }
    }

    parseMetadata(arr) {
        const data = flvDemux.parseMetaData(arr);
        this._parseScriptData(data);

        console.log(this._mediaInfo, this._mediaInfo.isComplete());
    }

    _parseScriptData(obj) {
        const scriptData = obj;

        if (scriptData.hasOwnProperty('onMetaData')) {
            if (this._metaData) {
                console.log('found another onMetaData tag!');
            }

            this._metaData = scriptData;

            const onMetaData = this._metaData.onMetaData;

            if (typeof onMetaData.hasAudio == "boolean") {
                this._hasAudio = onMetaData.hasAudio;
                this._mediaInfo.hasAudio = this._hasAudio;
            }

            if (typeof onMetaData.hasVideo == "boolean") {
                this._hasVideo = onMetaData.hasVideo;
                this._mediaInfo.hasVideo = this._hasVideo;
            }

            if (typeof onMetaData.audiodatarate == 'number') {
                this._mediaInfo.audiodatarate = onMetaData.audiodatarate;
            }
            if (typeof onMetaData.videodatarate == 'number') {
                this._mediaInfo.videodatarate = onMetaData.videodatarate;
            }

            if (typeof onMetaData.width == 'number') {
                this._mediaInfo.width = onMetaData.width;
            }
            if (typeof onMetaData.height == 'number') {
                this._mediaInfo.height = onMetaData.height;
            }

            if (typeof onMetaData.duration == 'number') {
                if (!this._durationOverrided) {
                    const duration = Math.floor(onMetaData.duration * this._timescale);
                    this._duration = duration;
                    this._mediaInfo.duration = duration;
                }
            } else {
                this._mediaInfo.duration = 0;
            }

            if (typeof onMetaData.framerate == 'number') {
                const fps_num = Math.floor(onMetaData.framerate * 1000);
                if (fps_num > 0) {
                    const fps = fps_num / 1000;
                    this._referenceFrameRate.fixed = true;
                    this._referenceFrameRate.fps = fps;
                    this._referenceFrameRate.fps_num = fps_num;
                    this._referenceFrameRate.fps_den = 1000;
                    this._mediaInfo.fps = fps;
                }
            }

            if (typeof onMetaData.keyframes == 'number') {
                this._mediaInfo.hasKeyframesIndex = true;
                const keyframes = onMetaData.keyframes;
                keyframes.times = onMetaData.times;
                keyframes.filepositions = onMetaData.filepositions;
                this._mediaInfo.keyframesIndex = this._parseKeyframesIndex(keyframes);
                onMetaData.keyframes = null; // keyframes has been extracted, remove it
            } else {
                this._mediaInfo.hasKeyframesIndex = false;
            }

            this._dispatch = false;

            this._mediaInfo.metadata = onMetaData;

            return this._mediaInfo;
        }
    }

}

export default new tagDemux();