import Container from '@/components/layout/Container';
import { getDictionary } from '@/lib/dictionary';
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaEnvelope,
} from 'react-icons/fa6';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <Container>
      <main className="py-20 max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8 text-blackish">
          {dict.static.contact_title}
        </h1>
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-blackish/80">{dict.static.contact_intro}</p>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-primary text-2xl" />
              <a
                href={`mailto:${dict.static.email}`}
                className="text-primary hover:underline text-lg"
              >
                {dict.static.email}
              </a>
            </div>
          </div>

          <p className="text-blackish/80">{dict.static.social_intro}</p>
          <div className="flex gap-6">
            <a
              href="https://www.facebook.com/share/1E4pBPhgkc/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-greyish flex items-center justify-center text-blackish hover:bg-primary hover:text-whiteish transition-colors"
              aria-label="Facebook"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://www.instagram.com/presssuwayda?igsh=ZDA1bXVqNngwMWoy"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-greyish flex items-center justify-center text-blackish hover:bg-primary hover:text-whiteish transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://x.com/presssuwayda"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-greyish flex items-center justify-center text-blackish hover:bg-primary hover:text-whiteish transition-colors"
              aria-label="X"
            >
              <FaXTwitter size={20} />
            </a>
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-blackish/80">{dict.static.facebook_group_intro}</p>
            <a
              href={dict.static.facebook_group_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-lg"
            >
              {dict.static.facebook_group_link}
            </a>
          </div>
        </div>
      </main>
    </Container>
  );
}