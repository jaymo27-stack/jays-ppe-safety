// ---------------------------------------------------------------------------
// South African sizing standards for PPE.
//
// FOOTWEAR: South African shoe sizes follow the UK scale. Safety footwear is
// normally stocked 5–13; gum boots 4–13.
//
// WORKSUITS (conti suits / overalls): sized by JACKET size 32–54 (even numbers
// only) — the SA industry standard "size curve". The rule of thumb on the floor
// is jacket size = your normal trouser waist + 4 inches. So a 32" waist takes a
// size 36 conti suit.
// ---------------------------------------------------------------------------

const FOOTWEAR_SIZES = ['5', '6', '7', '8', '9', '10', '11', '12', '13'];
const GUMBOOT_SIZES = ['4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

const FOOTWEAR_COLOURS = ['Black', 'Brown'];

// The full SA conti suit size curve: 32–54, even numbers.
const WORKSUIT_SIZES = ['32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54'];

// Jackets & other garments sold on the letter scale.
const GARMENT_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

// SA (= UK) → EU → US conversion for the size guide page.
const FOOTWEAR_CHART = [
  { sa: '4', uk: '4', eu: '37', us: '7' },
  { sa: '5', uk: '5', eu: '38', us: '8' },
  { sa: '6', uk: '6', eu: '39', us: '9' },
  { sa: '7', uk: '7', eu: '40', us: '10' },
  { sa: '8', uk: '8', eu: '41', us: '11' },
  { sa: '9', uk: '9', eu: '42', us: '12' },
  { sa: '10', uk: '10', eu: '43', us: '13' },
  { sa: '11', uk: '11', eu: '44', us: '14' },
  { sa: '12', uk: '12', eu: '45', us: '15' },
  { sa: '13', uk: '13', eu: '46', us: '16' },
];

// Conti suit size curve with chest / waist guidance.
const WORKSUIT_CHART = [
  { size: '32', chest: '81 cm', waist: '28"', intl: 'XS' },
  { size: '34', chest: '86 cm', waist: '30"', intl: 'S' },
  { size: '36', chest: '91 cm', waist: '32"', intl: 'S/M' },
  { size: '38', chest: '97 cm', waist: '34"', intl: 'M' },
  { size: '40', chest: '102 cm', waist: '36"', intl: 'L' },
  { size: '42', chest: '107 cm', waist: '38"', intl: 'XL' },
  { size: '44', chest: '112 cm', waist: '40"', intl: '2XL' },
  { size: '46', chest: '117 cm', waist: '42"', intl: '3XL' },
  { size: '48', chest: '122 cm', waist: '44"', intl: '4XL' },
  { size: '50', chest: '127 cm', waist: '46"', intl: '5XL' },
  { size: '52', chest: '132 cm', waist: '48"', intl: '6XL' },
  { size: '54', chest: '137 cm', waist: '50"', intl: '7XL' },
];

// Handy presets the admin form offers with one click.
const OPTION_PRESETS = {
  'footwear-size': { name: 'size', label: 'Size (SA / UK)', values: FOOTWEAR_SIZES, guide: 'footwear' },
  'gumboot-size': { name: 'size', label: 'Size (SA / UK)', values: GUMBOOT_SIZES, guide: 'footwear' },
  'footwear-colour': { name: 'colour', label: 'Colour', values: FOOTWEAR_COLOURS, guide: null },
  'worksuit-size': { name: 'size', label: 'Size (SA Conti Size)', values: WORKSUIT_SIZES, guide: 'worksuit' },
  'garment-size': { name: 'size', label: 'Size', values: GARMENT_SIZES, guide: null },
};

// Sensible defaults when a new product is created in a given category.
function defaultOptionsForCategory(category) {
  switch (category) {
    case 'footwear':
      return [
        { ...OPTION_PRESETS['footwear-size'] },
        { ...OPTION_PRESETS['footwear-colour'] },
      ];
    case 'gumboots':
      return [{ ...OPTION_PRESETS['gumboot-size'] }];
    case 'worksuits':
      return [{ ...OPTION_PRESETS['worksuit-size'] }];
    case 'jackets':
    case 'vests':
      return [{ ...OPTION_PRESETS['garment-size'] }];
    default:
      return [];
  }
}

// Normalises whatever comes out of the DB / admin form into a clean array.
function normaliseOptions(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((opt) => ({
      name: String(opt?.name || '').trim().toLowerCase(),
      label: String(opt?.label || '').trim(),
      values: Array.isArray(opt?.values)
        ? opt.values.map((v) => String(v).trim()).filter(Boolean)
        : [],
      guide: opt?.guide || null,
    }))
    .filter((opt) => opt.name && opt.values.length > 0)
    .map((opt) => ({ ...opt, label: opt.label || opt.name }));
}

// "Size: 9, Colour: Brown" — used on the cart, Stripe line item and order record.
function describeSelection(selected) {
  if (!selected) return '';
  return Object.entries(selected)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
    .join(', ');
}

module.exports = {
  FOOTWEAR_SIZES,
  GUMBOOT_SIZES,
  FOOTWEAR_COLOURS,
  WORKSUIT_SIZES,
  GARMENT_SIZES,
  FOOTWEAR_CHART,
  WORKSUIT_CHART,
  OPTION_PRESETS,
  defaultOptionsForCategory,
  normaliseOptions,
  describeSelection,
};
