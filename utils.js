function render_error(res, code, message) {
    res.status(code || 500).render("error", {
        error_code: code,
        message: message
    })
}

module.exports = {render_error}
