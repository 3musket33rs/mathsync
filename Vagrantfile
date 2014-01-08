# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  config.vm.network :private_network, ip: "192.168.1.2"

  config.vm.provision "shell", path: "dev-machine/root.sh"
  config.vm.provision "shell", path: "dev-machine/user.sh", privileged: false

  config.vm.synced_folder ".", "/home/vagrant/dev"

  config.vm.provider "virtualbox" do |v|
    v.name = "mathsync"
  end
end
