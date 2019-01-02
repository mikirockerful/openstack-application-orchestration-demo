# openstack-application-orchestration-demo
Automatic deployment of a custom application on an OpenStack scenario

# Execution instructions
* On a DIT lab computer, create the OpenStack virtual environment as usual:
```
/mnt/vnx/repo/cnvr/bin/get-openstack-tutorial.sh
cd /mnt/tmp/openstack_lab-ocata_4n_classic_ovs-v04
sudo vnx -f openstack_lab.xml -t
sudo vnx -f openstack_lab.xml -x start-all,load-img
vnx_config_nat ExtNet <interfaz_externo>
```

* Copy the project files and templates to that computer. The deployment is intended to be run from the host (project requirement 1), as the "demo" user (project requirement 2).

* Currently, the external network needs to be manually created (provider networks require "admin" privileges, because they connect to the physical infrastructure). We need to set the environment variables properly and create the network:
```
source admin-openrc.sh
openstack network create --share --external --provider-physical-network provider --provider-network-type flat ExtNet
openstack subnet create --network ExtNet --gateway 10.0.10.1 --dns-nameserver 10.0.10.1 --subnet-range 10.0.10.0/24 --allocation-pool start=10.0.10.100,end=10.0.10.200 ExtSubNet
```

* Release the admin privileges and set environment to "demo" user:
```
source demo-openrc.sh
```

* Finally, deploy the stack from the controller with the following command. Remember that you need to have the correct environment variables (you can reset them with "source bin/admin-openrc.sh"):
```
openstack stack create -t deployment.yaml -e deployment_parameters.yaml <nombre_stack>
```

**Check HOT templates syntax:** You can use the "--dry-run" option of the creation command or use:
```
openstack orchestration template validate -t <file.yaml>
```