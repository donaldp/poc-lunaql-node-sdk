const { got } = require('./utils/got')

class LunaQL {
    constructor(endpoint, token, queryLoader) {
        this.endpoint = endpoint
        this.token = token
        this.queryLoader = queryLoader

        const luna = this

        const builder = []

        const validator = {
            get(target, prop, receiver) {
                builder.push(prop)

                if (typeof target[prop] === 'function') {
                    return function (...args) {
                        const [ collection ] = builder

                        return luna.run(target[prop].apply(target, args), collection);
                    }
                } else if (typeof target[prop] === 'object' && target[prop] !== null) {
                    return new Proxy(target[prop], validator)
                } else {
                    return luna.run(target[prop]);
                }
            },
            set() {
                throw new Error('Action not allowed')
            }
        }

        return new Proxy(this.queryLoader.getFinder(), validator)
    }

    /**
     * @param {string} query
     * @param {string|null} collection
     * @returns
     */
    async run(query, collection = null) {
        let method = 'POST'
        let results

        if (query.includes("query({\n\t@prop data = {")) {
            method = 'PUT'
        }

        let endpoint = this.endpoint + (method == 'PUT' && collection ? `/${collection}` : '')

        try {
            results = await got(endpoint, {
                method: method,
                headers: {
                    'content-type': 'application/lunaql',
                    'Authorization': 'Bearer ' + this.token
                },
                body: query
            })

            results = JSON.parse(results.body)

        } catch (err) {
            throw err
        }

        return results
    }
}

module.exports = {
    LunaQL
}
