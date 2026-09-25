export type Featured = {
  slug: string;
  title: string;
  blurb: string;
  tags: string[];
  repo: string;
  demo?: string;
  cover?: string;
};
export type GhRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics?: string[];
  language: string | null;
  pushed_at: string;
  fork: boolean;
};

export async function fetchRepos(
  username: string,
  limit = 12
): Promise<Featured[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=${limit}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, 
      },
      next: { revalidate: 600 },
    }
  );
  console.log('Response status:', res.status);  // ← DEBUG

  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const data: GhRepo[] = await res.json();

  return data
    .filter((r) => !r.fork)
    .map<Featured>((r) => ({
      slug: r.name,
      title: r.name,
      blurb: r.description ?? "—",
      tags: r.topics?.length ? r.topics : r.language ? [r.language] : [],
      repo: r.html_url,
      demo: r.homepage || undefined,
      cover: PROJECT_COVERS[r.name.toLowerCase()] ?? `https://opengraph.githubassets.com/1/jan-elia-24/${r.name}`,
    }));
}

export async function fetchRepo(owner: string, name: string) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
    },
    next: { revalidate: 600 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub error ${res.status}`);
  return res.json();
}

const FEATURED = [
  "warehouse-order-system",
  "SveabyggpartnerAB",
  "washify",
  "portfolio",
];

export const PROJECT_COVERS: Record<string, string> = {
  sveabyggpartnerab: "/projects/sveabyggpartnerab.png",
  washify:           "/projects/washify.png",
  portfolio:         "/projects/portfolio1.png",
};

const headers: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

export async function fetchFeaturedRepos(owner: string): Promise<Featured[]> {
  const results = await Promise.all(
    FEATURED.map(async (name) => {
      const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
        headers,
        next: { revalidate: 600 },
      });
      if (!res.ok) return null;
      const r = await res.json();
      return {
        slug: r.name,
        title: r.name,
        blurb: r.description ?? "—",
        tags: r.topics?.length ? r.topics : r.language ? [r.language] : [],
        repo: r.html_url,
        demo: r.homepage || undefined,
        cover: PROJECT_COVERS[r.name.toLowerCase()] ?? `https://opengraph.githubassets.com/1/jan-elia-24/${r.name}`,
      } as Featured;
    })
  );
  return results.filter(Boolean) as Featured[];
}
