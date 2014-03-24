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
1.Clone the project<BR>
```sh
  $ git clone https://github.com/lgrcyanny/PaperBook-MySQL
  $ npm install
  $ cp config/config.disk.js config/config.js
```
Please config your mysql in the `config.js`;<BR>

2.Install mysql[http://dev.mysql.com/downloads/]<BR>

3.Start mysql service and change mysql root password into 'root'<BR>

4.Build the database<br>
```sh
  $ mysql -u root -p
  > create database paperbook
  > quit
  $ mysql -u root -pyourpassword paperbook < paperbook.sql
```
5.Start Server<br>
```sh
  $ npm start
```
6.Then visit [http://localhost:3000/](http://localhost:3000/)<br>

7. **NOTE:**, the database is empty, please build it by yourself, and the uploads dir is not include, it will create when you upload files.<br>

## Install Hadoop for HDFS storage
We adopt Hadoop 2.2.0, which is shipped with more new features.<BR>
1. Please follow the [blog guide](http://www.cyanny.com/2014/02/06/set-hadoop-hbase-part1/) to install Hadoop 2.2.0<BR>
2. You can start the project the same as the MySQL version by `npm start`<BR>
3. Please try to upload, delete and download literatures, up to now these files will be saved/deleted/get on HDFS<BR>

## Install HBase and Thrift
We adopt HBase 0.96.1 which support Hadoop 2.2 well, and we use thrift interface to communicate with HBase.<BR>
1.Install and Config HBase with pseudo mode, you can refer to [the blog](http://www.cyanny.com/2014/02/06/set-hadoop-hbase-part2/)<BR>
2.You can lean something about thrift [here](http://www.cyanny.com/2014/02/27/nodejs-hbase-hadoop2-thrift2%e9%85%8d%e7%bd%ae%e4%b8%8e%e4%bd%bf%e7%94%a8/).<BR>
3.since you have run 'npm install', the thrift package is installed, now you can open hbase to create some table:<BR>
```sh
  $ start-hbase.sh
  $ hbsae shell
  > create 'pb_users', 'info'
  > create 'pb_literatures', 'info'
  > create 'pb_comments', 'brief_draft', 'brief_publish', 'rich_draft', 'rich_publish'
  > create 'pb_config', 'info'
  > create 'pb_cited', 'info'
```
<BR>
4.start thrift2<BR>
We use thrift2 API provided by HBase 0.96, since the thrift1 will be deprecated in future.<BR>
```sh
 $ hbase thrift2 start -f # Use TFramedTransport, This transport is required when using a non-blocking server. It sends data in frames, where each frame is preceded by length information.
```
5.Start and use paperbook now<BR>
```sh
 $ npm start
```
<BR>
Now only upload, update, browser detail and my literature, register, login is based on HBase.<BR>
The comments, admin config and search is based on MySQL, so you must start MySQL as well.

## Build MapReduce Inverted Index for Search
Please refer to [PaperBook-MapReduce](https://github.com/lgrcyanny/PaperBook-MapReduce)
After you have build the reverted index in HBase, you can try the search function


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
1. open test dir
2. run batchtest.sh<BR>
The batchtest.sh will run test-mysql.js, test-hbase-fullscan.js and test-hbase-index.js, 100 times for each.<BR>


## Comments
Originally, the project is built on mongodb, but our teacher said that we have to use mysql, which freaks us out.
The migration costs me 3 days, just simple signin/signup function. Different database is like different OS. Why teacher user command us to do so ? He wants us to compare rational database and non-rational database(HBase). By the way, even though I hate the migration, I learned a lot.

## License
(The MIT License)
