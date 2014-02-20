var sys = require('sys');
var exec = require('child_process').exec;
var path = require('path');

module.exports = {
  commands: {
    mkdir: 'hdfs dfs -mkdir -p ',
    put: 'hdfs dfs -put ',
    get: 'hdfs dfs -get ',
    rm: 'hdfs dfs -rm '
  },

  putFile: function (filepath, callback) {
    var self = this;
    var dirpath = path.dirname(filepath);
    var command = self.commands.mkdir + dirpath;
    var child = exec(command, function (err, stdout, stderr) {
      console.log('hdfs mkdir stdout: ' + stdout);
      console.log('hdfs mkdir stderr: ' + stderr);
      if (err) {
        callback(err);
      }
      var putcommand = self.commands.put + filepath + ' ' + filepath;
      exec(putcommand, callback);
    });
  },

  getFile: function (filepath, callback) {
    var command = this.commands.get + filepath + ' ' + filepath;
    var child = exec(command, callback);
  },

  deleteFile: function (filepath, callback) {
    var command = this.commands.rm + filepath;
    var child = exec(command, callback);
  }
}