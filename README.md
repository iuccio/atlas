# ATLAS Backend

## Big Picture
<pre>

+--------------+                        +-------+
| Lidi-Backend | ---------------------> | Kafka |
+--------------+                        +-------+
                                            ^
                                            |
                                    +---------------+          +------------------------+               +----------------+
                                    | ATLAS-Backend |<---------| API-Management Gateway |<--------------| ATLAS-Frontend |
                                    | └LiDi-Modul   |          | CloudWAF Container     |               +----------------+                  
                                    +---------------+          +------------------------+               
                                            |
                                            |
                                            v
                                      +------------+
                                      | PostgreSQL |
                                      +------------+
</pre>
## Development
### PostgreSQL Docker
Run PostgreSQL in docker:
~~~
    docker-compose up
~~~

## Links
* Developer Portal Prod:
* Developer Portal Int:
* Openshift Prod:
* Openshift Int:
* Openshift Test:
* Openshift Dev: 
* Jenkins:
* Infrastruktur: https://confluence.sbb.ch/display/ATLAS/%5BATLAS%5D+7.1.+Infrastruktur+Ebene+1


## Decision History
07.2021: Spring-Boot Initializer used for template