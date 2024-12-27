var express = require('express');
var router = express.Router();
const axios = require('axios');
var url = require('url-composer');

/* GET home page. */
router.get('/', function(req, res, next) {
    let request_url = url.build({
        host: global.host,
        path: "crew",
        query: {
            page: req.query.page,
            size: req.query.size,
        }
    })

    axios.get(request_url).then(crew => {
        res.render('./crew/crew', { title: 'Crew', crew : crew.data.content });
    }).catch(error => {
        console.log(error);
    })
});


module.exports = router;
