const express = require('express');
const router = express.Router();
const empCtrl = require('../controllers/empController');
const { createEmpValidator, updateEmpValidator } = require('../validators/empValidator');

router.get('/emp/employees', empCtrl.getAll);
router.post('/emp/employees', createEmpValidator, empCtrl.create);
router.get('/emp/employees/:eid', empCtrl.getById);  
router.put('/emp/employees/:eid', updateEmpValidator, empCtrl.update); 
router.delete('/emp/employees', empCtrl.remove);

module.exports = router;
