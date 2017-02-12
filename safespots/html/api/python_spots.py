from cassandra.cluster import Cluster
import sys
import json

cluster = Cluster(['104.131.61.92', '104.236.140.157', '159.203.19.130'])
session = cluster.connect()
session.execute('USE safespot')

operation = sys.argv[1]

# return a list of spots
if  operation == 'GET':
    username = sys.argv[2]
    query = 'SELECT * FROM spots WHERE username = \'' + username + '\';'
    query = session.execute(query)
    spots = []
    for row in query:
        spot = {}
        spot['name']    = row.name
        spot['lat']     = row.lat
        spot['lng']     = row.lng
        spots.append(spot)
    spots = json.dumps(spots)
    spots.replace("\\","")
    print spots

# add a new spot
elif operation == 'POST':
    username    = sys.argv[2]
    name        = sys.argv[3]
    lat         = sys.argv[4]
    lng         = sys.argv[5]
    query = 'INSERT INTO spots(id, lat, lng, name, username) VALUES (now(), \'' + lat \
        + '\', \'' + lng + '\', \'' + name + '\', \'' + username + '\');'
    session.execute(query)
    print 'success'

# delete a specific spot
elif operation == 'DELETE':
    username    = sys.argv[2]
    name        = sys.argv[3]
    lat         = sys.argv[4]
    lng         = sys.argv[5]
    query = 'SELECT * FROM spots WHERE username=\'' + username + '\';'
    query = session.execute(query)
    for row in query:
        if  row.name    == name and \
            row.lat     == lat and \
            row.lng     == lng:
            stmt = 'DELETE FROM spots WHERE id=' + str(row.id)
            session.execute(stmt)
    print 'success'
