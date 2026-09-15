import { Features } from './layout/Features';
import { Footer } from './layout/Footer';
import { Hero } from './layout/Hero';
import { Sidebar } from './layout/Sidebar';
import { Topbar } from './layout/Topbar';
import { LIVE_REGION_ID } from './lib/a11y';
import { AdvancedPath } from './sections/AdvancedPath';
import { BeginnerPath } from './sections/BeginnerPath';
import { CommonSteps } from './sections/CommonSteps';
import { Done } from './sections/Done';
import { Downloads } from './sections/Downloads';
import { GuideIntro } from './sections/GuideIntro';
import { PathChooser } from './sections/PathChooser';
import { Tools } from './sections/Tools';
import { GuideProvider } from './state/guide';
import { LightboxProvider } from './state/lightbox';

export function App() {
  return (
    <GuideProvider>
      <LightboxProvider>
        <a className="skip-link" href="#guide">
          Skip to the guide
        </a>
        <p id={LIVE_REGION_ID} className="visually-hidden" aria-live="polite" />

        <Topbar />
        <main id="top">
          <Hero />
          <Features />

          <section className="guide-section" id="guide" aria-labelledby="guide-title">
            <div className="wrap guide">
              <Sidebar />
              <div className="content">
                <GuideIntro />
                <CommonSteps />
                <PathChooser />
                <BeginnerPath />
                <AdvancedPath />
                <Done />
              </div>
            </div>
          </section>

          <Downloads />
          <Tools />
        </main>
        <Footer />
      </LightboxProvider>
    </GuideProvider>
  );
}
