-- Service Points Shared via Kafka to this service

CREATE TABLE shared_service_point
(
    sloid         varchar(500) PRIMARY KEY,
    service_point varchar(5000) NOT NULL
);