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
    bio: 'A devoted disciple of Paramahamsa Vishwananda, Swami Aniruddha has walked the yogic path for over 20 years. He is known for leading Himalayan Retreats, blending yoga, devotion, and community. He inspires seekers to discover the sacred in every step of life.',
    img: swamiImg,
    link: 'Instagram',
    url: 'https://www.instagram.com/sv.aniruddha/'
  },
  {
    name: 'Vanamali Dasi',
    role: 'Retreat organiser',
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1.26fr_1fr_1fr] gap-6 lg:gap-7 items-stretch mx-auto max-w-[1400px]">
          {team.map((member, i) => {
            const isLeader = member.name === 'Swami Aniruddha';
            return (
              <article
                key={i}
                className={`group reveal reveal-delay-${i + 1} flex flex-col bg-gradient-to-b from-[#121214] to-near-black border transition-all duration-700 ${
                  isLeader
                    ? 'border-antique-gold/50 shadow-[0_12px_45px_rgba(169,137,94,0.14)] ring-1 ring-antique-gold/20 lg:-translate-y-2.5 hover:border-antique-gold hover:shadow-[0_16px_50px_rgba(169,137,94,0.22)]'
                    : 'border-[#E6DCC8]/15 shadow-2xl hover:border-antique-gold/50 hover:shadow-[0_8px_40px_rgba(230,220,200,0.06)]'
                }`}
              >
                <div
                  className={`relative w-full overflow-hidden bg-charcoal ${
                    isLeader ? 'aspect-[4/4.2]' : 'aspect-[4/5]'
                  }`}
                >
                  <img
                    src={member.img.src}
                    alt={member.name}
                    className={`h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105 ${
                      isLeader ? 'object-[32%_15%]' : 'object-center'
                    }`}
                    loading="lazy"
                  />
                  {isLeader && (
                    <span className="absolute top-3 left-3 font-sans text-[9px] uppercase tracking-[0.22em] text-antique-gold bg-black/80 px-2.5 py-1 rounded backdrop-blur-md border border-antique-gold/30">
                      Pilgrimage Guide
                    </span>
                  )}
                </div>
                <div
                  className={`flex flex-col items-center justify-between text-center text-[#F1EEE7] flex-1 ${
                    isLeader ? 'p-6 md:p-7' : 'p-6'
                  }`}
                >
                  <div>
                    <h3
                      className={`mb-2 font-serif ${
                        isLeader ? 'text-[26px] md:text-[28px] font-normal text-ivory' : 'text-2xl font-light text-ivory'
                      }`}
                    >
                      {member.name}
                    </h3>
                    <p
                      className={`mb-4 uppercase tracking-[0.2em] ${
                        isLeader
                          ? 'text-antique-gold font-medium text-[10.5px]'
                          : 'text-[#E6DCC8]/70 text-[10px]'
                      }`}
                    >
                      {member.role}
                    </p>
                    <p
                      className={`font-sans font-light leading-[1.6] ${
                        isLeader ? 'text-[13.5px] text-[#EBE7DE]/85' : 'text-[13px] text-[#EBE7DE]/75'
                      }`}
                    >
                      {member.bio}
                    </p>
                  </div>
                  {member.link && member.url && (
                    <a
                      href={member.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-6 text-xs underline underline-offset-4 transition-colors ${
                        isLeader
                          ? 'text-antique-gold hover:text-ivory'
                          : 'text-[#E6DCC8]/80 hover:text-antique-gold'
                      }`}
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
