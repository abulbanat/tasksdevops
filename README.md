<<<<<<< HEAD
# tasksdevops
=======
# CI/CD + Kubernetes + Logging (Loki + Grafana)

Этот проект содержит готовую основу для задания:
- автоматическая сборка Docker-образа и push в Docker Hub через GitHub Actions;
- деплой приложения в Kubernetes;
- сбор логов приложения через Promtail в Loki и просмотр в Grafana.

## 1) Подготовка репозитория и Docker Hub

1. Создай новый репозиторий на GitHub, например `otrabotka-app`.
2. Залей этот проект в ветку `main`.
3. Создай репозиторий образа в Docker Hub (например `YOUR_DOCKERHUB_USERNAME/otrabotka-app`).
4. На GitHub открой `Settings -> Secrets and variables -> Actions` и добавь:
   - `DOCKERHUB_USERNAME` = логин Docker Hub
   - `DOCKERHUB_TOKEN` = Docker Hub Access Token

## 2) CI/CD (GitHub Actions)

Workflow: `.github/workflows/ci-cd.yml`

Триггер:
- каждый `push` в `main`

Что делает pipeline:
- checkout кода;
- логин в Docker Hub;
- build Docker image;
- push тегов `latest` и `sha-<commit>` в Docker Hub.

## 3) Обновление образа для Kubernetes

Открой файл `k8s/app/deployment.yaml` и замени:
- `YOUR_DOCKERHUB_USERNAME/otrabotka-app:latest`

на свой образ из Docker Hub.

## 4) Деплой приложения в Kubernetes (Minikube)

```bash
minikube start
kubectl apply -f k8s/app/deployment.yaml
kubectl apply -f k8s/app/service.yaml
kubectl rollout status deployment/otrabotka-app
kubectl get pods -o wide
kubectl get svc otrabotka-app-service
```

Проверка приложения:

```bash
minikube service otrabotka-app-service --url
# Открой URL и проверь JSON ответ
```

## 5) Установка и настройка логирования (Loki + Grafana + Promtail)

```bash
kubectl apply -f k8s/logging/namespace.yaml
kubectl apply -f k8s/logging/loki-config.yaml
kubectl apply -f k8s/logging/loki-deployment.yaml
kubectl apply -f k8s/logging/grafana-datasource.yaml
kubectl apply -f k8s/logging/grafana-deployment.yaml
kubectl apply -f k8s/logging/promtail-rbac.yaml
kubectl apply -f k8s/logging/promtail-config.yaml
kubectl apply -f k8s/logging/promtail-daemonset.yaml
```

Проверки:

```bash
kubectl get pods -n logging
kubectl get svc -n logging
```

Открой Grafana:

```bash
minikube service grafana -n logging --url
```

Логин по умолчанию:
- user: `admin`
- password: `admin123`

В Grafana:
1. `Explore`
2. datasource `Loki`
3. запрос: `{app="otrabotka-app"}` или `{namespace="default"}`
4. убедись, что видны логи приложения.

## 6) Ресурсы CPU/Memory

Лимиты и реквесты заданы в:
- `k8s/app/deployment.yaml`
- `k8s/logging/loki-deployment.yaml`
- `k8s/logging/grafana-deployment.yaml`
- `k8s/logging/promtail-daemonset.yaml`

## 7) Что приложить в сдаче

1. GitHub repository link (с workflow):
   - `https://github.com/<username>/<repo>`
2. Docker Hub image link:
   - `https://hub.docker.com/r/<dockerhub_username>/otrabotka-app`
3. YAML configuration files:
   - папка `k8s/` и `.github/workflows/ci-cd.yml`
4. Screenshot успешного GitHub Actions pipeline (вкладка Actions).
5. Screenshot `kubectl get pods` (приложение и logging namespace).
6. Screenshot логов в Grafana Explore (datasource Loki).

## 8) Краткое описание (5–7 предложений)

CI/CD реализован через GitHub Actions и запускается автоматически при каждом push в ветку main. Workflow собирает Docker-образ приложения и публикует его в Docker Hub с тегами latest и commit SHA, что упрощает трассировку версий. Kubernetes-деплой оформлен через Deployment и Service манифесты, где заданы requests и limits для CPU и памяти для стабильной работы под нагрузкой. После публикации образа deployment использует актуальный тег из Docker Hub, поэтому обновление происходит стандартным rolling update. Для централизованного логирования развернут стек Loki + Promtail + Grafana в отдельном namespace logging. Promtail собирает логи контейнеров Kubernetes и отправляет их в Loki, а Grafana подключена к Loki как datasource для поиска и анализа логов. В результате весь контур от сборки до наблюдаемости работает автоматически и воспроизводимо.
>>>>>>> bab2b26 (Initial commit)
