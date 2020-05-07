const Tickets = require('../models').ticket;
const Events = require('../models').event;
const { ErrorHandler } = require('../helper/error');

exports.addTicket = (req, res, next) => {
  Tickets
    .create({
      price: req.body.price,
      event_id: req.body.event_id,
    })
    .then(data => {
      res.status(201).send({
        ticket: data,
        message: 'ticket has been created!'
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getAllTickets = (req, res, next) => {
  Tickets.findAndCountAll({
    exclude: ["createdAt", "updatedAt"],
    include: [
      { model: Events, as: "event", attributes: ["title", "date", "location", "time_start", "time_end", "image"] },
    ]
  })
    .then(data => {
      res.status(200).send({
        Tickets: data
      });
    })
    .catch(() => {
      throw new ErrorHandler(500, 'Internal server error');
    });
};

exports.getTicketById = async (req, res, next) => {
  const ticketId = req.params.ticketId;

  try {
    const ticket = await Tickets.findOne({
      where: {
        id: ticketId
      }
    });
    if (!ticket) {
      res.status(200).send({
        message: 'ticket not found!',
        id: 0
      });
    }
    else {
      Tickets
        .findOne({
          where: {
            id: ticketId
          },
          exclude: ["createdAt", "updatedAt"],
          include: [
            { model: Events, as: "event", attributes: ["title", "date", "location", "time_start", "time_end", "image"] },
          ]
        })
        .then(data => {
          res.status(200).send({
            ticket: data
          });
        });
    }
  } catch(error) {
    next(error);
  }
};

exports.updateTicket = (req, res, next) => {
  const ticketId = req.params.ticketId;

  const ticket = Tickets.findOne({
    id: ticketId
  });
  if (!ticket) {
    res.status(200).send({
      message: 'ticket not found!',
      id: 0
    });
  } else {
    Tickets
      .update({
        price: req.body.price,
        event_id: req.body.event_id,
      },
      {
        where: {
          id: ticketId
        }
      })
      .then(data => {
        res.status(200).send({
          message: 'ticket has been updated!',
          ticket: data
        });
      });
  }
};

exports.deleteTicket = async (req, res, next) => {
  const ticketId = req.params.ticketId;

  try {
    const ticket = await Tickets.findOne({
      where: {
        id: ticketId
      }
    });
    if (!ticket) {
      res.status(200).send({
        message: 'ticket not found!',
        id: 0
      });
    } else {
      Tickets
        .destroy({
          where: {
            id: ticketId
          }
        })
        .then(data => {
          res.status(200).send({
            message: 'ticket has been deleted!',
            ticket: data
          });
        });
    }
  } catch(error) {
    next(error);
  }
};
