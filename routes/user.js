

var jwt         = require('jsonwebtoken');
var User        = require('../models/User');
var formidable  = require('formidable');
var fs          = require('fs');

exports.signin = function(req, res) {

    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            res.json({
                success: false,
                message: "Error occured: " + err
            });
        } else {
            if (user) {
                user.token = jwt.sign(user.email, process.env.JWT_SECRET);
                user.lastLoginDate = new Date();
                user.save(function(err, user1) {
                        res.json({
                            success: true,
                            user: {email:user1.email, 
                                password: user1.password,
                                photo:user1.photo
                            },
                            token: user1.token
                        });
                    });
            } else {
                res.json({
                    success: false,
                    message: "Incorrect email/password"
                });    
            }
        }
    });

};

exports.signup = function (req, res) {
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            res.json({
                success: false,
                message: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    success: false,
                    message: "User already exists!"
                });
            } else {
                var userModel = new User();
                userModel.email = req.body.email;
                userModel.password = req.body.password;
                var now = new Date();
                userModel.createDate = now;
                userModel.updateDate = now;
                userModel.lastLoginDate = now;
                userModel.save(function(err, user) {
                    user.token = jwt.sign(user.email, process.env.JWT_SECRET);
                    user.save(function(err, user1) {
                        res.json({
                            success: true,
                            user: {email:user1.email, 
                                password: user1.password
                            },
                            token: user1.token
                        });
                    });
                })
            }
        }
    });
};


exports.me = function(req, res) {
    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                success: false,
                message: "Error occured: " + err
            });
        } else {
            res.json({
                success: true,
                user: user
            });
        }
    });
};

exports.checkToken = function(req, res, next) {
    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                success: false,
                message: "Error occured: " + err
            });
        } else {
            req.user = user;
            next();
        }
    });
};


exports.upload = function(req, res) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = process.env.USER_PHOTO_TEMP_DIR;
    form.keepExtensions = true;
    form.maxFieldsSize = 2 * 1024 * 1024;

    form.parse(req, function(err, fields, files) {
        if (err) {
          res.json({
            success: false,
            message: "Error occured: " + err
          });
          return;       
        }  
         
        var extName = fields.name.match(/.[\w+]+$/);

        if (req.user.photo) {
            fs.unlink(process.env.USER_PHOTO_DIR + '/' + req.user.photo);
        }

        var avatarName = req.user.email + Date.now() + extName;
        var newPath = process.env.USER_PHOTO_DIR + '/' + avatarName;
        fs.rename(files.content.path,newPath);
        console.log("file upload success at: " + newPath);
        console.log("file size: " + files.content.size);
        req.user.photo = avatarName;
        req.user.updateDate = new Date();
        req.user.save(function(err, user) {

            res.json({
                success: true,
                photo: user.photo
            });
        });

     });

    
}


exports.photo = function(req, res) {
    User.findOne({email: req.query.email}, function(err, user) {
        if (err) {
            res.json({
                success: false,
                message: "Error occured: " + err
            });
        } else if (user){
            if (user.photo) {
                res.json({
                    success: true,
                    photo: user.photo
                });
            }else {
                res.json({
                    success: false,
                    message: "photo not exist"
                });

            }
            
        }else {
            res.json({
                success: false,
                message: "user not exist"
            });
        }
    });

}

exports.update = function(req,  res) {
    if (req.body.birthday != undefined) {
        req.user.birthday = req.body.birthday;
    }

    if (req.body.gender != undefined) {
        req.user.gender   = req.body.gender;
    }
    
    if (req.body.skinOily != undefined) {
        req.user.skinOily = req.body.skinOily;
    }

    if (req.body.skinNormal != undefined) {
        req.user.skinNormal = req.body.skinNormal;
    }

    if (req.body.skinDry != undefined) {
        req.user.skinDry = req.body.skinDry;
    }

    if (req.body.skinSensitive != undefined) {
        req.user.skinSensitive = req.body.skinSensitive;
    }

    if (req.body.skinCareTime != undefined) {
        req.user.skinCareTime = req.body.skinCareTime;
    }

    if (req.body.weekPlan != undefined) {
        req.user.weekPlan = req.body.weekPlan;
    }

    req.updateDate = new Date();
    req.user.save(function(err, user){
        if (err) {
            res.json({
                success: false,
                message: "Error occured: " + err
            });
        }else {
            res.json({
                success: true
            });
        }
    });

}


