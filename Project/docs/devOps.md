# DevOps

## Features

- Docker Setup with container per service
- Google Cloud Platform and Virtual Machine setup
- GitHub actions for deployment automatization
- SSH connection between git and GCP’s VM

## Design and Architecture

![](https://i.imgur.com/A54ggXQ.png)

The Uni4all API was built using Docker, more specifically docker-compose, that let us build a container per service since each endpoint needs different services in order to work properly.

After setting up the container for each service a deployment automatization for those services was required. In order to accomplish that, a GitHub Action workflow that runs on every push to the main branch was created, which uses the code present in the repository to build the containers, send them to the Google Cloud Platform’s Virtual Machine and have them run in production.

With this workflow, a temporary virtual machine provided by Git with access to the repository’s code logs in on DockerHub using the Uni4All credentials (created for development authentication purposes) and acesses the GitHub Secrets to obtain the necessary SSH keys and certificates that will be used to connect to the Virtual Machine using the ***docker context*** feature. After the connection is established the temporary VM runs the command ***docker-compose up —build*** that builds all docker containers and sends them to the GCP VM where they will be run.

## Design decisions

Since all of the pattern’s mappings are related and strictly connected, they are presented together on the above Design and Architecture diagram.

### **Service instance per container**

Pattern Type: Interface Partitioning

**Context**

Each service is deployed as a set of service instances for throughput and availability. So we used this pattern to define how services are packaged and deployed in Uni4all API.

**Forces:**

- Each service consists of multiple service instances for throughput and availability
- Services must be independently deployable and scalable
- Need to be able to quickly build and deploy a service
- Need to be able to constrain the resources (CPU and memory) consumed by a service
- Need to monitor the behaviour of each service instance
- Need for deployment to be reliable
- Deploy the application as cost-effectively as possible

Given the requirements specified above, there is a clear need to apply the **Service instance per container pattern** and package each service as a Docker container image and deploy each service as a container instance (via docker-compose) using a temporary Git VM to save resources, as it is explained in the pattern below.

**Pros**

- It is straightforward to scale up and down a service by changing the number of container instances.
- The container encapsulates the details of the technology used to build the service. All services are, for example started and stopped in exactly the same way.
- Each service is isolated
- A container imposes limits on the CPU and memory consumed by a service instance

### **Automate VM Deployment**

**Context**

This pattern encourages making automated deployments using tools and scripts. 

It's good practice to automate software deployments. In its most simple form, this could mean simply writing a script to perform the deployments, or using a specific tool to do the work for us.

In this case, we decided to create a **GitHub Actions** workflow that uses a temporary Virtual Machine provided by Git to deploy the API on each push to the main branch, instead of manually making every deployment, as explained in the Architecture section.

**Pros**

- Increased deployment speed
- Greater reliability
- Built-in audit trails.

**Cons**

- Hard to monitorize whats happening on the VM. E.g. too many failed deployments made the production VM run out of memory with unnecessary docker images.

### **Canary Testing**

**Context**

Deploying new and improved services at an ever-increasing rate to a large number of users that can only withstand a minimal amount of disruption during the process requires a lot of testing.

The goal is to employ a Canary Testing Approach through which a new service or service version is only rolled out to a small number of users initially. If the change does not prove to be disruptive, then roll out the service to the remaining user population.

**Problem**

Even though this was discussed, this pattern was not actually implemented, due to both the complexity of implementation as well as the requirement of a whole different setup in the Google Cloud Platform (which would bring in monetary costs). 

Since there are so many people developing different services on the project, having bugs in production makes it very difficult to discover the root of the problem: where and when it was made and by who.

**Possible solution**

This pattern could be implemented with a test production environment - a Google Cloud Platform Virtual Machine similar to the one we use for production -, so everyone could test the development code on a server that works just like the production machine, before deploying it to the main server, in order to minimize bugs in production.

To minimize the problems caused by not applying this pattern one of the groups - T2G4 - and later, a “horizontal manager” - João Araújo - were responsible for handling most of the production bugs.

Another improvement that could have been made was to apply a robust Pipeline for deployment based on pipeline pattern to **ensure that the application can be built, tested and deployed in an automated and standardized way.**
