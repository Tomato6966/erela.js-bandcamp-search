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
const bandcamp = require('bandcamp-scraper')
const REGEX = "/^(https:\/\/)bandcamp\.com(\/track\/xx).*/;"
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
class BandCampSearch extends erelajs.Plugin {
    constructor(options = {}) {
        super();
        this.fetchDataAmount = options.fetchData && !!Number(options.fetchData) ? Number(options.fetchData) : 1;
        this.querySource = options.querySource && Array.isArray(options.querySource) ? options.querySource : ["bandcamp"];
    };
    load(manager) {
        this.manager = manager;
        this._search = manager.search.bind(manager);
        manager.search = this.search.bind(this);
    }
    async searchBandCamp(query) {
        const maxAmount = this.fetchDataAmount;
        const fun = this.getTrackData
        return new Promise((res, rej) => {
            const params = {
                query: 'Eminem Without me',
                page: 1
            }
            bandcamp.search(params, async function (error, searchResults) {
                if (error) {
                    console.error("error", error);
                    return rej(error)
                } else {
                    try {
                        const filtered = searchResults.filter(x => x.type === "track");
                        if(!filtered?.length) return [];
                        const formatted = [];
                        for(const track of filtered) {
                            if(maxAmount > formatted.length){
                                const data = await fun(track.url);
                                formatted.push(data);
                            } else {
                                formatted.push(convertToUnresolved(track));
                            }
                        }
                        return res(formatted)
                    } catch(e) {
                        console.error("error", e);
                        return rej(error)
                    }
                }
            })
        })
    }
    async getTrackData(link) {
        return new Promise((res, rej) => {
            bandcamp.getTrackInfo(link, function (error, resda) {
                if (error) {
                    console.error("error", error);
                    return rej(error)
                } else {
                    return res(convertToUnresolved(resda))
                }
            })
        })
    }
    search(query, requester) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const finalQuery = query.query || query;
            if(typeof query === "object" && query.source && (this.querySource.includes(query.source))) {
                const tracks = yield this.searchBandCamp(finalQuery)
                if(tracks && tracks.length) return buildSearch("TRACK_LOADED", tracks.map(query => {
                    const track = erelajs.TrackUtils.buildUnresolved(query, requester);
                    return track;
                }), null, null);
            }
            const [, type, id] = (_a = finalQuery.match(REGEX)) !== null && _a !== void 0 ? _a : [];
            if (type === "track") {
                try {
                    const data = yield this.getTrackData(finalQuery);
                    if(!data) return buildSearch('NO_MATCHES', null, null, null);
                    const track = erelajs.TrackUtils.buildUnresolved(data, requester);
                    return buildSearch(loadType, [track], null, name);
                    const msg = 'Incorrect type for Bandcamp URL, must be one of "track".';
                    return buildSearch("LOAD_FAILED", null, msg, null);
                } catch (e) {
                    return buildSearch((_b = e.loadType) !== null && _b !== void 0 ? _b : "LOAD_FAILED", null, (_c = e.message) !== null && _c !== void 0 ? _c : null, null);
                };
            };
            return this._search(query, requester);
        });
    };
};
function convertToUnresolved(track) {
    if(!track) return;
    if(!track.name) console.log(track);
    if (!track) throw new ReferenceError("The Bandcamp track object was not provided");
    //if (!track.artist) throw new ReferenceError("The track artist array was not provided");
    if (!track.name) throw new ReferenceError("The track title was not provided");
    if (!track.url) throw new ReferenceError("The track url was not provided");
    if (track.type !=="track") throw new ReferenceError("The track type is not a track");
    if (typeof track.name !== "string") throw new TypeError(`The track title must be a string, received type ${typeof track.name}`);
    return {
        identifier: track.id ? `${track.id}` : track.url?.split("/").reverse()[0],
        uri: track.url,
        thumbnail: track.imageUrl,
        author: track.artist,
        title: track.name,
        duration: track.duration ? track.duration * 1000 : track.raw ? track.raw.trackinfo[0].duration * 1000 : 0,
        raw: track.raw,
    };
};
exports.BandCampSearch = BandCampSearch;
