-- Tony Stark insert SQL statement
INSERT INTO account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
  );
-- Tony Stark update SQL statement
UPDATE account
SET account_type = 'Admin '
WHERE account_firstname = 'Tony'
  AND account_id = 1;
-- delete Tony Stark SQL statement
DELETE FROM account
WHERE account_id = 1;
-- description update SQL statement
UPDATE inventory
SET inv_description = REPLACE(
    inv_description,
    'small interiors',
    'a huge interior'
  )
WHERE inv_id = 10;
-- select query using a JOIN SQL statement 
SELECT inventory.inv_make,
  inventory.inv_model,
  classification.classification_name
FROM inventory
  JOIN classification ON classification.classification_id = inventory.classification_id
WHERE classification.classification_id = 2;
-- inv_image and inv_thumbnail update query
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumnail = REPLACE(inv_thumnail, '/images/', '/images/vehicles/');