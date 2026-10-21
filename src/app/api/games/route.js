import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ error: "Type at least 2 characters." }, { status: 400 });
  }

  try {
    const url = new URL("https://api.rawg.io/api/games");
    url.searchParams.set("key", process.env.RAWG_API_KEY);
    url.searchParams.set("search", q.trim());
    url.searchParams.set("page_size", "12");

    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: "Game database is not responding." }, { status: 502 });
    }

    const data = await res.json();
    const games = data.results.map((g) => ({
      id: g.id,
      name: g.name,
      image: g.background_image,
      released: g.released,
      rating: g.rating,
      genres: g.genres.map((x) => x.name),
      platforms: (g.platforms || []).map((p) => p.platform.name),
    }));

    return NextResponse.json({ games });
  } catch (err) {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}