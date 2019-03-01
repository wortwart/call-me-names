'use strict'
const {dialogflow, Suggestions} = require('actions-on-google')
const functions = require('firebase-functions')
const app = dialogflow({debug: true})

const namelength = 4

const responses = [
	'Dein vollständiger Name lautet',
	'Mit vollem Namen heißt du',
	'Dein kompletter Name ist'
]

const followUp = [
	'Soll ich einen anderen Namen herausfinden?',
	'Ich würde es gern nochmal versuchen, okay?',
	'Nochmal?',
	'Noch ein Versuch?'
]

const vornamen = [
	'Adalbert',
	'Amelie',
	'Bertha',
	'Connie',
	'Dagobert',
	'Dreikäsehoch',
	'Ekelpaket',
	'Erdbeerinchen',
	'Essiggurke',
	'Eulalie',
	'Froschkönig',
	'Georgine',
	'Halbling',
	'Hamster',
	'Hasenpfote',
	'Hildegard',
	'Hurzel',
	'Ignazius',
	'Isidor',
	'Karotte',
	'Klothilde',
	'Krötenbein',
	'Lilifee',
	'Lotta',
	'Meerschweinchen',
	'Mopsi',
	'Murkel',
	'Nasenbär',
	'Naseweis',
	'Nervbacke',
	'Ottokar',
	'Pippilotti',
	'Ponyfee',
	'Prinz',
	'Prinzessin',
	`Pumuckl`,
	'Pupsi',
	'Quasimodo',
	'Quatschkopf',
	'Quatschtüte',
	'Quietschie',
	'Rappelzappel',
	'Rumpelstilzchen',
	'Rübennase',
	'Satansbraten',
	'Schnuckiputz',
	'Stupsi',
	'Suppenkaspar',
	'Tilly',
	'Tino',
	'Zicklein',
	'Zwergenmütze',
]

const nachnamen = [
	'Braun',
	'Duck',
	'Einhorn',
	'Erdbeerfee',
	'Gurkenkönig',
	'Hasenzahn',
	'Heinzelmann',
	'Holzfuß',
	'Hosenmatz',
	'Knopf',
	'Langstrumpf',
	'Marmeladenfee',
	'Meier',
	'Mäusebein',
	'Meckermeier',
	'Motzmann',
	'Müller',
	'Nashorn',
	'Nörgelheimer',
	'Runkelrübe',
	'Runzelchen',
	'Schmidt',
	'Schneider',
	'von Klotzkopf',
	'Wuschelhaar',
	'Zottel'
]

const soundBaseURL = 'https://actions.google.com/sounds/v1/'
const soundExtension = '.ogg'
const sounds = [
	'cartoon/cartoon_boing',
	'cartoon/cartoon_cowbell',
	'human_voices/male_chuckling',
	'doors/wood_rattle',
	'tools/ratchet_wrench_slow',
	'cartoon/concussive_hit_guitar_boing',
	'cartoon/metal_twang',
	'cartoon/slide_whistle_to_drum'
]

const randomVal = arr => {
	if (!arr.length) return ''
	return arr[(Math.random() * arr.length) | 0]
}

app.intent('getFirstname', (conv, {vorname}) => {
	const nameparts = [vorname]
	while (nameparts.length < namelength - 1) {
		const tmp = randomVal(vornamen)
		if (nameparts.indexOf(tmp) < 0)
			nameparts.push(tmp)
	}
	nameparts.push(randomVal(nachnamen))
	const intro = randomVal(responses)
	const sound = soundBaseURL + randomVal(sounds) + soundExtension
	const outro = randomVal(followUp)
	let answer = `<speak>
		<prosody pitch="3st">${intro}</prosody>
		<prosody rate="slow" pitch="-6st" volume="loud">${nameparts.join(' ')}</prosody>
		<audio src="${sound}"></audio>
		${outro}
	</speak>`
	conv.ask(answer)
	conv.ask(new Suggestions('Ja', 'Nein'))
})

app.intent('noInputReprompt', conv => {
	const repromptCount = parseInt(conv.arguments.get('REPROMPT_COUNT'))
	if (repromptCount === 0) {
		conv.ask('Wie ist jetzt dein Vorname?')
	} else if (repromptCount === 1) {
		conv.ask(`Hallo, hallo, sprich mit mir.`)
	} else if (conv.arguments.get('IS_FINAL_REPROMPT')) {
		conv.close(`Ich habe was Besseres zu tun, als den ganzen Tag auf dich zu warten.`)
	}
})

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)
