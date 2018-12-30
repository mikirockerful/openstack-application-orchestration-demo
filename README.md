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

* Currently, the external network needs to be manually created. To do so, SSH to the controller and execute:
```
source bin/admin-openrc.sh
openstack network create --share --external --provider-physical-network provider --provider-network-type flat ExtNet
openstack subnet create --network ExtNet --gateway 10.0.10.1 --dns-nameserver 10.0.10.1 --subnet-range 10.0.10.0/24 --allocation-pool start=10.0.10.100,end=10.0.10.200 ExtSubNet
```

* Then, copy the HOT templates to the controller node. One option is to SCP them three times: your computer -> DIT lab jump server -> your assigned server -> controller node. Another option is to copy/paste the contents. If you do so, remember to check the YAML syntax.

* Finally, deploy the stack from the controller with the following command. Remember that you need to have the correct environment variables (you can reset them with "source bin/admin-openrc.sh"):
```
openstack stack create -t escenario_completo_p73.yml -e parameters_p73.yml <nombre_stack>
```

**Check HOT templates syntax:** You can use the "--dry-run" option of the creation command or use:
```
openstack orchestration template validate -t <file.yml>
```