---
title: Docker
subtitle: Containers & Images
icon: Container
color: primary
tags: [containers, devops, ci]
---

## Images
| Command | Description |
|---|---|
| `docker build -t myapp:v1 .` | Build image from `Dockerfile` in current dir and tag it |
| `docker build -t app . -f Dockerfile.prod` | Build using a custom Dockerfile path |
| `docker build --no-cache -t app .` | Build image without using cache |
| `docker images` | List all local images |
| `docker image ls` | List local images (newer syntax) |
| `docker pull nginx:latest` | Pull an image from registry |
| `docker push myrepo/myapp:v1` | Push an image to registry |
| `docker tag myapp:latest myrepo/myapp:v1` | Create a new tag referencing existing image |
| `docker rmi <image>` | Remove an image by name or ID |
| `docker rmi -f <image>` | Force remove an image even if in use |
| `docker image prune` | Remove dangling (untagged) images |
| `docker save -o app.tar myapp:latest` | Save image to a tar archive |
| `docker load -i app.tar` | Load an image from a tar archive |

## Containers (`docker run`)
| Command | Description |
|---|---|
| `docker run -d nginx` | Run container in detached (background) mode |
| `docker run -p 8080:80 nginx` | Map host port 8080 to container port 80 |
| `docker run -P nginx` | Publish all exposed ports to random host ports |
| `docker run -v /host/data:/data nginx` | Bind mount a host path into container |
| `docker run -e MYSQL_ROOT_PASSWORD=secret mysql` | Set an environment variable |
| `docker run --name web nginx` | Assign a name to the container |
| `docker run --rm alpine echo hello` | Automatically remove container when it exits |
| `docker run -it ubuntu bash` | Interactive session with a TTY |
| `docker run --network mynet nginx` | Attach container to a specific network |
| `docker run --restart unless-stopped nginx` | Set restart policy |
| `docker run -m 512m --cpus 1.5 nginx` | Limit memory to 512 MB and CPU to 1.5 cores |
| `docker run -d --restart always --health-cmd "curl -f http://localhost/" app` | Run detached with auto-restart and health check |

## Lifecycle
| Command | Description |
|---|---|
| `docker ps` | List running containers |
| `docker ps -a` | List all containers including stopped |
| `docker ps -q` | Print only container IDs (useful for scripting) |
| `docker create nginx` | Create a container without starting it |
| `docker start <container>` | Start a stopped container |
| `docker stop <container>` | Gracefully stop a running container |
| `docker stop $(docker ps -q)` | Stop all running containers |
| `docker restart <container>` | Restart a running container |
| `docker rm <container>` | Remove a stopped container |
| `docker rm -f <container>` | Force-remove a running container |
| `docker rename old_name new_name` | Rename an existing container |
| `docker container prune` | Remove all stopped containers |

## Inspect & Logs
| Command | Description |
|---|---|
| `docker logs <container>` | View all container stdout/stderr logs |
| `docker logs -f <container>` | Follow log output live |
| `docker logs --tail 100 <container>` | Show last 100 lines of logs |
| `docker logs --since 1h <container>` | Show logs from the last hour |
| `docker logs -t <container>` | Prefix logs with timestamps |
| `docker inspect <container>` | Show low-level JSON metadata |
| `docker inspect --format '{{.NetworkSettings.IPAddress}}' <container>` | Extract container IP |
| `docker stats` | Stream live resource usage for all containers |
| `docker stats --no-stream` | Print resource usage once and exit |
| `docker top <container>` | List running processes inside a container |
| `docker port <container>` | Show port mappings for a container |
| `docker events` | Stream real-time Docker daemon events |

## Exec & Copy
| Command | Description |
|---|---|
| `docker exec -it <container> bash` | Open an interactive bash shell in running container |
| `docker exec <container> ls /app` | Run a command in a running container |
| `docker exec -u root <container> sh` | Run as a specific user (e.g., root) |
| `docker exec -e VAR=value <container> cmd` | Run with an extra env variable |
| `docker exec -d <container> cmd` | Run detached (background) inside container |
| `docker cp <container>:/path /host/path` | Copy a file from container to host |
| `docker cp /host/path <container>:/path` | Copy a file from host to container |
| `docker cp -a <container>:/path /host` | Copy preserving archive/UID-GID attributes |
| `docker attach <container>` | Attach local stdio to a running container |

## Volumes
| Command | Description |
|---|---|
| `docker volume create myvol` | Create a named volume |
| `docker volume ls` | List all named volumes |
| `docker volume rm myvol` | Remove a named volume |
| `docker volume inspect myvol` | Show volume metadata and mountpoint |
| `docker volume prune` | Remove all unused volumes |
| `-v myvol:/data` | Mount a named volume (short flag) |
| `-v /host/path:/data` | Bind mount a host directory |
| `-v /host/path:/data:ro` | Bind mount read-only |
| `--mount type=bind,source=/h,target=/d` | Explicit bind mount syntax |
| `--mount type=volume,source=myvol,target=/d` | Explicit named volume mount |
| `--mount type=tmpfs,target=/d` | Mount a tmpfs in memory |
| `--tmpfs /d` | Short flag for tmpfs mount |

## Networks
| Command | Description |
|---|---|
| `docker network ls` | List all networks |
| `docker network create mynet` | Create a user-defined bridge network |
| `docker network create --driver bridge mynet` | Create with explicit driver |
| `docker network create --subnet 10.0.0.0/24 mynet` | Create with custom subnet |
| `docker network rm mynet` | Remove a network |
| `docker network inspect mynet` | Show network details and containers |
| `docker network connect mynet <container>` | Attach a running container to a network |
| `docker network disconnect mynet <container>` | Disconnect a container from a network |
| `docker network prune` | Remove all unused networks |
| `--network host` | Use the host's network stack (no isolation) |
| `--network none` | Disable all networking |

## Compose
| Command | Description |
|---|---|
| `docker compose up -d` | Start all services in detached mode |
| `docker compose up --build` | Rebuild images then start services |
| `docker compose down` | Stop and remove containers and networks |
| `docker compose down -v` | Also remove named volumes |
| `docker compose logs -f` | Follow logs for all services |
| `docker compose logs web` | View logs for a single service |
| `docker compose build` | Build or rebuild service images |
| `docker compose ps` | List containers defined in compose file |
| `docker compose run web rake db:migrate` | Run a one-off command in a new container |
| `docker compose exec web bash` | Run interactive command in running service |
| `docker compose start` | Start existing containers without recreating |
| `docker compose stop` | Stop services without removing containers |
| `docker compose config` | Validate and print the merged compose file |

## System
| Command | Description |
|---|---|
| `docker system prune` | Remove unused containers, networks, and images |
| `docker system prune -a --volumes` | Remove all unused images and volumes too |
| `docker system df` | Show Docker disk usage breakdown |
| `docker system info` | Display system-wide information |
| `docker info` | Show Docker daemon info (alias for `system info`) |
| `docker version` | Print Docker client and server versions |
| `docker events` | Subscribe to real-time engine events |
| `docker context ls` | List configured CLI contexts |
| `docker context use <name>` | Switch to a different context |

## Dockerfile Instructions
| Command | Description |
|---|---|
| `FROM node:20` | Set the base image for subsequent instructions |
| `FROM node:20 AS builder` | Start a named build stage (multi-stage builds) |
| `RUN apt-get update && apt-get install -y curl` | Execute a command at build time, in a new layer |
| `COPY ./src /app/src` | Copy files from build context into the image |
| `ADD https://example.com/file.tar.gz /tmp/` | Copy with URL support and archive auto-extraction |
| `WORKDIR /app` | Set the working directory for `RUN`, `CMD`, etc. |
| `ENV NODE_ENV=production` | Set a persistent image environment variable |
| `ARG VERSION=1.0` | Define a build-time variable (used with `--build-arg`) |
| `EXPOSE 8080` | Document which port the container listens on |
| `CMD ["node", "server.js"]` | Set the default command (overridable at run) |
| `ENTRYPOINT ["node"]` | Set the fixed executable; `CMD` becomes args |
| `USER node` | Run subsequent instructions and container as this user |
| `HEALTHCHECK CMD curl -f http://localhost/ || exit 1` | Define how Docker checks container health |
| `COPY --from=builder /app/dist /dist` | Copy from another build stage |

## Registry & Login
| Command | Description |
|---|---|
| `docker login` | Log in to Docker Hub (prompts for credentials) |
| `docker login registry.example.com` | Log in to a custom registry |
| `docker login -u user -p password` | Non-interactive login (avoid in shared shells) |
| `docker logout` | Log out of the current registry |
| `docker logout registry.example.com` | Log out of a specific registry |
| `docker search nginx` | Search Docker Hub for images |
| `docker tag app:latest myuser/app:v1` | Tag image for pushing under a Hub namespace |
| `docker push myuser/app:v1` | Push image to Docker Hub |
| `docker pull myuser/app:v1` | Pull image from Docker Hub |
| `docker pull registry.example.com/app:v1` | Pull from a private registry |
| `registry.example.com/org/app:v1.2.3` | Full image reference: registry / repo : tag |
