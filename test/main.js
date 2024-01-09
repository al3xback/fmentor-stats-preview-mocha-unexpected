import expect from 'unexpected';
import jsdom from 'jsdom';
import got from 'got';

const { JSDOM } = jsdom;

const url = 'https://al3xback.github.io/fmentor-stats-preview-mocha-unexpected/';

const getData = () => {
	return got(url)
		.then((res) => {
			const { document } = new JSDOM(res.body).window;
			return document;
		})
		.catch((err) => {
			throw new Error(err);
		});
};

describe('DOM', () => {
	beforeEach(async () => {
		try {
			const document = await getData();
			global.document = document;
		} catch (err) {
			console.log(err);
		}
	});

	it('should have an author image element which has alt and dimension equals to mockup data', () => {
		const cardStatListItemElements = document.querySelectorAll(
			'.card__stats-list-item'
		);

		const statListData = [];

		for (let i = 0; i < cardStatListItemElements.length; i++) {
			const cardStatListItemEl = cardStatListItemElements[i];
			const amount = cardStatListItemEl.firstElementChild.textContent;
			const label = cardStatListItemEl.lastElementChild.textContent;

			statListData.push({
				amount: amount,
				label: label,
			});
		}

		const mockupStatListData = [
			{ amount: '10K+', label: 'Companies' },
			{ amount: '314', label: 'Templates' },
			{ amount: '12M+', label: 'Queries' },
		];

		expect(statListData, 'to satisfy', mockupStatListData);
	});

	it('should have an empty alt attribute value of card image element', () => {
		const cardImageAlt = document.querySelector('.card__image img').alt;

		expect(cardImageAlt, 'to be', '');
	});

	it("should have a heading one element with a class of 'sr-only'", () => {
		const headingOneEl = document.querySelector('h1');

		expect(headingOneEl.className, 'to equal', 'sr-only');
	});
});
