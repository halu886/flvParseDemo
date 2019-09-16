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
            if (this._metaData) { }

            this._metaData = scriptData;

            const onMetaData = this._metaData.onMetaData;

            if (typeof onMetaData.hasAudio == "boolean") { }
            if (typeof onMetaData.hasVideo == "boolean") { }

            if (typeof onMetaData.audiodatarate == 'number') { }
            if (typeof onMetaData.videodatarate == 'number') { }

            if (typeof onMetaData.width == 'number') { }
            if (typeof onMetaData.height == 'number') { }

            if (typeof onMetaData.duration == 'number') { } else { }

            if (typeof onMetaData.framerate == 'number') { }

            if (typeof onMetaData.keyframes == 'number') { } else { }

            this._dispatch = false;

            this._medieInfInfo.metadata = onMetaData;

            return this._
        }
    }

}

export default new tagDemux();