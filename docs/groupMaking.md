# Group Making

## Content

## Component Envisioning

Groups and team work is an essencial part of a student's life. This includes both groups for class projects as study groups as well. 

This component provides an API that supports the creation, consulting and the joining of groups helping students on their academic daily life. 


## Endpoints

### GET `/groups`

Provides a list of groups. 

#### Parameters
None yet.

#### Responses

Returns a list of groups if they match filters. 

- 200 if successful, including a body of type: 

```json
[
    {
        "id": "Int",
        "typename": "String",
        "title": "String",
        "description": "String",
        "mlimit": "Int",
        "autoaccept": "Bool"
    }
]
```

- 500 if not successful.

### GET `/groups/{groupId}`

Provides a single group.

#### Parameters

- Path: 
- - groupId: Int 

#### Responses

Returns a single group that matches the groupId specified. 

- 200 if successful, including a body of type: 

```json
{
    "id": "Int",
    "typename": "String",
    "title": "String",
    "description": "String",
    "mlimit": "Int",
    "autoaccept": "Bool"
}
```

- 400 if parameters are not valid.

- 500 if not successful. 

### POST `/groups`

Create a group.

#### Parameters

- Body: 
```json
[
    {
        "id": "Int",
        "typename": "String",
        "title": "String",
        "description": "String",
        "mlimit": "Int",
        "autoaccept": "Bool"
    }
]
```

#### Responses

Returns a single group that matches the groupId specified. 

- 200 if group was created with success.

- 400 if request body is not valid. 

- 500 if not successful. 


### DELETE `/groups/{groupId}`

Delete a group.

#### Parameters

- Path: 
- - groupId: Int 

#### Responses

Returns a single group that matches the groupId specified. 

- 200 if group was deleted with success.

- 400 if parameters are not valid. 

- 500 if not successful. 


### GET `/groups/{groupId}/members`

Provides a list with the members of a group.

#### Parameters

- Path: 
- - groupId: Int 

#### Responses

Returns a single group that matches the groupId specified. 

- 200 if success, including the response body: 

```json
[
    {
        "id": "Int",
        "groupid": "Int",
        "studentid": "Int",
        "isadmin": "Bool",
        "isaccepted": "Bool"
    }
]
```

- 400 if parameters are not valid. 

- 500 if not successful. 


### GET `/groups/{groupId}/members/{memberId}`

Provides a specific member of a group.

#### Parameters

- Path: 
- - groupId: Int 
- - memberId: Int

#### Responses

Returns a single member that matches the groupId and memberId specified. 

- 200 if success, including the response body: 

```json
{
    "id": "Int",
    "groupid": "Int",
    "studentid": "Int",
    "isadmin": "Bool",
    "isaccepted": "Bool"
}
```

- 400 if parameters are not valid. 

- 500 if not successful. 


### POST `/groups/{groupId}/members/{memberId}`

Supports the joinning of a student to a group.

#### Parameters

- Path: 
- - groupId: Int 
- - memberId: Int

#### Responses

- 204 if joining was sucessful. 

- 400 if parameters are not valid. 

- 500 if not successful. 


### DELETE `/groups/{groupId}/members/{memberId}`

Supports the quit operation of a student from a group.

#### Parameters

- Path: 
- - groupId: Int 
- - memberId: Int

#### Responses

- 204 if quit was sucessful. 

- 400 if parameters are not valid. 

- 500 if not successful. 