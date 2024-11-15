

export async function onRequestGet(ctx) {
	const users = await ctx.env.DB.prepare("SELECT * FROM users").all();
	return new Response(users);
}