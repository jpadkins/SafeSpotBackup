# SafeSpot

## How To Set Up Dev Environment

1. Clone the repository

2. cd into the directory of the cloned repo and run "vagrant up"

3. Run vagrant --reload provision

4. run "vagrant ssh"

5. mysql -uroot -p
	- create database safespots;
	- exit

6. mysql -uroot -p safespots < safespots_db.sql

7. run 'sudo a2enmod rewrite'

8. edit /etc/apache2/apache2.conf so that this section:

<Directory /var/www/>  
        Options Indexes FollowSymLinks  
        AllowOverride None    
        Require all granted
</Directory>

Looks like this:

<Directory /var/www/>  
        Options Indexes FollowSymLinks  
        AllowOverride All    
        Require all granted  
</Directory>

then restart apache by running 'sudo service apache2 restart'

9. Pat yourself on the back and give yourself a high-five,
because you're ready to develop!
