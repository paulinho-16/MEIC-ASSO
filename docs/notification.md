# Notifications design and architecture

## Error Report

### Context
Our group agreed it was good practice to log errors generated upon answering request so it was easier to find problems in the code and the system overall.

### Maping
![something](https://prnt.sc/6_5qJtKckGws)

### Consequences

#### Pros
- Error logs allow the both the user and the system's maintainers to understand what the problem is and where it is being generated.
- Error logs can help to faster reach a solution for a certain problem.

#### Cons
- Due to the nature of our component the error logs aren't extremely deatailed so there may be some difficulties 








## Token

### Context
After a topic is created there is the need to identify its creator to prevent others from posting to it
### Maping
![something](https://prnt.sc/6_5qJtKckGws)

### Consequences

#### Pros
- The retrieval of the token can be optimized on the database to allow for fast queries and checks on the permissions of the token
- The implementation of the pattern is of low complexity

#### Cons
- If the token is stolen, it gives its holder total permissions on a topic 
- There is no way to check if the token holder trustworthy
