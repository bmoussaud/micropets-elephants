set -x 
NS=micropets-dev
#kubectl apply -f config/pets_config.yaml --namespace $NS
#SOURCE="--source-image akseutap6registry.azurecr.io/cats"
#tanzu apps workload apply -f config/workload.yaml --live-update --local-path .  --namespace $NS --yes  --update-strategy merge
tanzu apps workload apply --file config/workload.yaml --namespace ${NS}  --debug --yes --local-path . --live-update --tail --update-strategy replace 
