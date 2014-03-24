# !/bin/bash
max=100
for i in `seq 1 $max`
do
  node test-mysql.js >> res-mysql.csv
done
echo "Test MySQL search done."

for i in `seq 1 $max`
do
  node test-hbase-fullscan.js >> res-hbase-fullscan.csv
done
echo "Test HBase full scan done."

for i in `seq 1 $max`
do
  node test-hbase-index.js >> res-hbase-index.csv
done
echo "Test HBase index search done"