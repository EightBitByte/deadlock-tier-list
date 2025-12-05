import fs from 'fs';
import path from 'path';

// Mapping overrides if standard logic fails
const FORCE_VO_KEY: Record<string, string> = {
  // 'TargetName': 'vo_key'
};

async function main() {
  console.log('Fetching heroes...');
  const heroesRes = await fetch('https://assets.deadlock-api.com/v2/heroes');
  const heroes: any[] = await heroesRes.json();

  console.log('Fetching sounds (this may take a while)...');
  const soundsRes = await fetch('https://assets.deadlock-api.com/v1/sounds');
  const sounds: any = await soundsRes.json();

  const soundMap: Record<string, { happy: string[], sad: string[] }> = {};

  const playableHeroes = heroes.filter(h => h.player_selectable && !h.disabled);

  for (const hero of playableHeroes) {
    // e.g. hero_inferno -> inferno
    const internalName = hero.class_name.replace('hero_', '');
    // Check if this key exists in sounds.vo
    const voData = sounds.vo[internalName];

    if (!voData) {
      console.warn(`No VO data found for ${hero.name} (key: ${internalName})`);
      continue;
    }

    const keys = Object.keys(voData);
    // We look for patterns. 
    // Happy: 'happy', 'win', 'laugh', 'joy'
    // Sad: 'sad', 'pain', 'death', 'lose'
    // Prioritize specific 'happy'/'sad' keys if they exist.

    // Filter keys
    // Forbidden words to exclude entirely
    const forbidden = ['win_early', 'win_late', 'lose_early', 'lose_late', 'close_call', 'kill', 'death', 'match_start', 'respawn'];

    const isValid = (k: string) => !forbidden.some(f => k.toLowerCase().includes(f));

    const happyKeys = keys.filter(k => {
      const lower = k.toLowerCase();
      return isValid(k) && (lower.includes('happy') || lower.includes('select')) && !lower.includes('unselect');
    });

    const sadKeys = keys.filter(k => {
      const lower = k.toLowerCase();
      return isValid(k) && (lower.includes('sad') || lower.includes('unselect'));
    });

    // We no longer fallback to win/lose/death based on user request.

    // Map keys to URLs
    const validHappy = happyKeys.map(k => voData[k]).filter(Boolean);
    const validSad = sadKeys.map(k => voData[k]).filter(Boolean);

    if (validHappy.length > 0 || validSad.length > 0) {
      soundMap[hero.name] = {
        happy: validHappy,
        sad: validSad
      };
      console.log(`Mapped ${hero.name}: ${validHappy.length} happy, ${validSad.length} sad`);
    } else {
      console.warn(`No suitable sounds found for ${hero.name}`);
    }
  }

  const outputPath = path.join(process.cwd(), 'src', 'lib', 'sound-map.json');
  fs.writeFileSync(outputPath, JSON.stringify(soundMap, null, 2));
  console.log(`Sound map written to ${outputPath}`);
}

main().catch(console.error);
