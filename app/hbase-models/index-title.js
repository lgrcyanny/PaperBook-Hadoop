var hbase = require('../../lib/hbase');
var HBaseTypes = require('../../lib/gen-nodejs/hbase_types.js');

module.exports = {
  table: 'pb_index_title',

  findByTitle: function (title, page, pageSize, callback) {
    var offset = (page - 1) * pageSize;
    var tscan = new HBaseTypes.TScan({
      startRow: title,
      endRow: title + '~',
      columns: [
        new HBaseTypes.TColumn({
          family: 'info'
        })
      ],
      filterString: 'ColumnPaginationFilter(' + pageSize + ', ' + offset + ')'
    });
    var self = this;
    hbase.scan(self.table, tscan, pageSize, function (err, data) {
      if (err) {
        callback(err);
      }
      callback(null, self.wrapSearchResults(data));
    });
  },

  wrapSearchResults: function (data) {
    var literatures = [];
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var values = row.columnValues;
      for (var j = 0; j < values.length; j++) {
        var literature = {};
        literature.id = values[j].qualifier;
        literature.title = values[j].value;
        literature.abstract = values[j].value;
        literatures.push(literature);
      }
    }
    return literatures;
  }
}