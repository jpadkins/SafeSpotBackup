from cassandra.cluster import Cluster
import sys

cluster = Cluster(['104.131.61.92', '104.236.140.157', '159.203.19.130'])
session = cluster.connect()
session.execute('USE safespot')

username    = sys.argv[1]
email       = sys.argv[2]
first       = sys.argv[3]
last        = sys.argv[4]
password    = sys.argv[5]
salt        = sys.argv[6]
pin = 'null'
timeout = '5'

# check for existing user
query = 'SELECT * FROM users WHERE username = \'' + username + '\' ALLOW FILTERING;'
query = session.execute(query)
account_exists = query in locals() or query in globals()

# proceed if no user exists
if account_exists is False:
    query = 'INSERT INTO users(username, email, firstname, lastname, password, pin, salt, ' \
        'timeout) VALUES (\'' + username + '\', \'' + email + '\', \'' + first + '\', \'' \
        + last + '\', \'' + password + '\', ' + pin + ', \'' + salt + '\', ' + timeout + ');'
    session.execute(query)

    print 'success'
else:
    print 'error'
