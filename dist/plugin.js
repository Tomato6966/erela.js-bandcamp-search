"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BandCampSearch = void 0;
const erelajs = require("erela.js");
//const bcfetch = require('bandcamp-fetch');

const axios = (require("axios"));
const REGEX = /(.+\.bandcamp\.com.\S*)|(^bandcamp\.com.\S*)/gm;
const buildSearch = (loadType, tracks, error, name) => ({
    loadType: loadType,
    tracks: tracks !== null && tracks !== void 0 ? tracks : [],
    playlist: name ? {
        name,
        duration: tracks
            .reduce((acc, cur) => acc + (cur.duration || 0), 0),
    } : null,
    exception: error ? {
        message: error,
        severity: "COMMON"
    } : null,
});
const getSearchURL = (query) => `https://bandcamp.com/api/nusearch/2/autocomplete?q=${encodeURIComponent(query)}`;
const headers = {
    'User-Agent': 'android-async-http/1.4.1 (http://loopj.com/android-async-http)',
    'Cookie': '$Version=1'
}
class BandCampSearch extends erelajs.Plugin {
    constructor(options = {}) {
        super();
        this.linksFetchedByLavalink = options.linksFetchedByLavalink ?? true;
        this.fetchDataAmount = options.fetchData && !!Number(options.fetchData) ? Number(options.fetchData) : 1;
        this.querySource = options.querySource && Array.isArray(options.querySource) ? options.querySource : ["bandcamp", "bc"];
    };
    load(manager) {
        this.manager = manager;
        this._search = manager.search.bind(manager);
        manager.search = this.search.bind(this);
    }
    search(query, requester) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const finalQuery = query.query || query;
            if(typeof query === "object" && query.source && (this.querySource.includes(query.source))) {
                console.log(`Search ${finalQuery} on bandcamp`);
                const tracks = yield this.searchQuery(finalQuery)
                if(tracks && tracks.length) return buildSearch("TRACK_LOADED", tracks.map(q => {
                    const track = erelajs.TrackUtils.buildUnresolved(q, requester);
                    track.thumbnail = q.thumbnail || track.thumbnail;
                    track.author = q.artist || track.author;
                    return track;
                }), null, null);
            }
            //const [url] = (_a = finalQuery.match(REGEX)) !== null && _a !== void 0 ? _a : [];
            //if (!this.linksFetchedByLavalink && url && url.includes("bandcamp.com") && url.includes("track")) {
            //    try {
            //        const data = yield this.getTrackData(url);
            //        if(!data) return buildSearch('NO_MATCHES', null, null, null);
            //        const track = erelajs.TrackUtils.buildUnresolved(data, requester);
            //        track.thumbnail = data.thumbnail || track.thumbnail;
            //        track.author = data.artist || track.author;
            //        return buildSearch("TRACK_LOADED", [track], null, null);
            //        const msg = 'Incorrect type for Bandcamp URL, must be one of "track".';
            //        return buildSearch("LOAD_FAILED", null, msg, null);
            //    } catch (e) {
            //        return buildSearch((_b = e.loadType) !== null && _b !== void 0 ? _b : "LOAD_FAILED", null, (_c = e.message) !== null && _c !== void 0 ? _c : null, null);
            //    };
            //};
            // api end point: https://bandcamp.com/api/track/3/info?key=${key}&track_id=279317014
            return this._search(query, requester);
        });
    };
    searchQuery(query) {
        return __awaiter(this, void 0, void 0, function* () { 
            const { data } = yield axios.default.get(getSearchURL(query), { headers }).catch(() => { });
            if(!data) return [];
            const tracks = data?.results?.filter(Boolean).filter(x => x.type === "t").map?.(item => convertToUnresolved(item));
            return tracks || [];
        });
    };
};
function convertToUnresolved(track) {
    if (!track) throw new ReferenceError("The Bandcamp track object was not provided");
    //if (!track.artist) throw new ReferenceError("The track artist array was not provided");
    if (!track.name) throw new ReferenceError("The track title was not provided");
    if (!track.url) throw new ReferenceError("The track url was not provided");
    if (track.type && track.type !=="t") throw new ReferenceError("The track type is not a t (track) it was: ", track.type);
    if (typeof track.name !== "string") throw new TypeError(`The track title must be a string, received type ${typeof track.name}`);
    const data = {
        identifier: track.id ? `${track.id}` : track.url?.split("/").reverse()[0],
        uri: track.url,
        thumbnail: track.img,
        author: track.band_name,
        title: track.name,
        duration: track.duration ? track.duration * 1000 : track.raw ? track.raw.trackinfo[0].duration * 1000 : 0,
    };
    return data;
};
exports.BandCampSearch = BandCampSearch;