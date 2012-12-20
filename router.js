var routes = require('routes')
, Router = routes.Router
, router = new Router()

module.exports = router

router.addRoute('/', require('./routes/index.js'))
router.addRoute("/members/:id.:format?", require("./routes/member.js"));
router.addRoute("/members?:querystring", require("./routes/memberslist.js"));
router.addRoute("/members/*/notes/:id?", require("./routes/note.js"));