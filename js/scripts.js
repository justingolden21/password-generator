/* todo

quick copy buttons
autofocus/select on generate
autofocus/select on page load

url params for settings?
upload json file for settings?

more:
pin generator
truly random (no words) pass generator
dropdown menu with "memorable" as default
https://1password.com/password-generator/
*/

// pass item generation

// https://owasp.org/www-community/password-special-characters
const specials = ` !"#$%&'()*+,-./:;<=>?@[\]^_\`{|}~`.split('');
// const specials = ['"']; // for testing quote

const getRandomWord = () => words[Math.floor(Math.random() * words.length)];
const getRandomSpecial = () =>
	specials[Math.floor(Math.random() * specials.length)];

// https://stackoverflow.com/a/59945762/4907950
const toggleCase = (str) =>
	str
		.toUpperCase()
		.split(' ')
		.map((word) => word.charAt(0).toLowerCase() + word.slice(1))
		.join(' ');
const caps = (str) => str.toUpperCase();
const lower = (str) => str.toLowerCase();
const capitalize = (str) =>
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
	let pass = '';
	for (let i = 0; i < settings.size; i++) {
		let rng = Math.random();
		if (rng > 0.8) pass += caps(getRandomWord());
		else if (rng > 0.6) pass += lower(getRandomWord());
		else if (rng > 0.4) pass += capitalize(getRandomWord());
		else if (rng > 0.2) pass += toggleCase(getRandomWord());
		else if (rng > 0.1) pass += randInt(100, 999).toString();
		else pass += getRandomSpecial();

		// if a word was generated and not the last loop
		if (rng > 0.2 && i != settings.size - 1)
			pass += Math.random() > 0.5 ? '_' : '-';
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
			seperators: {
				underscore: u('#underscore-checkbox').is(':checked'),
				dash: u('#dash-checkbox').is(':checked'),
			},
			minWordLen: getVal('min-word-len'),
			maxWordLen: getVal('max-word-len'),
			numberSize: getVal('number-size'),
			specialChars: u('#special-chars').val(),
		};

		for (let i = 0; i < numPasswords; i++) {
			console.log(settings);
			const pass = getRandomPass(settings);
			let html = `<input id="output" class="input my-2" type="text" value="${pass.replace(
				/\"/g,
				'&quot;'
			)}"></input>`; // replace quote with &quot;
			u('#output').html(html);
		}
	});
	u('#gen-btn').trigger('click');
};
