'use client';

import { OPTION_PRESETS, defaultOptionsForCategory } from '../lib/sa-sizes';

// Editor for a product's size / colour choices. Values are edited as a simple
// comma-separated list so staff can add or remove a size in seconds.
export default function OptionsEditor({ options, category, onChange }) {
  const list = Array.isArray(options) ? options : [];

  function updateOption(index, patch) {
    onChange(list.map((o, i) => (i === index ? { ...o, ...patch } : o)));
  }

  function removeOption(index) {
    onChange(list.filter((_, i) => i !== index));
  }

  function addPreset(key) {
    if (!key) return;
    const preset = OPTION_PRESETS[key];
    if (!preset) return;
    // Replace an existing option of the same name rather than duplicating it.
    const without = list.filter((o) => o.name !== preset.name);
    onChange([...without, { ...preset, values: [...preset.values] }]);
  }

  function addCustom() {
    onChange([...list, { name: '', label: '', values: [], guide: null }]);
  }

  function applyCategoryDefaults() {
    onChange(defaultOptionsForCategory(category));
  }

  return (
    <div className="border-2 border-line bg-bone/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display uppercase tracking-wide text-charcoal">
            Sizes &amp; Colours
          </h3>
          <p className="text-xs text-steel/60">
            Customers must pick one of each before they can add this item to their cart.
          </p>
        </div>
        <button
          type="button"
          onClick={applyCategoryDefaults}
          className="border-2 border-charcoal px-3 py-1 text-xs font-bold uppercase tracking-wide text-charcoal hover:bg-charcoal hover:text-bone"
        >
          Use SA defaults for this category
        </button>
      </div>

      {list.length === 0 && (
        <p className="mt-4 text-sm text-steel/60">
          No options set — this product will be sold as a single item with no size or colour choice.
        </p>
      )}

      <div className="mt-4 space-y-4">
        {list.map((opt, index) => (
          <div key={index} className="border-2 border-line bg-white p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-charcoal">
                  Option key <span className="font-normal normal-case text-steel/60">(e.g. size, colour)</span>
                </label>
                <input
                  className="input-field mt-1"
                  value={opt.name}
                  onChange={(e) => updateOption(index, { name: e.target.value.toLowerCase() })}
                  placeholder="size"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-charcoal">
                  Label shown to customer
                </label>
                <input
                  className="input-field mt-1"
                  value={opt.label}
                  onChange={(e) => updateOption(index, { label: e.target.value })}
                  placeholder="Size (SA / UK)"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-bold uppercase tracking-wide text-charcoal">
                Values <span className="font-normal normal-case text-steel/60">(comma separated)</span>
              </label>
              <input
                className="input-field mt-1"
                value={(opt.values || []).join(', ')}
                onChange={(e) =>
                  updateOption(index, {
                    values: e.target.value.split(',').map((v) => v.trim()).filter(Boolean),
                  })
                }
                placeholder="5, 6, 7, 8, 9, 10, 11, 12, 13"
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-charcoal">
                Link to size guide
                <select
                  className="border-2 border-line bg-white px-2 py-1 font-normal normal-case"
                  value={opt.guide || ''}
                  onChange={(e) => updateOption(index, { guide: e.target.value || null })}
                >
                  <option value="">None</option>
                  <option value="footwear">Footwear chart</option>
                  <option value="worksuit">Conti suit chart</option>
                </select>
              </label>
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="text-xs font-bold uppercase tracking-wide text-hazard hover:underline"
              >
                Remove option
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <select
          className="border-2 border-line bg-white px-3 py-2 text-sm"
          value=""
          onChange={(e) => addPreset(e.target.value)}
        >
          <option value="">+ Add a standard option…</option>
          <option value="footwear-size">Safety footwear sizes (5–13)</option>
          <option value="gumboot-size">Gum boot sizes (4–13)</option>
          <option value="footwear-colour">Colour (Black / Brown)</option>
          <option value="worksuit-size">Conti suit sizes (32–54)</option>
          <option value="garment-size">Garment sizes (S–5XL)</option>
        </select>
        <button
          type="button"
          onClick={addCustom}
          className="border-2 border-line px-3 py-2 text-sm font-bold uppercase tracking-wide text-charcoal hover:border-charcoal"
        >
          + Custom option
        </button>
      </div>
    </div>
  );
}
