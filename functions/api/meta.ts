
import { D1Database,PagesFunction } from "@cloudflare/workers-types";

interface Env {
	DB: D1Database
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
	const users = await ctx.env.DB.prepare("SELECT * FROM users").all();
	return new Response(users);
};