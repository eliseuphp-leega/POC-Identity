const { Storage } = require('@google-cloud/storage');

async function listObjects() {
  // Initialize a GCS client.
  const storage = new Storage();

  // Specify the GCS bucket name.
  const bucketName = 'infra-agnaldo';

  // Lists objects in the bucket.
  const [objects] = await storage.bucket(bucketName).getFiles();

  console.log('Objects in bucket:');
  objects.forEach((object) => {
    console.log(object.name);
  });
}

listObjects().catch(console.error);
