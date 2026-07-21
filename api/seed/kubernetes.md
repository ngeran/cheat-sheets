---
title: Kubernetes
subtitle: Container Orchestration
icon: Boxes
color: secondary
tags: [k8s, devops, orchestration]
---

## Cluster & Context
| Command | Description |
|---|---|
| `kubectl config get-contexts` | List all available kubeconfig contexts |
| `kubectl config current-context` | Show the name of the active context |
| `kubectl config use-context <name>` | Switch the current context to `<name>` |
| `kubectl config view` | Display merged kubeconfig settings |
| `kubectl config set-context --current --namespace=<ns>` | Set default namespace for current context |
| `kubectl cluster-info` | Show cluster control plane and DNS endpoints |
| `kubectl version` | Print client and server version info |
| `kubectl api-resources` | List all resource types the cluster supports |
| `kubectl api-versions` | List available API groups and versions |

## Core get & describe
| Command | Description |
|---|---|
| `kubectl get pods` | List pods in the current namespace |
| `kubectl get pods -A` | List pods across all namespaces |
| `kubectl get svc,deploy,po` | List multiple resource types at once |
| `kubectl get all` | List common workload resources in the namespace |
| `kubectl get pods -o wide` | Show pods with node and IP details |
| `kubectl get pod <name> -o yaml` | Print full pod manifest as YAML |
| `kubectl get pod <name> -o jsonpath='{.status.phase}'` | Extract a field using JSONPath |
| `kubectl get nodes -o wide` | List cluster nodes with details |
| `kubectl get pods --field-selector=status.phase=Running` | Filter resources by field selector |
| `kubectl describe pod <name>` | Show detailed pod info, conditions, and events |

## Namespaces
| Command | Description |
|---|---|
| `kubectl get namespaces` | List all namespaces in the cluster |
| `kubectl get ns` | Short alias for namespaces |
| `kubectl create namespace <name>` | Create a new namespace |
| `kubectl delete namespace <name>` | Delete a namespace and all its resources |
| `kubectl get pods -n <ns>` | Operate within a specific namespace |
| `kubectl get pods --all-namespaces` | List resources in every namespace |
| `kubectl config set-context --current --namespace=<ns>` | Permanently set default namespace |

## Pods
| Command | Description |
|---|---|
| `kubectl run nginx --image=nginx` | Create and run a new pod |
| `kubectl run -it tmp --rm --image=alpine -- sh` | Run an interactive temporary pod |
| `kubectl exec -it <pod> -- sh` | Open a shell inside a running pod |
| `kubectl logs <pod>` | Print pod stdout logs |
| `kubectl logs -f <pod>` | Stream pod logs continuously |
| `kubectl logs <pod> -c <container>` | Show logs for a specific container |
| `kubectl logs <pod> --previous` | Show logs of the previous crashed instance |
| `kubectl port-forward pod/<name> 8080:80` | Forward local port `8080` to pod port `80` |
| `kubectl cp <pod>:/var/log/app.log ./app.log` | Copy a file from pod to local machine |
| `kubectl cp ./app.log <pod>:/tmp/app.log` | Copy a file from local machine to pod |
| `kubectl get pods -w` | Watch pod changes in real time |
| `kubectl delete pod <name>` | Delete a pod (controller will recreate it) |

## Deployments
| Command | Description |
|---|---|
| `kubectl create deployment nginx --image=nginx` | Create a deployment from an image |
| `kubectl create deployment nginx --image=nginx --replicas=3` | Create a deployment with 3 replicas |
| `kubectl get deployments` | List deployments in the namespace |
| `kubectl scale deployment nginx --replicas=5` | Scale the replica count |
| `kubectl set image deployment/nginx nginx=nginx:1.25` | Update a container image, triggering rollout |
| `kubectl rollout status deployment/nginx` | Watch the rollout progress |
| `kubectl rollout history deployment/nginx` | Show revision history with change causes |
| `kubectl rollout undo deployment/nginx` | Roll back to the previous revision |
| `kubectl rollout undo deployment/nginx --to-revision=2` | Roll back to a specific revision |
| `kubectl rollout restart deployment/nginx` | Restart all pods under the deployment |
| `kubectl autoscale deployment nginx --min=2 --max=10 --cpu-percent=80` | Enable horizontal pod autoscaling |
| `kubectl delete deployment nginx` | Delete a deployment |

## Services & Networking
| Command | Description |
|---|---|
| `kubectl get services` | List services in the namespace |
| `kubectl get svc` | Short alias for services |
| `kubectl expose deployment nginx --port=80` | Create a `ClusterIP` service for a deployment |
| `kubectl expose deployment nginx --type=NodePort --port=80` | Create a `NodePort` service |
| `kubectl expose deployment nginx --type=LoadBalancer --port=80` | Create a `LoadBalancer` service |
| `kubectl get endpoints` | Show IP endpoints backing each service |
| `kubectl describe svc <name>` | Show service selectors, ports, and endpoints |
| `kubectl get ingress` | List ingress rules |
| `kubectl port-forward svc/<name> 8080:80` | Forward a local port to a service |
| `kubectl delete svc <name>` | Delete a service |

## Labels & Selectors
| Command | Description |
|---|---|
| `kubectl get pods --show-labels` | List pods with all their labels |
| `kubectl get pods -l app=nginx` | List pods matching label `app=nginx` |
| `kubectl get pods -l 'app in (nginx,web)'` | Match a label against a set of values |
| `kubectl get pods -l app!=nginx` | Match pods where label is not equal |
| `kubectl get all -l app=nginx` | List all resources matching the label |
| `kubectl label pod <name> env=prod` | Add or update a label on a pod |
| `kubectl label pod <name> env-` | Remove a label from a pod |

## Apply & Manage
| Command | Description |
|---|---|
| `kubectl apply -f deploy.yaml` | Create or update resources from a manifest |
| `kubectl apply -f ./manifests/` | Apply all YAML files in a directory |
| `kubectl apply -k ./overlays/prod` | Apply resources using Kustomize |
| `kubectl delete -f deploy.yaml` | Delete resources defined in a manifest |
| `kubectl edit deployment nginx` | Open the resource in an editor to modify |
| `kubectl patch deployment nginx -p '{"spec":{"replicas":4}}'` | Apply a JSON patch to a resource |
| `kubectl replace -f deploy.yaml` | Replace a resource entirely from file |
| `kubectl delete pods --all` | Delete all pods in the current namespace |
| `kubectl wait --for=condition=Ready pod/<name>` | Block until a condition is met |
| `kubectl annotate pod <name> owner=team-a` | Add or update an annotation |

## ConfigMaps & Secrets
| Command | Description |
|---|---|
| `kubectl create configmap cfg --from-literal=key=value` | Create a `ConfigMap` from a literal |
| `kubectl create configmap cfg --from-file=app.properties` | Create a `ConfigMap` from a file |
| `kubectl get configmaps` | List configmaps in the namespace |
| `kubectl describe configmap <name>` | Show the data stored in a `ConfigMap` |
| `kubectl create secret generic db --from-literal=password=s3cr3t` | Create an opaque `Secret` |
| `kubectl create secret generic db --from-file=./secret.txt` | Create a `Secret` from a file |
| `kubectl create secret tls tls-cert --cert=tls.crt --key=tls.key` | Create a TLS `Secret` for ingress |
| `kubectl get secrets` | List secrets in the namespace |
| `kubectl get secret <name> -o jsonpath='{.data}'` | Print base64-encoded secret data |
| `kubectl delete secret <name>` | Delete a secret |

## Storage
| Command | Description |
|---|---|
| `kubectl get pv` | List persistent volumes (cluster-scoped) |
| `kubectl get pvc` | List persistent volume claims |
| `kubectl get sc` | List storage classes (short alias) |
| `kubectl get storageclass` | List available `StorageClass` resources |
| `kubectl describe pvc <name>` | Show claim status and bound volume |
| `kubectl apply -f pvc.yaml` | Create a `PVC` from manifest |
| `kubectl delete pvc <name>` | Delete a persistent volume claim |
| `kubectl patch storageclass standard -p '{"metadata":{"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'` | Mark a `StorageClass` as default |

## Debugging
| Command | Description |
|---|---|
| `kubectl describe pod <name>` | Inspect events and conditions for failures |
| `kubectl get events` | List recent cluster events |
| `kubectl get events --sort-by='.lastTimestamp'` | Sort events chronologically |
| `kubectl get pods --sort-by='.status.startTime'` | Sort pods by start time |
| `kubectl top nodes` | Show CPU and memory usage per node |
| `kubectl top pods` | Show CPU and memory usage per pod |
| `kubectl top pods -A` | Show pod metrics across all namespaces |
| `kubectl auth can-i create deployments` | Check if current user can perform an action |
| `kubectl auth can-i --list` | List all permissions for the current user |
| `kubectl logs -l app=nginx` | Aggregate logs from pods matching a label |

## Workload YAML
| Command | Description |
|---|---|
| `apiVersion: apps/v1` | API group and version for a `Deployment` |
| `kind: Deployment` | Declares the resource type |
| `metadata.name: nginx` | Sets the resource name |
| `metadata.labels.app: nginx` | Label attached to the resource |
| `spec.replicas: 3` | Number of desired pod replicas |
| `spec.selector.matchLabels.app: nginx` | Selector matching pod template labels |
| `spec.template.spec.containers[].image: nginx:1.25` | Container image to deploy |
| `spec.template.spec.containers[].ports[].containerPort: 80` | Port exposed by the container |
| `spec.template.spec.containers[].imagePullPolicy: Always` | Force image pull on every start |
| `apiVersion: v1` | API version for a `Service` |
| `kind: Service` | Declares a `Service` resource |
| `spec.type: ClusterIP` | Service type (`ClusterIP`, `NodePort`, `LoadBalancer`) |
| `spec.selector.app: nginx` | Routes traffic to matching pods |
| `spec.ports[].port: 80` | Port the service exposes |
| `spec.ports[].targetPort: 80` | Port on the pod to forward to |
