Vagrant.configure(2) do |config|
	config.vm.box = "ubuntu/trusty64"
	config.vm.network :forwarded_port, guest: 80, host: 9000
	config.vm.synced_folder "html", "/var/www/html"
	config.vm.provider "virtualbox" do |vb|
		vb.name = "Safe_Spots_Dev"
	end
	config.vm.provision "shell", inline: <<-SHELL
	    PASSWORD='root'
	    sudo apt-get update
	    sudo apt-get install -y apache2
	    sudo apt-get install -y php5
	    sudo debconf-set-selections <<< "mysql-server mysql-server/root_password password $PASSWORD"
	    sudo debconf-set-selections <<< "mysql-server mysql-server/root_password_again password $PASSWORD"
	    sudo apt-get -y install mysql-server
	    sudo apt-get -y install php5-mysql
	    service apache2 restart
    SHELL
end
