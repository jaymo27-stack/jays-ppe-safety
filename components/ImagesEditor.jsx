'use client';

// Editor for a product's photo gallery. Paths are entered one per line; the
// first line is the main photo shown on the shop grid and in the cart.
export default function ImagesEditor({ images, onChange }) {
  const list = Array.isArray(images) ? images : [];

  function setAt(index, value) {
    onChange(list.map((img, i) => (i === index ? value : img)));
  }

  function remove(index) {
    onChange(list.filter((_, i) => i !== index));
  }

  function move(index, delta) {
    const target = index + delta;
    if (target < 0 || target >= list.length) return;
    const next = [...list];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function add() {
    onChange([...list, '']);
  }

  return (
    <div className="border-2 border-line bg-bone/40 p-4">
      <h3 className="font-display uppercase tracking-wide text-charcoal">Photos</h3>
      <p className="text-xs text-steel/60">
        Drop image files into <code>public/images/products/</code>, then add each path below. The
        first photo is the main one — it appears on the shop grid, the cart and the Stripe receipt.
      </p>

      {list.length === 0 && (
        <p className="mt-4 text-sm text-steel/60">
          No photos yet — this product will show its category icon instead.
        </p>
      )}

      <div className="mt-4 space-y-3">
        {list.map((img, index) => (
          <div key={index} className="flex items-start gap-3 border-2 border-line bg-white p-2">
            {/* Plain <img> here, not next/image: admin previews arbitrary paths
                that may not exist yet, and a broken next/image throws. */}
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center border border-line bg-bone">
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt="" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-[10px] uppercase text-steel/50">Empty</span>
              )}
            </div>

            <div className="flex-1">
              <input
                className="input-field"
                value={img}
                onChange={(e) => setAt(index, e.target.value)}
                placeholder="/images/products/my-photo.jpg"
              />
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wide">
                {index === 0 ? (
                  <span className="text-safetyDark">Main photo</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => move(index, -1 * index)}
                    className="text-charcoal hover:underline"
                  >
                    Make main
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="text-charcoal hover:underline disabled:opacity-30"
                >
                  ↑ Up
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === list.length - 1}
                  className="text-charcoal hover:underline disabled:opacity-30"
                >
                  ↓ Down
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-hazard hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-4 border-2 border-line px-3 py-2 text-sm font-bold uppercase tracking-wide text-charcoal hover:border-charcoal"
      >
        + Add a photo
      </button>
    </div>
  );
}
