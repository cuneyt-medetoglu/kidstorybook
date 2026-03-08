-- Replace kidstorybook S3 hostname with herokidstory in all stored URLs.
-- Run once after S3 sync: psql -h ... -U herokidstory -d herokidstory -f scripts/update-s3-urls-to-herokidstory.sql

BEGIN;

-- 1. books.cover_image_url
UPDATE books
SET cover_image_url = REPLACE(cover_image_url, 'kidstorybook.s3.eu-central-1.amazonaws.com', 'herokidstory.s3.eu-central-1.amazonaws.com')
WHERE cover_image_url IS NOT NULL AND cover_image_url LIKE '%kidstorybook.s3.%';

-- 2. characters.reference_photo_url
UPDATE characters
SET reference_photo_url = REPLACE(reference_photo_url, 'kidstorybook.s3.eu-central-1.amazonaws.com', 'herokidstory.s3.eu-central-1.amazonaws.com')
WHERE reference_photo_url IS NOT NULL AND reference_photo_url LIKE '%kidstorybook.s3.%';

-- 3. books.story_data (JSONB: pages[].imageUrl etc.)
UPDATE books
SET story_data = regexp_replace(story_data::text, 'kidstorybook\.s3\.eu-central-1\.amazonaws\.com', 'herokidstory.s3.eu-central-1.amazonaws.com', 'g')::jsonb
WHERE story_data IS NOT NULL AND story_data::text LIKE '%kidstorybook.s3.%';

-- 4. image_edit_history
UPDATE image_edit_history
SET original_image_url = REPLACE(original_image_url, 'kidstorybook.s3.eu-central-1.amazonaws.com', 'herokidstory.s3.eu-central-1.amazonaws.com')
WHERE original_image_url IS NOT NULL AND original_image_url LIKE '%kidstorybook.s3.%';

UPDATE image_edit_history
SET edited_image_url = REPLACE(edited_image_url, 'kidstorybook.s3.eu-central-1.amazonaws.com', 'herokidstory.s3.eu-central-1.amazonaws.com')
WHERE edited_image_url LIKE '%kidstorybook.s3.%';

UPDATE image_edit_history
SET mask_image_url = REPLACE(mask_image_url, 'kidstorybook.s3.eu-central-1.amazonaws.com', 'herokidstory.s3.eu-central-1.amazonaws.com')
WHERE mask_image_url IS NOT NULL AND mask_image_url LIKE '%kidstorybook.s3.%';

COMMIT;
