from cassandra.cluster import Cluster
import sys
import json

cluster = Cluster(['104.131.61.92', '104.236.140.157', '159.203.19.130'])
session = cluster.connect()
session.execute('USE safespot')

operation = sys.argv[1]

# return a list of contacts
if  operation == 'GET':
    username = sys.argv[2]
    query = 'SELECT * FROM contacts WHERE username = \'' + username + '\';'
    query = session.execute(query)
    contacts = []
    for row in query:
        contact = {}
        contact['firstname']    = row.firstname
        contact['lastname']     = row.lastname
        contact['phone']        = row.phone
        contact['state']        = row.state
        contact['city']         = row.city
        contact['street']       = row.street
        contacts.append(contact)
    contacts = json.dumps(contacts)
    contacts.replace("\\","")
    print contacts

# add a new contact
elif operation == 'POST':
    username    = sys.argv[2]
    city        = sys.argv[3]
    first       = sys.argv[4]
    last        = sys.argv[5]
    phone       = sys.argv[6]
    state       = sys.argv[7]
    street      = sys.argv[8]
    query = 'INSERT INTO contacts(id, username, city, firstname, lastname, phone, state, street) ' \
        'VALUES (now(), \'' + username + '\', \'' + city + '\', \'' + first + '\', \'' + last + '\', \'' \
        + phone + '\', \'' + state + '\', \'' + street + '\');'
    session.execute(query)
    print 'success'

# delete a specific contact
elif operation == 'DELETE':
    username    = sys.argv[2]
    city        = sys.argv[3]
    firstname   = sys.argv[4]
    lastname    = sys.argv[5]
    phone       = sys.argv[6]
    state       = sys.argv[7]
    street      = sys.argv[8]
    query = 'SELECT * FROM contacts WHERE username=\'' + username + '\';'
    query = session.execute(query)
    for row in query:
        if  row.firstname   == firstname and \
            row.lastname    == lastname and \
            row.city        == city and \
            row.phone       == phone and \
            row.state       == state and \
            row.street      == street:
            stmt = 'DELETE FROM contacts WHERE id=' + str(row.id)
            session.execute(stmt)
    print 'success'
