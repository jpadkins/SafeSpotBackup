from cassandra.cluster import Cluster
import sys
import json

cluster = Cluster(['104.131.61.92', '104.236.140.157', '159.203.19.130'])
session = cluster.connect()
session.execute('USE safespot')

username    = sys.argv[1]
password    = sys.argv[2]

query = 'SELECT * FROM users WHERE username = \'' + username + '\' ALLOW FILTERING;'

query = session.execute(query)
result = query[0]
if result != "":
    data = {}
    data['username']    = result.username
    data['password']    = result.password
    data['email']       = result.email
    data['firstname']   = result.firstname
    data['lastname']    = result.lastname
    data['salt']        = result.salt
    data['pin']         = result.pin
    data['timeout']     = result.timeout
    json_data = json.dumps(data)
    json_data.replace("\\","")
    print json_data
else:
    print result
