import React, { useState } from 'react';
import { MAX_TAGS, MAX_TAG_LENGTH, normalizeTags } from '../utils/tasks';

// Compact chip editor used by quick-capture and inline card editing.
// Enter / comma commits the draft; Backspace on an empty draft removes the last tag.
const TagInput = ({ tags = [], onChange, id, placeholder = 'Add a tag…', disabled = false }) => {
  const [draft, setDraft] = useState('');
  const normalized = normalizeTags(tags);
  const atLimit = normalized.length >= MAX_TAGS;

  const commitDraft = () => {
    const next = normalizeTags([...normalized, draft]);
    setDraft('');
    if (next.length !== normalized.length || next.some((t, i) => t !== normalized[i])) {
      onChange(next);
    }
  };

  const removeTag = (tag) => {
    const key = tag.toLowerCase();
    onChange(normalized.filter((t) => t.toLowerCase() !== key));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (draft.trim()) commitDraft();
    } else if (e.key === 'Backspace' && !draft && normalized.length) {
      e.preventDefault();
      removeTag(normalized[normalized.length - 1]);
    } else if (e.key === 'Escape') {
      setDraft('');
    }
  };

  const handleBlur = () => {
    if (draft.trim()) commitDraft();
  };

  return (
    <div className={`tag-input${disabled ? ' is-disabled' : ''}`} id={id}>
      {normalized.map((tag) => (
        <span className="tag-pill" key={tag.toLowerCase()}>
          {tag}
          <button
            type="button"
            className="tag-pill-remove"
            aria-label={`Remove tag ${tag}`}
            disabled={disabled}
            onClick={() => removeTag(tag)}
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="tag-input-field"
        type="text"
        value={draft}
        disabled={disabled || atLimit}
        maxLength={MAX_TAG_LENGTH}
        placeholder={atLimit ? `Up to ${MAX_TAGS} tags` : placeholder}
        aria-label="Add tag"
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default TagInput;
