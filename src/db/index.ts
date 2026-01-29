import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export async function db() {
    const { env } = await getCloudflareContext();
    return drizzle(env.deadlock_tier_list_db, { schema });
}
