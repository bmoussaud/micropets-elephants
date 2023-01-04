# Micropets Elephants

Implements the Micropets API using Node/JS server and MongoDB database either from 
* [a managed service azure](config/ops/azure) `kubectl apply -f config/ops/azure`  (require [Azure Service Operator (for Kubernetes)](https://github.com/Azure/azure-service-operator) ) or
* [a local operator](config/ops/k8s) running in the Kubernetes Cluster `kubectl apply -f config/ops/mongodb-operator/00-mongodb-operator.yaml -f config/ops/k8s`

The delivery relies on Tanzu Application platform provided by VMware.

The injection of the MongoDB configuration is using [service binding specification](https://servicebinding.io/)
The project contains a dedicated library to read the data from the Binding Root and load them as Environmnet Variable. The code is a fork from [nebhale's GitHub](https://github.com/nebhale/client-nodejs)

To change the mongodb provider edit [config/workload.yaml]() and set
* `mongodb-database` to `micropets-mongodb-azure-credentials` for Azure
* `mongodb-database` to `micropets-mongodb-k8s-credentials` for Local Kubernetes

Note: The project was initially forked from https://github.com/CleverCloud/expressjs-mongodb-statsd-example
