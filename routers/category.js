module.exports = function(app) {
  const controller = require('../controllers/category');
  const auth = require('../middleware/middleware');

  app.post('/api/lalavent/category', auth.authorized, controller.addCategory);
  app.get('/api/lalavent/category', controller.getAllCategories);
  app.get('/api/lalavent/category/:categoryId', controller.getCategoryById);
  app.put('/api/lalavent/category/:categoryId', auth.authorized, controller.updateCategory);
  app.delete('/api/lalavent/category/:categoryId', auth.authorized, controller.deleteCategory);
};
