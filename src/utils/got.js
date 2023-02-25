const got = (...args) => import('got').then(({ default: got }) => got(...args))

module.exports = {
    got
}