const db = require("../../db");
const Stage = db.Stage;
const Error = db.Error;
const Op = db.Sequelize.Op;

module.exports = {
  list(req, res) {
    let page = req.query._page;
    let pageSize = req.query._size;
    if (!pageSize) pageSize = 10;
    if (!page) page = 0;
    const offset = page * pageSize;
    let searchOptions = {
      order: [
        ['id', 'DESC']
      ],
      where: {},
      limit: pageSize,
      offset: offset,
      include: [],
    };
    if (req.query.name) {
      searchOptions.where.name = {
        [Op.like]: `%${req.query.name}%`
      }
    }
    if (req.query.code) {
      searchOptions.where.code = {
        [Op.like]: `%${req.query.code}%`
      }
    }
    if (req.query.status) {
      searchOptions.where.status = {
        [Op.eq]: req.query.status
      }
    }
    if (req.query.label) {
      searchOptions.where.label = {
        [Op.like]: `%${req.query.label}%`
      }
    }
    if (req.query.checked) {
      searchOptions.where.checked = {
        [Op.eq]: req.query.checked
      }
    }
    return Stage.findAndCountAll(searchOptions)
      .then((data) => res.status(200).send(data))
      .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    return Stage
      .findByPk(req.params.id, {
        include: [Error],
      })
      .then((data) => {
        if (!data) {
          return res.status(404).send({
            message: 'Data Not Found',
          });
        }
        return res.status(200).send(data);
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  add(req, res) {
    return Stage
      .create(req.body)
      .then((data) => res.status(201).send(data))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    return Stage
      .findByPk(req.params.id, {
      })
      .then(data => {
        if (!data) {
          return res.status(404).send({
            message: 'Data Not Found',
          });
        }
        return data
          .update(req.body)
          .then(() => res.status(200).send(data))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return Stage
      .findByPk(req.params.id)
      .then(data => {
        if (!data) {
          return res.status(400).send({
            message: 'Data Not Found',
          });
        }
        return data
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  addWithErrors(req, res){
    return Stage
    .create(req.body,{
      include: [Error]
    })
    .then((data) => res.status(201).send(data))
    .catch((error) => res.status(400).send(error));
  },

  addError(req, res) {
    return Stage
    .findByPk(req.body.id)
    .then((stage) => {
      if (!stage) {
        return res.status(404).send({
          message: 'Data Not Found',
        });
      }
      Error
      .findByPk(req.body.stage_id)
      .then((error) => {
        if (!error) {
          return res.status(404).send({
            message: 'Data Not Found',
          });
        }
        stage.addError(error);
        return res.status(200).send(stage);
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send(error);
    });
  },
  
  removeError(req, res){
    return Stage
    .findByPk(req.body.id)
    .then((stage) => {
      if (!stage) {
        return res.status(404).send({
          message: 'Data Not Found',
        });
      }
      Error
      .findByPk(req.body.stage_id)
      .then((error) => {
        if (!error) {
          return res.status(404).send({
            message: 'Data Not Found',
          });
        }
        stage.removeError(error);
        return res.status(200).send(stage);
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send(error);
    });
  }
};