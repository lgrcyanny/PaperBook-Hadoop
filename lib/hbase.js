var thrift = require('thrift');
var HBase = require('./gen-nodejs/THBaseService');
var HBaseTypes = require('./gen-nodejs/hbase_types');

module.exports = {
  host: 'localhost',
  port: 9090,

  getConnection: function () {
    var connection = thrift.createConnection(this.host, this.port, {
      transport: thrift.TFramedTransport,
      protocol: thrift.TBinaryProtocol
    });
    return connection;
  },

  /**
   * Get a single row from hbase
   * @param  {[String]} table name
   * @param  {[TGet]} tget
   * @param  {[Function]} callback
   */
  get: function (table, tget, callback) {
    var connection = this.getConnection();
    var self = this;
    connection.on('connect', function() {
      console.log('Get Connected HBase');
      var client = thrift.createClient(HBase, connection);
      client.get(table, tget, function (err, data) {
        connection.end();
        console.log('Get End Connection to HBase');
        if (err) {
          callback(err);
        } else {
          callback(null, data);
        }
      });
    });
  },

   /**
   * Put is insert or update for a record in hbase
   * @param  {[String]} table name
   * @param  {[TPut]} tput
   * @param  {[Function]} callback
   */
  put: function (table, tput, callback) {
    var connection = this.getConnection();
    connection.on('connect', function() {
      console.log('Put Connected HBase');
      var client = thrift.createClient(HBase, connection);
      client.put(table, tput, function (err, data) {
        connection.end();
        console.log('Put End Connection to HBase');
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    });
  },

   /**
   * Delete a record in HBase
   * @param  {[String]} table name
   * @param  {[TDelete]} tdelete
   * @param  {[Function]} callback
   */
  delete: function (table, tdelete, callback) {
    var connection = this.getConnection();
    connection.on('connect', function() {
      console.log('Delete Connected HBase');
      var client = thrift.createClient(HBase, connection);
      client.deleteSingle(table, tdelete, function (err, data) {
        connection.end();
        console.log('Delete End Connection to HBase');
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    });
  },

   /**
   * Scan mutltiple rows in HBase
   * @param  {[String]} table name
   * @param  {[TScan]} tscan
   * @param  {[Function]} callback
   */
  scan: function (table, tscan, numRows, callback) {
    var connection = this.getConnection();
    connection.on('connect', function() {
      console.log('Scan Connected HBase');
      var client = thrift.createClient(HBase, connection);
      client.openScanner(table, tscan, function (err, scannerId) {
        if (err) {
          connection.end();
          console.log('Scan End Connection to HBase');
          callback(err);
        }
        console.log('scannerid : ' + scannerId);
        client.getScannerRows(scannerId, numRows, function (serr, data) {
          if (serr) {
            console.log(serr);
            connection.end();
            console.log('Scan End Connection to HBase');
            callback(err);
          }
          client.closeScanner(scannerId, function (closeerr) {
            if (closeerr) {
              connection.end();
              console.log('Scan End Connection to HBase');
              callback(closeerr);
            }
            connection.end();
            callback(null, data);
          });
        });
      });
    });
  }
}