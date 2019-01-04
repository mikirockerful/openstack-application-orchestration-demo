# openstack-application-orchestration-demo
Automatic deployment of a custom application on an OpenStack scenario

# Deployment instructions
* On a DIT lab computer, create the OpenStack virtual environment as usual:
```
/mnt/vnx/repo/cnvr/bin/get-openstack-tutorial.sh
cd /mnt/tmp/openstack_lab-ocata_4n_classic_ovs-v04
sudo vnx -f openstack_lab.xml -t
sudo vnx -f openstack_lab.xml -x start-all,load-img
vnx_config_nat ExtNet <interfaz_externo>
```

* Copy the files "admin-openrc.sh", "demo-openrc.sh" and the contents of the "deployment" folder to that computer. The deployment is intended to be run from the host (project requirement 1), as the "demo" user (project requirement 2).

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

# Image creation
Deployment scripts require that pre-built images exist in the Glance image service. Image creation should be a one-time step to be performed independently from deployment, as per project requirement 3.

The "image_creation" folder contains the HOT templates and cloud-init files required for image creation. To create the images:

* Start from an OpenStack scenario with ExtNet created by an admin user (see "Deployment instructions").

* Copy the files from the "image_creation" folder and source the "demo-openrc.sh" script in the computer's lab (i.e. the host)

* Run the desired stack(s). For instance:
```
openstack stack create -t install_zookeeper.yaml -e parameters.yaml <nombre_stack>
```

* Log into the OpenStack web interface. Check the result of the stack creation in "orchestration -> stacks". Take into account that software installations may take some minutes. The templates should create running instances, wait until they are active and have installed all the software.

* From the OpenStack "Compute -> Instances" menu, use the option "Create snapshot". Give the snapshot the same name that is used in the "deployment" files. When the process finishes, the image is ready to be used.

* Delete the stack to release resources. The created image will not be erased, as it was not part of the HOT template. Deletion can be done from the web interface or by running:
```
openstack stack delete <nombre_stack>
```

We can also create an image from an instance through CLI:

* Get instance name:
```
openstack server list
```

* Stop the running instance:
```
openstack server stop <instanceName>
```

* Wait until the instance shows status SHUTOFF:
```
openstack server list
```

* Create the snapshot (aka image):
```
openstack server image create <intanceName> --name <imageName>
```

* Verify that the new image status is ACTIVE:
```
openstack image list
```

#### For the application server image creation, after deploying the stack and before taking the screenshot, also run the script "finishInstall.sh".

# Enabling/disabling SSH firewall rule
The SSH connection to the admin server needs to be enabled when needed. There is a script that manages the creation and deletion of FW rules to handle this. When executed, it deletes the rule if exists and creates it if not. Go to the project root directory and run:
```
./sshFwRule.sh
```
Note: rules are associated with the source IP.




