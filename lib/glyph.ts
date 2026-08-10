/**
 * Identity glyphs.
 *
 * The lab has no portrait set we can use, and stock avatars would be a
 * lie. So each person is drawn as their own small landmark graph —
 * derived deterministically from their name, the same way the hero face
 * is a graph. It is stable across reloads, unique per person, and it is
 * honestly a generated mark rather than a photograph of nobody.
 */

export type Glyph = {
  nodes: { x: number; y: number; r: number }[];
  edges: [number, number][];
  hue: number;
};

/** FNV-1a. Small, stable, and good enough to decorrelate similar names. */
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function glyphFor(name: string): Glyph {
  let s = hash(name);
  const next = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };

  const count = 5 + Math.floor(next() * 3); // 5–7 nodes
  const nodes: Glyph["nodes"] = [];
  const spin = next() * Math.PI * 2;

  // Rounded before it reaches the DOM: Node and the browser disagree on
  // the last digit of a float's string form, and React counts that as a
  // hydration mismatch.
  const fix = (v: number) => Math.round(v * 1e4) / 1e4;

  for (let i = 0; i < count; i++) {
    // Spread around a ring with enough jitter that no two read alike,
    // but never so much that a node lands on the edge of the frame.
    const angle = spin + (i / count) * Math.PI * 2 + (next() - 0.5) * 0.7;
    const radius = 0.3 + next() * 0.34;
    nodes.push({
      x: fix(0.5 + Math.cos(angle) * radius),
      y: fix(0.5 + Math.sin(angle) * radius),
      r: fix(0.028 + next() * 0.038),
    });
  }

  // Chain the ring, then add one or two chords across it.
  const edges: [number, number][] = [];
  for (let i = 0; i < count; i++) edges.push([i, (i + 1) % count]);
  const chords = 1 + Math.floor(next() * 2);
  for (let i = 0; i < chords; i++) {
    const a = Math.floor(next() * count);
    const b = (a + 2 + Math.floor(next() * (count - 3))) % count;
    if (a !== b) edges.push([a, b]);
  }

  // Constrained to the site's own arc: blue through cyan into violet.
  const hue = Math.round((196 + next() * 68) * 10) / 10;
  return { nodes, edges, hue };
}
