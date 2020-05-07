module.exports = function(app) {
  const controller = require('../controllers/role');
  const auth = require('../middleware/middleware');

  app.post('/api/lalavent/role', auth.authorized, controller.addRole);
  app.get('/api/lalavent/role', controller.getAllRoles);
  app.get('/api/lalavent/role/:roleId', controller.getRoleById);
  app.put('/api/lalavent/role/:roleId', auth.authorized, controller.updateRole);
  app.delete('/api/lalavent/role/:roleId', auth.authorized, controller.deleteRole);
};
