var utils = require('../../lib/utils');
var squel = require('squel');

module.exports = {
  table: 'literatures',

  getLiteraturesData: function (req, callback) {
    // var sql = 'SELECT add_at FROM paperbook.literatures where user_id=' + req.user.id + ' order by add_at';
    var sql = squel.select()
      .field('add_at')
      .from('paperbook.literatures')
      .where('user_id=' + 1)
      .order('add_at');
    // console.log(sql.toString());
    utils.exec(sql.toString(), null, function (err, results) {
      if (err || !results) {
        results = [];
      };
      var highstockData = [];
      if (results.length) {
        var year = new Date(results[0].add_at)
          .getFullYear(),
        month = new Date(results[0].add_at)
          .getMonth(),
        count = 0;
      }

      // results.forEach(function (result, index) {
      //   if (year != new Date(result.add_at)
      //     .getFullYear() || month != new Date(result.add_at)
      //     .getMonth()) {
      //     highstockData.push([Date.UTC(year, month, 1), count]);
      //     count = 0;
      //     year = new Date(result.add_at)
      //       .getFullYear();
      //     month = new Date(result.add_at)
      //       .getMonth();
      //   };
      //   console.log(year + '-' + month);
      //   count++;
      // })
      // highstockData.push([Date.UTC(year, month, 1), count]);


      results.forEach(function (result, index) {
        highstockData.push([new Date(result.add_at)
          .getTime(), index + 1
        ]);
      });


      //var sql = 'SELECT b.username as username, count(*) as literature_count FROM paperbook.literatures as a join paperbook.users as b on a.user_id = b.id GROUP BY a.user_id, b.username;';
      //var sql = 'SELECT year(a.add_at) as add_year, b.username as username, count(*) as literature_count FROM paperbook.literatures as a right join paperbook.users as b on a.user_id = b.id GROUP BY add_year,a.user_id, b.username;';
      // var sql = 'select b.add_year as add_year, b.username as username, ifnull(a.literature_count,0) as literature_count from(SELECT year(a.add_at) as add_year, b.username as username, count(*) as literature_count FROM paperbook.literatures as a join paperbook.users as b on a.user_id = b.id GROUP BY add_year,a.user_id, b.username) as a right join(select distinct year(a.add_at) as add_year,username as username from literatures as a,users as b) as b on a.add_year=b.add_year and a.username=b.username order by add_year,username';
      var sql = squel.select()
        .field('b.add_year', 'add_year')
        .field('b.username', 'username')
        .field('ifnull(a.literature_count,0)', 'literature_count')
        .from(
          squel.select()
          .field('year(a.add_at)', 'add_year')
          .field('b.username', 'username')
          .field('count(*)', 'literature_count')
          .from('paperbook.literatures', 'a')
          .join('paperbook.users', 'b', 'a.user_id = b.id')
          .group('add_year')
          .group('a.user_id')
          .group('b.username'), 'a'
      )
        .right_join(
          squel.select()
          .field('distinct year(a.add_at)', 'add_year')
          .field('username', 'username')
          .from('literatures', 'a')
          .from('users', 'b'), 'b', 'a.add_year=b.add_year and a.username=b.username'
      )
        .order('add_year')
        .order('username');
      // console.log(sql.toString());
      var highchartsData = Array();
      utils.exec(sql.toString(), null, function (err, results) {
        if (err) {
          results = [];
        };
        while (results[0].add_year === null) {
          results.shift();
        }
        var year = results[0].add_year,
          index = 0,
          temp = [];
        results.forEach(function (result) {
          var result_year = result.add_year;
          if (year != result_year) {
            highchartsData.push({
              'index': index,
              'name': 'Year ' + year,
              'data': temp
            });
            year = result_year;
            temp = [];
          };
          temp.push([result.username, result.literature_count]);
        });
        highchartsData.push({
          'index': index,
          'name': 'Year ' + year,
          'data': temp
        });
        callback(highchartsData,highstockData);
      });

    });
  },

  getBriefCommentsData: function (req, callback) {
    var sql = squel.select()
      .field('created_at')
      .from('paperbook.brief_comments')
      .where('user_id=' + req.user.id)
      .order('created_at');
    // console.log(sql.toString());
    utils.exec(sql.toString(), null, function (err, results) {
      if (err || results.length == 0) {
        results = [];
      };

      var highstockData = [],
        count = 0;

      results.forEach(function (result, index) {
        highstockData.push([new Date(result.created_at)
          .getTime(), index + 1
        ]);
      });
      // console.log(highstockData);

      var sql = squel.select()
        .field('b.add_year', 'add_year')
        .field('b.username', 'username')
        .field('ifnull(a.brief_comments_count,0)', 'brief_comments_count')
        .from(
          squel.select()
          .field('year(a.created_at)', 'add_year')
          .field('b.username', 'username')
          .field('count(*)', 'brief_comments_count')
          .from('paperbook.brief_comments', 'a')
          .join('paperbook.users', 'b', 'a.user_id = b.id')
          .group('add_year')
          .group('a.user_id')
          .group('b.username'), 'a'
      )
        .right_join(
          squel.select()
          .field('distinct year(a.created_at)', 'add_year')
          .field('username', 'username')
          .from('paperbook.brief_comments', 'a')
          .from('paperbook.users', 'b'), 'b', 'a.add_year=b.add_year and a.username=b.username'
      )
        .order('add_year')
        .order('username');
      console.log(sql.toString());
      var highchartsData = Array();
      utils.exec(sql.toString(), null, function (err, results) {
        if (err) {
          results = [];
        };
        while (results[0].add_year === null) {
          results.shift();
        }
        var year = results[0].add_year,
          index = 0,
          temp = [];
        results.forEach(function (result) {
          var result_year = result.add_year;
          if (year != result_year) {
            highchartsData.push({
              'index': index,
              'name': 'Year ' + year,
              'data': temp
            });
            year = result_year;
            temp = [];
          };
          temp.push([result.username, result.brief_comments_count]);
        });
        highchartsData.push({
          'index': index,
          'name': 'Year ' + year,
          'data': temp
        });
        callback(highchartsData, highstockData);
      });

    });
  },

  getRichCommentsData: function (req, callback) {
    var sql = squel.select()
      .field('created_at')
      .from('paperbook.rich_comments')
      .where('user_id=' + req.user.id)
      .order('created_at');
    // console.log(sql.toString());
    utils.exec(sql.toString(), null, function (err, results) {
      if (err || results.length == 0) {
        results = [];
      };

      var highstockData = [],
        count = 0;

      results.forEach(function (result, index) {
        highstockData.push([new Date(result.created_at)
          .getTime(), index + 1
        ]);
      });
      // console.log(highstockData);

      var sql = squel.select()
        .field('b.add_year', 'add_year')
        .field('b.username', 'username')
        .field('ifnull(a.rich_comments_count,0)', 'rich_comments_count')
        .from(
          squel.select()
          .field('year(a.created_at)', 'add_year')
          .field('b.username', 'username')
          .field('count(*)', 'rich_comments_count')
          .from('paperbook.rich_comments', 'a')
          .join('paperbook.users', 'b', 'a.user_id = b.id')
          .group('add_year')
          .group('a.user_id')
          .group('b.username'), 'a'
      )
        .right_join(
          squel.select()
          .field('distinct year(a.created_at)', 'add_year')
          .field('username', 'username')
          .from('paperbook.rich_comments', 'a')
          .from('paperbook.users', 'b'), 'b', 'a.add_year=b.add_year and a.username=b.username'
      )
        .order('add_year')
        .order('username');
      console.log(sql.toString());
      var highchartsData = Array();
      utils.exec(sql.toString(), null, function (err, results) {
        if (err) {
          results = [];
        };
        while (results[0].add_year === null) {
          results.shift();
        }
        var year = results[0].add_year,
          index = 0,
          temp = [];
        results.forEach(function (result) {
          var result_year = result.add_year;
          if (year != result_year) {
            highchartsData.push({
              'index': index,
              'name': 'Year ' + year,
              'data': temp
            });
            year = result_year;
            temp = [];
          };
          temp.push([result.username, result.rich_comments_count]);
        });
        highchartsData.push({
          'index': index,
          'name': 'Year ' + year,
          'data': temp
        });
        callback(highchartsData, highstockData);
      });

    });
  }
}