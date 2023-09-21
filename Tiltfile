LOCAL_PATH = os.getenv("LOCAL_PATH", default='.')
NAMESPACE = os.getenv("NAMESPACE", default='micropets-dev')

allow_k8s_contexts('aks-eu-tap-6')

k8s_yaml(["config/application-configuration.yaml","config/class-claim-elephants-mongo.yaml"])

k8s_custom_deploy(
    'elephants-nodejs-mongodb',
    apply_cmd="tanzu apps workload apply -f config/workload.yaml --update-strategy replace --debug --live-update" +
              " --local-path " + LOCAL_PATH +
              " --namespace " + NAMESPACE +
              " --yes --output yaml",    
    delete_cmd="tanzu apps workload delete -f config/workload.yaml --namespace " + NAMESPACE + " --yes",
    deps=['.'],
    container_selector='workload',
    live_update=[
        fall_back_on(['package.json']),
        sync('.', '/workspace')
]
)

k8s_resource('elephants-nodejs-mongodb', port_forwards=["8080:8080"],
    extra_pod_selectors=[{'serving.knative.dev/service': 'elephants-nodejs-mongodb'}])
