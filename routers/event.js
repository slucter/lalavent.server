module.exports = function(app) {
  const controller = require('../controllers/event');
  const upload = require('../helper/upload');
  const auth = require('../middleware/middleware');

  app.post('/api/lalavent/event', auth.authorized, controller.addEvent);
  app.get('/api/lalavent/event', controller.getAllEvents);
  app.get('/api/lalavent/event/user/:userId', controller.getEventByUserId);
  app.get('/api/lalavent/event/:eventId', controller.getEventById);
  app.put('/api/lalavent/event/:eventId', auth.authorized, upload.uploadImage.single('image'), controller.updateEvent);
  app.delete('/api/lalavent/event/:eventId', auth.authorized, controller.deleteEvent);
};
