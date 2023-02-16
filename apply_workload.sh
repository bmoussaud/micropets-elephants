NS=micropets-dev
kubectl apply -f config/elephants-configuration.yaml --namespace $NS
kubectl apply -f config/ops/mongodb-operator/00-mongodb-operator.yaml -f config/ops/k8s 
tanzu apps workload apply -f config/workload.yaml  --live-update --local-path . --source-image akseutap4registry.azurecr.io/elephants --namespace $NS --yes  --update-strategy merge
