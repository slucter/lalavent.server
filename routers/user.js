module.exports = function(app) {
  const controller = require('../controllers/user');
  const upload = require('../helper/upload');
  const auth = require('../middleware/middleware');
  const user = require('../middleware/userVerify');

  app.post('/api/lalavent/auth/signup', controller.signUp);
  app.post('/api/lalavent/auth/signin', controller.signIn);
  app.get('/api/lalavent/user', controller.getAllUsers);
  app.get('/api/lalavent/user/check', controller.checkUsers);
  app.get('/api/lalavent/user/:userId', controller.getUserById);
  app.get('/api/lalavent/user/role/:roleId', controller.getUserByRoleId);
  app.put('/api/lalavent/user/:userId', auth.authorized, upload.uploadImage.single('image'), controller.updateUser);
  app.delete('/api/lalavent/user/:userId', auth.authorized, controller.deleteUser);
};
