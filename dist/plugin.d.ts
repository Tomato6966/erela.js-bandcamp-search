import { Manager, Plugin, UnresolvedTrack, UnresolvedQuery } from "erela.js";
export declare class Deezer extends Plugin {
    private _search;
    private manager;
    private readonly functions;
    private readonly options;
    constructor(options: DeezerOptions);
    load(manager: Manager): void;
    private search;
    private getAlbumTracks;
    private getPlaylistTracks;
    private getTrack;
    private static convertToUnresolved;
}
export interface DeezerOptions {
    /** of how many tracks it should fetch the data during the search, default 1. */
    fetchData?: number;
    /** The Query source string(s) it shall use to detect deezer searchings (default is: ["bandcamp", "bc"]) */
    querySource?: string[];
}
export interface Result {
    tracks: UnresolvedQuery[];
    name?: string;
}
export interface Album {
    name: string;
    tracks: AlbumTracks;
}
export interface AlbumTracks {
    items: DeezerTrack[];
    next: string | null;
}
export interface Artist {
    name: string;
}
export interface Playlist {
    tracks: PlaylistTracks;
    name: string;
}
export interface PlaylistTracks {
    items: [
        {
            track: DeezerTrack;
        }
    ];
    next: string | null;
}
export interface DeezerTrack {
    artists: Artist[];
    name: string;
    duration_ms: number;
}
export interface SearchResult {
    exception?: {
        severity: string;
        message: string;
    };
    loadType: string;
    playlist?: {
        duration: number;
        name: string;
    };
    tracks: UnresolvedTrack[];
}
