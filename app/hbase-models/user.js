/**
 * Module Dependencies
 */
var hbase = require('../../lib/hbase');
var HBaseTypes = require('../../lib/gen-nodejs/hbase_types.js');
var md5 = require('MD5');
var crypto = require('crypto');

module.exports = {
  table: 'pb_users',

  /**
   * The rowid of pb_users is md5(email)
   * @param  {[String]}   email [description]
   * @param  {Function} cb    [description]
   */
  findById: function (id, cb) {
    var tget = new HBaseTypes.TGet({
      row: id,
      columns: [new HBaseTypes.TColumn({family: 'info', qualifier: 'user'})]
    })
    hbase.get(this.table, tget, function (err, data) {
      if (err) {
        cb(err);
      }
      var userinfo = null;
      if (data.row) {
        userinfo = data.columnValues[0].value;
        userinfo = JSON.parse(userinfo);
        userinfo.id = data.row;
      }
      cb(null, userinfo);
    });
  },

  findAll: function (cb) {
    var tscan = new HBaseTypes.TScan({
      columns: [new HBaseTypes.TColumn({family: 'info', qualifier: 'user'})]
    });
    hbase.scan(this.table, tscan, 100,function (err, data) {
      if (err) {
        cb(err);
      }
      var users = [];
      for (var i = 0; i < data.length; i++) {
        var row = data[i];
        var info = row.columnValues[0].value;
        info = JSON.parse(info);
        users.push(info);
      }
      cb(null, users);
    });
  },

  /**
   * Create new user record to database
   */
  save: function (user, cb) {
    user.salt = this.makeSalt();
    user.password = this.encryptPassword(user.password, user.salt);
    var rowkey = md5(user.email);
    var info = JSON.stringify(user);
    var tput = new HBaseTypes.TPut({
      row: rowkey,
      columnValues: [
        new HBaseTypes.TColumnValue({
          family: 'info',
          qualifier: 'user',
          value: info
        })
      ]
    });
    hbase.put(this.table, tput, function (err, data) {
      if (err) {
        cb(err);
      }
      cb(null, {insertId: rowkey})
    });
  },

  deleteById: function (id, cb) {

  },

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText, user) {
    return this.encryptPassword(plainText, user.salt) === user.password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password, salt) {
    if (!password) return ''
    var encrypred
    try {
      encrypred = crypto.createHmac('sha1', salt).update(password).digest('hex')
      return encrypred
    } catch (err) {
      return ''
    }
  }
}
