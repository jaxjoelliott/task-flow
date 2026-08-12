const MAX_TAG_LENGTH = 24;
const MAX_TAGS = 8;

// Normalize free-form tag input into a short, unique list.
// Preserves the first-seen casing; compares case-insensitively.
const normalizeTags = (tags) => {
  let list = tags;
  if (typeof list === 'string') {
    list = list.split(/[,#]/);
  }
  if (!Array.isArray(list)) return [];

  const seen = new Set();
  const out = [];

  for (const raw of list) {
    if (typeof raw !== 'string') continue;
    const tag = raw
      .trim()
      .replace(/^#+/, '')
      .replace(/\s+/g, ' ')
      .slice(0, MAX_TAG_LENGTH)
      .trim();
    if (!tag) continue;

    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
    if (out.length >= MAX_TAGS) break;
  }

  return out;
};

module.exports = { normalizeTags, MAX_TAG_LENGTH, MAX_TAGS };
