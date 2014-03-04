/**
 * Module Dependencies
 */
var hbase = require('../../lib/hbase');
var HBaseTypes = require('../../lib/gen-nodejs/hbase_types.js');
var md5 = require('MD5');
var _ = require('underscore');

module.exports = {
  table: 'pb_literatures',

  save: function (literature, cb) {
    var rowkey = md5(literature.title);
    var basicinfo = JSON.stringify(literature);
    var tput = new HBaseTypes.TPut({
      row: rowkey,
      columnValues: [
        new HBaseTypes.TColumnValue({
          family: 'info',
          qualifier: 'title',
          value: literature.title
        }),
        new HBaseTypes.TColumnValue({
          family: 'info',
          qualifier: 'abstract',
          value: literature.abstract
        }),
        new HBaseTypes.TColumnValue({
          family: 'info',
          qualifier: 'basic',
          value: basicinfo
        }),
        new HBaseTypes.TColumnValue({
          family: 'info',
          qualifier: 'tags',
          value: ''
        }),
        new HBaseTypes.TColumnValue({
          family: 'info',
          qualifier: 'score_count',
          value: '0'
        }),
        new HBaseTypes.TColumnValue({
          family: 'info',
          qualifier: 'score_avg',
          value: '0'
        }),
        new HBaseTypes.TColumnValue({
          family: 'info',
          qualifier: 'user_id',
          value: '' + literature.user_id
        })
      ]
    });
    hbase.put(this.table, tput, function (err) {
      if (err) {
        cb(err);
      }
      cb(null, {insertId: rowkey});
    });
  },

  update: function (id, literature, cb) {
    var rowkey = id;
    var basicinfo = JSON.stringify(literature);
    var tput = new HBaseTypes.TPut({
      row: rowkey,
      columnValues: [
        new HBaseTypes.TColumnValue({
          family: 'info',
          qualifier: 'title',
          value: literature.title
        }),
        new HBaseTypes.TColumnValue({
          family: 'info',
          qualifier: 'abstract',
          value: literature.abstract
        }),
        new HBaseTypes.TColumnValue({
          family: 'info',
          qualifier: 'basic',
          value: basicinfo
        })
      ]
    });
    hbase.put(this.table, tput, function (err) {
      if (err) {
        cb(err);
      }
      cb(null);
    });
  },

  delete: function (id, cb) {
    var tdelete = new HBaseTypes.TDelete({
      row: id,
      columns: [new HBaseTypes.TColumn({family: 'info'})]
    });
    hbase.delete(this.table, tdelete, function (err) {
      if (err) {
        cb(err);
      }
      cb(null);
    });
  },

  findById: function (id, cb) {
    var tget = new HBaseTypes.TGet({
      row: id,
      columns: [
        new HBaseTypes.TColumn({
          family: 'info'
        })
      ]
    });
    hbase.get(this.table, tget, function (err, data) {
      if (err) {
        cb(err);
      }
      var literature = {};
      if (data.row) {
        var values = data.columnValues;
        for (var i = 0; i < values.length; i++) {
          var columnItem = values[i];
          if (columnItem.qualifier == 'basic') {
            literature = JSON.parse(columnItem.value);
            break;
          }
        }
        for (var i = 0; i < values.length; i++) {
          var columnItem = values[i];
          if (columnItem.qualifier != 'basic') {
            literature[columnItem.qualifier] = columnItem.value;
          }
        }
        literature.score_count = parseInt(literature.score_count);
        literature.score_avg = parseFloat(literature.score_avg);
        literature.id = data.row;
      }
      //console.log(data.columnValues);
      cb(null, literature);
    });
  },

  findByUser: function (userid, cb) {
    console.log(userid);
    var tscan = new HBaseTypes.TScan({
      columns: [
        new HBaseTypes.TColumn({
          family: 'info',
          qualifier: 'title'
        }),
        new HBaseTypes.TColumn({
          family: 'info',
          qualifier: 'user_id'
        })
      ],
      filterString: "(SingleColumnValueFilter('info', 'user_id', =, 'regexstring: *" + userid + "*', true, true))"
    }); // What you filter must be in the array of columns, or there is empty set
    hbase.scan(this.table, tscan, 100, function (err, data) {
      if (err) {
        cb(err);
      }
      console.log('findByUser:');
      console.log(data);
      var literatures = [];
      for (var i = 0; i < data.length; i++) {
        var row = data[i];
        var literature = {};
        literature.id = row.row; // the row key
        literature.title = row.columnValues[0].value;
        literature.add_at = parseInt(row.columnValues[0].timestamp);
        literatures.push(literature);
      }
      cb(null, literatures);
    });
  },

  findByTitle: function (title, cb) {
    var tscan = new HBaseTypes.TScan({
      columns: [
        new HBaseTypes.TColumn({
          family: 'info',
          qualifier: 'title'
        }),
        new HBaseTypes.TColumn({
          family: 'info',
          qualifier: 'abstract'
        })
      ],
      filterString: "(SingleColumnValueFilter('info', 'title', =, 'regexstring: *" + title + "*', true, true))"
    }); // The space  'regexstring:' is important, if no space, there will be error
    hbase.scan(this.table, tscan, 100, function (err, data) {
      if (err) {
        cb(err);
      }
      var literatures = [];
      for (var i = 0; i < data.length; i++) {
        var row = data[i];
        var literature = {};
        literature.id = row.row; // the row key
        for (var j = 0; j < row.columnValues.length; j++) {
          var column = row.columnValues[j];
          literature[column.qualifier] = column.value;
        }
        literatures.push(literature);
      }
      //console.log(literatures);
      cb(null, literatures);
    });
  },


  findAll: function (condition, callback) {

  },

  /**
   * When make rich comment and brief comment, should update tags and score for
   * literature
   */
  updateForComment: function (literatureId, score, tags, cb) {
    var self = this;
    if (score === 0 && tags.length === 0) {
      cb(null);
    }
    var tget = new HBaseTypes.TGet({
      row: literatureId,
      columns: [
        new HBaseTypes.TColumn({
          family: 'info',
          qualifier: 'score_avg'
        }),
        new HBaseTypes.TColumn({
          family: 'info',
          qualifier: 'score_count'
        }),
        new HBaseTypes.TColumn({
          family: 'info',
          qualifier: 'tags'
        })
      ]
    });

    hbase.get(self.table, tget, function (err, result) {
      if (err) {
        cb(err);
      }
      var literature = {};
      for (var i = 0; i < result.columnValues.length; i++) {
        var column = result.columnValues[i];
        literature[column.qualifier] = column.value;
      }
      literature.score_avg = parseFloat(literature.score_avg);
      literature.score_count = parseInt(literature.score_count);
      score = parseInt(score);
      if (score > 0) {
        var scoreAvg = literature.score_avg;
        var scoreCount = literature.score_count;
        scoreAvg = ((scoreAvg * scoreCount) + score) / (scoreCount + 1);
        literature.score_avg = scoreAvg;
        literature.score_count = scoreCount + 1;
      }

      if (tags.length > 0) {
          var newTagsArr = tags.toLowerCase().split(',');
          newTagsArr = _.map(newTagsArr, function (item) {
            return item.trim();
          })
          newTagsArr = _.without(newTagsArr, '');
        if (literature.tags) {
          var literatureTagsArr = literature.tags.toLowerCase().split(',');
          literatureTagsArr = _.map(literatureTagsArr, function (item) {
            return item.trim();
          });
          literatureTagsArr = _.without(literatureTagsArr, '');
          literatureTagsArr = _.union(literatureTagsArr, newTagsArr);
          literatureTagsArr = _.uniq(literatureTagsArr, false);
          literature.tags = literatureTagsArr.join(',');
        } else {
          literature.tags = newTagsArr.join(',');
        }
      }

      var tput = new HBaseTypes.TPut({
        row: literatureId,
        columnValues: [
          new HBaseTypes.TColumnValue({
            family: 'info',
            qualifier: 'score_count',
            value: literature.score_count
          }),
          new HBaseTypes.TColumnValue({
            family: 'info',
            qualifier: 'score_avg',
            value: literature.score_avg
          }),
          new HBaseTypes.TColumnValue({
            family: 'info',
            qualifier: 'tags',
            value: literature.tags
          })
        ]
      })

      hbase.put(self.table, tput, function (puterr) {
        if (puterr) {
          cb(puterr);
        }
        cb(null);
      });
    });
  },

  findTags: function (literatureId, cb) {
    var tget = new HBaseTypes.TGet({
      row: literatureId,
      columns: [
        new HBaseTypes.TColumn({
          family: 'info',
          qualifier: 'tags'
        })
      ]
    });
    hbase.get(this.table, tget, function (err, data) {
      if (err) {
        cb(err);
      }
      var literature = {};
      literature.tags = data.columnValues ? data.columnValues[0].value : '';
      cb(null, literature);
    });
  }
}