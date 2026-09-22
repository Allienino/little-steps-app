(function (root) {
  const englishAlphabet = [
    ['A','eɪ','ay','æ','ant'], ['B','biː','bee','b','bat'],
    ['C','siː','see','k','cat'], ['D','diː','dee','d','dog'],
    ['E','iː','ee','ɛ','egg'], ['F','ɛf','ef','f','fish'],
    ['G','dʒiː','jee','g','goat'], ['H','eɪtʃ','aitch','h','hat'],
    ['I','aɪ','eye','ɪ','ink'], ['J','dʒeɪ','jay','dʒ','jelly'],
    ['K','keɪ','kay','k','king'], ['L','ɛl','el','l','lollipop'],
    ['M','ɛm','em','m','mum'], ['N','ɛn','en','n','net'],
    ['O','oʊ','oh','ɒ','orange'], ['P','piː','pee','p','pig'],
    ['Q','kjuː','cue','kw','queen'], ['R','ɑː','ar','r','red'],
    ['S','ɛs','es','s','snake'], ['T','tiː','tee','t','tennis'],
    ['U','juː','you','ʌ','umbrella'], ['V','viː','vee','v','van'],
    ['W','ˈdʌbəl.juː','double-u','w','water'], ['X','ɛks','ex','ks','box'],
    ['Y','waɪ','why','j','yellow'], ['Z','zɛd','zed','z','zebra']
  ].map(([letter, nameIpa, spokenName, phonemeIpa, example]) => ({
    letter,
    name: { ipa: `/${nameIpa}/`, spoken: spokenName, audio: `audio/en/letters/${letter.toLowerCase()}-name.mp3` },
    phoneme: { ipa: `/${phonemeIpa}/`, audio: `audio/en/phonics/${letter.toLowerCase()}-sound.mp3` },
    example: { word: example, audio: `audio/en/examples/${example}.mp3` }
  }));

  const arabicRows = [
    ['ا','أَلِف','Alif','أَرْنَب','alif','arnab'], ['ب','بَاء','Baa','بَطَّة','baa','batta'],
    ['ت','تَاء','Taa','تُفَّاحَة','taa','tuffaha'], ['ث','ثَاء','Thaa','ثَوْب','thaa','thawb'],
    ['ج','جِيم','Jeem','جَمَل','jeem','jamal'], ['ح','حَاء','Haa','حَلِيب','haa_deep','haleeb'],
    ['خ','خَاء','Khaa','خُبْز','khaa','khubz'], ['د','دَال','Daal','دَفْتَر','daal','daftar'],
    ['ذ','ذَال','Dhaal','ذَهَب','dhaal','dhahab'], ['ر','رَاء','Raa','رِيشَة','raa','reesha'],
    ['ز','زَاي','Zay','زَهْرَة','zay','zahra'], ['س','سِين','Seen','سَيَّارَة','seen','sayyara'],
    ['ش','شِين','Sheen','شَمْس','sheen','shams'], ['ص','صَاد','Saad','صَابُون','saad','saboon'],
    ['ض','ضَاد','Daad','ضَوْء','daad','daw'], ['ط','طَاء','Taa','طَاوِلَة','taa_heavy','tawila'],
    ['ظ','ظَاء','Zaa','ظَرْف','zaa_heavy','zarf'], ['ع','عَيْن','Ayn','عَيْن','ayn','ayn'],
    ['غ','غَيْنْ','Ghayn','غُرْفَة','ghayn','ghurfa'], ['ف','فَاء','Faa','فِنْجَان','faa','finjan'],
    ['ق','قَاف','Qaaf','قَلَم','qaaf','qalam'], ['ك','كَاف','Kaaf','كُرْسِي','kaaf','kursi'],
    ['ل','لَامْ','Laam','لَيْمُون','laam','laymoon'], ['م','مِيم','Meem','مِفْتَاح','meem','miftah'],
    ['ن','نُون','Noon','نَجْم','noon','najm'], ['هـ','هَاء','Haa','هَدِيَّة','haa','hadiyya'],
    ['و','وَاو','Waw','وَرَقَة','waw','waraqa'], ['ي','يَاء','Yaa','يَد','yaa','yad']
  ];
  const arabicAlphabet = arabicRows.map(([letter, spokenName, label, example, file, exampleFile]) => ({
    letter,
    name: {
      label,
      spoken: spokenName,
      audio: file === 'ghayn' || file === 'laam'
        ? `audio/ar/letters/${file}.m4a`
        : `audio/ar/letters/${file}.mp3`
    },
    example: { word: example, audio: `audio/ar/examples/${exampleFile}.mp3` }
  }));

  root.LITTLE_STEPS_DATA = Object.freeze({
    englishAlphabet: Object.freeze(englishAlphabet),
    arabicAlphabet: Object.freeze(arabicAlphabet),
    englishNumbers: Object.freeze(['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten']),
    arabicNumbers: Object.freeze(['صِفْر','وَاحِد','اِثْنَان','ثَلَاثَة','أَرْبَعَة','خَمْسَة','سِتَّة','سَبْعَة','ثَمَانِيَة','تِسْعَة','عَشَرَة']),
    arabicDigits: Object.freeze(['٠','١','٢','٣','٤','٥','٦','٧','٨','٩','١٠'])
  });
})(globalThis);
