/**
 * The face in the hero is not a model. It is a landmark graph — the same
 * kind of structure a biometric system actually reduces a face to before
 * it decides who someone is.
 *
 * Each feature (jaw, brows, eye rings, nose ridge, lips) is authored as a
 * short list of control points, smoothed with Catmull-Rom, then resampled
 * at even arc length so node spacing is uniform no matter how the curve
 * was drawn. Depth comes from an ellipsoid front surface plus per-feature
 * offsets, so the nose sits proud and the eyes sit recessed.
 *
 * Every node carries three positions — scattered, graph, and surface —
 * and the shader interpolates between them. That is the perception
 * pipeline read left to right: raw samples, extracted landmarks,
 * reconstructed surface.
 */

export type FaceGraph = {
  /** Node count. */
  count: number;
  /** Landmark position — the identity. */
  graph: Float32Array;
  /** Scattered position — unstructured sensor samples. */
  scatter: Float32Array;
  /** Relaxed onto the head surface — the reconstruction. */
  surface: Float32Array;
  /** 0 contour, 0.5 detail, 1 eye. Drives colour and glow in the shader. */
  role: Float32Array;
  /** Per-node random, for staggering everything that should not be in step. */
  seed: Float32Array;
  /** Index pairs for the edge geometry. */
  edges: Uint16Array;
  edgeCount: number;
};

type Pt = [number, number];

/** Feature curves, authored on the left half and mirrored where noted. */
type Curve = {
  id: string;
  pts: Pt[];
  /** Nodes to place along it. */
  n: number;
  closed?: boolean;
  mirror?: boolean;
  /** Pushed forward (+) or recessed (−) off the base face surface. */
  z?: number;
  role?: number;
};

// Head occupies roughly x ∈ [-0.78, 0.78], y ∈ [-1.35, 1.15].
const CURVES: Curve[] = [
  {
    id: "jaw",
    n: 26,
    mirror: true,
    role: 0,
    pts: [
      [-0.72, 0.52],
      [-0.75, 0.24],
      [-0.72, -0.02],
      [-0.63, -0.29],
      [-0.48, -0.55],
      [-0.28, -0.76],
      [-0.02, -0.86],
    ],
  },
  {
    id: "cranium",
    n: 22,
    mirror: true,
    role: 0,
    pts: [
      [-0.72, 0.52],
      [-0.68, 0.78],
      [-0.52, 1.0],
      [-0.28, 1.12],
      [-0.02, 1.15],
    ],
  },
  {
    id: "brow",
    n: 12,
    mirror: true,
    role: 0.5,
    z: 0.03,
    pts: [
      [-0.6, 0.33],
      [-0.46, 0.44],
      [-0.28, 0.46],
      [-0.14, 0.4],
    ],
  },
  {
    id: "eye",
    n: 20,
    mirror: true,
    closed: true,
    role: 1,
    z: -0.05,
    pts: eyeRing(-0.36, 0.23, 0.2, 0.088),
  },
  {
    id: "iris",
    n: 12,
    mirror: true,
    closed: true,
    role: 1,
    z: -0.02,
    pts: eyeRing(-0.36, 0.23, 0.07, 0.07),
  },
  {
    id: "nose-ridge",
    n: 12,
    role: 0.5,
    z: 0.1,
    pts: [
      [0, 0.34],
      [0, 0.16],
      [-0.01, -0.02],
      [0, -0.13],
    ],
  },
  {
    id: "nose-base",
    n: 12,
    mirror: true,
    role: 0.5,
    z: 0.12,
    pts: [
      [-0.17, -0.14],
      [-0.12, -0.21],
      [-0.05, -0.23],
      [-0.005, -0.19],
    ],
  },
  {
    id: "lip-upper",
    n: 12,
    mirror: true,
    role: 0.5,
    z: 0.04,
    pts: [
      [-0.23, -0.44],
      [-0.13, -0.39],
      [-0.05, -0.42],
      [-0.005, -0.4],
    ],
  },
  {
    id: "lip-lower",
    n: 12,
    mirror: true,
    role: 0.5,
    z: 0.03,
    pts: [
      [-0.23, -0.44],
      [-0.14, -0.53],
      [-0.06, -0.56],
      [-0.005, -0.56],
    ],
  },
  {
    id: "cheek",
    n: 14,
    mirror: true,
    role: 0,
    z: -0.02,
    // Held well inside the jaw line. Run them close and parallel and the
    // cross-links between the two read as hatching rather than a network.
    pts: [
      [-0.55, 0.03],
      [-0.47, -0.15],
      [-0.37, -0.31],
      [-0.26, -0.42],
    ],
  },
  {
    id: "ear",
    n: 10,
    mirror: true,
    role: 0,
    z: -0.3,
    pts: [
      [-0.74, 0.3],
      [-0.82, 0.16],
      [-0.8, -0.02],
      [-0.72, -0.1],
    ],
  },
  {
    id: "neck",
    n: 12,
    mirror: true,
    role: 0,
    z: -0.1,
    pts: [
      [-0.26, -0.84],
      [-0.3, -1.06],
      [-0.34, -1.3],
    ],
  },
];

/** Almond-ish ring: an ellipse with the lids pinched toward the corners. */
function eyeRing(cx: number, cy: number, a: number, b: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < 16; i++) {
    const t = (i / 16) * Math.PI * 2;
    const pinch = 0.62 + 0.38 * Math.abs(Math.sin(t));
    pts.push([cx + a * Math.cos(t), cy + b * Math.sin(t) * pinch]);
  }
  return pts;
}

/** Front surface of the head. Zero at the silhouette, deepest mid-face. */
function faceDepth(x: number, y: number) {
  const nx = x / 0.98;
  const ny = (y - 0.05) / 1.42;
  const r = 1 - nx * nx - ny * ny;
  return r <= 0 ? 0 : 0.66 * Math.sqrt(r);
}

function catmull(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const t2 = t * t;
  const t3 = t2 * t;
  const f = (a: number, b: number, c: number, d: number) =>
    0.5 *
    (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
  return [f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])];
}

/** Smooth a control polygon, then resample it at even arc length. */
function resample(pts: Pt[], n: number, closed: boolean): Pt[] {
  const src = pts.slice();
  const segs = closed ? src.length : src.length - 1;
  const dense: Pt[] = [];
  const STEPS = 24;

  for (let i = 0; i < segs; i++) {
    const p0 = src[(i - 1 + src.length) % src.length];
    const p1 = src[i % src.length];
    const p2 = src[(i + 1) % src.length];
    const p3 = src[(i + 2) % src.length];
    const a = closed ? p0 : src[Math.max(0, i - 1)];
    const d = closed ? p3 : src[Math.min(src.length - 1, i + 2)];
    for (let s = 0; s < STEPS; s++) dense.push(catmull(a, p1, p2, d, s / STEPS));
  }
  if (!closed) dense.push(src[src.length - 1]);

  // Cumulative arc length, then pick n points evenly along it.
  const acc = [0];
  for (let i = 1; i < dense.length; i++) {
    const dx = dense[i][0] - dense[i - 1][0];
    const dy = dense[i][1] - dense[i - 1][1];
    acc.push(acc[i - 1] + Math.hypot(dx, dy));
  }
  const total = acc[acc.length - 1] || 1;
  const out: Pt[] = [];
  const last = closed ? n : n - 1;
  for (let i = 0; i < n; i++) {
    const target = (i / last) * total;
    let j = 1;
    while (j < acc.length - 1 && acc[j] < target) j++;
    const span = acc[j] - acc[j - 1] || 1;
    const f = (target - acc[j - 1]) / span;
    out.push([
      dense[j - 1][0] + (dense[j][0] - dense[j - 1][0]) * f,
      dense[j - 1][1] + (dense[j][1] - dense[j - 1][1]) * f,
    ]);
  }
  return out;
}

/** Deterministic PRNG so the layout is identical on server and client. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function buildFaceGraph(): FaceGraph {
  const rand = rng(20220422);

  const graph: number[] = [];
  const scatter: number[] = [];
  const surface: number[] = [];
  const role: number[] = [];
  const seed: number[] = [];
  const edges: number[] = [];

  /** Nodes belonging to a curve, kept so we can chain them. */
  const push = (x: number, y: number, z: number, r: number) => {
    const i = graph.length / 3;
    graph.push(x, y, z);

    // Scattered: blown off the surface along its own normal, plus jitter.
    const n = 0.55 + rand() * 0.9;
    scatter.push(
      x * (1 + n * 0.5) + (rand() - 0.5) * 0.5,
      y * (1 + n * 0.32) + (rand() - 0.5) * 0.5,
      z + (rand() - 0.5) * 1.5,
    );

    // Surface: relaxed onto the smooth head. Feature depth offsets are
    // dropped and the shell is inflated, so the sharp landmark graph
    // softens into a mask rather than staying visually identical.
    surface.push(x * 1.09, y * 1.07, faceDepth(x, y) * 1.16);

    role.push(r);
    seed.push(rand());
    return i;
  };

  for (const c of CURVES) {
    const sides = c.mirror ? [1, -1] : [1];
    for (const s of sides) {
      const pts = resample(c.pts, c.n, !!c.closed);
      const first = graph.length / 3;
      for (const [px, py] of pts) {
        const x = px * s;
        const z = faceDepth(x, py) + (c.z ?? 0);
        push(x, py, z, c.role ?? 0);
      }
      // Chain consecutive nodes into the structural edges.
      for (let i = 0; i < pts.length - 1; i++) edges.push(first + i, first + i + 1);
      if (c.closed) edges.push(first + pts.length - 1, first);
    }
  }

  const landmarkCount = graph.length / 3;

  /**
   * Cross-links. Every node reaches to a couple of nearby nodes it is not
   * already chained to, which is what turns a set of outlines into
   * something that reads as a network. Capped per node so the mid-face
   * does not turn into a solid sheet.
   */
  const MIN_LINK = 0.085;
  const MAX_LINK = 0.16;
  const linkedFrom = new Int8Array(landmarkCount);
  for (let i = 0; i < landmarkCount; i++) {
    if (linkedFrom[i] >= 1) continue;
    const ax = graph[i * 3];
    const ay = graph[i * 3 + 1];
    const az = graph[i * 3 + 2];
    for (let j = i + 3; j < landmarkCount && linkedFrom[i] < 1; j++) {
      if (linkedFrom[j] >= 1) continue;
      const dx = graph[j * 3] - ax;
      const dy = graph[j * 3 + 1] - ay;
      const dz = graph[j * 3 + 2] - az;
      const d = Math.hypot(dx, dy, dz);
      if (d < MIN_LINK || d > MAX_LINK) continue;
      // Two contours running parallel would otherwise link at every
      // step and read as hatching. Taking roughly half at random breaks
      // the regularity into something that looks like a network.
      if (rand() > 0.55) continue;
      edges.push(i, j);
      linkedFrom[i]++;
      linkedFrom[j]++;
    }
  }

  /**
   * Volumetric fill. Sparse samples across the head surface so the point
   * cloud state has body, and so the graph sits inside something rather
   * than floating as bare outlines.
   */
  const FILL = 900;
  for (let i = 0; i < FILL; i++) {
    // Even-ish coverage of the front hemisphere, biased toward the face.
    const u = rand() * 2 - 1;
    const th = rand() * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    const x = r * Math.cos(th) * 0.78;
    const y = u * 1.12 + 0.05;
    const zSign = r * Math.sin(th);
    const depth = faceDepth(x, y);
    if (depth <= 0.02) continue;
    push(x, y, zSign > 0 ? depth * (0.75 + rand() * 0.3) : -depth * (0.4 + rand() * 0.5), 0);
  }

  return {
    count: graph.length / 3,
    graph: new Float32Array(graph),
    scatter: new Float32Array(scatter),
    surface: new Float32Array(surface),
    role: new Float32Array(role),
    seed: new Float32Array(seed),
    edges: new Uint16Array(edges),
    edgeCount: edges.length / 2,
  };
}
