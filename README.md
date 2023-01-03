# Micropets Elephants

Implements the Micropets API using Node/JS server and MongoDB database either from 
* [a managed service azure](config/ops/azure) or
* [a local operator](config/ops/k8s) running in the Kubernetes Cluster


The delivery relies on Tanzu Application platform provided by VMware.

The injection of the MongoDB configuration is using [service binding specification](https://servicebinding.io/)
The project contains a dedicated library to read the data from the Binding Root and load them as Environmnet Variable. The code is a fork from [nebhale's GitHub](https://github.com/nebhale/client-nodejs)

Note: The project was initially forked from https://github.com/CleverCloud/expressjs-mongodb-statsd-example
