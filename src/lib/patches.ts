
export async function getPatches(): Promise<number[]> {
  try {
    const res = await fetch('https://assets.deadlock-api.com/v2/client-versions', {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return [];
    const data = await res.json();
    // Ensure they are numbers and sorted descending
    return data.map(Number).sort((a: number, b: number) => b - a);
  } catch (err) {
    console.error('Failed to fetch patches:', err);
    return [];
  }
}

export async function getLatestPatch(): Promise<string> {
  const patches = await getPatches();
  return patches.length > 0 ? patches[0].toString() : 'unknown';
}
