ALTER TABLE traffic_point_element_version
    add COLUMN status VARCHAR(50) NOT NULL DEFAULT 'VALIDATED';
