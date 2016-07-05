$script = <<SCRIPT
  curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
  apt-get install -y nodejs build-essential
  npm install -g npm@latest
  npm install -g bunyan

  apt-get install mongodb -y

  su vagrant
  cd /vagrant
  npm install
SCRIPT

Vagrant.configure("2") do |config|
  # Settings for the VM
  config.vm.box = "ubuntu/trusty64"
  config.vm.hostname = "products-service.box"
  config.vm.network :private_network, ip: "192.168.10.13"

  # Development environment using gulp live-reload
  config.vm.provision "shell", privileged:true, inline: $script

  # To start the debug server: vagrant ssh -c "cd /vagrant && node server.js | bunyan"
end
