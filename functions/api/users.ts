import { D1Database,PagesFunction,Env } from "@cloudflare/workers-types";


interface Env {
	DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
	const users = await context.env.DB.prepare("SELECT * FROM users").all();
	return new Response(JSON.stringify(users), {
		headers: { "content-type": "application/json" },
	});
};