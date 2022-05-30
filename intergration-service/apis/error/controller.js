const db = require("../../db");
const Error = db.Error;
const getAllUsers = async(req, res) => {
    let page = req.query.page;
    let pageSize = req.query.size;
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
    if (req.query.cameraName) {
        searchOptions.where.camera_name = {
            [Op.like]: `%${req.query.cameraName}%`
        }
    }
    Error.findAndCountAll(searchOptions).then(data => {
            if (data) {
                // searchOptions.include = [{
                //         model: Configs,
                //         as: "camera_configs",
                //         include: [{
                //             model: Config_Tasks,
                //             as: "config_tasks"
                //         }],
                //         order: [
                //             [Config_Tasks, 'id', 'DESC'],
                //         ]
                //     },

                // ];
                searchOptions.order = [
                    ["camera_configs", 'id', 'DESC'],
                ]
                Error.findAndCountAll(searchOptions).then(function(result) {
                    // let json = helper.utilsRespone(constant.SUCCESS_CODE_200, "FRS", constant.MESSAGE_SUCCESS, result.rows, data.count);
                    res.send({ result });
                })

            }
        })
        .catch(err => {
            let message =
                err.message || "Some error occurred while creating the Tutorial."
                // let json = helper.utilsRespone(constant.ERROR_CODE_500, "FRS", message, null, null);
            res.status('500').send({ message });
        });
};
module.exports = {
    getAllUsers: getAllUsers,
    createUser: getAllUsers
}