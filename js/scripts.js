/* todo

quick copy buttons
autofocus/select on generate
autofocus/select on page load

more:
pin generator
truly random (no words) pass generator
dropdown menu with "memorable" as default
https://1password.com/password-generator/
*/

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

let settings = {
	size: 5,
};

window.onload = () => {
	u('#gen-btn').on('click', () => {
		const pass = getRandomPass(settings);
		let html = `<input id="output" class="input my-2" type="text" value="${pass.replace(
			/\"/g,
			'&quot;'
		)}"></input>`; // replace quote with &quot;
		u('#output').html(html);
	});
	u('#gen-btn').trigger('click');
};
