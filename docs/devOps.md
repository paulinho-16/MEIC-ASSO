# DevOps

## Features

- Docker Setup with container per service
- GitHub actions for deployment automatization
- Google Cloud VM setup
- SSH connection between git and GCP VM

## Design and Architecture

![](https://i.imgur.com/A54ggXQ.png)

The uni4all API was built using Docker, more specifically docker-compose, that let us build a container per service since each endpoint needs different services in order to work properly.

After setting up the container for each service a deployment automatization of those services was needed. For that, a GitHub Action workflow that runs on every push to the main branch was created in order to put the code into production (Google Cloud Virtual Machine).

The Workflow creates a login on DockerHub and with the docker context feature, the SSH keys and certificates are created in order to make an SSH Connection. After the connection is established we run the command **docker-compose build** that builds all docker containers on gcp VM.

## Design decisions

Since all of the patterns mapping are related and strictly connected, they are presented together on the above Design and Architecture diagram.

### **Service instance per container**

**Context**

Each service is deployed as a set of service instances for throughput and availability. So we used this pattern do define how are services packaged and deployed.

**Forces:**

- Each service consists of multiple service instances for throughput and availability
- Service must be independently deployable and scalable
- Service instances need to be isolated from one another
- Need to be able to quickly build and deploy a service
- Need to be able to constrain the resources (CPU and memory) consumed by a service
- Need to monitor the behaviour of each service instance
- Need for deployment to be reliable
- Deploy the application as cost-effectively as possible

Given the requirements specified above, there is a clear need to apply the **Service instance per container pattern** and package each service as a Docker container image and deploy each service instance as a container using docker-compose.

**Pros:**

- It is straightforward to scale up and down a service by changing the number of container instances.
- The container encapsulates the details of the technology used to build the service. All services are, for example started and stopped in exactly the same way.
- Each service instance is isolated
- A container imposes limits on the CPU and memory consumed by a service instance

### **Automate VM Deployment**

**Context**

This pattern encourages making automated deployments using tools and scripts. 

It's a good practice to automate software deployments. In its most simple form, this could mean simply writing a script to perform the deployments, or using a specific tool to do work for us.

In this case, we decided to create a GitHub action workflow that deploys the API on each push to the main branch, instead of manually making every deploy, as explained in the Architecture section.

**Pros**

- Increased deployment speed
- Greater reliability
- Built-in audit trails.

**Cons**

- Hard to monitorize whats happening on VM. e.g. to many failed deployments made VM run out of memory with unnecessary docker images.

### **Canary Testing**

**Context**

Deploying new and improved services at an ever-increasing rate to a large number of users that can only withstand a minimal amount of disruption during the process requires a lot of testing.

The goal is to employ a Canary Testing Approach through which a new service or service version is only rolled out to a small number of users initially. If the change does not prove to be disruptive, then roll out the service to the remaining user population.

**Problem**

This was not actually implemented. Since there are so many people developing different services on the project, having bugs in production makes it very difficult to discover the root of the problem: where and when it was made and by who.

**Possible solution**

This pattern could be implemented with a test production environment, so everyone could test the development code on a server before it went to the main production server to avoid bugs in production.

To minimize the problems caused by not applying this pattern a group (T2G4) was responsible for handling the production bugs.

Another improvement that could have been made was to apply a robust Pipeline for deployment based on pipeline pattern to **ensure that the application can be built, tested and deployed in an automated and standardized way.**
