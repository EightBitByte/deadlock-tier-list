
async function main() {
  const res = await fetch('http://localhost:3000/api/tierlist');
  const data = await res.json();
  if (data.tierList && data.tierList.length > 0) {
    console.log('First character:', JSON.stringify(data.tierList[0], null, 2));
    const charsWithImage = data.tierList.filter((c: any) => c.nameImage);
    console.log(`Characters with nameImage: ${charsWithImage.length}/${data.tierList.length}`);
  } else {
    console.log('No characters found in API response.');
  }
}

main().catch(console.error);
