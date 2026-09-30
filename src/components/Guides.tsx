import shoorsenaImg from '../../assets/team_memebers/shoorsenadas.webp';
import swamiImg from '../../assets/team_memebers/swamianirudha.webp';
import vanamaliImg from '../../assets/team_memebers/vanmalio.webp';
import aikaImg from '../../assets/team_memebers/aika.jpeg';

const team = [
  {
    name: 'Shoorasena Das',
    role: 'JustPrem creator',
    bio: 'Founder of Just Prem Community, Shoorasena is a filmmaker, musician, and yoga teacher who brings creativity and devotion to retreats across India and Nepal.',
    img: shoorsenaImg,
    link: 'Instagram',
    url: 'https://www.instagram.com/shoorasenadas.music/'
  },
  {
    name: 'Swami Aniruddha',
    role: 'Guide',
    bio: 'A devoted disciple of Paramahamsa Vishwananda, Swami Aniruddha has walked the yogic path for over 20 years. He is known for leading Himalayan pilgrimages, blending yoga, devotion, and community. He inspires seekers to discover the sacred in every step of life.',
    img: swamiImg,
    link: 'Instagram',
    url: 'https://www.instagram.com/sv.aniruddha/'
  },
  {
    name: 'Vanamali Dasi',
    role: 'Pilgrimage organiser',
    bio: 'Vanamali Dasi blends art, music, and spirituality through meditation, chanting, yoga, and retreats. A devoted disciple of Paramahamsa Vishwananda, she inspires hearts at spiritual events worldwide.',
    img: vanamaliImg,
    link: 'Instagram',
    url: 'https://www.instagram.com/vikamiy/'
  },
  {
    name: 'Aika',
    role: 'Team Member',
    bio: 'Aika is an inspiring traveler who has explored much of Asia and the East. A devoted kirtan leader, gifted singer and ukulele player, her musical journey began over a decade ago and has become her main life path. As the Community Manager of Just Prem, Aika is the core smile of the team. Her vibrant presence, compassion and dedication inspire those around her.',
    img: aikaImg,
    link: 'Instagram',
    url: 'https://www.instagram.com/aikasun/'
  }
];

export default function Guides() {
  return (
    <section className="relative bg-near-black px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-20 text-center md:mb-32">
          <h2 className="reveal font-serif text-4xl font-light text-ivory md:text-6xl lg:text-7xl">
            Meet the team
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8 items-start mx-auto max-w-[1400px]">
          {team.map((member, i) => {
            const isLeader = member.name === 'Swami Aniruddha';
            return (
              <article
                key={i}
                className={`group reveal reveal-delay-${i + 1} flex flex-col bg-gradient-to-b from-[#121214] to-near-black border border-[#E6DCC8]/15 shadow-2xl transition-all duration-700 hover:border-[#E6DCC8]/30 hover:shadow-[0_8px_40px_rgba(230,220,200,0.05)] ${
                  isLeader ? 'lg:col-span-2' : 'lg:col-span-1 mt-0 lg:mt-12'
                }`}
              >
                <div className={`relative w-full overflow-hidden ${isLeader ? 'aspect-[4/5]' : 'aspect-[1/1] sm:aspect-[4/5]'}`}>
                  <img
                    src={member.img.src}
                    alt={member.name}
                    className={`h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105 ${isLeader ? 'object-[30%_20%]' : 'object-center'}`}
                    loading="lazy"
                  />
                </div>
                <div className={`flex flex-col items-center justify-between text-center text-[#F1EEE7] ${isLeader ? 'p-8 md:p-12' : 'p-6'}`}>
                  <div>
                    <h3 className={`mb-3 font-medium ${isLeader ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
                      {member.name}
                    </h3>
                    <p className={`mb-5 uppercase tracking-[0.2em] text-[#E6DCC8]/70 ${isLeader ? 'text-[11px]' : 'text-[10px]'}`}>
                      {member.role}
                    </p>
                    <p className={`font-sans font-light leading-[1.6] text-[#EBE7DE]/70 ${isLeader ? 'text-[14px]' : 'text-[13px]'}`}>
                      {member.bio}
                    </p>
                  </div>
                  {member.link && member.url && (
                    <a
                      href={member.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-6 underline underline-offset-4 transition-colors hover:text-[#E6DCC8] ${isLeader ? 'text-sm' : 'text-xs'}`}
                    >
                      {member.link}
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
