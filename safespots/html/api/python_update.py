from cassandra.cluster import Cluster
import sys

cluster = Cluster(['104.131.61.92', '104.236.140.157', '159.203.19.130'])
session = cluster.connect()
session.execute('USE safespot')

user    = sys.argv[1]
column  = sys.argv[2]
value   = sys.argv[3]

if column == 'email' or column == 'password':
    query = 'UPDATE users SET ' + column + '=\'' + value + '\' WHERE username=\'' \
        + user + '\';'
    session.execute(query)
    print 'success'

elif column == 'pin' or column == 'timeout':
    query = 'UPDATE users SET ' + column + '=' + value + ' WHERE username=\'' \
        + user + '\';'
    session.execute(query)
    print 'success'
