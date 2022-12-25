const database = require("./database")
const DatabaseSongs = require("./DatabaseSongs")
const SquareApi = require("./hostApi")
const SongsPagination = require("./musicPagination")
const Utils = require("./utils")
const translate = require("@iamtraction/google-translate");
const jsonConfig = require("../jsons/config.json")

class Base {
    constructor() {
        this.DatabaseSongs = DatabaseSongs
        this.SquareApi = SquareApi
        this.Database = database
        this.jsonConfig = jsonConfig
        this.Utils = Utils
        this.SongsPagination = SongsPagination
    }

    async translateText(text, langague) {
        return translate(text, { to: langague })
            .then(res => res.text)
            .catch(() => null)
    }
}

module.exports = Base