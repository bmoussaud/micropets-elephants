NS=micropets-dev
kubectl apply -f config/elephants-configuration.yaml --namespace $NS
kubectl apply -f config/ops/k8s 
tanzu apps workload apply -f config/workload.yaml  --live-update --local-path . --source-image akseutap5registry.azurecr.io/elephants --namespace $NS --yes  --update-strategy merge
