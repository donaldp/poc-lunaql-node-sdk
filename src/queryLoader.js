const glob = require('glob')
const fs = require('fs')
const lodash = require('lodash')

class QueryLoader {
    finder = {}

    constructor(path) {
        this.load(path)
    }

    load(path) {
        const queries = glob.sync(`${path}/**/*.lunaql`)

        for (let index = 0; index < queries.length; index++) {
            let queryFile = queries[index]
            let content = fs.readFileSync(queryFile || '').toString()

            queryFile = queryFile?.slice(path.length).slice(0, -7)
            queryFile = queryFile && queryFile[0] == '/' ? queryFile?.slice(1) : queryFile
            queryFile = queryFile?.replace(/\//gi, '.')

            const isFunc = (new RegExp(/\@var\s*[a-zA-Z_]+/g)).test(content)

            const handler = isFunc ? (a) => {
                let q = content

                if (a) {
                    Object.keys(a).forEach((variable) => {
                        const replace = new RegExp(`\\@var\\s*${variable}`, "g")

                        q = q.replace(replace, a[variable])
                    })
                }

                return q
            } : content

            lodash.set(this.finder, queryFile, handler)
        }

    }

    get(path) {
        return this.finder[path]
    }

    getFinder() {
        return this.finder
    }
}

/**
 * Load queries from specified path
 */
const queryLoader = (path) => new QueryLoader(path)

module.exports = {
    QueryLoader,
    queryLoader
}
