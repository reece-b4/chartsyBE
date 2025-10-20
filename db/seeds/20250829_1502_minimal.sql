-- Create an example collection
INSERT INTO collections (collection_name, icon)
VALUES ('Getting Started', '📁')
ON CONFLICT DO NOTHING;

-- Create an example item in that collection
INSERT INTO items (collection_id, item_name, icon)
SELECT c.id, 'First item', '📝'
FROM collections c
WHERE c.collection_name = 'Getting Started'
-- make idempotent
ON CONFLICT DO NOTHING;

-- Add a text data entry for that item
INSERT INTO item_data (item_id, data_type, data_body)
SELECT i.id, 'text', 'Hello from your new schema!'
FROM items i
JOIN collections c ON c.id = i.collection_id
WHERE c.collection_name = 'Getting Started'
  AND i.item_name = 'First item'
ON CONFLICT DO NOTHING;