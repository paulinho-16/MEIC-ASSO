# Group Making

## Content

* [Component Envisioning](#Component-Envisioning)
* [Data Model](#Data-Model)
* [Endpoints](#Endpoints)

<a name="Component-Envisioning"/>

## Component Envisioning

Groups and team work is an essencial part of a student's life. This includes both groups for class projects as well as study groups.

This component helps students on their academic daily life by proving an API that supports the creation, consulting and joining of groups making this process easier.

<a name="Endpoints"/>

## Endpoints

### GET `/groups`

Provides a list of groups. 
Supports pagination through "limit" and "offset" query parameters.

#### Parameters

- Query:
- - limit: Int?
- - offset: Int?
- - classId: Int? -> filter groups by class. 

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
        "autoaccept": "Bool",
        "classId": "Int"
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
    "autoaccept": "Bool",
    "classId": "Int"
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
        "autoaccept": "Bool",
        "classId": "Int"
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
Supports pagination through "limit" and "offset" query parameters.

#### Parameters

- Path: 
- - groupId: Int 

- Query:
- - limit: Int?
- - offset: Int?

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