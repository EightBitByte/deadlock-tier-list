
async function main() {
  const res = await fetch('https://assets.deadlock-api.com/v2/heroes');
  const heroes = await res.json();
  if (heroes.length > 0) {
    if (heroes[0].images) {
      console.log('Images object:', JSON.stringify(heroes[0].images, null, 2));
    } else {
      console.log('No images object found in hero root.');
      // Check if it's nested elsewhere or if I missed something obvious
      console.log('Keys:', Object.keys(heroes[0]));
    }
  }
}

main().catch(console.error);
