import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

// SVG icons for tech stack
const TechIcons: Record<string, ReactElement> = {
  unity: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm0 1.385l9.223 5.327v10.577L12 22.615l-9.223-5.326V6.712L12 1.385zM6.958 14.032l1.34-2.32-1.34-2.322H9.65l1.338 2.322-1.338 2.32H6.958zm0-4.642H4.35L3.01 11.712l1.34 2.32H6.958l-1.338-2.32 1.338-2.322zm10.084 0h-2.608l-1.339 2.322 1.339 2.32h2.608l-1.34-2.32 1.34-2.322zm-2.608 4.642h-2.608L10.487 16.6H7.879l1.34-2.32h2.607l1.34 2.32h-2.607zm0-8.642H11.826l-1.339-2.32H7.879l1.34 2.32H11.826zM14.433 5.39h-2.607l1.339 2.32h2.608l-1.34-2.32zm0 0"/>
    </svg>
  ),
  csharp: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.5 15.97l.41 2.44c-.26.14-.79.43-1.69.61-.9.18-1.82.14-2.7-.17-.87-.3-1.6-.9-2.2-1.79-.59-.88-.81-2-.67-3.38.14-1.38.58-2.41 1.33-3.09.74-.68 1.58-1.02 2.53-1.02.95 0 1.76.32 2.42.97l-.59 2.45c-.36-.49-.87-.74-1.55-.74-.67 0-1.17.27-1.48.8-.31.53-.4 1.24-.26 2.14.14.89.43 1.55.86 1.97.43.41.95.56 1.55.44.6-.12 1.1-.39 1.52-.82l.52.19zm5.46-4.72l-.63 2.96-1.96-.55-.61 2.87-1.82-.48.61-2.88-1.31-.36.62-2.95 1.31.36.68-3.2 1.82.48-.68 3.19 1.97.56z"/>
    </svg>
  ),
  react: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09c.225 0 .406.044.558.127.61.352.872 1.507.67 3.057-.038.273-.086.56-.144.854-.683-.183-1.43-.327-2.224-.422-.46-.567-.945-1.113-1.444-1.627.818-.74 1.596-1.29 2.29-1.625.239-.107.449-.164.295-.364zm-9.76 0c-.147 0-.294.05-.434.148-.693.335-1.47.885-2.29 1.626.5.513.985 1.059 1.445 1.627-.793.095-1.54.239-2.224.422-.057-.294-.105-.581-.143-.854-.2-1.55.06-2.705.67-3.057.151-.083.332-.127.558-.127.627 0 1.45.345 2.418.215zm4.888 3.96c.26.258.518.524.764.8.244-.276.502-.542.762-.8-.26-.257-.518-.524-.763-.8-.244.277-.502.543-.763.8zM8.2 7.04c.546.178 1.08.382 1.603.61-.32.56-.62 1.14-.9 1.72-.38-.85-.666-1.71-.703-2.33zm7.6 0c-.037.62-.323 1.48-.704 2.33-.28-.58-.58-1.16-.9-1.72.522-.228 1.057-.432 1.603-.61zm-3.8 0c.48.45.944.93 1.385 1.44-.46.165-.92.33-1.385.495-.465-.165-.926-.33-1.385-.495C10.055 7.97 10.52 7.49 11 7.04zM5.044 8.21c.27.07.55.147.843.227-.077.51-.133 1.023-.168 1.537-.44.16-.855.33-1.24.51-.24-1.103-.255-1.99.565-2.274zm13.912 0c.82.284.805 1.17.565 2.274-.385-.18-.8-.35-1.24-.51-.035-.514-.09-1.027-.168-1.537.293-.08.574-.157.843-.227zM12 8.48c.41 0 .73.167.73.37 0 .205-.32.37-.73.37s-.73-.165-.73-.37c0-.203.32-.37.73-.37zm0 3.524c2.226 0 3.973.42 4.617.884-.644.464-2.39.884-4.617.884s-3.972-.42-4.617-.884c.644-.464 2.39-.884 4.617-.884zm0 2.952c1.95 0 3.7.384 4.617.97-.917.585-2.667.97-4.617.97s-3.7-.385-4.617-.97c.917-.586 2.667-.97 4.617-.97zM3.476 14.36c.385.18.8.35 1.24.51.035.514.09 1.027.168 1.537-.293.08-.574.157-.843.227-.82-.284-.805-1.17-.565-2.274zm17.048 0c.24 1.103.255 1.99-.565 2.274-.27-.07-.55-.147-.843-.227.077-.51.133-1.023.168-1.537.44-.16.855-.33 1.24-.51zm-13.9 1.01c.28.58.58 1.16.9 1.72-.523.228-1.058.432-1.604.61.037-.62.323-1.48.704-2.33zm10.752 0c.38.85.666 1.71.703 2.33-.546-.178-1.08-.382-1.603-.61.32-.56.62-1.14.9-1.72zM12 15.96c.26.257.518.523.763.8-.24.276-.502.543-.762.8-.261-.257-.519-.524-.764-.8.246-.277.504-.543.763-.8zm-2.813.61c.32.56.62 1.14.9 1.72-.52-.23-1.056-.433-1.6-.612.037-.617.32-1.48.7-2.33zM15 15.96c-.262.257-.52.523-.764.8-.244-.276-.502-.543-.762-.8.26-.257.518-.524.763-.8.244.277.502.543.763.8zm-3 2.56c.48.45.944.93 1.384 1.44-.46-.165-.92-.33-1.384-.495-.465.165-.926.33-1.384.495.44-.51.904-.99 1.384-1.44zm-.295-1.105c-.46-.514-.945-1.06-1.444-1.627.818.74 1.596 1.29 2.29 1.625.244-.107.449-.164.295-.364-.147 0-.294.05-.434.148-.093.047-.19.1-.29.158zm3.59 0c-.1-.058-.197-.11-.29-.158-.14-.098-.287-.148-.434-.148-.154.2.051.257.295.364.694-.335 1.47-.885 2.29-1.625-.5.567-.985 1.113-1.444 1.627z"/>
    </svg>
  ),
  typescript: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/>
    </svg>
  ),
  vite: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.27 5.34L12.8 21.63c-.18.32-.62.33-.82.02L2.56 5.35c-.22-.37.07-.82.5-.77l9.44 1.1a.46.46 0 0 0 .1 0l9.17-1.1c.42-.05.72.4.5.76z"/>
      <path d="M14.84.22l-5.03.98a.2.2 0 0 0-.16.19l-.31 4.9a.2.2 0 0 0 .23.21l1.38-.3a.2.2 0 0 1 .24.21l-.36 2.5a.2.2 0 0 0 .25.22l.85-.26a.2.2 0 0 1 .24.22l-.57 3.5c-.04.21.23.33.36.15l.08-.12 4.38-8.75c.1-.2-.07-.43-.29-.38l-1.42.34a.2.2 0 0 1-.23-.22l.47-2.9a.2.2 0 0 0-.1-.22z"/>
    </svg>
  ),
  blender: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.51 13.214c.046-.8.438-1.538 1.075-2.028a3.53 3.53 0 0 1 2.249-.78 3.5 3.5 0 0 1 2.25.78c.638.49 1.028 1.229 1.074 2.028a3.284 3.284 0 0 1-.93 2.552 3.374 3.374 0 0 1-2.394.99 3.374 3.374 0 0 1-2.394-.99 3.273 3.273 0 0 1-.93-2.552zM10.27 8.674a.411.411 0 0 1-.09-.028L4.43 5.505a.29.29 0 0 0-.205-.01.3.3 0 0 0-.156.145L.263 12.32a.29.29 0 0 0 .025.299l3.495 4.851c.046.064.118.1.196.1h6.82l.009-.014 3.522-5.99a.292.292 0 0 0 .002-.3l-4.063-2.592zm-.18-.69l4.047 2.58a.292.292 0 0 0 .351-.041l1.85-1.816a.281.281 0 0 0 .07-.29.288.288 0 0 0-.247-.186l-2.31-.244a.29.29 0 0 1-.258-.289v-1.16a.29.29 0 0 0-.275-.29L9.35 6.19a.29.29 0 0 0-.175.046.29.29 0 0 0-.113.157L8.67 8.044a.291.291 0 0 0 .11.33l1.31.61z"/>
    </svg>
  ),
  git: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.606-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"/>
    </svg>
  ),
  figma: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117V8.981H8.148zm8.644 8.98c0 2.476-2.014 4.49-4.49 4.49s-4.49-2.014-4.49-4.49 2.014-4.49 4.49-4.49 4.49 2.013 4.49 4.49zm-7.509 0c0 1.665 1.354 3.019 3.019 3.019s3.019-1.354 3.019-3.019-1.354-3.019-3.019-3.019-3.019 1.355-3.019 3.019z"/>
    </svg>
  ),
};

type SkillItem = { name: string; proficiency: number; icon?: string; category: string };

const skillGroups = [
  {
    category: 'Game & AR',
    categoryId: 'Game & AR',
    color: '#d4af37',
    items: [
      { name: 'Unity 3D', proficiency: 95, icon: 'unity', category: 'Game & AR' },
      { name: 'C# Programming', proficiency: 90, icon: 'csharp', category: 'Game & AR' },
      { name: 'Augmented Reality', proficiency: 85, icon: 'unity', category: 'Game & AR' },
      { name: 'Game Design', proficiency: 90, icon: 'unity', category: 'Game & AR' },
    ],
  },
  {
    category: 'Web & UI',
    categoryId: 'Web & UI',
    color: '#c8a820',
    items: [
      { name: 'React / Next.js', proficiency: 80, icon: 'react', category: 'Web & UI' },
      { name: 'TypeScript', proficiency: 78, icon: 'typescript', category: 'Web & UI' },
      { name: 'UI/UX Design', proficiency: 75, icon: 'figma', category: 'Web & UI' },
      { name: 'Vite', proficiency: 82, icon: 'vite', category: 'Web & UI' },
    ],
  },
  {
    category: 'Tools',
    categoryId: 'Tools',
    color: '#b89830',
    items: [
      { name: '3D Modeling', proficiency: 70, icon: 'blender', category: 'Tools' },
      { name: 'Git', proficiency: 85, icon: 'git', category: 'Tools' },
      { name: 'Figma', proficiency: 75, icon: 'figma', category: 'Tools' },
      { name: 'Project Management', proficiency: 80, icon: 'git', category: 'Tools' },
    ],
  },
];

function SkillBar({ skill, groupColor }: { skill: SkillItem; groupColor: string }) {
  const barRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || !barRef.current) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: cardRef.current, start: 'top 88%', toggleActions: 'play none none none' },
    });
    tl.fromTo(cardRef.current, { opacity: 0, y: 20, filter: 'blur(4px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' });
    tl.fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power3.out' }, '-=0.2');
    return () => { tl.scrollTrigger?.kill(); };
  }, []);

  const icon = skill.icon && TechIcons[skill.icon] ? TechIcons[skill.icon] : null;

  return (
    <div ref={cardRef} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon && (
            <div style={{
              width: '20px', height: '20px',
              color: groupColor,
              opacity: 0.8,
              flexShrink: 0,
            }}>
              {icon}
            </div>
          )}
          <span className="text-label color-dim" style={{ letterSpacing: '0.08em', fontSize: '0.72rem' }}>
            {skill.name}
          </span>
        </div>
        <span style={{ color: groupColor, fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.08em' }}>
          {skill.proficiency}%
        </span>
      </div>
      <div style={{ height: '1px', backgroundColor: 'rgba(240,240,240,0.08)', position: 'relative' }}>
        <div
          ref={barRef}
          style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${skill.proficiency}%`,
            background: `linear-gradient(90deg, ${groupColor}80, ${groupColor})`,
            transformOrigin: 'left',
            transform: 'scaleX(0)',
            boxShadow: `0 0 6px ${groupColor}40`,
          }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const { t } = useLanguage();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    const words = headingRef.current.querySelectorAll('.word');
    const tl = gsap.timeline({ scrollTrigger: { trigger: headingRef.current, start: 'top 85%', toggleActions: 'play none none none' } });
    tl.fromTo(words, { opacity: 0, filter: 'blur(6px) brightness(50%)', skewX: -5 }, { opacity: 1, filter: 'blur(0px) brightness(100%)', skewX: 0, stagger: 0.03, duration: 0.8, ease: 'power2.out' });
    return () => { tl.scrollTrigger?.kill(); };
  }, []);

  return (
    <section className="relative w-full" style={{ paddingTop: '180px', paddingBottom: '180px', backgroundColor: '#0a0a0a' }}>
      <div className="mx-auto px-6" style={{ maxWidth: '1400px' }}>
        <h2 ref={headingRef} className="text-display-l color-paper mb-20">
          <span className="word inline-block animate-blur-reveal">{t('skills.title').split(' ')[0]}</span>{' '}
          <span className="word inline-block animate-blur-reveal" style={{ animationDelay: '0.03s' }}>{t('skills.title').split(' ').slice(1).join(' ')}</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          {skillGroups.map((group) => (
            <div key={group.category}>
              {/* Category header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: group.color, boxShadow: `0 0 8px ${group.color}60` }} />
                <span style={{ color: group.color, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  {group.category}
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: `${group.color}20` }} />
              </div>
              {/* Skills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {group.items.map((skill, i) => (
                  <SkillBar key={i} skill={skill} groupColor={group.color} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tech badge row */}
        <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid rgba(240,240,240,0.06)' }}>
          <p className="text-label color-dim" style={{ letterSpacing: '0.2em', marginBottom: '1.5rem' }}>
            TECH STACK
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {['Unity 3D', 'C#', 'AR Foundation', 'Vuforia', 'React', 'TypeScript', 'Vite', 'TailwindCSS', 'Node.js', 'Blender', 'Figma', 'Git', 'MySQL', 'Firebase', 'GSAP', 'Three.js'].map((tech) => (
              <span key={tech} style={{
                padding: '6px 14px',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                color: 'rgba(240, 240, 240, 0.5)',
                fontSize: '0.65rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                borderRadius: '2px',
                transition: 'all 0.2s ease',
                cursor: 'default',
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#d4af37';
                  (e.currentTarget as HTMLElement).style.color = '#d4af37';
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(212,175,55,0.06)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.2)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(240, 240, 240, 0.5)';
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
