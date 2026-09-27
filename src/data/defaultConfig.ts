import { MemoryItem, SurpriseConfig } from '../types';

// The 4 authentic photos uploaded by user
import photoPhotoboothStrip from '../assets/images/user_photobooth_strip_1790435627804.jpg';
import photoNightRide from '../assets/images/user_night_ride_1790435644948.jpg';
import photoCozyCuddle from '../assets/images/user_cozy_cuddle_1790435660518.jpg';
import photoPhotoboothCurtain from '../assets/images/user_photobooth_curtain_1790435719887.jpg';

export const DEFAULT_CONFIG: SurpriseConfig = {
  gfName: 'MILA',
  secretCode: '2609',
  finalName: 'RIAN',
  anniversaryDate: '2026-03-02', // Tanggal mulai: 2 Maret 2026
  letterTitle: 'Surat Cinta Spesial Untukmu',
  letterGreeting: 'Untuk Mila Tersayang,',
  letterBody: [
    'hey babeee, how u doin?? i hope u doing good, oh and how r u? r u healthy? please dont get sick, i meant it love (I DONT WANT MY BEAUTIFUL GF GET SICK!). SOOOOOO......THIS IS ITTT, HAPPYY BIRTHDAYYY MY LOVEEE!!!, I HOPE ALL UR WISH WILL COME TRUE! AAMIIN!! im sorry if i take along time to make thiss:(. oh anw, I LOVE U SOOO MUCHH AND I MISS UUUU!!!! maybe i dont have so much things to say or givee but after all the busy dayy, letssss havee funn and ride togetherr!! OKAYY?? HEHEE'
  ],
  letterClosing: 'Selamanya milikmu penuh cinta,',
  questionText: 'Will you continue walking together in our beautiful story, today and forever? ♡?',
  hintText: 'Petunjuk: Tanggal spesial kamu (26/09)',
};

export const DEFAULT_MEMORIES: MemoryItem[] = [
  {
    id: '1',
    title: 'Gaya Lucu di OURstudio',
    date: 'Photobooth Strip',
    location: 'OURstudio Room',
    image: '/foto2.jpeg',
    caption: 'Tawa dan ekspresi konyol kita yang paling berharga ♡',
    story: 'Dari gaya peace sampai pose kedipin mata yang lucu bangettt, setiap jepretan foto strip nya ini penuh tawa kita wkwk. Ngeliat kamu ketawa dan gaya kita yang kocak banget bakal selalu jadi kebahagiaan terbesarku!!',
    tags: ['OURstudio', 'Photobooth Strip', 'Tawa Bareng']
  },
  {
    id: '2',
    title: 'Night Ride Berdua',
    date: 'Night Ride Seru',
    location: 'Jalanan Malam Kota',
    image: '/foto1.jpeg',
    caption: 'Dinginnya angin malam kalah sama hangatnya pelukanmu.',
    story: "Helm kembaran, motoran malam keliling gajelas, terus sama foto selfie candid di jalan. Momen motoran santai kayak gini yang bikin kangen pas kita lagi hari sibuk. Let's ride together always babeee!",
    tags: ['Motoran Malam', 'Helm Couple', 'Ride Together']
  },
  {
    id: '3',
    title: 'Momen Hangat Bersamamu',
    date: 'Waktu Berdua',
    location: 'Sudut Rumah Ternyaman',
    image: '/foto3.jpeg',
    caption: 'Tatapan mata dan senyum manismu di balik kacamata cantrikmu ♡',
    story: 'Cuma duduk santai berdua, diem-dieman tanpa ngomong. With u beside me, hari-hari kita yang cape bakal langsung terasa ringan dan tenang. u are the most comfortable home I come home to.',
    tags: ['Kacamata Lucu', 'Kenyamanan', 'Rumahku']
  },
  {
    id: '4',
    title: 'Peace & Winks!',
    date: 'Kenangan Manis',
    location: 'Bilik Tirai Putih',
    image: '/foto4.jpeg',
    caption: 'Dua orang konyol yang saling jatuh cinta setiap hari.',
    story: 'Baju item kembaran dan pose dua jari andalan kita (wkwk). Makaasiiiihhh udah selalu jadi partner paling seruuuu, paling menggemaskan, dan paling aku sayangi di dunia ini!',
    tags: ['Couple Goals', 'Matching Black', 'Selamanya']
  }
];
