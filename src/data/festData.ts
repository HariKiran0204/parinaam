import { FestConfig } from '../types';

export const FEST_CONFIG: FestConfig = {
  name: 'PARINAAM',
  edition: '2026',
  tagline: 'The Techno-Cultural Fest',
  subtitle: 'The Annual National Techno-Cultural Festival of Amrita Vishwa Vidyapeetham, Amaravati',
  dates: 'October 11 – 12, 2026',
  venue: 'Main Campus & Innovation Complex',
  collegeName: 'Amrita Vishwa Vidyapeetham',
  locationCity: 'Amaravati, Andhra Pradesh',
  totalPrizePool: '₹15L+',
  expectedParticipants: '12,000+',
  participatingColleges: '150+',
  totalEvents: '35+',
  contactEmail: 'parinaam@av.amrita.edu',
  helplinePhone: '+91 98765 43210',
  socialLinks: {
    instagram: 'https://instagram.com/parinaam_fest',
    youtube: 'https://youtube.com/c/parinaamfest',
    linkedin: 'https://linkedin.com/company/parinaamfest',
    x: 'https://x.com/parinaamfest',
  },
};

export interface ClubPhotoItem {
  url: string;
  title: string;
  caption?: string;
}

export interface GalleryClubItem {
  id: string;
  name: string;
  title: string;
  cluster: 'Tech & Innovation' | 'Arts & Culture' | 'Media & Play';
  category: string;
  imageUrl: string;
  logoUrl?: string;
  cardUrl?: string;
  photos?: ClubPhotoItem[];
  caption: string;
  description: string;
  eventsConducted: string[];
}

export const GALLERY_ITEMS: GalleryClubItem[] = [
  // ─── CLUSTER 1: TECH & INNOVATION ────────────────────────────
  {
    id: 'club-avinya',
    name: 'Avinya',
    title: 'Avinya',
    cluster: 'Tech & Innovation',
    category: 'Innovation & Entrepreneurship',
    imageUrl: '/images/clubs/avinya.png',
    logoUrl: '/images/clubs/avinya-emblem.png',
    cardUrl: '/images/clubs/avinya-card.png',
    photos: [
      {
        url: '/images/clubs/avinya/avinya-photo-1.jpg',
        title: 'Venture Pitch Summit',
        caption: 'Student innovator presenting deeptech and startup prototypes to campus evaluators.'
      },
      {
        url: '/images/clubs/avinya/avinya-photo-2.jpg',
        title: 'Keynote & Podium Address',
        caption: 'Founders sharing insights and event kickoff at the university auditorium podium.'
      },
      {
        url: '/images/clubs/avinya/avinya-photo-3.jpg',
        title: 'Stage Opening Ceremony',
        caption: 'Emcee and organizers leading the stage lighting and event inaugural session.'
      },
      {
        url: '/images/clubs/avinya/avinya-photo-4.jpg',
        title: 'Live Event Moderation',
        caption: 'Interactive student moderation and crowd engagement during the competition rounds.'
      },
      {
        url: '/images/clubs/avinya/avinya-photo-5.jpg',
        title: 'Ideation Roundtable Conference',
        caption: 'Core team conducting brainstorming and venture planning sessions with the Avinya brand.'
      },
    ],
    caption: 'Student founders pitching deeptech prototypes to angel investors and venture capitalists at Shark Tank Parinaam.',
    description: 'Avinya is the innovation and entrepreneurship incubator of Parinaam. Spearheading student ventures, startup hackathons, and angel pitch summits, Avinya transforms bold student ideas into viable tech enterprises.',
    eventsConducted: ['Shark Tank Parinaam', 'Venture Pitch Sprint', 'Disruptive Ideathon']
  },
  {
    id: 'club-robotics',
    name: 'Robotics',
    title: 'Robotics',
    cluster: 'Tech & Innovation',
    category: 'Robotics & Automation',
    imageUrl: '/images/clubs/robotics.png',
    logoUrl: '/images/clubs/robotics-emblem.png',
    cardUrl: '/images/clubs/robotics-card.png',
    photos: [
      {
        url: '/images/clubs/robotics/robotics-photo-1.jpg',
        title: 'Quadcopter Assembly & Testing',
        caption: 'Students fine-tuning flight controllers, rotors, and telemetry on custom racing drone builds in the workshop.'
      },
      {
        url: '/images/clubs/robotics/robotics-photo-2.jpg',
        title: 'Hardware & Drone Prototyping',
        caption: 'Hands-on calibration of ESCs, brushless motors, and carbon fiber airframes in the robotics makerspace.'
      },
      {
        url: '/images/clubs/robotics/robotics-photo-3.jpg',
        title: 'Electronics & Circuitry Lab',
        caption: 'Engineering teams testing telemetry sensors, power distribution boards, and microcontrollers.'
      },
      {
        url: '/images/clubs/robotics/robotics-photo-4.jpg',
        title: 'Combat Arena & RoboWars',
        caption: 'Full-metal combat bots clashing at 10,000 RPM inside the fortified polycarbonate battle arena.'
      },
      {
        url: '/images/clubs/robotics/robotics-photo-5.jpg',
        title: 'Technical Exhibition & Demos',
        caption: 'Robotics leads demonstrating autonomous rovers and combat bot capabilities to festival attendees.'
      },
    ],
    caption: 'Full-metal 15kg & 30kg combat bots clashing at 10,000 RPM in the armored hexagonal arena before a roaring crowd.',
    description: 'The premier engineering robotics guild known for high-octane RoboWars, line-following autonomous rovers, and acrobatic FPV drone races inside fortified polycarbonate arenas.',
    eventsConducted: ['RoboWars Steel Carnage', 'Drone Grand Prix', 'Autonomous Rover Sprint']
  },
  {
    id: 'club-chakravyuha',
    name: 'Chakravyuha',
    title: 'Chakravyuha',
    cluster: 'Tech & Innovation',
    category: 'Coding & Cyber Hackathons',
    imageUrl: '/images/clubs/chakravyuha.png',
    logoUrl: '/images/clubs/chakravyuha-emblem.png',
    cardUrl: '/images/clubs/chakravyuha-card.png',
    photos: [
      {
        url: '/images/clubs/chakravyuha/chakravyuha-photo-1.jpg',
        title: 'Auditorium Tech Keynote',
        caption: 'Chakravyuha leads inaugurating technical symposiums and competitive coding hackathons in the university auditorium.'
      },
      {
        url: '/images/clubs/chakravyuha/chakravyuha-photo-2.jpg',
        title: 'Smart India Hackathon Winners',
        caption: 'Team Chakravyuha receiving the championship award cheque for breakthrough engineering solutions at SIH.'
      },
      {
        url: '/images/clubs/chakravyuha/chakravyuha-photo-3.jpg',
        title: 'Competitive Coding & Labs',
        caption: 'Developers immersed in 24-hour algorithmic problem solving and cyber security capture-the-flag sprints.'
      },
      {
        url: '/images/clubs/chakravyuha/chakravyuha-photo-4.jpg',
        title: 'Hackathon Prototyping & Collaboration',
        caption: 'Teams collaborating on architectural design, code review, and full-stack software development.'
      },
      {
        url: '/images/clubs/chakravyuha/chakravyuha-photo-5.jpg',
        title: 'Grand Hackathon Stage Showcase',
        caption: 'Chakravyuha members and participants gathered on the main auditorium stage for celebration.'
      },
      {
        url: '/images/clubs/chakravyuha/chakravyuha-photo-6.jpg',
        title: 'Championship Trophy & Prize Ceremony',
        caption: 'Winning teams receiving certificates, medals, and national cash prize accolades.'
      },
      {
        url: '/images/clubs/chakravyuha/chakravyuha-photo-7.jpg',
        title: 'Team Problem-Solving Sprint',
        caption: 'Engineers debugging algorithmic edge cases and stress-testing backends under tight deadlines.'
      },
      {
        url: '/images/clubs/chakravyuha/chakravyuha-photo-8.jpg',
        title: 'Hackathon Project Defense',
        caption: 'Participants pitching live software and hardware solutions to academic and industry juries.'
      },
      {
        url: '/images/clubs/chakravyuha/chakravyuha-photo-9.jpg',
        title: 'Technical Presentation & Talks',
        caption: 'Student engineers presenting research architectures and software systems to fellow participants.'
      },
      {
        url: '/images/clubs/chakravyuha/chakravyuha-photo-10.jpg',
        title: 'Innovation Defense & Demo',
        caption: 'Finalists presenting breakthrough models and algorithmic pipelines to evaluation panels.'
      },
    ],
    caption: '150+ teams decoding cryptographic ciphers and investigating cyber crime logs in the flagship murder mystery hackathon.',
    description: 'The flagship computing club of Amrita Vishwa Vidyapeetham. Chakravyuha designs intense 24-hour hackathons, algorithmic coding battles, cyber forensic mysteries, and tactical LAN gaming tourneys.',
    eventsConducted: ['Code Red Hackathon', 'Cyber Forensic Mystery', 'Valorant LAN Showdown']
  },

  // ─── CLUSTER 2: ARTS & CULTURE ───────────────────────────────
  {
    id: 'club-prachurya',
    name: 'Prachurya',
    title: 'Prachurya',
    cluster: 'Arts & Culture',
    category: 'Literary & Quizzing',
    imageUrl: '/images/clubs/prachurya.png',
    logoUrl: '/images/clubs/prachurya-emblem.png',
    cardUrl: '/images/clubs/prachurya-card.png',
    caption: 'Fiercely contested Parliamentary debates and national trivia rounds igniting student minds across the seminar halls.',
    description: 'Dedicated to igniting curiosity and inspiring expression ("Ignite, Inspire"), Prachurya hosts the festival\'s parliamentary debates, national general quizzes, creative writing summits, and fine arts exhibitions.',
    eventsConducted: ['Parliamentary Debate Summit', 'Mega General Quiz', 'Canvas & Calligraphy Gala']
  },
  {
    id: 'club-nrityasparsh',
    name: 'NrityaSparsh',
    title: 'NrityaSparsh',
    cluster: 'Arts & Culture',
    category: 'Dance & Choreography',
    imageUrl: '/images/clubs/nrityasparsh.png',
    logoUrl: '/images/clubs/nrityasparsh-emblem.png',
    cardUrl: '/images/clubs/nrityasparsh-card.png',
    photos: [
      {
        url: '/images/clubs/nrityasparsh/nrityasparsh-photo-1.jpg',
        title: 'Mainstage Choreography',
        caption: 'Inter-collegiate dance troupes synchronizing intricate hip-hop formations under stadium spotlights.'
      },
      {
        url: '/images/clubs/nrityasparsh/nrityasparsh-photo-2.jpg',
        title: 'Classical & Contemporary Fusion',
        caption: 'Graceful classical storytelling blended with modern contemporary expression.'
      },
      {
        url: '/images/clubs/nrityasparsh/nrityasparsh-photo-3.jpg',
        title: '1v1 Street Cypher Battles',
        caption: 'Solo dancers showing explosive breaking and popping skills in circle cyphers.'
      },
      {
        url: '/images/clubs/nrityasparsh/nrityasparsh-photo-4.jpg',
        title: 'Costume & Thematic Spectacle',
        caption: 'Thematic narrative dance performances captivating the packed amphitheatre crowd.'
      },
      {
        url: '/images/clubs/nrityasparsh/nrityasparsh-photo-5.jpg',
        title: 'Grand Finale Showcase',
        caption: 'The complete NrityaSparsh crew uniting for the exhilarating fest closing showcase.'
      },
    ],
    caption: 'Inter-college choreography crews and street dance battles competing for the national championship under stage lights.',
    description: 'The beating pulse of rhythm on campus. NrityaSparsh orchestrates mega inter-collegiate dance battles, hip-hop crew cyphers, and graceful classical and contemporary choreography showcases.',
    eventsConducted: ['Nritya Sangram Dance Clash', 'Western Crew Choreography', '1v1 Street Cyphers']
  },
  {
    id: 'club-saptaswara',
    name: 'Saptaswara',
    title: 'Saptaswara',
    cluster: 'Arts & Culture',
    category: 'Music & Symphony',
    imageUrl: '/images/clubs/saptaswara.png',
    logoUrl: '/images/clubs/saptaswara-emblem.png',
    cardUrl: '/images/clubs/saptaswara-card.png',
    photos: [
      {
        url: '/images/clubs/saptaswara/saptaswara-photo-1.jpg',
        title: 'Open Air Amphitheatre Concert',
        caption: 'Live collegiate band delivering electrifying fusion guitar solos and drum rhythms under stage floodlights.'
      },
      {
        url: '/images/clubs/saptaswara/saptaswara-photo-2.jpg',
        title: 'Battle of the Bands Mainstage',
        caption: 'Lead vocalists and instrumentalists captivating a roaring crowd of festival attendees.'
      },
      {
        url: '/images/clubs/saptaswara/saptaswara-photo-3.jpg',
        title: 'Acoustic & Unplugged Sessions',
        caption: 'Intimate acoustic guitar sets, melodious vocals, and keyboard harmonies.'
      },
      {
        url: '/images/clubs/saptaswara/saptaswara-photo-4.jpg',
        title: 'Carnatic-Western Raga Fusion',
        caption: 'Mesmerizing musical jugalbandis blending classical ragas with contemporary rock cadence.'
      },
      {
        url: '/images/clubs/saptaswara/saptaswara-photo-5.jpg',
        title: 'Orchestra & Vocal Ensemble',
        caption: 'The full musical ensemble performing soul-stirring festive choral anthems.'
      },
    ],
    caption: 'Top collegiate rock, metal, and fusion bands headlining an electric evening on the Main Open Air Amphitheatre.',
    description: 'Bringing soulful harmony and roaring decibels to the techfest. Saptaswara curates electric Battle of the Bands clashes, Carnatic-Western jugalbandis, and acoustic vocal open mics.',
    eventsConducted: ['Battle of the Bands', 'Raga Symphony Fusion', 'Acoustic Unplugged Night']
  },

  // ─── CLUSTER 3: MEDIA & PLAY ─────────────────────────────────
  {
    id: 'club-drsya',
    name: 'Drsya',
    title: 'Drsya',
    cluster: 'Media & Play',
    category: 'Cinematography & Visual Media',
    imageUrl: '/images/clubs/drsya.png',
    logoUrl: '/images/clubs/drsya-emblem.png',
    cardUrl: '/images/clubs/drsya-card.png',
    caption: 'Filmmakers, cinematographers, and editors scripting, shooting, and premiering short films within 48 tight hours.',
    description: 'The visual storytelling powerhouse of Parinaam. Drsya challenges creative directors with 48-hour short film making sprints, campus photography marathons, and cinematic visual media challenges.',
    eventsConducted: ['Kala Drishti 48h Film Making', 'Campus Photo Walk Marathon', 'Cinematic Reel Craft']
  },
  {
    id: 'club-relu',
    name: 'Relu',
    title: 'Relu',
    cluster: 'Media & Play',
    category: 'AI / Machine Learning',
    imageUrl: '/images/clubs/relu.png',
    logoUrl: '/images/clubs/relu-emblem.png',
    cardUrl: '/images/clubs/relu-card.png',
    photos: [
      {
        url: '/images/clubs/relu/relu-photo-1.jpg',
        title: 'Deep Learning Sprint',
        caption: 'Developers fine-tuning neural network weights and deploying AI models in real time.'
      },
      {
        url: '/images/clubs/relu/relu-photo-2.jpg',
        title: 'Autonomous Agents Lab',
        caption: 'Teams architecting multi-agent reasoning systems and tool-using LLM pipelines.'
      },
      {
        url: '/images/clubs/relu/relu-photo-3.jpg',
        title: 'AI Architecture Workshop',
        caption: 'Mentors breaking down transformer attention mechanisms and neural representations.'
      },
      {
        url: '/images/clubs/relu/relu-photo-4.jpg',
        title: 'Predictive Analytics Sprint',
        caption: 'Data scientists presenting algorithmic evaluation metrics to industry judges.'
      },
      {
        url: '/images/clubs/relu/relu-photo-5.jpg',
        title: 'Hackathon Award Presentation',
        caption: 'Relu champions receiving certificates and awards for machine learning innovation.'
      },
    ],
    caption: 'Developers engineering autonomous AI agent swarms and deep learning pipelines solving complex industry challenges.',
    description: 'Named after the foundational activation function in neural networks, ReLU spearheads artificial intelligence, deep learning hackathons, autonomous agent architectures, and data science sprints at Parinaam.',
    eventsConducted: ['AgentForge AI Agents Challenge', 'Deep Learning Sprint', 'Predictive Analytics Hack']
  },
  {
    id: 'club-advika',
    name: 'Advika',
    title: 'Advika',
    cluster: 'Media & Play',
    category: 'Fine Arts, Crafts & Design',
    imageUrl: '/images/clubs/advika.png',
    logoUrl: '/images/clubs/advika-emblem.png',
    cardUrl: '/images/clubs/advika-card.png',
    photos: [
      {
        url: '/images/clubs/advika/advika-photo-1.jpg',
        title: 'Origami Masterpieces',
        caption: 'Students proudly presenting their paper birds, cranes, and geometric origami art pieces.'
      },
      {
        url: '/images/clubs/advika/advika-photo-2.jpg',
        title: 'Paper Craft Workshop',
        caption: 'Hands-on live demonstration of origami paper folding and action toys during the workshop.'
      },
      {
        url: '/images/clubs/advika/advika-photo-3.jpg',
        title: 'Clay Sculpting Guild',
        caption: 'Students sculpting clay figurines and artistic pottery in hands-on tactile craft sessions.'
      },
      {
        url: '/images/clubs/advika/advika-photo-4.jpg',
        title: 'Social Poster Painting',
        caption: 'Creating impactful hand-drawn awareness art and health education canvas posters.'
      },
      {
        url: '/images/clubs/advika/advika-photo-5.jpg',
        title: 'Canvas & Marker Design',
        caption: 'Fine art illustration teams collaborating on large-format campaign banners.'
      },
    ],
    caption: 'Students mastering paper origami creations, clay sculpting, and social awareness poster painting in creative craft workshops.',
    description: 'The creative arts, fine crafts, and design guild of campus. Advika brings imagination into tangible reality through intricate paper origami workshops, fine clay pottery sculpting, canvas painting marathons, and impactful socio-cultural awareness poster exhibitions.',
    eventsConducted: ['Origami Craft Masterclass', 'Clay Sculpting Guild', 'Social Awareness Poster Art', 'Canvas Illustration Gala']
  },
];

