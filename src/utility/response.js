const good = (res, code, data, message = "All is good!") => {
    return res.status(code).send({ status: true, data, message })
}

const bad = (res, code, message = "Something went wrong!") => {
    return res.status(code).send({ status: !true, message })
}

module.exports = { good, bad }