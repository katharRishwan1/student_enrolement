const { student } = require('../controllers');
const { router } = require('../services/imports');

router.post('/student', student.create);
router.get('/student/:id?', student.get);
router.put('/student/:id', student.update);
router.delete('/student/:id', student.delete)
module.exports = router;
