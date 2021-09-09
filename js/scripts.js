/* todo

maybe:
quick copy buttons

url params for settings?
upload json file for settings?

reset settings btn?

more:
pin generator
truly random (no words) pass generator
dropdown menu with "memorable" as default
https://1password.com/password-generator/
*/

// pass item generation

const getRandomItem = (items) =>
	items[Math.floor(Math.random() * items.length)];

const getRandomWord = () => getRandomItem(words);

// https://stackoverflow.com/a/59945762/4907950
const togglecase = (str) =>
	str
		.toUpperCase()
		.split(' ')
		.map((word) => word.charAt(0).toLowerCase() + word.slice(1))
		.join(' ');
const caps = (str) => str.toUpperCase();
const lower = (str) => str.toLowerCase();
const capitalized = (str) =>
	str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// input validation

function getVal(elmID) {
	let elm = u(`#${elmID}`);
	let val = verify(
		elm.val(),
		elm.attr('min'),
		elm.attr('max'),
		elm.attr('min')
	);
	elm.val(val);
	return val;
}

function verify(num, min, max, defaultVal) {
	num = Math.max(Math.min(parseInt(num), max), min);
	return isNaN(num) ? defaultVal : num;
}

// pass generation

function getRandomPass(settings) {
	let specials =
		settings.specials.split('') ||
		` !"#$%&'()*+,-./:;<=>?@[\]^_\`{|}~`.split('');
	let separators = settings.separators.split('') || `-_`.split('');

	let pass = '';
	for (let i = 0; i < settings.size; i++) {
		let items = [];
		if (settings.generatedItems.caps) items.push(caps(getRandomWord()));
		if (settings.generatedItems.lower) items.push(lower(getRandomWord()));
		if (settings.generatedItems.capitalized)
			items.push(capitalized(getRandomWord()));
		if (settings.generatedItems.togglecase)
			items.push(togglecase(getRandomWord()));
		if (settings.generatedItems.number)
			items.push(
				randInt(
					Math.pow(10, settings.numberSize),
					Math.pow(10, settings.numberSize + 1) - 1
				).toString()
			);
		if (settings.generatedItems.special)
			items.push(getRandomItem(specials));

		const item = getRandomItem(items);
		pass += item;

		// if not the last iteration of the loop and the item isn't a word (doesn't contain a letter)
		if (i != settings.size - 1 && /[a-z]/i.test(item))
			pass += getRandomItem(separators);
	}
	return pass;
}

window.onload = () => {
	u('#gen-btn').on('click', () => {
		const numPasswords = getVal('num-passwords');
		let settings = {
			size: getVal('size'),
			generatedItems: {
				caps: u('#caps-checkbox').is(':checked'),
				lower: u('#lower-checkbox').is(':checked'),
				capitalized: u('#capitalized-checkbox').is(':checked'),
				togglecase: u('#togglecase-checkbox').is(':checked'),
				number: u('#number-checkbox').is(':checked'),
				special: u('#special-checkbox').is(':checked'),
			},
			numberSize: getVal('number-size'),
			specials: u('#special-chars').val(),
			separators: u('#separators').val(),
		};

		let html = '';
		for (let i = 0; i < numPasswords; i++) {
			console.log(settings);
			const pass = getRandomPass(settings);
			html += `<input id="output" class="input my-2" type="text" value="${pass.replace(
				/\"/g,
				'&quot;'
			)}" spellcheck="false"></input>`; // replace quote with &quot;
		}
		u('#output').html(html);
		if (u('#select-checkbox').is(':checked'))
			u('#output input').first().select();
	});
	u('#gen-btn').trigger('click');
};
