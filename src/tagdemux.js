class tagDemux {
    moof(tags) {
        for (const t of tags) {
            this.chunkparse(t);
        }

    }

    chunkparse(tag) {
        switch (tag.type) {
            case 8:
                break;
            case 9:
                break;
            case 18:
                this.parseMetadata(tag.body);
                break;
        }
    }

    parseMetadata(arr) {
        const data = flvDemux.parseMetadata(arr);
        this._parseScriptData(data);

    }

    _parseScriptData(obj) {
        const scriptData = obj;

        if (scriptData.hasOwnPerperty('onMetaData')) {
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

            this._medieInfInfo.metadata = onMetaData;

            return this._mediaInfo;
        }
    }

}

export default new tagDemux();