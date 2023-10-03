# Guia da PoC para Listar Objetos em um Bucket do GCS e Implantação no GKE

Este guia irá orientá-lo por meio dos passos necessários para criar uma Proof of Concept (PoC) que lista objetos dentro de um bucket do Google Cloud Storage (GCS) e, em seguida, implantá-la no Google Kubernetes Engine (GKE).

## Pré-requisitos

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) instalado e configurado.
- Conta do Google Cloud com um projeto criado.
- Acesso ao Console do Google Cloud para criar recursos.
- [Node.js](https://nodejs.org/) instalado localmente.
- [Docker](https://www.docker.com/) instalado localmente.
- Uma conta com permissões para criar e configurar um cluster GKE.

## Passo 1: Criar um Bucket no GCS

1. Acesse o [Console do Google Cloud](https://console.cloud.google.com/).

2. Crie um novo projeto ou selecione um projeto existente.

3. No menu de navegação, vá para **Storage > Storage**.

4. Clique em **Criar bucket**.

5. Siga as instruções para configurar o bucket, definindo um nome único e configurando as opções necessárias.

## Passo 2: Configurar o Ambiente Local

1. Instale a biblioteca `@google-cloud/storage` para Node.js:

   ```bash
   npm install @google-cloud/storage
   ```

2. Autentique-se com o Google Cloud SDK:

   ```bash
   gcloud auth login
   ```

3. Configure o Docker para usar o Container Registry do Google Cloud:

   ```bash
   gcloud auth configure-docker
   ```

## Passo 3: Criar o Script Node.js

Crie um arquivo chamado `list-gcs-objects.js` com o seguinte conteúdo:

```javascript
const { Storage } = require('@google-cloud/storage');

async function listObjects() {
  const storage = new Storage();
  const bucketName = 'NOME_DO_SEU_BUCKET';

  const [objects] = await storage.bucket(bucketName).getFiles();

  console.log('Objetos no bucket:');
  objects.forEach((object) => {
    console.log(object.name);
  });
}

listObjects().catch(console.error);
```

Substitua `NOME_DO_SEU_BUCKET` pelo nome do bucket criado no Passo 1.

## Passo 4: Criar o Dockerfile

Crie um arquivo chamado `Dockerfile` com o seguinte conteúdo:

```Dockerfile
# Use a imagem oficial do Node.js como imagem pai
FROM node:18

# Configure o diretório de trabalho no contêiner
WORKDIR /app

# Copie os arquivos package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o script Node.js local para o contêiner
COPY list-gcs-objects.js ./

# Execute o script Node.js quando o contêiner iniciar
CMD ["node", "list-gcs-objects.js"]
```

## Passo 5: Criar o Cluster GKE

1. Acesse o [Console do Google Cloud](https://console.cloud.google.com/).

2. No menu de navegação, vá para **Kubernetes Engine > Clusters**.

3. Clique em **Criar cluster** e siga as instruções para configurar o cluster GKE. Certifique-se de que o cluster tenha permissões adequadas para acessar o GCS e lembre de ativar a opção **Workload Identity**.

## Passo 6: Configuração do Workload Identity

Acesse e siga a documentação do google sobre como configurar uma aplicação para que essa use o Workload Identity.

[Configure applications to use Workload Identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity#authenticating_to)

## Passo 7: Criar e Implantar os Recursos do Kubernetes

Crie um arquivo YAML para criar um Deployment no Kubernetes. Certifique-se de inserir os dados usados na configuração do Workload Identity para que a aplicação possa herdar a autenticação.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: list-objects-app
  namespace: namespace-name
spec:
  replicas: 1
  selector:
    matchLabels:
      app: list-objects
  template:
    metadata:
      labels:
        app: list-objects
    spec:
      serviceAccountName: sa-name
      nodeSelector:
        iam.gke.io/gke-metadata-server-enabled: "true"
      containers:
        - name: list-objects
          image: gcr.io/SEU-PROJETO/list-objects-app:SEU-TAG
```

Implante os recursos no Kubernetes usando o comando `kubectl apply -f seu-arquivo.yaml`.

## Passo 8: Acessar os Logs da Aplicação

Para acessar os logs da aplicação em execução no GKE, use o seguinte comando:

```bash
kubectl logs NOME_DO_POD
```

Substitua `NOME_DO_POD` pelo nome do pod em que a aplicação está em execução.

Agora você criou uma PoC que lista objetos em um bucket do GCS e a implantou no GKE. Certifique-se de que as permissões e configurações de autenticação estejam corretas para garantir o funcionamento correto da aplicação no cluster GKE.