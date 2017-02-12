from bs4 import BeautifulSoup
import dryscrape
import sys
import json

url = ''

for i in range(1, len(sys.argv)):
    url = url + sys.argv[i] + '%20'

session = dryscrape.Session()
session.visit(url)
response = session.body()
soup = BeautifulSoup(response, "lxml")
crimes = soup.find_all("a", {"class" : "list-group-item"})
response = []
for crime in crimes:
    c = {}
    c['crime'] = crime.find_all("h4", {"class" : "list-group-item-heading"})[0].getText()
    c['date'] = crime.find_all("p", {"class" : "list-group-item-text crime-date"})[0].getText()
    c['address'] = crime.find_all("p", {"class" : "list-group-item-text crime-address"})[0].getText()
    response.append(c);
response = json.dumps(response);
response.replace("\\","")
print response
