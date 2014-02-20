# PaperBook Hadoop Overview
 PaperBook is a Literature Management System, which is shipped with convenient literature upload, search, comment and greate communication functions for a private research group.<br>
 Originally, we built the system based on Node.js + Express + MySQL<BR>
 Now, we migrate the project to Hadoop and HBase. We make use of HDFS to save literaute files and use HBase to do database work.

# Team Member
+ [Cyanny Liang](http://www.cyanny.com)
+ Thomas Zhang
+ Aaron Feng

## Install for the MySQL version

**NOTE:** You need to have node.js, mysql installed <BR>
1. Clone the project
```sh
  $ git clone https://github.com/lgrcyanny/PaperBook-MySQL
  $ npm install
  $ cp config/config.disk.js config/config.js
```
Please config your mysql in the `config.js`;

2. Install mysql[http://dev.mysql.com/downloads/]

3. Start mysql service and change mysql root password into 'root'

4. Build the database
```sh
  $ mysql -u root -p
  > create database paperbook
  > quit
  $ mysql -u root -pyourpassword paperbook < paperbook.sql
```
5. Start Server
```sh
  $ npm start
```
6. Then visit [http://localhost:3000/](http://localhost:3000/)

7. **NOTE:**, the database is empty, please build it by yourself, and the uploads dir is not include, it will create when you upload files.

## Install Hadoop for HDFS storage
We adopt Hadoop 2.2.0, which is shipped with more new features.
1. Please follow the [blog guide](http://www.cyanny.com/2014/02/06/set-hadoop-hbase-part1/) to install Hadoop 2.2.0
2. You can start the project the same as the MySQL version by `npm start`
3. Please try to upload, delete and download literatures, up to now these files will be saved/deleted/get on HDFS


## Related modules
[node-express-mongoose-demo](https://github.com/madhums/node-express-mongoose-demo)

## Directory structure
```
-app/
  |__controllers/
  |__models/
  |__mailer/
  |__views/
-config/
  |__routes.js
  |__config.js
  |__passport.js (auth config)
  |__imager.js (imager config)
  |__express.js (express.js configs)
  |__middlewares/ (custom middlewares)
-public/
```

## Tests

```sh
$ npm test
```

## Comments
Originally, the project is built on mongodb, but our teacher said that we have to use mysql, which freaks us out.
The migration costs me 3 days, just simple signin/signup function. Different database is like different OS. Why teacher user command us to do so ? He wants us to compare rational database and non-rational database(HBase). By the way, even though I hate the migration, I learned a lot.

## License
(The MIT License)
