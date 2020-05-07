module.exports = function(app) {
  const controller = require('../controllers/ticket');
  const auth = require('../middleware/middleware');

  app.post('/api/lalavent/ticket', auth.authorized, controller.addTicket);
  app.get('/api/lalavent/ticket', controller.getAllTickets);
  app.get('/api/lalavent/ticket/:ticketId', controller.getTicketById);
  app.put('/api/lalavent/ticket/:ticketId', auth.authorized, controller.updateTicket);
  app.delete('/api/lalavent/ticket/:ticketId', auth.authorized, controller.deleteTicket);
};
