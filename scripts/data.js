// *** PAGE DATA *** //
// title string
const titleText = 'How to tell a seal from a rock';

// footer html
const footer = '<div>All images &copy; Alister Perrott or Shelagh Lewins 2020</div><div>Example contact details: <address><a href="mailto:creator@example.com">Example email address</a></address></div><div><a href="https://github.com/Shelagh-Lewins/annotated-image">Annotated Image source code in GitHub</a></div>';

// *** HOTSPOT AND IMAGE DETAIL DATA *** //
// data-item must be a unique string without spaces, and a valid file name.
// data-item should match the name of the detail picture in /images that accompanies this item.
// for example if data-item = 'hat', the picture file should be called 'hat.jpg'

// data-full is the display text and can be any string

// by default the image file is *.jpg
// you can specify a different file type, e.g.:
// 'file-extension': 'png',

// area coords should be top left corner, then bottom right corner:
// top left corner x, y
// bottom right corner x, y
// Image Map data can be generated by http://www.image-map.net/

// description should be escaped text

const areaData = [
	{
		'data-item': 'seal',
		'data-full': 'Grey seal',
		'coords': '395,188,967,509',
		'description': 'Grey seals are common on the beaches of Pembrokeshire and can easily be mistaken for rocks, but when you look more carefully, they\'re clearly animals not geology.',
	},
	{
		'data-item': 'rock',
		'data-full': 'Grey rock',
		'coords': '1127,86,1544,394',
		'description': 'Grey rocks are common on Pembrokeshire beaches.\nIt\'s obvious that it\'s not a seal.\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
		'file-extension': 'png',
	},
];
