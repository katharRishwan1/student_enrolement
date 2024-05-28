const { course } = require('../controllers');
const { router } = require('../services/imports');

router.post('/course', course.create);
router.get('/course/:id?', course.get);
router.put('/course/:id', course.update);
router.delete('/course/:id', course.delete)
module.exports = router;
