#!/bin/bash

INTERFACE="ExtNet"
PORT=2018
RULENAME="SSH"
# Machine IP on $INTERFACE
IP=$(ifconfig $INTERFACE | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')
# Private_net_1 admin server IP
ADMINIP=$(openstack stack output show test admin_server_private_ip_net1 -c output_value -f value)
# Get policy
POLICY=$(openstack stack output show test fw_policy -c output_value -f value)

# Check if rule exists to remove it or if not exists to create it
RULECHECK=$(neutron firewall-rule-list | grep -c $RULENAME)
if [ $RULECHECK -ge 1 ]; then
	# Remove rule from policy
	neutron firewall-policy-remove-rule $POLICY $RULENAME
	# Delete rule
	neutron firewall-rule-delete $RULENAME
else
	# Create rule
	neutron firewall-rule-create --name $RULENAME --protocol tcp --source-ip-address $IP --destination-ip-address $ADMINIP --destination-port $PORT --action allow
	# Insert rule into policy
	neutron firewall-policy-insert-rule $POLICY $RULENAME  
fi